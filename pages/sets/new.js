import { useState, useRef, useEffect } from "react"
import styled, { keyframes } from "styled-components"
import { PlusCircle } from "react-feather"
import toast from "react-hot-toast"
import Router from  "next/router"
import { unstable_getServerSession as getServerSession } from "next-auth/next"
import PageTitle from "@/components/PageTitle"
import Header from "@/components/page/create/Header"
import Question from "@/components/page/create/Question"

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
`
const Content = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const Card = styled.div`
  display: flex;
  gap: 10vh;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: rgba(254, 221, 126, 0.1);
  padding: 10vh 30%;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-snap-type: y mandatory;

  * {
    scroll-snap-align: center;
  }

  @media (max-width: 1400px) {
    padding: 10vh 10%;
  }
  @media (max-width: 800px) {
    padding: 10vh 5%;
  }
`

const Add = styled.div`
  cursor: pointer;
  padding: 30px 35px;
  background-color: white;
  width: 100%;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transition: transform 200ms;

  :hover {
    transform: scale(1.03);
  }
  :active {
    transform: scale(1.1);
  }
`

const spinning = keyframes`
  to {
    transform: rotate(.5turn);
  }
`
const Spinner = styled.div`
  width: 30px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid;
  border-color: white transparent;
  animation: ${spinning} 1s infinite;
`

const toaster = text => toast(text, {
  position: "bottom-center"
})

export default function New() {
  const [name, setName] = useState("")
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [edit, setEdit] = useState(false);

  // this is to enable access in the beforeunload event
  // because you can't access state in beforeunload
  const data = useRef({ questions, name })
  useEffect(() => {
    data.current = { questions, name } // update the ref with any changes
  }, [questions, name])

  // save user's data so when they close and reopen it will still be there
  useEffect(() => {
    let saved = localStorage.getItem("newset__data")
    if(saved) {
      saved = JSON.parse(saved)
      setQuestions(saved.questions)
      setName(saved.name)
      setEdit(saved.edit)
    }

    const saveData = () => {
      localStorage.setItem("newset__data", JSON.stringify(data.current))
    }

    window.addEventListener("beforeunload", saveData)
    return () => window.removeEventListener("beforeunload", saveData)
  }, []);

  const updateQuestion = (index, data) => {
    const temp = questions.slice()
    if(temp[index]) temp[index] = data
    if(temp.length > 0) temp[temp.length - 1].last = true

    setQuestions(temp)
  }
  const remove = index => {
    const temp = questions.slice()
    temp.splice(index, 1)
    for(let i = index; i < temp.length; i++) {
      temp[i].id--
    }
    if(temp.length > 0) {
    temp[temp.length - 1].last = true
    }
    setQuestions(temp)
  }
  const newQuestion = () => {
    if(questions.length === 50) {
      return toast.error("A set may not have more than 50 questions", {
        position: "bottom-left"
      })
    }
    const temp = questions.slice()
    temp.push({
      question: "",
      answers: [
        {
          label: "",
          correct: true,
          id: 0,
        },
        {
          label: "",
          correct: false,
          id: 1,
        },
        {
          label: "",
          correct: false,
          id: 2,
        },
        {
          label: "",
          correct: false,
          id: 3,
        }
      ],
      id: questions.length,
      prompt: "",
      questionAudio: false,
      answerAudio: false,
      showQuestion: true,
    })
    if(temp.length > 0) {
    temp[temp.length - 1].last = true
    if(temp.length > 1) temp[temp.length - 2].last = false
    }
    setQuestions(temp)
  }

  return (
    <Wrapper>
      <PageTitle title="Create set" />
      <Content>
        <Header name={name} setName={setName} publish={async () => {
          if(!name.length) {
            return toaster("Please enter a name for this set")
          }

          if(!questions.length) {
            return toaster("Please add at least one question")
          }

          // client-side input validation
          for(let i in questions) {
            i = +i // convert i to number
            const q = questions[i]
            if(!q.question.length) {
              return toaster(`Question ${i + 1} must have question text`)
            }
            if(q.answers.length < 2 || q.answers.length > 4) {
              return toaster(`Question ${i + 1} must have between 2 and 4 answers`)
            }
            let hasCorrect = false
            for(const a of q.answers) {
              if(!a.label.length) {
                return toaster(`An answer field for question ${i + 1} cannot be empty`)
              }
              if(a.correct && hasCorrect) {
                return toaster("Wait, why are you messing with me?")
              }
              if(a.correct) {
                hasCorrect = true
              }
            }
            if(!hasCorrect) {
              return toaster(`Question ${i + 1} must have one correct answer`)
            }


          }


          if(creating) {
            return toast.error("Please wait... your set is already being created ", {
            position: "bottom-center"
          })
        }
        toast("Creating set... (this can take upto 1-2 minutes if there is lots of audio)", {
          position: "bottom-center"
        });
          setCreating(true)
          const res = await fetch("/api/sets/new", {
            method: 'POST',
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ questions, name, edit })
          })
          const data = await res.json()
          setCreating(false)

          if(res.status !== 200) {
            return toast.error(data.message, {
              position: "bottom-center"
            })
          }

          // remove saved data on successful set creation
          localStorage.removeItem("newset__data")

          toast.success("Set created...", {
            position: "bottom-center"
          })
          Router.push("/sets/" + data.id)
        }} loading={loading}>


          {loading ? <Spinner /> : "Publish"}
        </Header>
        <Card>
          {questions.map(question => (
            <Question
              key={question.id}
              data={question}
              update={updateQuestion}
              remove={remove}
            />
          ))}
          <Add role="button" onClick={newQuestion}>
            <PlusCircle color="var(--color-gold)" size={42} />
          </Add>
        </Card>
      </Content>
    </Wrapper>
  )
}


const admins = JSON.parse(process.env.ADMINS)
export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res)
  if(session && !admins.includes(session.user.email)) {
    return {
      redirect: {
        permanent: false,
        destination: "/learn"
      }
    }
  }
  return {
    props: { session }
  }
}

