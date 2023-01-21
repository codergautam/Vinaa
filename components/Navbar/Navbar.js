import { signOut } from "next-auth/react"
import { useState } from "react"
import styled from "styled-components"
import LogoText from "./LogoText"
import Modal from 'react-modal';
import Button from '@/components/Button'
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: var(--color-white);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
`

const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-dark);
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: var(--color-primary);
  }
`

// UserDropdown should be at the right of the Navbar
const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  justify-self: end;  /* aligns the element to the end of the flex container */
  background-color: #43C85B;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  user-select: none;

  &:hover {
    transform: scale(1.1);
  }
`
const DropDownContent = styled.div`
  display: none;
  position: relative;
  float: right;
  background-color: var(--color-white);
  min-width: 160px;
  z-index: 1;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  user-select: none;
`
const TileButton = styled.button`
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 0 10px;
  background-color: var(--color-white);
  border-radius: 5px;
  border: 1px solid var(--color-gray);
  color: var(--color-gray);
  transition: all 0.2s ease-in-out;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  width: 250px;
  height: 150px;
`

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
export default function Navbar(props) {
  let [hover, setHover] = useState(false)
  let [createModal, setCreateModal] = useState(false)

  return (
    <div>
       <Modal
        isOpen={createModal}
        onRequestClose={() => {setCreateModal(false)}}
        style={customStyles}
        contentLabel="Quiz type"
      >
  <center>
<h1> Select Quiz type</h1>
    <div style={{display: "flex"}}>
    <br/>
    <br/>
      
    <TileButton onClick={()=>window.location.href="/sets/newsimple"}>
    <h2>Words</h2>
      <p>Simple quiz for Tamil words & Defenition.</p>
    </TileButton>
        <TileButton onClick={()=>window.location.href="/sets/newsimple"}>
    <h2>Advanced</h2>
      <p>Advanced quiz for any question type & custom options.</p>
    </TileButton>
      </div>
    <br/>
    
        <Button onClick={()=>{setCreateModal(false)}}>Cancel</Button>
        </center>
      </Modal>
      <Nav>
          <LogoText/>
        

          <UserItem onClick={()=>{setHover(!hover)}}>
            <span >{props.name}</span>

          </UserItem>



      </Nav>


      <DropDownContent style={{display:hover?"inline-block":"none", textAlign: "center", transform: 'translate(-20px,-10px)'}} onMouseEnter={()=>{setHover(true)}}>


        <Link style={{position: "fixed", borderRadius: "10px", textAlign:"center", boxShadow:" 0px 8px 16px 0px rgba(0, 0, 0, 0.2);", backgroundColor: "white", width: '100%'}} onClick={() => {signOut({callbackUrl: '/'})}}>Logout</Link>
      </DropDownContent>

      {/* {
        props.admin ? (
          <div>
          <a href="/admin/listsets" style={{position: "fixed", borderRadius: "10px", textAlign:"center", boxShadow:" 0px 8px 16px 0px rgba(0, 0, 0, 0.2);", backgroundColor: "white", width: '100%', transform: 'translate(-20px,-10px)'}}>[Admin] View Sets</a>
         <br/>
          <a href="/sets/new" style={{position: "fixed", borderRadius: "10px", textAlign:"center", boxShadow:" 0px 8px 16px 0px rgba(0, 0, 0, 0.2);", backgroundColor: "white", width: '100%', transform: 'translate(-20px,-10px)'}}>[Admin] New set</a>
          <br/>
          <a href="/resources/new" style={{position: "fixed", borderRadius: "10px", textAlign:"center", boxShadow:" 0px 8px 16px 0px rgba(0, 0, 0, 0.2);", backgroundColor: "white", width: '100%', transform: 'translate(-20px,-10px)'}}>[Admin] New resource</a>
          </div>
        ) : null
      } */}

  {
            props.admin ?
            (
              <div>
                <br/><br/>
                <center>
          <UserItem style={{backgroundColor: "#68d7e3", color:"white", paddingLeft: "5px", paddingRight: "5px", width: "50%", minWidth: "100px", maxWidth: "500px", marginBottom: "10px"}} onClick={()=>{setCreateModal(true)}}>
Create a Quiz
</UserItem>
                 <UserItem style={{backgroundColor: "#68d7e3", color:"white", paddingLeft: "5px", paddingRight: "5px", width: "50%", minWidth: "100px", maxWidth: "500px"}}  onClick={()=>{window.location.href="/admin/listsets"}}>
My Quizzes
</UserItem>
                  </center>
                </div>
            ) : null
}
    </div>
  );
    }