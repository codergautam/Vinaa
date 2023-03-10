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
  progressExists,
  setProgress,
  finishResource
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
      const { id, accuracy, done, timePerQuestion, questionCnt } = JSON.parse(req.body)


      if(!id) return res.status(400).json({
        message: "Missing setId"
      })

      if(done) {

        // Resource done
        let alreadyCompleted = await finishResource({ id, user: session.id })
        return res.status(200).json({
          message: "Resource completed",
          alreadyCompleted
        })

      } else {
      if(accuracy === undefined) return res.status(400).json({
        message: "Missing accuracy"
      })

      if(isNaN(accuracy) || accuracy < 0 || accuracy > 100) return res.status(400).json({
        message: "Accuracy must be a number between 0 and 100"
      })

        let multiplier = 1;
        if(timePerQuestion) {
          if(timePerQuestion < 5500) multiplier =1.5
          if(timePerQuestion < 4500) multiplier =2
          if(timePerQuestion < 3500) multiplier = 2.5
          if(timePerQuestion < 2000) multiplier = 3
        }

        if(questionCnt > 20) multiplier *= 2
        if(questionCnt > 35) multiplier *= 1.5

        // console.log(multiplier)

      const newPoints = await setProgress({ id, user: session.id, points: Math.round(accuracy*multiplier) })

      return res.status(200).json({
        points: newPoints,
        gained: Math.round(accuracy*multiplier)
      })
    }


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
      const progress = await progressExists(req.query.id, data.username)
      return res.status(200).json(progress)
    } catch (e) {
      console.error(e)
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  }
}
