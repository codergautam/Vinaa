// contains global styles for this site
import { createGlobalStyle } from "styled-components"

export default createGlobalStyle`
:root {
  --color-green: #00ddb3;
  --color-purple: #8746ff;
  --color-pink: #fdabfa;
  --color-gold: #fedd7e;
  --color-red: #f55742;
  --color-dark: #004242;
  --color-gray: #636363;
  --color-light-gray: #cccccc;
}

html {
  font-family: 'Open Sans', sans-serif;
}

h1,
h2,
h3,
h4 {
  text-transform: uppercase;
}

/* 
* The following is a CSS reset to make the page easier to work with
* This makes it a lot easier to add new features and styles
*/
*,
*::before,
*::after {
  box-sizing: border-box;
}
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
  text-decoration-skip-ink: auto;
}
html:focus-within {
  scroll-behavior: smooth;
}
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}
img,
picture {
  max-width: 100%;
  display: block;
}
input,
button,
textarea,
select {
  font: inherit;
}
`
