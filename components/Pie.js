/*
Pie chart implementation
Adapted from https://www.freecodecamp.org/news/css-only-pie-chart/
------------------------
Usage:
<Pie
  percent={80} // required
  thickness={"16px"}
  color={"lightgreen"}
  size={"150px"}
/>

*/

import { useState, useEffect } from "react"
import styled, { keyframes } from "styled-components"

const animation = keyframes`
  from {
    --p: 0;
  }
`

const Chart = styled.div`
  text-align: center;
  
  @property --p {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }

  --p: 80;
  --b: 22px;
  --c: lightgreen;
  --w: 150px;

  width: var(--w);
  aspect-ratio: 1;
  position: relative;
  display: inline-grid;
  margin: 5px;
  place-content: center;
  font-size: 30px;
  font-weight: bold;
  animation: ${animation} 1s 0.5s both;
  
  :before,
  :after {
    content: "";
    position: absolute;
    border-radius: 50%;
  }
  :before {
    inset: 0;
    background: radial-gradient(farthest-side, var(--c) 98%, #0000) top/var(--b)
        var(--b) no-repeat,
      conic-gradient(var(--c) calc(var(--p) * 1%), #0000 0);
    -webkit-mask: radial-gradient(
      farthest-side,
      #0000 calc(99% - var(--b)),
      #000 calc(100% - var(--b))
    );
    mask: radial-gradient(
      farthest-side,
      #0000 calc(99% - var(--b)),
      #000 calc(100% - var(--b))
    );
  }
  :after {
    inset: calc(50% - var(--b) / 2);
    background: var(--c);
    transform: rotate(calc(var(--p) * 3.6deg))
      translateY(calc(50% - var(--w) / 2));
  }
`

const Label = styled.span`
  font-size: 12px;
  font-weight: normal;
`

export default function Pie({
  percent,
  label,
  thickness,
  color,
  size
}) {
  // otherwise nextjs will give a server-client content mismatch
  const [isClient, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  if(!isClient) return null;
  
  return (
    <Chart
      // only temporary for replit's ugness
      style={{
        "--p": percent || "",
        "--b": thickness || "",
        "--c": color || "",
        "--w": size
      }}
    >
      {percent}%
      {(label && (
        <Label>{label}</Label>
      ))}
    </Chart>
  );
}
