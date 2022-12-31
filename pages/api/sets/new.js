import { nanoid } from "nanoid"
import { API } from "@/server/protected"
import { createSet } from "@/server/db"
import { v4 } from "uuid"
import * as sdk from "microsoft-cognitiveservices-speech-sdk"
import path from "path"

let queueLength = 0;

function recordTamil(text) {
  if(!checkIfTamil(text)) {
    return;
  }

  const id = v4();

  let subscriptionKey = process.env.SUBSCRIPTION_KEY;
  let serviceRegion = "eastus";
  let filename = path.join(process.cwd(), "public", "audio", id+".wav");

  let audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
  let speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

  speechConfig.speechSynthesisLanguage = "ta-IN";
  speechConfig.speechSynthesisVoiceName = "ta-IN-PallaviNeural";

  let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);


  return new Promise((resolve, reject) => {
    queueLength++;
    setTimeout(() => {
    synthesizer.speakTextAsync(text,
        function (result) {
          let done = false;
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("recorded "+text );
        done = id;
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails +
            "\nDid you update the subscription info?");
      }
      synthesizer.close();
      synthesizer = undefined;
      queueLength--;
      if(done) resolve(done);
      else reject();
    },
        function (err) {
      queueLength--;
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = undefined;
      reject();
    });
    console.log("Now synthesizing to: " + filename);
  });
}, queueLength * 3000);

}

function checkIfTamil(text) {
  // Regex: ^[\u0B80-\u0BFF]+$
  return /^[\u0B80-\u0BFF]+$/.test(text.split("").filter((c) => c !== " ").join(""));
}

export default async function handler(req, res) {
  const user = await API(req, res)
  if(!user) {
    return res.status(401).json({
      error: "Unauthorized"
    })
  }

  if(req.method !== "POST")
    return res.status(405).json({
      "message": "This endpoint can only be used with the POST method"
    })

  const { body } = req

  const valid = validate(body.name, body.questions)
  if(typeof valid === "string") {
    return res.status(400).json({
      "message": valid
    })
  }

  const id = nanoid(8)
  const { name, questions } = body
  try {

    let recorded = {};

   for(let question of questions) {
      let e = question;
      if(e.questionAudio) {
        try {


          if(recorded[e.question]) {
            console.log("Found "+e.question+" from cache")
        e.questionAudio = recorded[e.question];
            
          } else {
        let record = await recordTamil(e.question);
        e.questionAudio = record;
          
        recorded[e.question] = record;
          }
        } catch(e) {
          console.error(e);
        }
      }
      if(e.answerAudio) {
        for(let answer of e.answers) {
          try {
            let base64answer = Buffer.from(answer.label).toString("base64");
            if(recorded[answer.label]) { answer.answerAudio = recorded[answer.label];
                                        console.log("Found "+answer.label+" from cache")
                                       }
            else {
            let record = await recordTamil(answer.label);
            answer.answerAudio = record;
            recorded[answer.label] = record;
            }
          } catch(e) {
            console.error(e);
          }
        }
      }
    }

    console.log("q:", questions)

    await createSet({ id, name, questions, user: user.username })
    res.status(200).json({
      "id": id
    })
  } catch(e) {
    console.error(e)
    return res.status(500).json({
      "message": "Internal server error"
    })
  }
}

function validate(name, questions) {
  if (!name)
    return "Set name required"
  if (!questions || !questions.length)
    return "At least one question is required"

  if(questions.length > 20)
    return "A set may not have more than 20 questions"

  for (let i in questions) {
    i = +i
    const q = questions[i]
    if (!q.question.length)
      return `Question ${i + 1} must have question text`

    if(q.questionAudio && !checkIfTamil(q.question)) {
      return `Question ${i + 1} must be in Tamil text to enable question audio`
    }

    if (q.answers.length < 2 || q.answers.length > 4)
      return `Question ${i + 1} must have between 2 and 4 answers`
    let hasCorrect = false
    for (const a of q.answers) {
      if(q.answerAudio && !checkIfTamil(a.label)) {
        return `Answer for question ${i + 1} must be in Tamil text to enable answer audio`
      }
      if (!a.label.length)
        return `An answer field for question ${i + 1} cannot be empty`
      if (a.correct && hasCorrect)
        return `Question ${i + 1} cannot have more than one correct answer`
      if (a.correct)
        hasCorrect = true
    }
    if (!hasCorrect)
      return `Question ${i + 1} must have one correct answer`
  }
}
