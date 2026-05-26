import { useState, useEffect } from 'react'
import './App.css'

const factionThemes = {
  space_marines: {
    '--accent': '#378ADD',
    '--accent-bg': 'rgba(55, 138, 221, 0.08)',
    '--accent-border': 'rgba(55, 138, 221, 0.4)',
    '--page-bg': '#E6F1FB',
    '--text-h': '#01070d',
  },
  tau: {
    '--accent': '#639922',
    '--accent-bg': 'rgba(99, 153, 34, 0.08)',
    '--accent-border': 'rgba(99, 153, 34, 0.4)',
    '--page-bg': '#EAF3DE',
    '--text-h': '#060c02',
  },
  chaos: {
    '--accent': '#d81818',
    '--accent-bg': 'rgba(154, 49, 49, 0.55)',
    '--accent-border': 'rgba(131, 42, 42, 0.4)',
    '--page-bg': '#FCEBEB',
    '--text-h': '#0b0303',
  },
  orks: {
    '--accent': '#639922',
    '--accent-bg': 'rgba(99, 153, 34, 0.1)',
    '--accent-border': 'rgba(99, 153, 34, 0.4)',
    '--page-bg': '#EAF3DE',
    '--text-h': '#173404',
  },
  necrons: {
    '--accent': '#83918c',
    '--accent-bg': 'rgba(29, 158, 117, 0.08)',
    '--accent-border': 'rgba(48, 117, 95, 0.4)',
    '--page-bg': '#E1F5EE',
    '--text-h': '#021714',
  },
  eldar: {
    '--accent': '#D4537E',
    '--accent-bg': 'rgba(212, 83, 126, 0.08)',
    '--accent-border': 'rgba(212, 83, 126, 0.4)',
    '--page-bg': '#FBEAF0',
    '--text-h': '#4B1528',
  },
}


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
      { text: "Humans", value: { space_marines: 3, chaos: 2 } },
      { text: "Elves", value: { eldar: 3 } },
      { text: "Orcs", value: { orks: 3 } },
      { text: "Skeletons", value: { necrons: 3 } }
    ]
  }

];

const factionData = {
  space_marines: {
    name: "Space Marines", tagline: "For the Emperor! For the Imperium of Man!"
  },
  tau: {
    name: "T'au", tagline: "For the Greater Good"
  },
  chaos: {
    name: "The Forces of Chaos", tagline: "For the Chaos Gods!"
  },
  orks: {
    name: "Orks", tagline: "WAAAAAAAAAAAAGGGH!!"
  },
  necrons: {
    name: "Necrons", tagline: "01101110 01100101 01100011 01110010 01101111 01101110 00001010"
  },
  eldar: {
    name: "Eldar", tagline: "For eternity"
  }
}


function applyTheme(faction) {
  const theme = factionThemes[faction];
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme).forEach(([prop, val]) => root.style.setProperty(prop, val));
}

function clearTheme() {
  const root = document.documentElement;
  Object.keys(factionThemes.space_marines).forEach(prop => root.style.removeProperty(prop));
  root.style.removeProperty("--page-bg");
}

function App() {
  const [scores, setScores] = useState(null);
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);



  // useEffect(() => {
  //   fetch('http://127.0.0.1:8000/api/questions')
  //     .then(res => res.json())
  //     .then(data => console.log(data));
  //   console.log(result)
  // }, []);


  const handleAnswer = (value) => {
    const newScores = { ...scores };
    Object.entries(value).forEach(([faction, pts]) => {
      newScores[faction] = (newScores[faction] || 0) + pts
    });

    setScores(newScores);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      applyTheme(winner);

      fetch('http://127.0.0.1:8000/api/quiz-result', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: newScores })
      })
        .then(r => r.json())
        .then(data => setResult(data.result ?? winner))
        .catch(() => setResult(winner))
    }
  };

  const clearAll = () => {
    clearTheme();
    setScores([]);
    setResult(null);
    setCurrentQuestion(0);
  }





  const quizQuestion = questions[currentQuestion];

  if (!result) {
    return (
      <>
        <header>
          <h1>Warhammer Quiz</h1>
        </header>
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


  const faction = factionData[result]
  if (result) {
    return (
      <>
        <header>
          <h1>Warhammer Quiz</h1>
        </header>
        <section id='center'>
          <div className='hero'>
            <h1>We recommend:</h1>
            <h2>{faction.name}</h2>
            <p>{faction.tagline}</p>
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
