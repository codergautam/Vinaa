import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import styled from "styled-components"
import toast from "react-hot-toast"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import PageTitle from "@/components/PageTitle"
import Header from "@/components/page/study/Header"
import Question from "@/components/page/study/Question"
import Results from "@/components/page/study/Results"
import Button from "@/components/Button"

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
`
const Content = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  @media (max-width: 600px) {
    height: 100%;
  }
`

const Card = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Loading = styled.h2`
  font-size: 1.5rem;
  color: var(--color-gray);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Set() {
  const router = useRouter()
  const { set } = router.query
  const { data, error } = useSWR(set ? `/api/sets/${set}` : null, fetcher)
  const [done, setDone] = useState(false)
  const [results, setResults] = useState([])
  const [correctCnt, setCorrectCnt] = useState(0)
  const [q, setQ] = useState(0)
  const [parent] = useAutoAnimate()
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [pointsGained, setPointsGained] = useState(0);
  const [flip, setFlip] = useState(false)

  let [questions, setQuestions] = useState([]);
  useEffect(() => {
    // console.log("data", data)
    if (data) {
      setStartTime(Date.now());
      console.log("shuffling questions")
      setQuestions(data?.questions?.sort(() => Math.random() - 0.5));

    }
  }, [data]);

  useEffect(() => {
    if(flip) {
            if (data?.questions) {
        let answerOptions = data?.questions?.map((q) => {
          return { question: q.question, audio: q.questionAudio }

        })
        console.log(answerOptions)
        answerOptions = [...new Map(answerOptions.map(item => [item.question, item])).values()];
        // get only unique answers

        let newQuestions = [];
        data?.questions?.forEach((e) => {
          let options = answerOptions.filter((o) => o.question !== e.question);
          // Get 3 options random
          options = options.sort((a, b) => Math.random() - 0.5).slice(0, 3)
          options.push({ question: e.question, audio: e.questionAudio, correct: true })
          // add current o
          options = options.sort((a, b) => Math.random() - 0.5).map((q, i) => {
            return {
              id: i,
              correct: q.correct ?? false,
              label: q.question,
              answerAudio: q.audio

            }
          })


          console.log(e)
          let newQ = {
            id: e.id,
            answerAudio: true,
            prompt: e.prompt,
            question: e.answers.find((a) => a.correct).label,
            questionAudio: e.answers.find((a) => a.correct).answerAudio,
            showQuestion: true,
            answers: options
          }

          newQuestions.push(newQ)
        
        })
        setQuestions(newQuestions)
      }
    } else {
      if(data?.questions) setQuestions(data?.questions)
      else setQuestions([])
    }
  }, [flip])


  return (
    <Wrapper>
      
      <Content ref={parent}>
        
        {data ? (
          <>
            <Header title={data.name} id={set} />
            <PageTitle title={data ? data.name : "Study set"} /><Button style={{width: "200px"}} onClick={()=>setFlip(!flip)}>{flip?"Questions":"Answers"}</Button>
            {done ? (
              <Results questions={data.questions} results={results} timeElapsed={endTime - startTime} pointsGained={pointsGained} />
            ) : (
              <Card>
                
                <Question
                  last={questions.length - 1 === q}
                  data={questions[q]}
                  total={questions.length}
                  all={questions}
                  questionNum={q + 1}
                  done={(selected, correct) => {
                    const temp = results.slice()
                    temp.push(selected)
                    let tempCorrect = correctCnt;
                    if (correct) tempCorrect++;
                    setCorrectCnt(tempCorrect);
                    console.log("temp", temp)
                    setResults(temp)
                    setQ(q + 1)

                    if (q + 1 === data.questions.length) {
                      const correct = tempCorrect;
                      const accuracy = Math.round((correct / (q + 1)) * 100)
                      const timeElapsed = Date.now() - startTime;
                      setEndTime(Date.now())
                      // console.log(temp, correct, q+1, accuracy)
                      fetch("/api/sets/progress", {
                        method: "POST",
                        body: JSON.stringify({
                          id: set,
                          accuracy,
                          timePerQuestion: (timeElapsed / (q + 1)),
                          questionCnt: q + 1,
                        }),
                      }).then((res) => {
                        res.json().then((data) => {
                          if (data.error) {
                            toast.error(data.error)
                          } else {
                            toast.success("You now have " + data.points + " points on this lesson! (" + data.gained + " gained)", { duration: 5000 });
                            setPointsGained(data.gained)
                            setDone(true)
                          }
                        });
                      });
                    }
                  }}
                />
               
                
              </Card>
            )}
          </>
        ) : (
          <Loading>{error ? "An unkown error occured" : "Loading..."}</Loading>
        )}
      </Content>
    </Wrapper>
  )
}
