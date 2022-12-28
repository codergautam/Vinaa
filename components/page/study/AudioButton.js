import { useState, useEffect } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import Button from "@/components/Button"


function amplifyMedia(mediaElem, multiplier) {

}

export default function AudioButton({ src, ...props }) {
  const [playing, setPlaying] = useState(false)
  const [audio, setAudio] = useState(null)


  // Increase volume 200% need to use gainNode

  useEffect(() => {
    if(!src) return
    // get relative link audio.src
    let relativeLink = audio?.src?.replace(window.location.origin, "")
    if(src == relativeLink) return
    setAudio(new Audio(src))
  }, [src])

  useEffect(() => {
    if(!audio) return
    audio.addEventListener("ended", () => {
      setPlaying(false)
    })
    audio.currentTime = 0;
    setTimeout(() => {
    play()
    }, 200)
  }, [audio])

  function play() {
    if(playing) {
      audio.pause()
    }
    audio.currentTime = 0;
    audio.play()
  }

  return (
    <Button
      {...props}
      onClick={() => {
        play()
      }}
    >
      {playing ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L18 12L6 20V4Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 5V19L19 12L8 5Z"
            fill="currentColor"
          />
        </svg>
      )}
    </Button>
  )
}

