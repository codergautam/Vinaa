import { getGame } from "@/server/db"

export default async function handler(req, res) {
  const { code } = req.query;
  const data = await getGame(code);
  res.status(200).json(data);
}
