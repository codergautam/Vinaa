/*
Route: api/progress
POST:
  Params:
    - id (set id)
    - accuracy (number)
  Returns:
    - total points for user
*/

import {
  API
} from "@/server/protected"
import { useSession, getSession } from "next-auth"
import {
  createProgress,
  updateProgress,
  getProgress,
  setProgress
} from "@/server/db"

export default async function handler(req, res) {
  const data = await API(req, res)
  if (!data)
    return res.status(401).json({
      message: "Unauthorized"
    })

  if (req.method === "POST") {
    if(typeof req.body === "undefined")
      return res.status(400).json({
        message: "Missing body"
      })

      const session = await getSession({ req })
      if(!session) return res.status(401).json({
        message: "Unauthorized"
      })

    try {
      const { id, accuracy } = req.body

      if(!id || !accuracy) return res.status(400).json({
        message: "Missing setId or accuracy"
      })

      const newPoints = await setProgress({ id, user: data.username, points: accuracy })
      console.log(newPoints)

      return res.status(200).json({
        points: newPoints
      })


    } catch (e) {
      console.error(e)
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  } else {
    if(!req?.query?.id)
      return res.status(400).json({
        message: "Needs query string id"
      })

    try {
      const progress = await getProgress(req.query.id, data.username)
      return res.status(200).json(progress.map(({ progress }) => progress))
    } catch (e) {
      console.error(e)
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  }
}
