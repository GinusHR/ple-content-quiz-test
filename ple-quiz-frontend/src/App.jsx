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
        { text: "Tactical and at range", value: { tau: 2, necrons: 2, eldar: 1 } },
        { text: "In your face violence", value: { chaos: 1, orks: 2 } },
        { text: "Versatility is key", value: { space_marines: 2, chaos: 1 } }
      ]
    },
    {
      question: "What color do you like?",
      answers: [
        { text: "Green", value: { orks: 2, necrons: 1 } },
        { text: "Blue", value: { space_marines: 1, tau: 2 } },
        { text: "Red", value: { chaos: 2, eldar: 1 } },
        { text: "Gray", value: { eldar: 2, necrons: 2 } }
      ]
    },
    {
      question: "What is your favorite fantasy species?",
      answers: [
        { text: "Humans", value: { space_marines: 2, chaos: 1 } },
        { text: "Elves", value: { eldar: 2 } },
        { text: "Orcs", value: { orks: 2 } },
        { text: "Skeletons", value: { necrons: 2 } }
      ]
    }

  ];

  const factionData = {
    space_marines: {
      name: "Space Marines"
    },
    tau: {
      name: "T'au"
    },
    chaos: {
      name: "The Forces of Chaos"
    },
    orks: {
      name: "Orks"
    },
    necrons: {
      name: "Necrons"
    },
    eldar: {
      name: "Eldar"
    }
  }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/questions')
      .then(res => res.json())
      .then(data => console.log(data));
    console.log(result)
  }, []);


  const handleAnswer = (value) => {
    setAnswers(prev => [...prev, value]);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {

      submitQuiz([...answers, value]);

    }
  };

  const submitQuiz = async (/** @type {any[]} */ finalAnswers) => {
    const res = await fetch('http://127.0.0.1:8000/api/quiz-result', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers: finalAnswers })
    })
    const data = await res.json();
    setResult(data.result);
    console.log("Sending answers:", finalAnswers);
  }

  const clearAll = () => {
    setAnswers([]);
    setResult(null);
    setCurrentQuestion(0);
  }


  const quizQuestion = questions[currentQuestion];
  if (result === null) {
    return (
      <>
        <section id="center">
          <div className='hero'>
            <h2>{quizQuestion.question}</h2>

            {quizQuestion.answers.map((answer, index) => (
              <button className='counter' onClick={() => { handleAnswer(answer.value) }} key={index}>
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

  if (result) {
    const faction = factionData[result]
    return (
      <>
        <section id='center'>
          <div className='hero'>
            <h1>We recommend:</h1>
            <h2>{faction.name}</h2>
          </div>
          <div>
            <button className='counter' onClick={clearAll}> Clear Result</button>
          </div>

        </section>

      </>
    )
  }
}

export default App
