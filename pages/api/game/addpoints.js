import { getGame, updateGame } from "@/server/db"

export default async function handler(req, res) {
  let { code, playerId, points } = req.query;

  console.time("Player got points");
  console.log("Player got points", playerId, points, code);
  try {
    points = parseInt(points);
    playerId = parseInt(playerId);
  } catch(e) {
    return res.status(400).json({ error: "Invalid points" });
  }
  if(!code) return res.status(400).json({ error: "No code provided" });
  if(!playerId) return res.status(400).json({ error: "No playerid provided" });
  const data2 = await getGame(code);

  if(!data2) return res.status(404).json({ error: "Game not found" });
  const data = JSON.parse(data2.data);
  console.log("Player got points", playerId, points, code, data);
  if(data.state !== "started") return res.status(400).json({ error: "Game not started" });
  const player = data.leaderboard.find(player => player.id === playerId);
  if(!player) return res.status(400).json({ error: "Player not found" });

  player.score += points;
  try {
    player.score = parseInt(player.score);
  } catch(e) {
    return res.status(400).json({ error: "Invalid points" });
  }
  data.leaderboard = data.leaderboard.map(p => p.id === playerId ? player : p);

  await updateGame(code, data);

  console.log("Player got points", playerId, points, code);
  console.timeEnd("Player got points");

  res.status(200).json({ id: playerId, code});
}
