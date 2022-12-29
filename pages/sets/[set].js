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

  let [questions, setQuestions] = useState([]);
  useEffect(() => {
    // console.log("data", data)
    if (data) {
      setQuestions(data?.questions?.sort(() => Math.random() - 0.5));
    }
  }, [data]);


  return (
    <Wrapper>
      <PageTitle title={data ? data.name : "Study set"} />
      <Content ref={parent}>
        {data ? (
          <>
            <Header title={data.name} id={set} />
            {done ? (
              <Results questions={data.questions} results={results} />
            ) : (
              <Card>
                <Question
                  last={questions.length - 1 === q}
                  data={questions[q]}
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
                      const accuracy = Math.round((correct / (q+1)) * 100)
                      // console.log(temp, correct, q+1, accuracy)
                       fetch("/api/sets/progress", {
                         method: "POST",
                         body: JSON.stringify({
                           id: set,
                           accuracy,
                         }),
                       }).then((res) => {
                          res.json().then((data) => {
                            if (data.error) {
                              toast.error(data.error)
                            } else {
                              toast.success("You now have " + data.points + " points on this lesson!");
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
