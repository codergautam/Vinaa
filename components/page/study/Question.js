import { useState, useEffect } from "react"
import styled from "styled-components"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import Button from "@/components/Button"

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
  margin-bottom: 20px;
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
  last
}) {
  const [selected, setSelected] = useState()
  const [parent] = useAutoAnimate()

  useEffect(() => {
    setSelected()
  }, [data.id])

  let correctIndex = 0
  for (let i in data.answers) {
    if (data.answers[i].correct) {
      correctIndex = +i
      break
    }
  }

  return (
    <Wrapper ref={parent}>
      <Ask>{data.question}</Ask>
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
          } else if(selected && answer.id === correctIndex) {
            styles.backgroundColor = "var(--color-green)"
            styles.border = "2px solid var(--color-green)"
            styles.color = "white"
          }
          return (
            <Option
              key={answer.id}
              onClick={() => setSelected(answer.id)}
              disabled={typeof selected === "number"}
              style={styles}
            >
              {answer.label}
            </Option>
          )
        })}
      </Options>
      {(typeof selected === "number") ? (
        <Button onClick={() => done(selected)}>
          {last ? "Done" : "Next"} &rarr;
        </Button>
      ) : null}
    </Wrapper>
  )
}
