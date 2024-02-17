import { use, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import styled from "styled-components"
import toast from "react-hot-toast"

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
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [pointsGained, setPointsGained] = useState(0);
  const [flip, setFlip] = useState(false)

  const [liveMode, setLiveMode] = useState("")
  const [playerName, setName] = useState("")
  const [joined, setJoined] = useState(false)
  const [liveData, setLiveData] = useState(null)
  const [waiting, setWaiting] = useState(true)

  const [timeLeft, setTimeLeft] = useState(0)
  const answerClicked = useRef(false)
  const playerId = useRef(null)

  useEffect(() => {
    if(window.location.search.includes("liveMode")) {
      // liveMode=gameId
      setLiveMode(window.location.search.split("=")[1])
    }
  }, []);

  useEffect(() => {
    let interval;
    if(liveMode && joined && waiting) {
      interval = setInterval(() => {
      fetch(`/api/game/getgame?code=${liveMode}`).then(res => res.json()).then(data => {
        if(data.error) {
          toast.error(data.error)
        } else {
          const actualData = JSON.parse(data.data);
          setLiveData(actualData);
          if(actualData.state === "started") {
            setWaiting(false)
      setStartTime(Date.now());

            console.log("Game started", actualData)
            setTimeLeft(Date.now() - actualData.startTime)
          }
        }
      });
    }, 2000);
    }

    return () => clearInterval(interval);
  }, [liveMode, joined, waiting]);

  useEffect(() => {
    const interval = setInterval(() => {

      if(!liveMode || !liveData) return;
      console.log("timeleft", timeLeft)
      if(liveData?.startTime) setTimeLeft(20000- ((Date.now() - liveData.startTime)%20000))
    }, 100)
    return () => clearInterval(interval)
  }, [liveData]);

  useEffect(() => {
    if(!data || !liveMode) return;

    const elapsed = Date.now() - liveData?.startTime;
    const expectedQ = Math.floor(elapsed / 20000);

    if(expectedQ !== q && expectedQ < data.questions.length) {
      setQ(expectedQ)
      if(!answerClicked.current) {
        toast.error("You didn't answer in time (+0 points)")
      }
      answerClicked.current = false;

    }

    if(expectedQ >= data.questions.length && !done) {
      setDone(true)
      setEndTime(Date.now())
    }

    console.log("expectedQ", expectedQ, q)
  }, [timeLeft]);

  let [questions, setQuestions] = useState(liveData ? data?.questions : [])
  useEffect(() => {
    // console.log("data", data)
    if (data && !liveMode) {
      setStartTime(Date.now());
      console.log("shuffling questions")
      setQuestions(data?.questions?.sort(() => Math.random() - 0.5));

    } else if(data) {
      setQuestions(data?.questions)
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

      <Content>

        {data ?
        liveMode && !joined ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <h1>Enter your name:</h1>
            <input
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              onClick={() => {
                if (!playerName) return toast.error("Please enter your name")
                fetch(`/api/game/join?code=${liveMode}&name=${playerName}`).then((res) => {
                  res.json().then((data) => {
                    if (data.error) {
                      toast.error(data.error)
                    } else {
                      toast.success("Joined game")
                      playerId.current = data.id;
                      fetch(`/api/game/getgame?code=${liveMode}`).then((res) => {
                        res.json().then((data) => {
                      setJoined(true)
                        });
                      });
                    }
                  });
                });
              }}
            >
              Start
            </Button>
          </div>
        ) :

        liveMode && joined && waiting ? (
          <>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <h1>Waiting for game to start...<br/>Players joined: {liveData?.leaderboard?.length}</h1>
            </div>
          </>
        ) :
        (
          <>
            <Header title={data.name} id={set} />
            <PageTitle title={data ? data.name : "Study set"} />
            {!liveMode ? (
            <Button style={{width: "200px"}} onClick={()=>setFlip(!flip)}>{flip?"Questions":"Answers"}</Button>
            ) : null}
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
                  timeLeft={timeLeft}
                  liveMode={liveMode}
                  liveData={liveData}
                  rank={liveData?.leaderboard?.sort((a, b) => b.points - a.points).findIndex((e) => e.id === playerId.current) + 1}
                  onAnswerClickLive={(correct) => {
                    if(!correct) toast.error("Incorrect Answer (+0 points)")
                    else {
                      const maxPnts = 1000;
                      const pnts = Math.round((timeLeft / 20000) * maxPnts);
                      toast.success("Correct! (+"+pnts+" points)")

                      fetch(`/api/game/addpoints?code=${liveMode}&playerId=${playerId.current}&points=${pnts}`).then((res) => {
                        res.json().then((data) => {
                          if (data.error) {
                            toast.error(data.error)
                          } else {
                          }
                        });
                      });
                    }

                    answerClicked.current = true;
                  }}
                  done={(selected, correct) => {
                    const temp = results.slice()
                    temp.push(selected)
                    let tempCorrect = correctCnt;
                    if (correct) tempCorrect++;
                    setCorrectCnt(tempCorrect);
                    console.log("temp", temp)
                    setResults(temp)
                    if(!liveMode) setQ(q + 1)

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
