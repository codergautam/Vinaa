import styled from "styled-components"

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
export default function LogoText(props) {
  return (
          <Link href="/">
              <h1 className="upper" style={{fontSize: props.size??""}}>Vinaa</h1>
          </Link>
  );
}