import { nanoid } from "nanoid"
import { API } from "@/server/protected"
import { createSet } from "@/server/db"
import { v4 } from "uuid"


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
  const { name, pages } = body

  const valid = validate(name, pages)
  if(typeof valid === "string") {
    return res.status(400).json({
      "message": valid
    })
  }

  const id = nanoid(8)
  try {

    await createSet({ id, name, questions: pages, user: user.username })
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

function validate(name, pages) {
  if (!name)
    return "Resource name required"
  if (!pages || !pages.length)
    return "At least one page is required"

  if(pages.length > 20)
    return "A resource may not have more than 20 pages"

  for (let i in pages) {
    i = +i
    const p = pages[i]
    if(!p.text) {
      return "Page "+(i+1)+" is missing text"
    }
  }
}
