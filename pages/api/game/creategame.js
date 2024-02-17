import { createGame } from "@/server/db"

export default async function handler(req, res) {
  const { setId } = req.query;
  const data = await createGame(setId);
  res.status(200).json({ code: data });
}
