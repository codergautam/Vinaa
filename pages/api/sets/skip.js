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
  setProgress,
  finishResource,
  progressExists
} from "@/server/db"
import pathway from '../../../components/pathway.json'

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
      const { id } = JSON.parse(req.body)


      if(!id) return res.status(400).json({
        message: "Missing Id"
      })

      let pathwayIds = pathway.pathway.map((pathway) => {
        return pathway.sets;
      }).flat();
      let setsBeforeId = pathwayIds.slice(0, pathwayIds.indexOf(id));
      let changed = [];
      for (let set of setsBeforeId) {
        let progress = await progressExists( {id: session.id, set} )
        if(!progress || progress < 500) {
        console.log(set, session.username, progress, 500 - (progress ?? 0) );

          await setProgress({ id: set, user: session.id, points: 500 - (progress ?? 0) })
          changed.push(set)
        }
      }
      res.status(200).json({
        changed: changed
      })



    } catch (e) {
      console.error(e)
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  } else {
    res.status(400).send("Method not allowed")
  }
}
