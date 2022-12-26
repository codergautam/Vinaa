import { nanoid } from "nanoid"
import { API } from "@/server/protected"
import { createSet } from "@/server/db"

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
  console.log("q:", body.questions)
  try {
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
    if (!q.prompt.length)
      return `Question ${i + 1} must have prompt text`
    if (q.answers.length < 2 || q.answers.length > 4)
      return `Question ${i + 1} must have between 2 and 4 answers`
    let hasCorrect = false
    for (const a of q.answers) {
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
