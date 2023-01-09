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
  finishResource,
  deleteProgress
} from "@/server/db"
import pathway from "../../../components/pathway.json";

export default async function handler(req, res) {
  const data = await API(req, res)
  if (!data)
    return res.status(401).json({
      message: "Unauthorized"
    })

  const session= await getSession({ req })

  if (req.method === "POST") {
  } else {
    if(!req?.query?.id)

      var pathwayIds = pathway.pathway.map((pathway) => {
        return pathway.sets;
      }).flat();

      for(let set of pathwayIds) {
        let progress = await progressExists( {id: session.id, set} )
        console.log( progress);
        if( progress) {
          console.log(set, req.query.id, progress);
          await deleteProgress({ id: set, user: session.id })
        }
      }
      return res.status(200).json({
        message: "Progress cleared"
      })
  }
}
