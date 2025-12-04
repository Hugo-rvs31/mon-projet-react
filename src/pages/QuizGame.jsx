import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import axios from "axios";

// Component refondu à partir du SCSS fourni
export default function QuizGame() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  0;

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/questions")
      .then((res) => {
        setQuestions(shuffle(res.data));
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de récupérer les questions.");
        setLoading(false);
      });
  }, []);

  const currentQuestion = questions[currentIndex];

  // handle user selection
  const handleSelect = (answer) => {
    if (selected) return;
    setSelected(answer);
    const isCorrect = answer === currentQuestion.answer;
    setFeedback(
      isCorrect
        ? "Bonne réponse !"
        : `Mauvaise réponse... La bonne réponse était : ${currentQuestion.answer}`
    );
    if (answer === currentQuestion.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setFeedback(null);
    }
  };

  return (
    <div className="quiz-container">
      <Navigation />

      {loading && <p>Chargement des questions...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && !started && !finished && (
        <div className="quiz-intro">
          <h1 className="h1-intro">Quiz Game</h1>
          <button className="button-intro" onClick={() => setStarted(true)}>
            Commencer le jeu
          </button>
        </div>
      )}

      {started && finished && (
        <div className="quiz-end">
          <h1>Quiz terminé 🎉</h1>
          <p>
            Votre score : {score} / {questions.length}
          </p>
          <button
            className="button-end"
            onClick={() => window.location.reload()}
          >
            Rejouer
          </button>
        </div>
      )}

      {started && !finished && questions.length > 0 && (
        <div className="quiz-start">
          <h3>
            {currentIndex + 1} / {questions.length}
          </h3>
          <h2>{currentQuestion.question}</h2>
          {feedback && (
            <p
              style={{
                fontWeight: "bold",
                color: feedback.includes("Bonne") ? "green" : "red",
                fontSize: "1.2rem",
                transition: "0.3s",
              }}
            >
              {feedback}
            </p>
          )}
          <ul>
            {(currentQuestion.choices || []).map((ans, i) => (
              <li
                key={i}
                onClick={() => handleSelect(ans)}
                className={
                  selected === ans
                    ? ans === currentQuestion.answer
                      ? "good-answer"
                      : "bad-answer"
                    : ""
                }
              >
                {ans}
              </li>
            ))}
          </ul>

          {selected && (
            <button className="button-next" onClick={handleNext}>
              Suivant
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/*import React from "react";
import Navigation from "../components/Navigation";

const QuizGame = () => {
  return (
    <div className="quiz-game">
      <Navigation />
      <div className="quiz-container">
        <button className="start-quiz">Commencer le jeu</button>
      </div>
    </div>
  );
};

export default QuizGame;

*/
