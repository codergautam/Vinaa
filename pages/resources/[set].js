import { useState } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import styled from "styled-components"

import PageTitle from "@/components/PageTitle"
import Header from "@/components/page/study/Header"
import Page from "@/components/page/study/Page"
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

  return (
    <Wrapper>
      <PageTitle title={data ? data.name : "Study resource"} />
      <Content>
        {data ? (
          <>
            <Header title={data.name} id={set} />
            {done ? (
              <Results data={data} results={results} />
            ) : (
              <Card>
                <Page
                  last={data.questions.length - 1 === q}
                  data={data.questions[q]}
                  done={() => {
                    setQ(q + 1)

                    if (q + 1 === data.questions.length) {
                       fetch("/api/sets/progress", {
                         method: "POST",
                         body: JSON.stringify({
                           id: set,
                           done: true,
                         }),
                       }).then((res) => {
                          res.json().then((data) => {
                            if (data.error) {
                              toast.error(data.error)
                            } else {
                              setDone(true)
                            }
                          });
                        });
                      // setDone(true);
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
