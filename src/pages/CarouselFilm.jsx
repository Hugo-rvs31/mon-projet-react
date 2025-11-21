import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import axios from "axios";

const CarouselFilm = () => {
  const [films, setFilms] = useState([]);

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
          {films.map((film) => (
            <div className="each-film" key={film.id}>
              <img src={film.image} alt={film.title} />
              <div className="overlay">
                <h3>{film.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselFilm;
