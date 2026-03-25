import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      question: "How do you like to fight?",
      answers: [
        { text: "Tactical and at range", value: { tau: 2, necrons: 1 } },
        { text: "In your face violence", value: { chaos: 1, orks: 2 } },
        { text: "Versatility is key", value: { space_marines: 2 } }
      ]
    },
    {
      question: "What color do you like?",
      answers: [
        { text: "Green", value: { orks: 2, necrons: 1 } },
        { text: "Blue", value: { space_marines: 1, tau: 2 } },
        { text: "Red", value: { chaos: 2 } }
      ]
    }

  ];

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/questions')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);


  const handleAnswer = (value) => {
    setAnswers(prev => [...prev, value]);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {

      submitQuiz([...answers, value]);

    }
  };

  const submitQuiz = async (finalAnswers) => {
    const res = await fetch('http://127.0.0.1:8000/api/quiz-result', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ answers: finalAnswers })
    })
    const data = await res.json();
    setResult(data.result);
    console.log("Sending answers:", finalAnswers);
  }


  const quizQuestion = questions[currentQuestion];
  if (result === null) {
    return (
      <>
        <section id="center">
          <div className='hero'>
            <h2>{quizQuestion.question}</h2>

            {quizQuestion.answers.map((answer, index) => (
              <button className='counter' onClick={() => { handleAnswer(answer) }} key={index}>
                {answer.text}
              </button>
            ))}
          </div>
          <div>
            <p>
              Question {currentQuestion + 1} / {questions.length}
            </p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section id="center">
        <div className="hero">


        </div>
        <div>
          <button className='counter' onClick={() => setResult(null)}>Clear Result</button>

        </div>
      </section>
    </>
  )
}

export default App
