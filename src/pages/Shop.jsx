import React, { useState, useEffect, useRef } from "react";
import Navigation from "../components/Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHeart,
  faBagShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faSnapchat } from "@fortawesome/free-brands-svg-icons";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";

const Shop = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll.current && currentScroll > 100) {
        // on descend → cache nav
        setShowNav(false);
      } else {
        // on remonte → montre nav
        setShowNav(true);
      }
      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className={`shop ${isFocused ? "shop-active" : ""}`}>
      {isFocused && <div className="overlay"></div>}
      <div
        className="help-other"
        style={{ display: isFocused ? "none" : "flex" }}
      >
        <div className="help-faq">
          <p>Aide et FAQ</p>
        </div>
        <div className="flag">
          <img src="/img/img-shop/Flag-France.webp" alt="" />
        </div>
      </div>
      <div
        className="navigation-shop"
        style={{
          transition: "top 0.3s ease",
          top: showNav ? "0" : "-100px",
          position: "sticky",
          zIndex: 1000,
        }}
      >
        <div className="nav-left">
          <div className="tiroir">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="shop-name same">SHOP</div>
          <div className="woman same">FEMME</div>
          <div className="man same">HOMME</div>
        </div>
        <div className="nav-middle">
          <input
            type="search"
            placeholder="Rechercher des articles et des marques"
            onFocus={() => {
              setIsFocused(true);
              // // empêche le scroll automatique
              // setTimeout(() => {
              //   window.scrollTo(window.scrollX, window.scrollY);
              // }, 0);
            }}
            onBlur={() => setIsFocused(false)}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="icon-search" />
        </div>
        <div className="nav-right">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="icon-search2" />
          <FontAwesomeIcon icon={faUser} className="icon" />
          <FontAwesomeIcon icon={faHeart} className="icon" />
          <FontAwesomeIcon icon={faBagShopping} className="icon" />
        </div>
      </div>
      <div className="reduction">
        <div className="reduction-left buttonRedcution">FEMME</div>
        <div className="reduction-middle">
          Tu viens d'arriver ? Profite de -15 % et de la livraison express
          offerte sur ta première commande avec le code FIRSTSHOP en
          t'inscrivant. Tu en veux plus ? Commande sur l'appli avec le code
          FIRSTAPP et obtiens -20 % à la place !*
        </div>
        <div className="reduction-right buttonRedcution">HOMME</div>
      </div>
      <div className="presentation">
        <div className="woman-picture">
          <button>Shopping femme</button>
        </div>
        <div className="man-picture">
          <button>Shopping homme</button>
        </div>
        <h1>Nous sommes Shop</h1>
      </div>
      <div className="informations-and-other">
        <div className="yellow cube">
          Tu viens d'arriver ? Profite de ta réduction de bienvenue
        </div>
        <div className="blue cube">
          Télécharge notre appli pour des promos exclusives et les derniers
          drops
        </div>
        <div className="pink cube">
          1 an de livraison express gratuite illimitée pour 15€. Offre soumise à
          conditions.
        </div>
        <div className="green cube">Retours faciles et rapides</div>
      </div>
      <div className="brands-section">
        <h1 className="title-brands">Les plus grandes marques</h1>
        <div className="cube-brand">
          <div className="each-cube woman1">
            <div className="NameOfTheBrand">SHOP</div>
          </div>
          <div className="each-cube woman2">
            <div className="NameOfTheBrand">SHOP</div>
          </div>
          <div className="each-cube woman3">
            <div className="NameOfTheBrand">SHOP</div>
          </div>
          <div className="each-cube woman4">
            <div className="NameOfTheBrand">SHOP</div>
          </div>
        </div>
        <button>SHOPPE LES MARQUES FEMMES</button>
        <div className="cube-brand">
          <div className="each-cube man1">
            <div className="NameOfTheBrand">SHOP</div>
          </div>
          <div className="each-cube man2">
            <div className="NameOfTheBrand">SHOP</div>
          </div>
          <div className="each-cube man3">
            <div className="NameOfTheBrand">SHOP</div>
          </div>
          <div className="each-cube man4">
            <div className="NameOfTheBrand">SHOP</div>
          </div>
        </div>
        <button>SHOPPE LES MARQUES HOMMES</button>
      </div>
      <div className="brandsCategories">
        <h1>Catégories Femme</h1>
        <div className="container">
          <div className="each-div">
            <p>Accessoires pour femme</p>
            <p>Chemisiers pour femme</p>
            <p>Loungewear pour femme</p>
            <p>Shorts pour femme</p>
            <p>Tenues de sport pour femme</p>
          </div>
          <div className="each-div">
            <p>Bijoux pour femme</p>
            <p>Idées de cadeaux pour femme</p>
            <p>Manteaux et vestes pour femme</p>
            <p>Survêtements pour femme</p>
            <p>Tops pour femme</p>
          </div>
          <div className="each-div">
            <p>Chaussures pour femme</p>
            <p>Jeans pour femme</p>
            <p>Robes</p>
            <p>Tailleurs pour femme</p>
            <p>Vêtements de grande taille pour femme</p>
          </div>
          <div className="each-div">
            <p>Chemises pour femme</p>
            <p>Jupes</p>
            <p>Robes longues</p>
            <p>Tenues de fête pour femme</p>
            <p>Vêtements maternité</p>
          </div>
        </div>
      </div>
      <div className="brandsCategories">
        <h1>Catégories Homme</h1>
        <div className="container">
          <div className="each-div">
            <p>Accessoires pour homme</p>
            <p>Chemises pour homme</p>
            <p>Loungewear pour homme</p>
            <p>Shorts de bain pour homme</p>
            <p>Tenues habillées pour homme</p>
          </div>
          <div className="each-div">
            <p>Bijoux pour homme</p>
            <p>Costumes pour homme</p>
            <p>Polos pour homme</p>
            <p>Survêtements pour homme</p>
            <p>Vêtements grande taille pour homme</p>
          </div>
          <div className="each-div">
            <p>Cadeaux pour homme</p>
            <p>Denim pour homme</p>
            <p>Sacs pour homme</p>
            <p>Tenues de soirée pour homme</p>
            <p>Vêtements Tall pour homme</p>
          </div>
          <div className="each-div">
            <p>Chaussures pour homme</p>
            <p>Jeans pour homme</p>
            <p>Shorts pour homme</p>
            <p>Tenues de sport pour homme</p>
            <p>Vêtements workwear pour homme</p>
          </div>
        </div>
      </div>
      <div className="socialNetworks">
        <div className="container-logo">
          <a href="" id="a1">
            <FontAwesomeIcon icon={faSquareFacebook} id="icon" />
          </a>

          <a href="" id="a2">
            <FontAwesomeIcon icon={faInstagram} id="icon" />
          </a>
          <a href="" id="a3">
            <FontAwesomeIcon icon={faSnapchat} id="icon3" />
          </a>
        </div>
      </div>
      <footer>
        <div className="container-up">
          <div className="each-div-footer">
            <h2>AIDE & INFORMATION</h2>
            <p>Assistance</p>
            <p>Suivi commande</p>
            <p>Livraison & retours</p>
            <p>SHOP Premier</p>
            <p>-10% pour les étudiants</p>
            <p>Plan du site</p>
          </div>
          <div className="each-div-footer">
            <h2>A PROPOS DE SHOP</h2>
            <p>A propos de SHOP</p>
            <p>SHOP recrute</p>
            <p>Responsabilité des entreprises</p>
            <p>Investisseurs</p>
          </div>
          <div className="each-div-footer">
            <h2>ENCORE PLUS DE SHOP</h2>
            <p>Mobile & applis SHOP</p>
            <p>Chèques cadeaux</p>
            <p>Franch Days</p>
            <p>Soldes</p>
            <p>Black Friday</p>
            <p>Parrainer un ami</p>
            <p>Informations pour les partenaires</p>
          </div>
          <div className="each-div-footer lastDiv">
            <h2>SELECTIONNEZ LE PAYS</h2>
            <div className="inner">
              <div className="up">
                <p>Vous êtes en</p>{" "}
                <img src="/img/img-shop/Flag-France.webp" alt="" />
                <h3 id="p-bold">CHANGER</h3>
              </div>
              <p id="text-center">
                Voici quelques-uns de nos sites internationaux :
              </p>
              <div className="flag">
                <img src="/img/img-shop/Flag-UK.png" alt="" />
                <img src="/img/img-shop/Flag-Spain.png" alt="" />
                <img src="/img/img-shop/Flag-Germany.png" alt="" />
                <img src="/img/img-shop/Flag-Australie.png" alt="" />
                <img src="/img/img-shop/Flag-Danemark.png" alt="" />
                <img src="/img/img-shop/Flag-Italie.webp" alt="" />
                <img src="/img/img-shop/Flag-Netherlands.png" alt="" />
                <img src="/img/img-shop/Flag-Poland.png" alt="" />
                <img src="/img/img-shop/Flag-USA.png" alt="" />
                <img src="/img/img-shop/Flag-Sweden.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="container-down">
          <div className="left">© 2025 SHOP</div>
          <div className="right">
            <div className="little-text-final">Les coordonnées de SHOP</div>
            <div className="little-text-final">Confidentialité et cookies</div>
            <div className="little-text-final">Conditions générales</div>
            <div className="little-text-final little-text-final-last">
              Accessibilité
            </div>
          </div>
        </div>
      </footer>
      <Navigation />
    </div>
  );
};

export default Shop;
