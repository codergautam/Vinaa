import { useState } from "react"
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
  const [q, setQ] = useState(0)
  const [parent] = useAutoAnimate()

  return (
    <Wrapper>
      <PageTitle title={data ? data.name : "Study set"} />
      <Content ref={parent}>
        {data ? (
          <>
            <Header title={data.name} id={set} />
            {done ? (
              <Results data={data} results={results} />
            ) : (
              <Card>
                <Question
                  last={data.questions.length - 1 === q}
                  data={data.questions[q]}
                  done={(selected) => {
                    const body = JSON.stringify({
                      id: data.id,
                      q,
                      selected,
                      correct: data.questions[q].answers[selected].correct
                    })
                    fetch("/api/sets/progress", {
                      method: "POST",
                      headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                      },
                      body,
                    }).then(res => res.json()).then(console.log).catch((e) => {
                      console.error(e)
                      toast.error(
                        "An unexpected error occured while saving your progress",
                        {
                          position: "bottom-center",
                        }
                      )
                    })

                    const temp = results.slice()
                    temp.push(selected)
                    setResults(temp)
                    setQ(q + 1)

                    if (q + 1 === data.questions.length) {
                      return setDone(true)
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
