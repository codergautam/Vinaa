import { getSet } from "@/server/db"

export default async function handler(req, res) {
  const { set } = req.query
  const data = await getSet(set)
  if(!data) {
    return res.status(404).json({ message: "Set not found" })
  }
  data.questions = JSON.parse(data.questions)
  res.status(200).json(data)
}
