import { getGame, updateGame } from "@/server/db"

export default async function handler(req, res) {
  const { code } = req.query;
  if(!code) return res.status(400).json({ error: "No code provided" });
  const data2 = await getGame(code);


  if(!data2) return res.status(404).json({ error: "Game not found" });
  const data = JSON.parse(data2.data);
  if(data.state !== "waiting") return res.status(400).json({ error: "Game in wrong state" });

  data.state = "started";
  data.startTime = Date.now();

  await updateGame(code, data);


  res.status(200).json({ code});
}
