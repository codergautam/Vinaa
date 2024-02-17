import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import styled from "styled-components"
import toast from "react-hot-toast"

import Header from "@/components/page/study/Header"
import Button from "@/components/Button"
import QRCode from "react-qr-code";

import { motion, AnimatePresence } from "framer-motion";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;

`;

const Content = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  @media (max-width: 600px) {
    height: 100%;
  }
`;

const Card = styled(motion.div)`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  color: #333;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  height: 100%;
`;

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const Loading = styled.h2`
  font-size: 1.5rem;
  color: var(--color-gray);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function useAnimatedScore(targetScore) {
  const [displayScore, setDisplayScore] = useState(targetScore);

  useEffect(() => {
    const startScore = displayScore;
    const endScore = targetScore;
    const duration = 1000; // Duration of the animation in milliseconds
    const frameDuration = 1000 / 60; // 60 frames per second
    const totalFrames = Math.round(duration / frameDuration);
    let currentFrame = 0;

    const counter = setInterval(() => {
      const progress = currentFrame / totalFrames;
      const updatedScore = startScore + (endScore - startScore) * progress;
      setDisplayScore(Math.round(updatedScore));

      if (++currentFrame > totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [targetScore]);

  return displayScore;
}

const LeaderboardCard = ({ rank, name, score, showRank }) => {
  const animatedScore = useAnimatedScore(score);

  return (
    <Card
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <h3 style={{ fontSize: 30 }}>
        {showRank ? `${rank}. ${name} - ${animatedScore} points` : `${name} - ${animatedScore} points`}
      </h3>
    </Card>
  );
};


const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Set() {
  const router = useRouter()
  const [setId, setSetId] = useState("")
  const [data, setData] = useState(null)
  const code = useRef(0);

  const renderLeaderboard = () => {
    return data.leaderboard.sort((a, b) => b.score - a.score).map((player, index) => (
      <LeaderboardCard key={player.id} rank={index + 1} name={player.name} score={player.score} showRank={data.state !== "waiting"} />
    ));
  };

  useEffect(() => {
    if(window.location.search.includes("setId") && !setId && code.current === 0) {
      // liveMode=setId
      const newSetId = window.location.search.split("=")[1]
      code.current = 1;
      setSetId(newSetId)
      fetch(`/api/game/creategame?setId=${newSetId}`, {
        method: "POST"
      }).then(res => res.json()).then(data => {
        if(!data || !data.code) {
          toast.error("Failed to create game")
        } else {
          // toast.success("Game created")
          code.current = data.code
        }
      });
    }
  }, [setId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if(setId) {
        fetch(`/api/game/getgame?code=${code.current}`, {
          method: "GET"
        }).then(res => res.json()).then(data => {
          if(data) {
            setData(JSON.parse(data.data))
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [setId]);


  return (
    <Wrapper>

      <Content>
      <Header
              title={code.current}
            />
        {data ?(
          <>


            <Card>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

              {data.state === "waiting" ? (
              <>
              <h1>Join by scanning the QR code<br/>Players joined: {data.leaderboard.length}</h1>
              <br/>
              <QRCode value={`https://vinaa.net/sets/${setId}?liveMode=${code.current}`} size={600} />
              <h1 style={{fontSize: 30}}>URL: <a href={`https://vinaa.net/join`}>{`vinaa.net/join`}</a></h1>
              <h1 style={{fontSize: 30}}>Code: {code.current}</h1>
              <Button onClick={() => {
                fetch(`/api/game/startgame?code=${code.current}`, {
                  method: "POST"
                }).then(res => res.json()).then(data => {
                  if(data.error) {
                    toast.error(data.error)
                  } else {
                    toast.success("Game started")
                  }
                });
              }}>Start game</Button>
              </>
              ) : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100%" }}>
  <div style={{ alignSelf: "flex-start", width: "100%" }}>
    <h1 style={{ textAlign: "center", margin: 0 }}>{data.state === "waiting" ? "போட்டியாளர்கள்" : "முன்னணி"}</h1>
  </div>
  <LeaderboardContainer>
    <AnimatePresence>
      {renderLeaderboard()}
    </AnimatePresence>
  </LeaderboardContainer>
</div>

            </Card>

          </>
        ) : (
          <Loading>{"Loading..."}</Loading>
        )}
      </Content>
    </Wrapper>
  )
}
