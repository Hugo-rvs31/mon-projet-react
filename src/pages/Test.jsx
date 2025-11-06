import React, { useRef, useState, useEffect } from "react";
import Navigation from "../components/Navigation";

const Test = ({ poster = null }) => {
  const videoRef = useRef(null);
  const [appearance, setAppearance] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // 🔹 Liste des vidéos
  const videos = [
    "/Videos/Shangai.mp4",
    "/Videos/Meduse.mp4",
    "/Videos/Road.mp4",
  ];

  // 🔹 Change la vidéo quand la précédente se termine
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleEnded = () => {
      // passe à la vidéo suivante (boucle)
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    videoEl.addEventListener("ended", handleEnded);

    return () => {
      videoEl.removeEventListener("ended", handleEnded);
    };
  }, []);

  // 🔹 Quand currentVideoIndex change, on met à jour la source et on relance la lecture
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.src = videos[currentVideoIndex];
    videoEl.play().catch((err) => {
      console.warn("Lecture auto bloquée", err);
    });
  }, [currentVideoIndex]);

  return (
    <div className="container-test">
      {/* 🎬 La vidéo en fond */}
      <video
        className="video-background"
        ref={videoRef}
        poster={poster}
        muted
        playsInline
        autoPlay
      />

      {/* 🔹 Overlay affichée seulement si appearance est false */}
      {!appearance && (
        <div
          className="overlay"
          onClick={() => setAppearance(true)} // clic sur toute la zone
        >
          <div className="write">Clique-moi dessus, j'adore ça</div>
        </div>
      )}

      {/* 🔹 Div cachée qui apparaît */}
      {appearance && (
        <div className="appearance">
          Navigation <Navigation />
          <button
            onClick={() => {
              setAppearance(false); // revenir à overlay
            }}
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
};

export default Test;
