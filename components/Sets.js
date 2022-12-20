import styled from "styled-components"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/router"

import Underline from "@/components/Underline"

// use CSS grid to create a 3x2 grid of sets
const SetGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;

  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`
const Set = styled.div`
  cursor: pointer;
  height: 8em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  background-color: rgba(255, 156, 251, 0.2);
`
const SetTitle = styled(Link)`
  text-decoration: none;
  color: var(--color-gray);
  font-size: 1.3rem;
`
const SetInfo = styled.div`
  display: flex;
  justify-content: space-between;
`
const SetCreator = styled(Link)`
  text-decoration: none;
  color: #db7bd8;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 40%;
`
const SetQuestions = styled.span`
  color: #737373;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Sets() {
  const router = useRouter()
  const { data, error } = useSWR("/api/sets/latest", fetcher)
  console.log(data)

  if (error) {
    console.error(error);
    return <div>An unknown error occured...</div>
  }
  if (!data) return (
    <p>Loading...</p>
  )
  return (
    <SetGroup>
      {data.map(set => (
        <Set key={set.id} onClick={e => {
          // if the user is trying to click on the creator of the set
          // don't take them to the actual set
          if(e.target.tagName !== "A")
            router.push("/sets/" + set.id);
        }}>
          <SetTitle href={"/sets/" + set.id}>
            <Underline
              styles={
                `transition: background-size 300ms;
                :hover {
                  background-size: 100% 10px;
                }`
              }
            >{set.name}</Underline>
          </SetTitle>
          <SetInfo>
            <SetCreator href={"/user/" + set.user}>{set.user}</SetCreator>
            <SetQuestions>{set.questions.length} question{set.questions.length - 1 ? "s" : ""}</SetQuestions>
          </SetInfo>
        </Set>
        )
      )}
    </SetGroup>
  );
}
