import { getAllSets } from "@/server/db"
import fs from "fs";

export default async function handler(req, res) {
  const data = await getAllSets()
  let audios = new Set();
  data.forEach(({questions}) => {
    questions = JSON.parse(questions)[0];
    if(questions.questionAudio && typeof questions.questionAudio == "string") audios.add(questions.questionAudio);
    questions.answers?.forEach(({answerAudio}) => {
      if(answerAudio && typeof answerAudio == "string") audios.add(answerAudio);
    });
  });
  // Find audio files that are not in use
  let unused = new Set();
  let dir = fs.readdirSync("./public/audio");
  dir.forEach(file => {
    if(file.endsWith(".wav")) {
      if(!audios.has(file.slice(0, -4))) unused.add(file);
    }
  });

  // Delete unused audio files
  unused.forEach(file => {
    fs.unlinkSync("./public/audio/" + file);
  });

  res.status(200).json({
    deleted: [...unused],
    cnt: unused.size
  })
}
