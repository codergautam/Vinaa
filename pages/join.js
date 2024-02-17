import { use, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import styled from "styled-components"
import toast from "react-hot-toast"
import Button from "@/components/Button"

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
`
const Content = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`


export default function Set() {
  const [code, setCode] = useState(null)
  const router = useRouter()

  return (
    <Wrapper>

      <Content>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>

<h1>Welcome to Vinaa live</h1>
<p>Please enter your game code</p>
            <input
              type="text"
              placeholder="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              onClick={() => {
                // conditions
                // code has to be 6 digits
                // code has to be just numbers

                if (code.length !== 6) {
                  toast.error("Code has to be 6 digits")
                  return
                }
                if (isNaN(code)) {
                  toast.error("Code has to be just numbers")
                  return
                }


                const redUrl = `/api/game/joinredirect?code=${code}`
                router.push(redUrl)
              }}
            >
              Start
            </Button>
          </div>
          </Content>
          </Wrapper>
  )
}
