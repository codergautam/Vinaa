import styled from "styled-components"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import Button from "@/components/Button"
import ReactMarkdown from "react-markdown"

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
`

export default function Page({
  data,
  done,
  last
}) {
  const [parent] = useAutoAnimate()
  // let answerAudios = [];

2
  let correctIndex = 0

  if(data) {
  } else {
    return (<div></div>);
  }

  if(data) {
  return (
    <Wrapper ref={parent}>
      <center>

{/* markdown */}
        <Ask>
          <ReactMarkdown>{data.text}</ReactMarkdown>
        </Ask>

      </center>
        <Button onClick={() => done()}>
          {last ? "Done" : "Next"} &rarr;
        </Button>
    </Wrapper>
  )
      }
}
