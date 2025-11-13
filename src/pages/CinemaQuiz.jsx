import React, { useEffect, useState, useRef } from "react";
import { RotateCcw } from "lucide-react"; // une flèche circulaire stylée
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
  const [usedFilms, setUsedFilms] = useState([]); // 🆕 Liste des films déjà utilisés

  const timerRef = useRef(null);

  // Chargement du JSON
  useEffect(() => {
    axios
      .get("/db-cinema.json")
      .then((response) => {
        const filmsData = response.data.films;
        if (Array.isArray(filmsData) && filmsData.length > 0) {
          setFilms(filmsData);
          initQuiz(filmsData, []);
        } else {
          console.error("Le fichier JSON ne contient pas de tableau 'films'.");
        }
      })
      .catch((error) => console.error("Erreur lors du chargement :", error));
  }, []);

  // Démarre un nouveau tour
  const initQuiz = (filmsList, usedList) => {
    if (!filmsList || filmsList.length === 0) return;

    // Liste filtrée des films encore disponibles
    const availableFilms = filmsList.filter(
      (film) => !usedList.some((u) => u.id === film.id)
    );

    // Si tous les films ont été utilisés → fin du jeu
    if (availableFilms.length === 0) {
      handleGameOver("🎉 Bravo ! Vous avez trouvé tous les films !");
      return;
    }

    // Choisir un film au hasard parmi ceux non encore utilisés
    const randomFilm =
      availableFilms[Math.floor(Math.random() * availableFilms.length)];

    setCurrentFilm(randomFilm);
    setUsedFilms([...usedList, randomFilm]); // 🆕 on l’ajoute à la liste utilisée
    setOptions(generateOptions(randomFilm, filmsList)); // 4 propositions
    setTimeLeft(10);
    startTimer();
  };

  // Génère 4 options avec toujours la bonne réponse incluse
  const generateOptions = (currentFilm, filmsList) => {
    const shuffled = [...filmsList].sort(() => 0.5 - Math.random());
    const options = shuffled.slice(0, 4); // 🆕 4 propositions

    // On s’assure que le film actuel soit inclus
    if (!options.some((f) => f.id === currentFilm.id)) {
      options[Math.floor(Math.random() * 4)] = currentFilm;
    }

    return options.sort(() => 0.5 - Math.random());
  };

  // Chronomètre
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

  // Vérifie la réponse de l'utilisateur
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

  // Fin de partie
  const handleGameOver = (text) => {
    setIsGameOver(true);
    setMessage(text);
    clearInterval(timerRef.current);
  };

  // Redémarrage du quiz
  const handleRestart = () => {
    setIsGameOver(false);
    setScore(0);
    setMessage("");
    setUsedFilms([]);
    initQuiz(films, []);
  };

  // Écran de chargement
  if (!currentFilm) {
    return (
      <div className="cinema-quiz">
        <Navigation />
        <div className="container-cinema-quiz">
          <h1>Chargement du quiz...</h1>
        </div>
      </div>
    );
  }

  // Affichage du quiz
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
