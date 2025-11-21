import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import axios from "axios";

const CarouselFilm = () => {
  const [films, setFilms] = useState([]);
  const [activeFilmId, setActiveFilmId] = useState(null);

  useEffect(() => {
    axios.get("/db-cinema.json").then((response) => {
      setFilms(response.data.films);
    });
  }, []);

  return (
    <div className="carousel-film">
      <Navigation />

      <div className="inner-carousel-film">
        <div className="box-carousel-films">
          {films.map((film) => {
            const isActive = activeFilmId === film.id;

            return (
              <div
                key={film.id}
                className={isActive ? "each-film-expanded" : "each-film"}
                onClick={() => setActiveFilmId(isActive ? null : film.id)}
              >
                <img
                  className={isActive ? "image-film-expanded" : "image-film"}
                  src={film.image}
                  alt={film.title}
                />
                <div
                  className={
                    isActive ? "overlay-film-expanded" : "overlay-film"
                  }
                >
                  <h3>{film.title}</h3>
                  {isActive && (
                    <p>
                      Ce film est sorti en {film.annee} et a été réalisé par{" "}
                      {film.realisateur}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CarouselFilm;
