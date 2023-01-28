import { latest, progressExists } from "@/server/db"
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  let data = await latest()
  data = data.filter((set) => set.user == session.username)
  for(let i in data) {

    try {
    data[i].questions = JSON.parse(data[i].questions)
    // fetch points
    if(session) {
      let sessId = session.id;
      let progress = await progressExists({id: sessId, set: data[i].id})

      if(progress) {
        data[i].points = progress
      } else data[i].points = 0
    }
    } catch(e) {
      console.error(e)
    }
  }
  res.status(200).json(data)
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
