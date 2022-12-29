import styled from "styled-components"
import Button from "@/components/Button"

const Wrapper = styled.div`
  height: 100%;
  padding: 50px 30%;
  @media (max-width: 1400px) {
    padding: 50px 10%;
  }
  @media (max-width: 800px) {
    padding: 50px 3%;
  }
`
const Content = styled.div`
  padding: 30px 40px;
`
const Title = styled.h2`
  font-size: 2em;
`
const Note = styled.p`
  color: var(--color-gray);
  font-size: 1.1rem;
  margin-bottom: 20px;
`
const Percent = styled.span`
  color: var(--color-purple);
`

const Wrongs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`
const Wrong = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid var(--color-light-gray);
  padding: 15px 25px;
`
const Asked = styled.p`
  color: var(--color-dark);
  font-size: 1.1rem;
  font-weight: bold;
`
const AnswerWrapper = styled.div`
  display: flex;
  color: var(--color-gray);
`
const Correct = styled.div`
  width: 100%;
  b {
    color: var(--color-green);
    font-sizE: 1.05rem;
  }
`
const YouSaid = styled.div`
  width: 100%;
  b {
    color: var(--color-red);
    font-size: 1.05rem;
  }
`

export default function Results({ questions, results }) {
  const { wrong, correct } = res(questions, results)
  let resource = (questions && questions[0]?.question) ? false : true;
  const accuracy = Math.round((correct / questions?.length) * 100)

  return (
    <Wrapper>
      <Content>
        <Title>All done!</Title>

        {!resource ? (
        <Note>You scored <Percent>{accuracy}%</Percent> on your last attempt.</Note>
        ) : null}
        {wrong.length ? (
          <Wrongs>
            {wrong.map(({ question, chose, correct }, id) => (
              <Wrong key={id}>
                <Asked>{question}</Asked>
                <AnswerWrapper>
                  <YouSaid>
                    <b>You said:</b> {chose}
                  </YouSaid>
                  <Correct>
                    <b>Correct:</b> {correct}
                  </Correct>
                </AnswerWrapper>
              </Wrong>
            ))}
          </Wrongs>
        ) : <p>Great job!</p>}
        <Button onClick={() => window.location.reload()}>

          {resource ? "Review Again" : "Try again"}
        </Button>
      </Content>
    </Wrapper>
  )
}

function res(questions, results) {
  const messedUp = []
  let correct = 0



  if(questions && questions[0]?.question) {
  for(let i = 0; i < questions.length; i++) {
    const question = questions[i]
    let correctIndex
    for(let j = 0; j < question.answers.length; j++) {
      if(question.answers[j].correct) {
        correctIndex = j
        break
      }
    }

    if(results[i] === correctIndex) {
      correct++
      continue
    }

    messedUp.push({
      question: (question.prompt??"")+question.question,
      chose: question.answers[results[i]].label,
      correct: question.answers[correctIndex].label
    })
  }
}

  return { wrong: messedUp, correct }
}
