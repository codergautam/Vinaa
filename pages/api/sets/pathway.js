import { latest, progressExists } from "@/server/db"
import { getSession } from "next-auth/react"
import { pathway } from "../../../components/pathway.json"

export default async function handler(req, res) {
  const session = await getSession({ req })
  let all = await latest()
  let pathwaySets = [];
  pathway.forEach((unit) => {
    pathwaySets.push(unit.sets)
  })
  pathwaySets = pathwaySets.map((unitSets) => {
    return unitSets.map((set) => {
      return all.find((s) => s.id === set)
    })
  })

  let lastCompleted = 0;
  let curCnt = 0;
  for(let i in pathwaySets) {
    for(let j in pathwaySets[i]) {
      curCnt++;
    pathwaySets[i][j].questions = JSON.parse(pathwaySets[i][j].questions)
    // fetch points
    if(session) {
      let sessId = session.id;
      let progress = await progressExists({id: sessId, set: pathwaySets[i][j].id})
      if(progress) {
        pathwaySets[i][j].points = progress
      } else pathwaySets[i][j].points = 0

      if(pathwaySets[i][j].points >= 500) lastCompleted = curCnt;
      else if(lastCompleted+1 < curCnt) pathwaySets[i][j].locked = true;

    }
  }
  res.status(200).json(pathwaySets)
}
}

/*
const dummyData = [
    {
      title: "Welcome to Vina",
      creator: "Vina",
      questions: 13,
      id: "a9fPfm8",
    },
    {
      title: "How to use",
      creator: "Random user",
      questions: 5,
      id: "a9fPfm7",
    },
    {
      title: "What is Vina?",
      creator: "Vina",
      questions: 12,
      id: "a9fPfm5",
    },
    {
      title: "You should try Vina",
      creator: "Bob12",
      questions: 20,
      id: "a9fPfm9",
    },
    {
      title: "Algebra formulae",
      creator: "mathboi12",
      questions: 100,
      id: "aufPfm8",
    },
    {
      title: "Rate vina!",
      creator: "Vina",
      questions: 6,
      id: "abcdefg",
    },
  ]
*/
