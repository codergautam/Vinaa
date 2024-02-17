import { getGame, updateGame } from "@/server/db"

export default async function handler(req, res) {
  const { code, name } = req.query;
  if(!code) return res.status(400).json({ error: "No code provided" });
  if(!name) return res.status(400).json({ error: "No name provided" });
  const data2 = await getGame(code);

console.log("Player joined", name, code);
  if(!data2) return res.status(404).json({ error: "Game not found" });
  const data = JSON.parse(data2.data);

  if(data.state !== "waiting") return res.status(400).json({ error: "Game already started" });
  if(data.leaderboard.find(player => player.name === name)) return res.status(400).json({ error: "Name already in use" });

  const playerId = data.leaderboard.length + 1;
  data.leaderboard.push({ name, score: 0, id: playerId });

  await updateGame(code, data);

  console.log("Player joined", name, playerId, code);

  res.status(200).json({ id: playerId, code});
}
