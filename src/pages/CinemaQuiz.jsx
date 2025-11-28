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
  const [isStarted, setIsStarted] = useState(false);

  // Paliers / banner
  const [tierMessage, setTierMessage] = useState("");
  const tierTimeoutRef = useRef(null);

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

  // Nettoyage timer et tierTimeout au unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(tierTimeoutRef.current);
    };
  }, []);

  // Utils : points selon nombre de films trouvés
  const getPointsForCount = (count) => {
    if (count <= 30) return 1;
    if (count <= 60) return 2;
    if (count <= 90) return 3;
    return 4;
  };

  // Retourne label du palier
  const getTierLabel = (count) => {
    if (count <= 30) return "Palier 1 (1 point par film) — 0–30";
    if (count <= 60) return "Palier 2 (2 points par film) — 31–60";
    if (count <= 90) return "Palier 3 (3 points par film) — 61–90";
    return "Palier 4 (4 points par film) — 91+";
  };

  const showTierBanner = (text) => {
    clearTimeout(tierTimeoutRef.current);
    setTierMessage(text);
    // duration 3s, puis fade out
    tierTimeoutRef.current = setTimeout(() => setTierMessage(""), 3000);
  };

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
    setOptions(generateOptions(randomFilm, filmsList));
    setTimeLeft(10);
    startTimer();
  };

  // Génère 4 propositions
  const generateOptions = (currentFilm, filmsList) => {
    const shuffled = [...filmsList].sort(() => 0.5 - Math.random());
    const opts = shuffled.slice(0, 4);

    if (!opts.some((f) => f.id === currentFilm.id)) {
      opts[Math.floor(Math.random() * 4)] = currentFilm;
    }

    return opts.sort(() => 0.5 - Math.random());
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

    if (!currentFilm) return;

    if (title === currentFilm.title) {
      // compute new used films count and points
      const prevCount = usedFilms.length;
      const newUsed = [...usedFilms, currentFilm];
      const newCount = newUsed.length;

      const pointsBefore = getPointsForCount(prevCount);
      const pointsNow = getPointsForCount(newCount);

      // points awarded are based on the NEW count (per spec B)
      const pointsAwarded = pointsNow;

      setScore((prev) => prev + pointsAwarded);

      // detect tier change
      if (pointsBefore !== pointsNow) {
        const label = getTierLabel(newCount);
        showTierBanner(
          `⭐ Nouveau palier atteint ! ${label} — Chaque film vaut désormais ${pointsNow} points.`
        );
      }

      setMessage(
        `✅ Bonne réponse ! +${pointsAwarded} point${
          pointsAwarded > 1 ? "s" : ""
        }`
      );

      // update usedFilms and continue after short delay
      setUsedFilms(newUsed);

      setTimeout(() => {
        setMessage("");
        // lance nouveau tour en passant la liste mise à jour
        initQuiz(films, newUsed);
      }, 900);
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
    setCurrentFilm(null);
    setOptions([]);
    setTimeLeft(10);
    setTierMessage("");
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
              <br /> Plus vous trouvez de films, plus votre score final sera
              élevé, <br /> chaque film vaut 1 point de 1 à 30 films, puis 2
              points de 31 à 60 films (le jeu fonctionne par palier de 30 films){" "}
              et ainsi de suite
              <br /> Êtes-vous prêt à tester vos connaissances cinéma ?
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
        {/* TIER BANNER (style cinéma sombre) */}
        <div className={`tier-banner ${tierMessage ? "show" : ""}`}>
          <div className="tier-content">
            <strong>🎬 Nouveau palier</strong>
            <span className="tier-text">{tierMessage}</span>
          </div>
        </div>

        {/* Info en haut : films trouvés / palier / points par film */}
        <div className="tier-info">
          <div>
            Films trouvés : <strong>{usedFilms.length}</strong>
          </div>
          <div>
            Palier actuel : <strong>{getTierLabel(usedFilms.length)}</strong>
          </div>
          <div>
            Points par film :{" "}
            <strong>{getPointsForCount(usedFilms.length)}</strong>
          </div>
        </div>

        <h1>
          Trouver le film correspondant à l'image en moins de 10 secondes ⏱️
        </h1>

        <div className="box-quiz">
          <p className="score">Score : {score}</p>
          <p className={`timer ${timeLeft <= 3 ? "urgent" : ""}`}>
            Temps restant : {timeLeft}s
          </p>

          <div className="quiz-image">
            {currentFilm ? (
              <img src={currentFilm.image} alt={currentFilm.title} />
            ) : (
              <div className="placeholder">Chargement...</div>
            )}
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
            <div className="end-block">
              <p className="final-score">🎯 Résultat final</p>
              <p>
                Films trouvés : <strong>{usedFilms.length}</strong>
              </p>
              <p>
                Score total : <strong>{score}</strong>
              </p>

              <button className="restart-button" onClick={handleRestart}>
                <RotateCcw color="white" size={20} />
                <span>Rejouer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CinemaQuiz;
