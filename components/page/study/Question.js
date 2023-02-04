import { useState, useEffect } from "react"
import styled from "styled-components"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import Button from "@/components/Button"
import AudioButton from "./AudioButton"
import ProgressBar from "@ramonak/react-progress-bar"

const Wrapper = styled.div`
  padding: 30px 40px;
  width: 40%;
  @media (max-width: 1400px) {
    width: 80%;
  }
  @media (max-width: 800px) {
    width: 95%;
  }
`
const Ask = styled.p`
  font-size: 2rem;
  @media (max-width: 800px) {
    font-size: 1.5rem;
  }
`

const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  margin-bottom: 15px;

  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`
const Option = styled.button`
  background-color: transparent;
  cursor: pointer;
  border-radius: 8px;
  border: 2px solid var(--color-light-gray);
  font-size: 1.2rem;
  padding: 10px;
  color: var(--color-gray);
  transition: background-color 200ms, color 200ms, border 200ms;

  :disabled {
    cursor: initial;
  }
`

export default function Question({
  data,
  done,
  last,
  total,
  questionNum,
  all
}) {
  const [selected, setSelected] = useState()
  const [parent] = useAutoAnimate()
  const [questionAudio, setQuestionAudio] = useState("")
  // let answerAudios = [];
  const [answerAudios, setAnswerAudios] = useState([]);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    if(!data?.answers) return;
    setAnswerAudios(data.answers.map(answer => answer.answerAudio ? new Audio("/api/audio/"+answer.answerAudio+".wav") : null));
  }, [data?.answers]);

  useEffect(() => {
    setSelected()
    if(data?.questionAudio) setQuestionAudio("/api/audio/"+data.questionAudio+".wav")
  }, [data?.id])



  let correctIndex = 0

  useEffect(() => {
    if(selected !== undefined && (!last && (selected == correctIndex))) {
      setTimeout(() => {
        done(selected, true)
      }, 1000)
    }
    if(typeof selected === "number" && (last || ((selected != correctIndex)))) {
      setShowDone(true);
    } else {
      setShowDone(false);
    }
  }, [selected])

  useEffect(() => {

  }, [selected])

  if(data) {
  for (let i in data.answers) {
    if (data.answers[i].correct) {
      correctIndex = +i
      break
    }
  }




  } else {
    return (<div></div>);
  }



  if(data) {
  return (
    <Wrapper ref={parent}>
        <ProgressBar completed={((((questionNum-(typeof selected === "number"?0:1))/total)*100).toFixed(0))+""} customLabel={" "}/>

      <center>
        <h1>Question {questionNum}</h1>
      <Ask>{data.prompt}</Ask>
      {questionAudio ? (
        <div>
        <AudioButton src={questionAudio} />
        <br/>
        <br/>
        </div>
      ) : null}
        {
          data?.showQuestion ? (
      <Ask>{data.question}</Ask>

          ) : null
        }
      </center>
      <Options>
        {data.answers.map(answer => {
          const styles = {};
          if (selected === answer.id) {
            if (answer.id === correctIndex) {
              styles.backgroundColor = "var(--color-green)"
              styles.border = "2px solid var(--color-green)"
              styles.color = "white"
            } else {
              styles.backgroundColor = "var(--color-red)"
              styles.border = "2px solid var(--color-red)"
              styles.color = "white"
            }
          } else if(selected !== undefined && answer.id === correctIndex) {
            styles.backgroundColor = "var(--color-green)"
            styles.border = "2px solid var(--color-green)"
            styles.color = "white"
          }
          return (
            <Option
              key={answer.id}
              onClick={() => {
                console.log(answer.label, data.question)
                // if(answerAudios[answer.id] && (typeof selected === "number" || (!data.answers[answer.id].correct || answer.label.trim() != data.question.trim()))) answerAudios[answer.id].play()
                 if(answerAudios[answer.id]) answerAudios[answer.id].play()

                if(typeof selected === "number") return;
                setSelected(answer.id)
              }}
              style={styles}
            >

              {answer.label}
            </Option>
          )
        })}
      </Options>
      {showDone ? (
        <Button onClick={() => done(selected, selected == correctIndex)}>
          {last ? "Done" : "Next"} &rarr;
        </Button>
      ) : null}
    </Wrapper>
  )
      }
}
