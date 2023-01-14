import { getSet } from "@/server/db"

export default async function handler(req, res) {
  const { set } = req.query
  const data = await getSet(set)
  if(!data) {
    return res.status(404).json({ message: "Set not found" })
  }

data.questions = JSON.stringify(JSON.parse(data.questions).map((q) => {
  if(q.questionAudio) q.questionAudio = true
  if(q.answerAudio) {
  q.answers = q.answers.map((a) => {
    delete a.answerAudio
    return a
  });
  }
  return q;
}))
  
  res.status(200).send(`
  <script>
  let questions = JSON.parse(decodeURIComponent(atob('${btoa(encodeURIComponent(data.questions))}')))
  let name = (decodeURIComponent(atob('${btoa(encodeURIComponent(data.name))}')))
  function replaceall(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
  window.localStorage.setItem("newset__data", JSON.stringify({questions: questions, name: name}))
  window.location.href = "/sets/new"
  </script>
  `)
}
