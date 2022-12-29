import styled from "styled-components"
import useSWR from "swr"
import { useRouter } from "next/router"
import SetCard from "@/components/SetCard"
import {pathway} from "../../pathway.json"


// use CSS grid to create a 3x2 grid of sets
const SetGroup = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  margin: 0 auto;
  max-width: 500px;

    display: flex;
    flex-direction: column;
`

const UnitCard = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  text-align: center;

`
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Sets() {
  const router = useRouter()
  const { data, error } = useSWR("/api/sets/pathway", fetcher)

  if (error) {
    console.error(error);
    return <div>An unknown error occured...</div>
  }
  if (!data) return (
    <p>Loading...</p>
  )
  return (
    <SetGroup>
    {
      data.map((unit,i) => {

        return (
          <div>
            <UnitCard>
          <h1>{pathway[i].name}</h1>
          <p>{pathway[i].description}</p>
          </UnitCard>
          {
            unit.map(set => {
              return (
                <SetCard set={set} key={set.id} />
              )
            })
          }
          </div>
        )

      })
    }
    </SetGroup>
  );
}
