

import styled from "styled-components"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook } from "@fortawesome/free-solid-svg-icons"

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
  <Set key={set.id} onClick={e => {
    // if the user is trying to click on the creator of the set
    // don't take them to the actual set
    // if(e.target.tagName !== "A")
    //   router.push("/sets/" + set.id);
  }}>
    <SetTitle href={(resource?"/resources/":"/sets/") + set.id}>
      {set.name}
    </SetTitle>
    <SetInfo>
      {/* <SetCreator href={"/user/" + set.user}>{set.user}</SetCreator> */}
      {/* <SetQuestions>{set.questions.length} question{set.questions.length - 1 ? "s" : ""}</SetQuestions> */}
      <SetPoints>
        {
        resource ? (
          (set.points == 500) ? "Completed" : ""
        ) : (

            `${set.points} point${(set.points) - 1 ? "s" : ""}`

        )
        }</SetPoints>
      {
        props.showId ? (
      <SetPoints>ID: {set.id}</SetPoints>
          ) : null
      }

    </SetInfo>
  </Set>
)
}