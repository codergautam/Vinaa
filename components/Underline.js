// a special underline effect component
import styled from "styled-components"

export default styled.span`
  background-image: linear-gradient(to right, ${({ color }) => color || "rgba(253, 171, 250, 0.7)"}, ${({ color }) => color || "rgba(253, 171, 250, 0.7)"});
  background-position: 0% 90%;
  background-repeat: no-repeat;
  background-size: 75% 10px;
  ${({ styles }) => styles || ""}
`
