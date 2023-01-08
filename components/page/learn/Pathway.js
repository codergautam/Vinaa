import styled from "styled-components"
import useSWR from "swr"
import { useRouter } from "next/router"
import SetCard from "@/components/SetCard"
import {pathway} from "../../pathway.json"
import Button from "@/components/Button"
import ReactModal from "react-modal"
import { useState } from "react"


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
  const { data, error, mutate } = useSWR("/api/sets/pathway", fetcher)
  const [skipModal, setSkipModal] = useState({open: false, id: null, unit: null});

  if (error) {
    console.error(error);
    return <div>An unknown error occured...</div>
  }
  if (!data) return (
    <p>Loading...</p>
  )
  return (
    <SetGroup>
      <ReactModal isOpen={skipModal.open}>
        <div style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}>
        <center>

        <h1>Are you sure you want to skip to {skipModal.unit}?</h1>
        <h4>This will mark the previous content as completed.</h4>
        <br/>
        <Button onClick={() => {
          fetcher("/api/sets/skip", {
            method: "POST",
            body: JSON.stringify({
              id: skipModal.id
            })
          }).then(({changed}) => {
            if(changed.length > 0) {
              mutate();
            }
          }).catch((e) => {
            console.error(e);
          });
          setSkipModal({open: false, id: null})
        }}>Continue</Button>
        &nbsp;
        &nbsp;
        <Button secondary onClick={() => {
          setSkipModal({open: false, id: null})
        }}>Cancel</Button>
        </center>

        </div>

      </ReactModal>
    {
      data.map((unit,i) => {

        return (
          <div>
            <UnitCard>
              {
                unit[0].locked ?
                <Button onClick={() => {
                  setSkipModal({open: true, id: unit[0].id, unit: pathway[i].name})
                }}>Skip to here</Button>
                : null
      }
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
