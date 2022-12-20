import styled from "styled-components"
import { X } from "react-feather"
import useSWR from "swr"

const Backdrop = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`
const Modal = styled.div`
  position: fixed !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: white;
  max-height: 90vh;
  overflow: auto;
  padding: 40px 50px;
  border-radius: 30px;
  width: 30%;
  @media (max-width: 1200px) {
    width: 80%;
  }
  @media (max-width: 800px) {
    width: 95%;
  }
`
const Close = styled.button`
  position: absolute;
  top: 15px;
  right: 10px;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 200ms;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 1;
  }
`

const Content = styled.div``

const fetcher = async (...args) => {
  const res = await fetch(...args).then(res => res.json())
  if(!res.ok) {
    throw new Error("failed")
  }
  return res
}

export default function Progress({ set, close }) {
  const { data, error, isLoading } = useSWR(`/api/sets/progress?id=${set}`, fetcher)
  
  return (
    <>
      <Backdrop onClick={close} />
      <Modal>
        <Close onClick={close}>
          <X size={20} />
        </Close>
        {(error || isLoading) ? (
          error ? (<p>An error occured</p>) : (<p>Loading...</p>)
        ) : (
          <Content>
            <h2>Attempts</h2>
            <p>{JSON.stringify(data)}</p>
          </Content>
        )}
      </Modal>
    </>
  )
}
