import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import axios from "axios";

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  // Mélange un tableau
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Récupération des questions
  useEffect(() => {
    axios
      .get("http://localhost:3001/questions")
      .then((res) => {
        const shuffledQuestions = shuffleArray(res.data);
        setQuestions(shuffledQuestions);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de récupérer les questions.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des questions...</p>;
  if (error) return <p>{error}</p>;

  // Si le jeu n’a pas commencé
  if (!gameStarted) {
    return (
      <div className="quiz-container">
        <Navigation />
        <div className="quiz-intro">
          <h1 className="h1-intro">Quiz Game</h1>
          <button className="button-intro" onClick={() => setGameStarted(true)}>
            Commencer le jeu
          </button>
        </div>
      </div>
    );
  }

  // Si le jeu est terminé
  if (gameFinished) {
    return (
      <div className="quiz-container">
        <Navigation />
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
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswerClick = (choice) => {
    setSelectedAnswer(choice);
    const correct = choice === currentQuestion.answer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowNextButton(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowNextButton(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameFinished(true);
    }
  };

  // ✅ Ici, tout est bien enveloppé dans un seul élément parent
  return (
    <>
      <div className="quiz-container">
        <Navigation />
        <div className="quiz-start">
          <h1>
            Question {currentIndex + 1} / {questions.length}
          </h1>
          <h3>{currentQuestion.question}</h3>
          <ul>
            {currentQuestion.choices.map((choice, index) => (
              <li
                key={index}
                onClick={() => !showNextButton && handleAnswerClick(choice)}
                style={{
                  cursor: showNextButton ? "default" : "pointer",
                  backgroundColor:
                    selectedAnswer === choice
                      ? isCorrect
                        ? "#b6e3a1"
                        : "#f8a5a5"
                      : "",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "6px",
                  border: "2px solid #ccc",
                }}
              >
                {choice}
              </li>
            ))}
          </ul>

          {showNextButton && (
            <>
              {isCorrect ? (
                <p>✅ Bonne réponse !</p>
              ) : (
                <p>
                  ❌ Mauvaise réponse... <br />
                  👉 La bonne réponse était :{" "}
                  <strong>{currentQuestion.answer}</strong>
                </p>
              )}
              <button className="button-next" onClick={handleNextQuestion}>
                Question suivante
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizGame;

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
