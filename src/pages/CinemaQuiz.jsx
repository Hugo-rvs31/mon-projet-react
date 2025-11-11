import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import axios from "axios";

const CinemaQuiz = () => {
  const [films, setFilms] = useState([]);
  const [currentFilm, setCurrentFilm] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  // 🔹 Charger les films avec Axios depuis /public/data/films.json
  useEffect(() => {
    axios
      .get("/db-cinema.json")
      .then((response) => {
        const filmsData = response.data.films;
        setFilms(filmsData);
        initQuiz(filmsData);
      })
      .catch((error) => console.error("Erreur lors du chargement :", error));
  }, []);

  // 🔹 Initialise un tour de quiz
  const initQuiz = (filmsList) => {
    const randomFilm = filmsList[Math.floor(Math.random() * filmsList.length)];
    setCurrentFilm(randomFilm);
    setOptions(generateOptions(randomFilm, filmsList));
  };

  // 🔹 Génère 4 options (dont la bonne)
  const generateOptions = (currentFilm, filmsList) => {
    const shuffled = [...filmsList].sort(() => 0.5 - Math.random());
    const options = shuffled.slice(0, 4);

    if (!options.some((f) => f.id === currentFilm.id)) {
      options[Math.floor(Math.random() * 3)] = currentFilm;
    }

    return options.sort(() => 0.5 - Math.random());
  };

  // 🔹 Quand l'utilisateur choisit une réponse
  const handleAnswer = (title) => {
    if (title === currentFilm.title) {
      setScore(score + 1);
      setMessage("✅ Bonne réponse !");
    } else {
      setMessage(`❌ Mauvaise réponse. C'était "${currentFilm.title}"`);
    }

    setTimeout(() => {
      initQuiz(films);
      setMessage("");
    }, 1500);
  };

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

  return (
    <div className="cinema-quiz">
      <Navigation />

      <div className="container-cinema-quiz">
        <h1>
          Trouver le film correspondant à l'image parmi les 4 propositions de
          réponse
        </h1>

        <div className="box-quiz">
          <p className="score">Score : {score}</p>

          <div className="quiz-image">
            <img src={currentFilm.image} alt="film" />
          </div>

          <div className="quiz-options">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.title)}
                className="quiz-button"
              >
                {option.title}
              </button>
            ))}
          </div>

          {message && <p className="quiz-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CinemaQuiz;
