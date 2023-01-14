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
  @media (max-width: 800px) {
    flex-direction: column;
    gap: 0;
    font-size: 0.7rem;
  }
`
export default function LogoText(props) {
  return (
          <Link href="/">
              <h1 className="upper" style={{fontSize: props.size??"", color:"rgb(48,134,235)"}}>Vinaa</h1><h1 className="upper" style={{fontSize: props.fontSize2??"", color:"#EF3934"}}>வினா</h1>
          </Link>
  );
}