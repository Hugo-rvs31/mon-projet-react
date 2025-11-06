import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); // empêche la propagation du clic
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="navigation">
      {/* 🔘 Bouton pour ouvrir/fermer le menu */}
      <div className="menu-button" onClick={toggleMenu}>
        {isOpen ? "Fermer" : "Menu"}
      </div>

      {/* 🔽 La navigation interne apparaît seulement si le menu est ouvert */}
      {isOpen && (
        <nav className="navigation-inner">
          <ul>
            {currentPath !== "/" && (
              <li>
                <NavLink to="/" onClick={closeMenu}>
                  Home
                </NavLink>
              </li>
            )}
            {currentPath !== "/quiz-game" && (
              <li>
                <NavLink to="/quiz-game" onClick={closeMenu}>
                  Quiz Game
                </NavLink>
              </li>
            )}
            {currentPath !== "/test" && (
              <li>
                <NavLink to="/test" onClick={closeMenu}>
                  Test
                </NavLink>
              </li>
            )}
            {currentPath !== "/carousel" && (
              <li>
                <NavLink to="/carousel" onClick={closeMenu}>
                  Carousel
                </NavLink>
              </li>
            )}
            {currentPath !== "/shop" && (
              <li>
                <NavLink to="/shop" onClick={closeMenu}>
                  Shop
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navigation;
