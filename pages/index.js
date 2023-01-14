import styled from "styled-components"
import Link from "next/link"
import Lottie from "lottie-react"
import { signIn } from "next-auth/react"

import PageTitle from "@/components/PageTitle"
import Button from "@/components/Button"
import Underline from "@/components/Underline"
import Sets from "@/components/Sets"
import Footer from "@/components/Footer"
import { TypeAnimation } from 'react-type-animation';
import { useState } from "react"
import desktopBackground from "@/assets/backgrounds/vina-bg-desktop.svg"
import mobileBackground from "@/assets/backgrounds/vina-bg-mobile.svg"
import indiaAnimation from "@/assets/animations/india.json"

import { unstable_getServerSession as getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"

// redirect to the dashboard page if the user is logged in
export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions)
  if(session) {
    return {
      redirect: {
        permanent: false,
        destination: "/learn"
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
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(30px, 40px, 70px);
`
const FrontMessage = styled.div`
`
const Title = styled.h1`
  font-size: clamp(3rem, 9vw, 4.7rem);
  max-width: 30vw;
  margin: 0;
  color: var(--color-dark);
  transition: all 0.2s ease-in-out;

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
  loop: false
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
  height: 0px;
`


function HomePage() {
  const signin = () => signIn("google", { callbackUrl: "/learn" });
  const [color, setColor] = useState("#3086EB")
  return (
    <Wrapper>
      <PageTitle title="Home" />
      <Hero>
        <Animation
          animationData={indiaAnimation}
          loop={false}
        />
        <FrontMessage>
          <Title className="upper" style={{color, animation: "fadeIn 1s ease-in-out"}}>
            <TypeAnimation
              cursor={false}
              sequence={[
                "Vinaa",
                300,
                () => setColor("#3086EB"),
                1000,
                () => setColor("black"),
                "வினா",
                300,
                () => setColor("#EF3934"),
                1000,
                () => setColor("black"),
              ]}
              repeat={Infinity}
              speed={5}
              deletionSpeed={5}
              color={color}
            />
          </Title>
          <Description>
            தமிழ் கற்க சிறந்த வழி!
          </Description>
          <ActionGroup>
            <Button onClick={signin}>Get started</Button>
            <Button secondary onClick={signin}>Log in</Button>
          </ActionGroup>
        </FrontMessage>
      </Hero>
      <Filler />
      {/* <Footer />x/ */}
    </Wrapper>
  );
}

export default HomePage
