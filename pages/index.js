import styled from "styled-components"
import Link from "next/link"
import Lottie from "lottie-react"
import { signIn } from "next-auth/react"

import PageTitle from "@/components/PageTitle"
import Button from "@/components/Button"
import Underline from "@/components/Underline"
import Sets from "@/components/Sets"
import Footer from "@/components/Footer"

import desktopBackground from "@/assets/backgrounds/vina-bg-desktop.svg"
import mobileBackground from "@/assets/backgrounds/vina-bg-mobile.svg"
import loloWave from "@/assets/animations/lolo-wave.json"

import { unstable_getServerSession as getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"

// redirect to the dashboard page if the user is logged in
export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions)
  if(session) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    }
  }
  return {
    props: { session }
  }
}

// wraps around the whole page for the background
const Wrapper = styled.div`
  min-height: 100vh;
  background-size: 100%;
  background-position: center center;
  background-image: url(${desktopBackground.src});

  @media (max-width: 800px) {
    background-image: url(${mobileBackground.src});
  }
`

// top section
const Hero = styled.div`
  height: calc(300px + 20vw);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(30px, 40px, 70px);
`
const FrontMessage = styled.div`
  min-width: 40%;
  max-width: 75%;
`
const Title = styled.h1`
  font-size: clamp(3rem, 9vw, 5rem);
  max-width: 30vw;
  margin: 0;
  color: var(--color-dark);
`
const Description = styled.p`
  font-size: 1.5rem;
  line-height: 100%;
  color: var(--color-gray);
`
const ActionGroup = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 15px;
`
const Animation = styled(Lottie)`
  height: 300px;

  @media(max-width: 800px) {
    display: none;
  }
`
const animationInteractivity = {
  mode: "cursor",
  actions: [
    {
      position: { x: [0, 1], y: [0, 1] },
      type: "seek",
      frames: [0, 180]
    }
  ]
}

// latest section
const LatestSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const LatestSection = styled.div`
  background-color: #ffd4fe;
  border-radius: 30px;
  width: 75%;
  padding: 40px 150px;
  color: var(--color-gray);

  @media (max-width: 1270px) {
    width: 85%;
    padding: 30px;
  }
  @media (max-width: 800px) {
    width: 95%;
    padding: 30px;
  }
`
const LatestTitle = styled.h2`
  font-size: 2rem;
  color: var(--color-dark);
  margin-bottom: 10px;
`
const MoreSets = styled(Link)`
  text-decoration: none;
  font-size: 1.1rem;
  color: var(--color-dark);
`

const Filler = styled.div`
  height: 100px;
`


function HomePage() {
  const signin = () => signIn("google", { callbackUrl: "/dashboard" });
  return (
    <Wrapper>
      <PageTitle title="Home" />
      <Hero>
        <Animation
          animationData={loloWave}
          interactivity={animationInteractivity}
        />
        <FrontMessage>
          <Title><Underline>Vina</Underline></Title>
          <Description>
            Create, share, and practice quizzes!
          </Description>
          <ActionGroup>
            <Button onClick={signin}>Get started</Button>
            <Button secondary onClick={signin}>Log in</Button>
          </ActionGroup>
        </FrontMessage>
      </Hero>
      <LatestSectionWrapper>
        <LatestSection>
          <LatestTitle><Underline>Latest sets</Underline></LatestTitle>
          <p></p>
          <Sets />
          <p style={{ marginTop: 20 }}>
            <MoreSets href="/sets/all">
              <Underline
                styles={
                  `transition: background-size 300ms;
                  :hover {
                    background-size: 100% 10px;
                  }`
                }
              >
                Find more &rarr;
              </Underline>
            </MoreSets>
          </p>
        </LatestSection>
      </LatestSectionWrapper>
      <Filler />
      <Footer />
    </Wrapper>
  );
}

export default HomePage
