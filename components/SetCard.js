

import styled from "styled-components"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faPencil, faLock } from "@fortawesome/free-solid-svg-icons"
import ProgressBar from "@ramonak/react-progress-bar"
import styles from "./progressfix.module.css"
import { useState, useEffect } from "react";
import useWindowSize from "./useWindowSize"
import { Element, scroller } from "react-scroll"

const Set = styled.div`
cursor: pointer;
height: fit-content;
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 15px;
background-color: rgba(255, 156, 251, 0.2);
border-radius: 10px;
margin: 0 200px;
margin-bottom: 10px;

@media screen and (max-width: 1024px) {
  margin: 0 100px;
  margin-bottom: 10px;
}
@media screen and (max-width: 800px) {
  margin: 0 50px;
  margin-bottom: 10px;

}
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
const BadgeDiv = styled.div`
position: absolute;
@media screen and (max-width: 480px) {
  top: 3px;
  left: 7px;
}
`

export default function SetCard(props) {
  const { set, admin } = props
  const size = useWindowSize();

  let sizeMap = [
    [400, 0.6],
    [600, 0.4],
    [800, 0.2]
  ]

  let [mySize, setMySize] = useState(0.3);
  useEffect(() => {
    if (!size.width) return;
    console.log(size)
    let test = sizeMap.find(([w, s]) => size.width < w);
    if (!test) test = sizeMap[sizeMap.length - 1]
    setMySize(test[1])
  }, [size])

  let resource = set.questions[0].text;

  scroller.scrollTo("scrollHere", {
    duration: 500,
    delay: 0,
    smooth: "easeInOutQuart",
    offset: -200
  })

  return (
    <Element name={(!set.locked && set.points < 500) ? "scrollHere" : "" }>
    <Set key={set.id} style={{ backgroundColor: (set.locked ? "#F5F5F5" : (set.points >= 500 ? "#abf7b1" : "rgba(255, 156, 251, 0.4)")), cursor: (set.locked ? "default" : "pointer"), position: "relative" }}>

<BadgeDiv>
      {
        set.locked ? (
          <FontAwesomeIcon icon={faLock} />
        ) : (
          resource ? (
            <FontAwesomeIcon icon={faBook} />
          ) : (
            <FontAwesomeIcon icon={faPencil} />
          )
        )
      }
      </BadgeDiv>
      <SetTitle href={set.locked ? "#" : ((resource ? "/resources/" : "/sets/") + set.id)} style={{ cursor: (set.locked ? "default" : "pointer") }} onClick={(e)=>{if(set.locked)e.preventDefault()}}>
        {set.name.split("-")[0]}<br/>{set.name.split("-").slice(1).join("-")}
      </SetTitle>
      <SetInfo>
        {/* <SetCreator href={"/user/" + set.user}>{set.user}</SetCreator> */}
        {/* <SetQuestions>{set.questions.length} question{set.questions.length - 1 ? "s" : ""}</SetQuestions> */}
        <SetPoints style={{ width: "100%" }}>
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
              <div style={{ paddingTop: '10px' }}>
                <ProgressBar labelClassName={(set.points / 500) <= mySize ? styles.progress : ""} bgColor={set.points >= 500 ? "teal" : "purple"} width={"100%"} completed={(((set.points / 500) * 100).toFixed(0))} customLabel={
                  `${set.points} point${(set.points) - 1 ? "s" : ""} ${(set.points < 500) ? `(${((set.points / 500) * 100).toFixed(0)}%)` : "(completed)"}`
                } baseBgColor={"#fcb3f9"} />
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
                {
          props.admin ? (
            <div>
              <center>
                <br/>
            <button onClick={()=>{location.href='/api/sets/edit/'+set.id}}>Edit quiz</button>
              </center>
              </div>
          ) : null
        }
    </Set>
    </Element>
  )
}