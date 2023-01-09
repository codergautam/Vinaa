import styled from "styled-components"
import useSWR from "swr"
import { useRouter } from "next/router"
import SetCard from "@/components/SetCard"
import {pathway} from "../../pathway.json"
import Button from "@/components/Button"
import ReactModal from "react-modal"
import { useEffect, useState } from "react"
import useWindowSize from "@/components/useWindowSize"


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
  const size = useWindowSize();
  const [customStyles, setCustomStyles] = useState({});

  useEffect(() => {
    console.log(size.width)
    if(size.width < 600 || size.height < 600) {
      setCustomStyles(
       {
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: "90vw",
            height: "90vh",

          },
        })
    } else {
      setCustomStyles(
        {
           content: {
             top: '50%',
             left: '50%',
             right: 'auto',
             bottom: 'auto',
             marginRight: '-50%',
             transform: 'translate(-50%, -50%)',
             width: "50vw",
             height: "50vh",

           },
         })
    }
  }, [size]);

  if (error) {
    console.error(error);
    return <div>An unknown error occured...</div>
  }
  if (!data) return (
    <p>Loading...</p>
  )
  return (
    <SetGroup>
      <ReactModal style={customStyles} isOpen={skipModal.open}>
        <div style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute"}}>
        <center>

        { (size.width < 400) || (size.height < 400) ? (
          <div>
        <h2>Skip to unit "{skipModal.unit}"?</h2>
        <h5>This will mark the previous content as completed.</h5>
        </div>
        ) : (
          <div>
        <h1>Skip to unit "{skipModal.unit}"?</h1>
        <h4>This will mark the previous content as completed.</h4>
        </div>
        )}
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
          <h1>{pathway[i].name}</h1>
          <p>{pathway[i].description}</p>
          {
                unit[0].locked ?
                <button style={{backgroundColor: "pink", borderRadius: "10px"}} onClick={() => {
                  setSkipModal({open: true, id: unit[0].id, unit: pathway[i].name})
                }}>Skip to here</button>
                : null
      }
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
