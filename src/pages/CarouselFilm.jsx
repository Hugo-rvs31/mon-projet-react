import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
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
    const [synopsisExpanded, setSynopsisExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const synopsisRef = useRef(null);

    useLayoutEffect(() => {
      if (synopsisRef.current) {
        const el = synopsisRef.current;
        const style = window.getComputedStyle(el);
        let lineHeight = parseFloat(style.lineHeight);
        if (isNaN(lineHeight)) {
          // fallback si lineHeight = "normal"
          const fontSize = parseFloat(style.fontSize);
          lineHeight = fontSize * 1.2;
        }
        const maxHeight = lineHeight * 8;
        if (el.scrollHeight > maxHeight) {
          setShowButton(true);
        }
      }
    }, [film]);

    const toggleSynopsis = (e) => {
      e.stopPropagation();
      setSynopsisExpanded(!synopsisExpanded);
    };

    return ReactDOM.createPortal(
      <div className="film-modal-backdrop">
        <div
          className={
            synopsisExpanded
              ? "each-film-expanded each-film-expanded-synopsis-on"
              : "each-film-expanded"
          }
          onClick={onClose} // clique pour fermer
        >
          <div className="expanded-media">
            <img
              className="image-film-expanded"
              src={film.image}
              alt={film.title}
            />
          </div>

          <div
            className="overlay-film-expanded"
            onClick={(e) => e.stopPropagation()} // empêche la fermeture si clic sur texte
          >
            <h3>{film.title}</h3>
            <p>
              Sorti en <strong>{film.annee}</strong> — Réalisé par{" "}
              <strong>{film.realisateur}</strong>
            </p>

            <div className="box-synopsis">
              <p
                ref={synopsisRef}
                className="synopsis"
                style={{
                  maxHeight: synopsisExpanded ? "none" : `${8 * 1.2}em`,
                  overflow: synopsisExpanded ? "visible" : "hidden",
                }}
              >
                {film.synopsis}
              </p>
              {showButton && (
                <button onClick={toggleSynopsis}>
                  {synopsisExpanded ? "Réduire" : "Lire la suite"}
                </button>
              )}
            </div>
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
