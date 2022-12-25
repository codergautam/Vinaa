import { useState } from "react"
import styled from "styled-components"
import Button from "@/components/Button"

import Progress from "@/components/page/study/Progress"
import LogoText from "@/components/Navbar/LogoText"

const Bar = styled.header`
  height: 4em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
  background-color: rgb(245, 245, 245);
`
const Title = styled.h2`
  font-weight: normal;
  margin-left: 30px;
`

export default function Header({ title, id }) {
  const [modal, setModal] = useState(false)

  return (
    <>
      <Bar>
        <Button secondary href="/learn">&larr; Back</Button>
        <Title>Set: {title}</Title>
        <LogoText size="30px"/>
      </Bar>
      {modal ? <Progress close={() => setModal(false)} set={id} /> : null}
    </>
  )
}
