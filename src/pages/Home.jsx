import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

const images = [
  "/img/art1.jpg",
  "/img/art2.webp",
  "/img/art3.jpg",
  "/img/art4.jpg",
  "/img/art5.jpg",
  "/img/art6.jpeg",
  "/img/art7.avif",
  "/img/art8.webp",
  "/img/art9.jpg",
  "/img/art10.webp",
  "/img/art11.jpg",
  "/img/art12.png",
  "/img/art13.png",
  "/img/art14.jpg",
  "/img/art15.jpg",
  "/img/art16.jpg",
  "/img/art17.jpg",
  "/img/art18.jpg",
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Précharge toutes les images
  useEffect(() => {
    let loadedCount = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          setLoaded(true); // Toutes les images sont prêtes
        }
      };
    });
  }, []);

  // Changement automatique d'image
  useEffect(() => {
    if (!loaded) return; // on attend que tout soit chargé
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 8000); // 8 secondes
    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        transition: "background-image 1s ease-in-out", // transition douce
      }}
    >
      <h1>Bienvenue</h1>
      <Navigation />
    </div>
  );
};

export default Home;
