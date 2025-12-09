import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

const BubbleGenerator = () => {
  const [bubbles, setBubbles] = useState([]);
  const [stars, setStars] = useState([]);

  // Générateur de bulles
  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now() + Math.random(),
        size: Math.random() * 60 + 20,
        left: Math.random() * 100,
      };

      setBubbles((prev) => [...prev, newBubble]);

      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
      }, 4000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // étoiles en fond
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

  return (
    <div style={styles.container}>
      <Navigation />
      <div className="central-div">
        <p></p>
      </div>
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
          style={{
            ...styles.bubble,
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
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
  bubble: {
    position: "absolute",
    bottom: "-80px",
    background: "rgba(255, 255, 255, 0.25)",
    borderRadius: "50%",
    backdropFilter: "blur(2px)",
    animation: "bubble 4s ease-in-out forwards",
  },
  star: {
    position: "absolute",
    background: "white",
    borderRadius: "50%",
    opacity: 0.8,
    animation: "twinkle linear infinite",
  },
};
