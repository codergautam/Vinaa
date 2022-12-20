import styled from "styled-components"
import Button from "@/components/Button"

const Bar = styled.header`
  height: 4em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
  background-color: rgba(0, 221, 179, 0.2);
`

const Set = styled.span`
  background-color: transparent;
  text-align: center;
  border: none;
  outline: none;
  font-size: 1.2rem;
  border-bottom: 1px dashed var(--color-dark);
  white-space: nowrap;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.8);
  max-width: 250px;

  :focus {
    color: black;
  }
  :empty:before {
    content: "Set name";
    color: rgba(0, 0, 0, 0.6);
    width: 100px;
    pointer-events: none;
  }

  @media (max-width: 800px) {
    max-width: 90px;
  }
`

export default function Header({ name, setName, publish, children, loading }) {
  return (
    <Bar>
      <Button secondary href="/dashboard">Back &larr;</Button>
      <Set
        onFocus={e => {
          // select the rename on click
          const range = document.createRange();
          range.selectNodeContents(e.target);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }}
        onKeyPress={e => {
          if(e.key === "Enter") {
            e.preventDefault()
            e.target.blur()
          }
        }}
        contentEditable="plaintext-only"
        onBlur={e => setName(e.currentTarget.textContent)}
        suppressContentEditableWarning={true} // react doesn't like a component with contentEditable and managed children
      >
        {name}
      </Set>
      <Button onClick={publish} disabled={loading}>{children}</Button>
    </Bar>
  );
}
