import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  // Clic pour Shop → renvoie Home
  const handleClick = () => {
    if (currentPath === "/shop") {
      navigate("/"); // redirige vers Home
    }
  };

  // Toggle menu pour pages autres que Shop
  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div
      className={`navigation ${
        currentPath === "/shop" ? "navigation-shop-fixed" : ""
      }`}
      onClick={handleClick} // clic déclenche navigation vers Home uniquement sur Shop
    >
      <div
        className="menu-button"
        onClick={currentPath !== "/shop" ? toggleMenu : undefined}
      >
        {currentPath === "/shop" ? "Accueil" : isOpen ? "Fermer" : "Menu"}
      </div>

      {/* Menu déroulant uniquement pour pages hors Shop */}
      {currentPath !== "/shop" && isOpen && (
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
            {currentPath !== "/cinema-quiz" && (
              <li>
                <NavLink to="/cinema-quiz" onClick={closeMenu}>
                  Cinema Quiz
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
