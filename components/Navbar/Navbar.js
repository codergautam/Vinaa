import { signOut } from "next-auth/react"
import { useState } from "react"
import styled from "styled-components"
import LogoText from "./LogoText"

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
  color: var(--color-dark);
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  justify-self: end;  /* aligns the element to the end of the flex container */
  background-color: pink;
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
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  user-select: none;
`

export default function Navbar(props) {
  let [hover, setHover] = useState(false)
  return (
    <div>
      <Nav>
          <LogoText/>
          <UserItem onClick={()=>{setHover(!hover)}}>
            <span >{props.name}</span>

          </UserItem>


      </Nav>
      <DropDownContent style={{display:hover?"inline-block":"none", transform: 'translate(0,-5%)'}} onMouseEnter={()=>{setHover(true)}}>

        <Link onClick={() => {signOut({callbackUrl: '/'})}}>Logout</Link>
      </DropDownContent>

    </div>
  );
}