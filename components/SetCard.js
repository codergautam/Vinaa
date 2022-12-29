

import styled from "styled-components"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faPencil, faLock } from "@fortawesome/free-solid-svg-icons"
import ProgressBar from "@ramonak/react-progress-bar"
import styles from "./progressfix.module.css"

const Set = styled.div`
cursor: pointer;
height: fit-content;
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 15px;
background-color: rgba(255, 156, 251, 0.2);
border-radius: 10px;
margin: 0 50px;
margin-bottom: 10px;
`
const SetTitle = styled(Link)`
text-decoration: none;
color: var(--color-gray);
font-size: 1.5rem;
text-align: center;

@media screen and (max-width: 480px) {
  font-size: 1rem;
}
`
const SetInfo = styled.div`
display: flex;
justify-content: space-between;
`
const SetCreator = styled(Link)`
text-decoration: none;
color: #db7bd8;
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
max-width: 40%;
`
const SetQuestions = styled.span`
color: #737373;
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
`

const SetPoints = styled.span`
color: #737373;
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
font-size: 1rem;
@media screen and (max-width: 480px) {
  font-size: 0.75rem;
}
`
export default function SetCard(props) {
const { set } = props
let resource = set.questions[0].text;
return (
  <Set key={set.id} style={{ backgroundColor: (set.locked ? "#F5F5F5" : (set.points >= 500 ? "#abf7b1" :"rgba(255, 156, 251, 0.2)")), cursor: (set.locked ? "default" : "pointer") }}>
    {
      set.locked ? (
      <FontAwesomeIcon icon={faLock} style={{ position:"absolute"}} />
      ) : (
      resource ? (
      <FontAwesomeIcon icon={faBook} style={{ position:"absolute"}} />
      ) : (
      <FontAwesomeIcon icon={faPencil} style={{ position:"absolute"}} />
      )
      )
}
    <SetTitle href={set.locked?"":((resource?"/resources/":"/sets/") + set.id)} style={{cursor: (set.locked ? "default" : "pointer") }}>
      {set.name}
    </SetTitle>
    <SetInfo>
      {/* <SetCreator href={"/user/" + set.user}>{set.user}</SetCreator> */}
      {/* <SetQuestions>{set.questions.length} question{set.questions.length - 1 ? "s" : ""}</SetQuestions> */}
      <SetPoints style={{width: "100%"}}>
        {/* {
        resource ? (
          (set.points == 500) ? "Completed" : ""
        ) : (

            `${set.points} point${(set.points) - 1 ? "s" : ""} ${(set.points < 500) ? `(${((set.points/500)*100).toFixed(0)}%)`: ""}`

        )
        } */}
{
  (resource || set.points >= 500 || set.locked) ? (
    (set.points >= 500) ? `Completed ${resource ? "" : `(${set.points} points)`}` : ""
  ) : (
    <div style={{paddingTop: '10px'}}>
    <ProgressBar labelClassName={(set.points/500) <= 0.1 ? styles.progress : ""} bgColor={set.points >= 500 ? "teal" : "purple"} width={"100%"} completed={(((set.points/500)*100).toFixed(0))} customLabel={
      `${set.points} point${(set.points) - 1 ? "s" : ""} ${(set.points < 500) ? `(${((set.points/500)*100).toFixed(0)}%)`: "(completed)"}`
    } />
    </div>
  )
  }

        </SetPoints>
      {
        props.showId ? (
      <SetPoints>ID: {set.id}</SetPoints>
          ) : null
      }

    </SetInfo>

  </Set>
)
}