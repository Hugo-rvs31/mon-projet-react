import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

const BubbleGenerator = () => {
  const [bubbles, setBubbles] = useState([]);
  const [stars, setStars] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [showCounter, setShowCounter] = useState(false);

  // Générateur de bulles
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      const size =
        random < 0.1 ? Math.random() * 120 + 80 : Math.random() * 60 + 20;

      const newBubble = {
        id: Date.now() + Math.random(),
        size,
        left: Math.random() * 100,
        startTop: window.innerHeight + 100, // départ hors écran
      };

      setBubbles((prev) => [...prev, newBubble]);

      // Suppression après animation (12s)
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 12000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Générateur d'étoiles
  useEffect(() => {
    const addStar = () => {
      const newStar = {
        id: Date.now() + Math.random(),
        size: Math.random() * 4 + 2,
        top: Math.random() * 100,
        left: Math.random() * 100,
        animationDuration: Math.random() * 2 + 1,
      };

      setStars((prev) => [...prev, newStar]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, 3000);
    };

    const interval = setInterval(addStar, 250);
    return () => clearInterval(interval);
  }, []);

  // clic sur une bulle
  const handleBubbleClick = (id) => {
    if (!showCounter) setShowCounter(true);
    setClickCount((prev) => prev + 1);
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div style={styles.container}>
      <Navigation />

      {/* Compteur central */}
      {showCounter && (
        <div className="central-div">
          <p>{clickCount}</p>
        </div>
      )}

      {/* Étoiles */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            ...styles.star,
            width: star.size,
            height: star.size,
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}

      {/* Bulles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          onClick={() => handleBubbleClick(bubble.id)}
          style={{
            position: "absolute",
            top: bubble.startTop,
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(2px)",
            cursor: "pointer",
            animation: "bubble 12s linear forwards",
          }}
        />
      ))}
    </div>
  );
};

export default BubbleGenerator;

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    background: "#030303",
  },
  star: {
    position: "absolute",
    background: "white",
    borderRadius: "50%",
    opacity: 0.8,
    animation: "twinkle linear infinite",
  },
};
