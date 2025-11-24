import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Navigation from "../components/Navigation";
import axios from "axios";

const CarouselFilm = () => {
  const [films, setFilms] = useState([]);
  const [activeFilm, setActiveFilm] = useState(null);

  useEffect(() => {
    axios.get("/db-cinema.json").then((response) => {
      setFilms(response.data.films);
    });
  }, []);

  const ExpandedFilm = ({ film, onClose }) => {
    return ReactDOM.createPortal(
      <div className="film-modal-backdrop">
        <div className="each-film-expanded" onClick={onClose}>
          <div className="expanded-media">
            <img
              className="image-film-expanded"
              src={film.image}
              alt={film.title}
            />
          </div>

          <div className="overlay-film-expanded">
            <h3>{film.title}</h3>

            <p>
              Sorti en <strong>{film.annee}</strong> — Réalisé par{" "}
              <strong>{film.realisateur}</strong>
            </p>

            {film.description && (
              <p className="description">{film.description}</p>
            )}
          </div>
        </div>
      </div>,
      document.getElementById("film-modal")
    );
  };

  return (
    <div className="carousel-film">
      <Navigation />

      <div className="inner-carousel-film">
        <div className="box-carousel-films">
          {films.map((film) => (
            <div
              key={film.id}
              className="each-film"
              onClick={() => setActiveFilm(film)}
            >
              <img className="image-film" src={film.image} alt={film.title} />
              <div className="overlay-film">
                <h3>{film.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeFilm && (
        <ExpandedFilm film={activeFilm} onClose={() => setActiveFilm(null)} />
      )}
    </div>
  );
};

export default CarouselFilm;
