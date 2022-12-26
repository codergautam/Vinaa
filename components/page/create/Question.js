import { useState } from "react"
import styled from "styled-components"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Trash } from "react-feather"

const Group = styled.div`
  padding: 30px 35px;
  background-color: white;
  width: 100%;
  border-radius: 30px;
  position: relative;

  .underhang {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0ms, opacity 200ms;
  }
  :hover > .underhang {
    visibility: visible;
    opacity: 1;
  }
`

// 2x2 grid
const OptionGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;

  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`
const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: 1em auto;
  gap: 1em;
  align-items: center
`
const Radio = styled.input`
  cursor: pointer;
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.5em;
  height: 1.5em;
  border: 0.15em solid var(--color-light-gray);
  border-radius: 50%;
  display: grid;
  place-content: center;

  ::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--color-gray);
  }
  :checked::before {
    transform: scale(1);
  }
  :focus {
    outline: max(2px, 0.15em) solid var(--color-light-gray);
    outline-offset: max(2px, 0.15em);
  }
`

const Input = styled.div`
  outline: none;
  border: none;
  width: 100%;
  font-size: 1.2rem;
  padding: 7px 10px;
  border-bottom: 3px solid var(--color-light-gray);
  transition: border-bottom-width 200ms, border-bottom-color 200ms;
  margin-bottom: 20px;
  max-height: 170px; /* the input auto grows, but not more than 4 rows */
  overflow: auto;

  :focus {
    border-bottom: 6px solid var(--color-gold);
  }

  :empty:before {
    content: attr(placeholder);
    color: rgb(150, 150, 150);
    pointer-events: none;
  }
`
const Answer = styled.input`
  font-size: 1.15rem;
  border: none;
  outline: none;

  ::placeholder {
    color: rgb(170, 170, 170);
  }
`

const Underhang = styled.div`
  position: absolute;
  top: 100%;
  right: 40px;
  background-color: white;
  padding: 12px 18px;
  border-radius: 0 0 20px 20px;
  box-shadow: 1px 0px 2px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  z-index: 0; /* so the box-shadow won't peek over */
`
const Delete = styled.button`
  padding: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: 1px solid var(--color-light-gray);
  border-radius: 5px;
  transition: opacity 200ms, background-color 200ms;

  svg {
    vertical-align: middle;
  }
  :hover {
    background-color: rgb(220, 220, 220);
  }
  :active {
    background-color: rgb(200, 200, 200);
  }
`
const Questions = styled.div`
  border-radius: 5px;
  display: flex;
  overflow: hidden;
  gap: 1px;
  background-color: var(--color-light-gray);
  outline: 1px solid var(--color-light-gray);
  margin-right: 10px;
`
const Amount = styled.button`
  padding: 5px 10px;
  background-color: white;
  border: none;
  outline: none;
  cursor: pointer;
  transition: opacity 200ms, background-color 200ms;
  :hover {
    background-color: rgb(220, 220, 220);
  }
  :active {
    background-color: rgb(200, 200, 200);
  }
  :disabled {
    cursor: no-drop;
    background-color: rgb(240, 240, 240);
  }
`

export default function Question({ data, update, remove }) {
  const [cur, setCur] = useState(data)
  const [parent] = useAutoAnimate()
  const name = `q__radio_${data.id}`

  console.log("cur:", cur)

  return (
    <Group onBlur={() => update(data.id, cur)}>
            <Input
        placeholder="Your prompt..."
        contentEditable="plaintext-only"
        suppressContentEditableWarning={true}
        onChange={e => {
          console.log("Change:", e.target.innerText)
        }}
        onBlur={e => {
          setCur({
           ...cur,
            prompt: e.target.innerText
          })
        }}
      >{data.prompt}</Input>
      <Input
        placeholder="Your question..."
        contentEditable="plaintext-only"
        suppressContentEditableWarning={true}
        onChange={e => {
          console.log("Change:", e.target.innerText)
        }}
        onBlur={e => {
          setCur({
           ...cur,
            question: e.target.innerText
          })
        }}
      >{data.question}</Input>

      <input type="checkbox" value={data.questionAudio} onChange={
        (e) => {
          if(e.target.checked) {
            setCur({
              ...cur,
              questionAudio: true
            })
          } else {
            setCur({
              ...cur,
              questionAudio: false,
              showQuestion: true
            })
          }
        }
      } id="audioQ"/>
      <label htmlFor="audioQ">Question Audio</label>

      <br/>

      <input type="checkbox" value={data.answerAudio} onChange={(e) => {
        if(e.target.checked) {
          setCur({
            ...cur,
            answerAudio: true
          })
        } else {
          setCur({
            ...cur,
            answerAudio: false
          })
        }
      }} id="audioA"/>
            <label htmlFor="audioA">Answer Audio</label>
            <br/>
      <input type="checkbox" disabled={cur.questionAudio ? false : true} checked={cur.showQuestion} key={Math.random()} onChange={(e) => {
        setCur({
          ...cur,
          showQuestion: e.target.checked
        })
        update(data.id, cur)
      }} id="showQ"/>

      <label htmlFor="showQ" >Show Question</label>

      <OptionGroup ref={parent} style={{
        display: data.answers.length === 2 ? "flex" : ""
      }} onChange={e => {
        const correct = +e.target.value
        if(isNaN(correct)) return
        const temp = data.answers.slice()
        for(let i = 0; i < temp.length; i++) {
          if(temp[i].correct) {
            temp[i].correct = false
            break
          }
        }
        temp[correct].correct = true
        setCur({ ...cur, answers: temp })
      }}>
        {data.answers.map(answer => (
          <RadioGroup key={answer.id}>
            <Radio
              type="radio"
              name={name}
              value={answer.id}
              checked={answer.correct}
              onChange={() => {
                // this empty function is necessary
                // to keep this input from being
                // readonly and erroring
              }}
            />
            <Answer
              placeholder={"Answer option " + (answer.id + 1)}
              value={answer.label}
              onChange={e => {
                const temp = data.answers.slice()
                temp[answer.id].label = e.target.value
                setCur({ ...cur, answers: temp })
              }}
            />
          </RadioGroup>
        ))}
      </OptionGroup>
      <Underhang className="underhang">
        <Questions>
          <Amount disabled={data.answers.length === 4} onClick={() => {
            const temp = data.answers.slice()
            temp.push({
              label: "",
              correct: false,
              id: temp.length
            })
            setCur({ ...cur, answers: temp })
          }}>+</Amount>
          <Amount disabled={data.answers.length === 2} onClick={() => {
            const temp = data.answers.slice()
            if(temp[temp.length - 1].correct) {
              temp[temp.length - 2].correct = true
            }
            setCur({ ...cur, answers: temp.slice(0, -1) })
          }}>-</Amount>
        </Questions>
        {data.last ? (
        <Delete title="Delete question" onClick={() => remove(data.id)}>
          <Trash size={18} color="red" />
        </Delete>
        ) : null}
      </Underhang>
    </Group>
  )
}
