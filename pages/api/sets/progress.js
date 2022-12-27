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
import { getSession } from "next-auth/react"
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
      if(!session.id) return res.status(401).json({
        message: "Unauthorized"
      })

    try {
      const { id, accuracy } = JSON.parse(req.body)

      if(!id || accuracy === undefined) return res.status(400).json({
        message: "Missing setId or accuracy"
      })

      if(isNaN(accuracy) || accuracy < 0 || accuracy > 100) return res.status(400).json({
        message: "Accuracy must be a number between 0 and 100"
      })

      console.log("id", id, "accuracy", accuracy, "user", session.id)

      const newPoints = await setProgress({ id, user: session.id, points: accuracy })

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
