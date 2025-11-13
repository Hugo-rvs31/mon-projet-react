import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const isHome = currentPath === "/";

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

  // Sur toutes les pages sauf Home → bouton simple “Accueil”
  if (!isHome) {
    return (
      <div className="navigation navigation-simple">
        <button className="menu-button" onClick={() => navigate("/")}>
          Accueil
        </button>
      </div>
    );
  }

  // Sur Home.jsx → menu complet déroulant
  return (
    <div className="navigation">
      <div className="menu-button" onClick={toggleMenu}>
        {isOpen ? "Fermer" : "Menu"}
      </div>

      {isOpen && (
        <nav className="navigation-inner">
          <ul>
            <li>
              <NavLink to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/quiz-game" onClick={closeMenu}>
                Quiz Game
              </NavLink>
            </li>
            <li>
              <NavLink to="/test" onClick={closeMenu}>
                Test
              </NavLink>
            </li>
            <li>
              <NavLink to="/carousel" onClick={closeMenu}>
                Carousel
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" onClick={closeMenu}>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/cinema-quiz" onClick={closeMenu}>
                Cinema Quiz
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navigation;
