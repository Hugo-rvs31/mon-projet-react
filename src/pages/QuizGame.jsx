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

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/questions")
      .then((res) => {
        setQuestions(shuffleArray(res.data));
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de récupérer les questions.");
        setLoading(false);
      });
  }, []);

  // 🔥 Navigation toujours affichée ici :
  return (
    <div className="quiz-container">
      <Navigation />

      {/* --- ÉTAT : chargement --- */}
      {loading && <p>Chargement des questions...</p>}

      {/* --- ÉTAT : erreur --- */}
      {error && <p>{error}</p>}

      {/* --- ÉTAT : accueil --- */}
      {!loading && !error && !gameStarted && (
        <div className="quiz-intro">
          <h1 className="h1-intro">Quiz Game</h1>
          <button className="button-intro" onClick={() => setGameStarted(true)}>
            Commencer le jeu
          </button>
        </div>
      )}

      {/* --- ÉTAT : jeu terminé --- */}
      {gameStarted && gameFinished && (
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

      {/* --- ÉTAT : jeu en cours --- */}
      {gameStarted && !gameFinished && !loading && questions.length > 0 && (
        <QuizContent
          questions={questions}
          currentIndex={currentIndex}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          showNextButton={showNextButton}
          setSelectedAnswer={setSelectedAnswer}
          setIsCorrect={setIsCorrect}
          setShowNextButton={setShowNextButton}
          setCurrentIndex={setCurrentIndex}
          setGameFinished={setGameFinished}
          score={score}
          setScore={setScore}
        />
      )}
    </div>
  );
};

// (Ton composant interne QuizContent peut rester tel que tu l'avais)

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
