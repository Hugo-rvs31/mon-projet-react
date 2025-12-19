import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

const images = [
  `${import.meta.env.BASE_URL}img/art1.jpg`,
  `${import.meta.env.BASE_URL}img/art2.webp`,
  `${import.meta.env.BASE_URL}img/art3.jpg`,
  `${import.meta.env.BASE_URL}img/art4.jpg`,
  `${import.meta.env.BASE_URL}img/art5.jpg`,
  `${import.meta.env.BASE_URL}img/art6.jpeg`,
  `${import.meta.env.BASE_URL}img/art7.avif`,
  `${import.meta.env.BASE_URL}img/art8.webp`,
  `${import.meta.env.BASE_URL}img/art9.jpg`,
  `${import.meta.env.BASE_URL}img/art10.webp`,
  `${import.meta.env.BASE_URL}img/art11.jpg`,
  `${import.meta.env.BASE_URL}img/art12.png`,
  `${import.meta.env.BASE_URL}img/art13.png`,
  `${import.meta.env.BASE_URL}img/art14.jpg`,
  `${import.meta.env.BASE_URL}img/art15.jpg`,
  `${import.meta.env.BASE_URL}img/art16.jpg`,
  `${import.meta.env.BASE_URL}img/art17.jpg`,
  `${import.meta.env.BASE_URL}img/art18.jpg`,
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

  useEffect(() => {
    if (!loaded) return;
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
        transition: "background-image 1s ease-in-out",
      }}
    >
      <h1>Bienvenue</h1>
      <Navigation />
    </div>
  );
};

export default Home;
