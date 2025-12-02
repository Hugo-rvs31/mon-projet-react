import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import QuizGame from "./pages/QuizGame";
import Test from "./pages/Test";
import Carousel from "./pages/Carousel";
import Shop from "./pages/Shop";
import CinemaQuiz from "./pages/CinemaQuiz";
import CarouselFilm from "./pages/CarouselFilm";
import Form from "./pages/Form";
import Drawing from "./pages/Drawing";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz-game" element={<QuizGame />} />
        <Route path="/test" element={<Test />} />
        <Route path="/carousel" element={<Carousel />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cinema-quiz" element={<CinemaQuiz />} />
        <Route path="/carousel-film" element={<CarouselFilm />} />
        <Route path="/form" element={<Form />} />
        <Route path="/drawing" element={<Drawing />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
