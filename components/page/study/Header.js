import { useState, useEffect } from "react"
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
  font-size: 1.5em;
  @media screen and (max-width: 480px) {
  font-size: 0.75rem;
}
`

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function Header({ title, id }) {
  const [modal, setModal] = useState(false)
  const size = useWindowSize()

  return (
    <>
      <Bar>
        <Button style={{fontSize: size.width < 400 ? "10px" : "15px"}} secondary href="/learn">&larr; Back</Button>
        <Title>{title}</Title>
        <LogoText size={size.width < 400 ? "20px" : "30px"}/>
      </Bar>
      {modal ? <Progress close={() => setModal(false)} set={id} /> : null}
    </>
  )
}
