/*
* Button component
* Props:
* - secondary: boolean, whether the button is of secondary style
* - href: optional; if specified, the component will return a <Link /> instead of a <button />
* Other props are passed down
*/

import styled from "styled-components"
import Link from "next/link"

const common = `
  text-align: center;
  padding: 8px 12px;
  border: none;
  background-color: var(--color-purple);
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  box-shadow: 4px 4px 0px 1px rgba(135, 70, 255, 0.4);
  opacity: 0.8;
  transition: opacity 200ms, box-shadow 200ms;

  :hover {
    opacity: 1;
  }
  :active {
    box-shadow: 2px 2px 0px 1px rgba(135, 70, 255, 0.4);
  }
  :disabled {
    opacity: 0.8;
    cursor: no-drop;
  }
`;
const sec = `
  background-color: initial;
  color: var(--color-dark);
  border: 2px solid rgba(0, 66, 66, 0.8);
  box-shadow: 4px 4px 0px 1px rgba(0, 66, 66, 0.6);
  :active {
    box-shadow: 2px 2px 0px 1px rgba(0, 66, 66, 0.6);
  }
`

// note: the line height is set for non-secondary (primary) buttons because if they're side-by-side it will mess the primary button's vertical alignment up
const Btn = styled.button`
  ${common}
  ${({ secondary }) => secondary ? sec : "line-height: 30px;"}
`
const Lnk = styled(({ secondary, ...rest }) => <Link {...rest} />)`
  text-decoration: none;
  ${common}
  ${({ secondary }) => secondary ? sec : "line-height: 30px;"}
`;

export default function Button({ href, children, ...props }) {
  if (href) return <Lnk href={href} {...props}>{children}</Lnk>
  return <Btn {...props}>{children}</Btn>
}
