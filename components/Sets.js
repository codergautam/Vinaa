import styled from "styled-components"
import useSWR from "swr"
import { useRouter } from "next/router"
import SetCard from "./SetCard"


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
        <SetCard set={set} key={set.id} />
        )
      )}
    </SetGroup>
  );
}
