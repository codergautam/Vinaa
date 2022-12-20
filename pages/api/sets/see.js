import { see } from "@/server/db"

export default async function handler(req, res) {
  const data = await see()
  return res.status(200).json(data)
}
