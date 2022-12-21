import styled from "styled-components"
import { useSession } from "next-auth/react"

import PageTitle from "@/components/PageTitle"
import Sets from "@/components/Sets"
import Pie from "@/components/Pie"
import Button from "@/components/Button"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar/Navbar"
import Pathway from "@/components/page/learn/Pathway"

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: inline-block;
`

const Greeting = styled.div`
  padding: 75px 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 40px;
  }
`
const Hello = styled.div`
  font-size: 2rem;
  color: var(--color-gray);
`
const Name = styled.h1`
  color: var(--color-dark);
  text-transform: initial;
`

const Content = styled.div`
  margin: 2em 20%;

  @media (max-width: 800px) {
    margin: 2em 3%;
  }
`

const ActionGroup = styled.div`
  margin: 30px 0;
  display: flex;
  gap: 15px;

  @media (max-width: 800px) {
    flex-direction: column;
    button, a {
      width: 100%;
    }
  }
`
const Action = styled(Button)`
  width: 300px;
`

const LatestSetsLabel = styled.h3`
  font-size: 1.2rem;
  color: var(--color-gray);
  margin-top: 18px;
  margin-bottom: 10px;
`

export default function Learn() {
  const { data: session } = useSession()

  return (
    <Wrapper>
      <PageTitle title="Learn" />
      <Navbar name={session.fname}/>
      <Content>
        <Pathway/>
      </Content>
      <Footer />
    </Wrapper>
  )
}

export { getServerSideProps } from "@/server/protected"
