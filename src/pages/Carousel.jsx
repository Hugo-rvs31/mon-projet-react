import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

const Carousel = () => {
  const slides = [
    {
      image: "/img/carousel-photo-1.jpg",
      title: "Château",
      description: "Découvrez ce merveilleux château.",
    },
    {
      image: "/img/carousel-photo-2.jpg",
      title: "Désert",
      description: "Être seul au monde en plein désert d'Atacama",
    },
    {
      image: "/img/carousel-photo-3.jpg",
      title: "Sur la route",
      description: "L'appel de l'aventure et du grand air.",
    },
    {
      image: "/img/carousel-photo-4.jpg",
      title: "Les granges abandonnées",
      description:
        "Explorez la beauté et le côté pittoresque du Midwest américain.",
    },
    {
      image: "/img/carousel-photo-5.jpg",
      title: "Art contemporain",
      description:
        "Visiter le Berlin underground et ses expos d'art contemporains",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === slides.length - 1) {
          setDirection(-1);
          return prev - 1;
        }
        if (prev === 0) {
          setDirection(1);
          return prev + 1;
        }
        return prev + direction;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [direction, slides.length]);

  return (
    <div className="carousel">
      <div className="carousel-navigation">
        <Navigation />
      </div>

      <div
        className="carousel-inner"
        style={{
          display: "flex",
          transition: "transform 1s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div className="carousel-item" key={i}>
            <img src={slide.image} alt={`Slide ${i + 1}`} />
            <div className="overlay-content">
              {slide.title && <h2>{slide.title}</h2>}
              {slide.description && <p>{slide.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
