import { useEffect, useState } from "react"
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
const Input = styled.textarea`
  outline: none;
  border: none;
  width: 100%;
  font-size: 1.2rem;
  padding: 7px 10px;
  border-bottom: 3px solid var(--color-light-gray);
  transition: border-bottom-width 200ms, border-bottom-color 200ms;
  margin-bottom: 20px;
  max-height: 360px; /* the input auto grows, but not more than 4 rows */
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

export default function Page({ data, update, remove }) {
  const [cur, setCur] = useState(data)
  const [parent] = useAutoAnimate()
  const name = `q__radio_${data.id}`

  console.log("cur:", cur)
  useEffect(() => {
    update(data.id, cur)
  }, [cur])

  return (
    <Group>
      <h1> Page {cur.id+1} </h1>
      <Input
        placeholder={"Page Content"}
        onChange={e => {
          console.log("e.target.innerText:", e.target.value)
          setCur({
            ...cur,
             text: e.target.value
           })
        }}
        value={cur.text}
      />
      <Underhang className="underhang">
        {data.last ? (
        <Delete title="Delete page" onClick={() => remove(data.id)}>
          <Trash size={18} color="red" />
        </Delete>
        ) : null}
      </Underhang>
    </Group>
  )
}
