function checkIfTamil(text) {
  // Regex: ^[\u0B80-\u0BFF]+$
  return /^[\u0B80-\u0BFF]+$/.test(text.split("").filter((c) => c !== " ").join(""));
}
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

}

import { getSession } from "next-auth/react"
import {
  progressExists,
  setProgress,
  finishResource,
  deleteProgress
} from "@/server/db"
import pathway from "../../../components/pathway.json";

export default async function handler(req, res) {

  const session= await getSession({ req })

  if (req.method === "POST") {
  } else {
    // Get id and text from query string
    const id = req.query.id
    const text = req.query.text

    // record
    if (id && text) {
      if(!checkIfTamil(text)) {
        return res.status(401).json({
          message: "Please enter a valid Tamil text"
        })
      }
      await recordTamil(text, id)
      return res.status(200).json({
        message: "Recorded"
      })
    } else {
      return res.status(400).json({
        message: "Missing id or text"
      })
    }
  }
}
