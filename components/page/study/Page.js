import styled from "styled-components"

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
  background-color: lightgray;
  border-radius: 30px;
`
export default function Page({
  data,
  done,
  last
}) {
  // let answerAudios = [];

2
  let correctIndex = 0

  if(data) {
  } else {
    return (<div></div>);
  }

  if(data) {
  return (
    <Wrapper>
      <center>
        <h2>Page {data.id+1}</h2>

{/* markdown */}
          <ReactMarkdown>{data.text}</ReactMarkdown>

      </center>
        <Button onClick={() => done()}>
          {last ? "Done" : "Next"} &rarr;
        </Button>
    </Wrapper>
  )
      }
}
