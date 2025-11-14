import React, { useEffect, useState, useRef } from "react";
import { RotateCcw } from "lucide-react";
import Navigation from "../components/Navigation";
import axios from "axios";

const CinemaQuiz = () => {
  const [films, setFilms] = useState([]);
  const [currentFilm, setCurrentFilm] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [usedFilms, setUsedFilms] = useState([]);
  const [isStarted, setIsStarted] = useState(false); // 🆕 Nouvel état

  const timerRef = useRef(null);

  // Chargement du JSON (sans démarrer le quiz)
  useEffect(() => {
    axios
      .get("/db-cinema.json")
      .then((response) => {
        const filmsData = response.data.films;
        if (Array.isArray(filmsData) && filmsData.length > 0) {
          setFilms(filmsData);
        } else {
          console.error("Le fichier JSON ne contient pas de tableau 'films'.");
        }
      })
      .catch((error) => console.error("Erreur lors du chargement :", error));
  }, []);

  // Lance un nouveau tour
  const initQuiz = (filmsList, usedList) => {
    if (!filmsList || filmsList.length === 0) return;

    const availableFilms = filmsList.filter(
      (film) => !usedList.some((u) => u.id === film.id)
    );

    if (availableFilms.length === 0) {
      handleGameOver("🎉 Bravo ! Vous avez trouvé tous les films !");
      return;
    }

    const randomFilm =
      availableFilms[Math.floor(Math.random() * availableFilms.length)];

    setCurrentFilm(randomFilm);
    setUsedFilms([...usedList, randomFilm]);
    setOptions(generateOptions(randomFilm, filmsList));
    setTimeLeft(10);
    startTimer();
  };

  // Génère 4 propositions
  const generateOptions = (currentFilm, filmsList) => {
    const shuffled = [...filmsList].sort(() => 0.5 - Math.random());
    const options = shuffled.slice(0, 4);

    if (!options.some((f) => f.id === currentFilm.id)) {
      options[Math.floor(Math.random() * 4)] = currentFilm;
    }

    return options.sort(() => 0.5 - Math.random());
  };

  // Timer
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleGameOver("⏰ Temps écoulé ! Vous avez perdu.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Vérifie la réponse
  const handleAnswer = (title) => {
    if (isGameOver) return;
    clearInterval(timerRef.current);

    if (title === currentFilm.title) {
      setScore((prev) => prev + 1);
      setMessage("✅ Bonne réponse !");
      setTimeout(() => {
        setMessage("");
        initQuiz(films, [...usedFilms, currentFilm]);
      }, 1000);
    } else {
      handleGameOver(`❌ Mauvaise réponse. C'était "${currentFilm.title}".`);
    }
  };

  const handleGameOver = (text) => {
    setIsGameOver(true);
    setMessage(text);
    clearInterval(timerRef.current);
  };

  const handleRestart = () => {
    setIsGameOver(false);
    setScore(0);
    setMessage("");
    setUsedFilms([]);
    setIsStarted(false); // Retour à l'écran Start
  };

  // 🆕 Écran de démarrage
  if (!isStarted) {
    return (
      <div className="cinema-quiz">
        <Navigation />
        <div className="container-cinema-quiz">
          <div className="start-screen">
            <h1>🎬 Cinema Quiz</h1>
            <p>
              Trouver le film correspondant à l'image en moins de 10 secondes.{" "}
              <br />
              Êtes-vous prêt à tester vos connaissances cinéma ?
            </p>

            <button
              className="start-button"
              onClick={() => {
                setIsStarted(true);
                initQuiz(films, []);
              }}
            >
              Démarrer le jeu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pendant le jeu
  return (
    <div className="cinema-quiz">
      <Navigation />
      <div className="container-cinema-quiz">
        <h1>
          Trouver le film correspondant à l'image en moins de 10 secondes ⏱️
        </h1>

        <div className="box-quiz">
          <p className="score">Score : {score}</p>
          <p className={`timer ${timeLeft <= 3 ? "urgent" : ""}`}>
            Temps restant : {timeLeft}s
          </p>

          <div className="quiz-image">
            <img src={currentFilm.image} alt={currentFilm.title} />
          </div>

          <div className="quiz-options">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.title)}
                className="quiz-button"
                disabled={isGameOver}
              >
                {option.title}
              </button>
            ))}
          </div>

          {message && (
            <p
              className={`quiz-message ${
                message.includes("Bonne") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          {isGameOver && (
            <button className="restart-button" onClick={handleRestart}>
              <RotateCcw color="white" size={20} />
              <span>Rejouer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CinemaQuiz;
