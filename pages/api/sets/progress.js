/*
Route: api/progress

GET:
  Params:
    - id (set id)
  Returns:
    - progress

POST:
  Params:
    - id (set id)
    - q (question number)
    - select (selection option)
    - correct (boolean)
  Returns:
    - Message (success)
*/

import {
  API
} from "@/server/protected"
import {
  createProgress,
  updateProgress,
  getProgress
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
    try {
      const { id, ...more } = req.body
      let current = await getProgress(id, data.username)
      try {
        current = JSON.parse(current)
      } catch {}
      const expected = current?.length || 0
      if(more.q !== 0 && more.q !== expected)
        return res.status(400).json({
          message: `Expected question ${expected} but received ${more.q}`
        })
      
      const progress = (current ?? []).concat(more)
      
      await (current ? (more.q ? updateProgress : createProgress) : createProgress)({
        id,
        user: data.username,
        progress
      })
    } catch (e) {
      console.error(e)
      return res.status(500).json({
        message: "Internal server error"
      })
    }
    return res.status(200).json({
      message: "success"
    })
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
