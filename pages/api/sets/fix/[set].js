import { getSet } from "@/server/db"
import * as sdk from "microsoft-cognitiveservices-speech-sdk"
import { v4 } from "uuid"
import path from "path"
let queueLength = 0;
import { updateSet } from "@/server/db";

function recordTamil(text,id=v4()) {
  if(!checkIfTamil(text)) {
    return;
  }

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
}, queueLength * 5000);

}

function checkIfTamil(text) {
  // Regex: ^[\u0B80-\u0BFF]+$
  text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  return /^[\u0B80-\u0BFF]+$/.test(text.split("").filter((c) => c !== " ").join(""));
}

export default async function handler(req, res) {
  const { set } = req.query
  const data = await getSet(set)
  if(!data) {
    return res.status(404).json({ message: "Set not found" })
  }


while(!data.questions[0].question) {
data.questions = (JSON.parse(data.questions))
}
let newjson = (data.questions)
let fixcnt = 0;
for (let question of data.questions) {
  if( typeof question.questionAudio == "boolean") {

    let id = await recordTamil(question.question);
    if(!id) console.log("Failed to record "+question.question);
    console.log("id: "+id);
    newjson[question.id].questionAudio = id;

    fixcnt++;
  }

  if(question.answerAudio) {
    for (let answer of question.answers) {
      if(typeof answer.answerAudio == "boolean" || !answer.answerAudio) {
        let id = await recordTamil(answer.label);
        if(!id) console.log("Failed to record "+answer.label);
        console.log("id: "+id);
        newjson[question.id].answers[answer.id].answerAudio = id;
        fixcnt++;
      }

    }
  }
 }
data.questions = newjson
await updateSet(set, data.questions)

  res.status(200).json({ message: "Fixed "+fixcnt+" questions/answers" })



}
