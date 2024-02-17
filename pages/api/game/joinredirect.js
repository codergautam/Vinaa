import { getGame, updateGame } from "@/server/db"

export default async function handler(req, res) {
  const { code } = req.query;
  if(!code) return res.status(400).json({ error: "No code provided" });
  const data2 = await getGame(code);

console.log("Player coming", code);
  if(!data2) return res.status(404).json({ error: "Game not found" });
  const data = JSON.parse(data2.data);

  res.redirect(307, `/sets/${data.setId}?liveMode=${code}`);
}
