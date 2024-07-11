import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import "../styles/LoadingBar.css"; // Assurez-vous d'avoir un fichier CSS pour les styles
import { FadeLoader } from "react-spinners";

function LoadingBar({ progress }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (progress >= 1) {
      setIsLoaded(true);
    }
  }, [progress]);

  useEffect(() => {
    if (isLoaded) {
      const tl = gsap.timeline();

      window.setTimeout(() => {
        /* // Ajout de la classe 'ended' à la barre de chargement
        gsap.to(".loading-bar", {
          scaleX: 0,
          transformOrigin: "right top",
          duration: 0.5, // Vous pouvez ajuster la durée de l'animation
          ease: "ease-in-out",
        });
        gsap.to(".loading-container", {
          opacity: 0,
          duration: 1, // Vous pouvez ajuster la durée de l'animation
          onComplete: () => {
            document.querySelector(".loading-container").classList.add("ended");
          },
        }); */

        tl.to(".loading-bar", {
          scaleX: 0,
          transformOrigin: "right top",
          duration: 1.5, // Ajustez la durée de l'animation
          ease: "ease-in-out",
          onComplete: () => {
            document.querySelector(".loading-bar").classList.add("ended");
          },
        }).to(".loading-container", {
          opacity: 0,
          duration: 0.5, // Ajustez la durée de l'animation
          onComplete: () => {
            document.querySelector(".loading-container").classList.add("ended");
            /*   document.querySelector(".loading-bar").classList.add("ended"); */
          },
        });
      }, 1000);
    }
  }, [isLoaded]);

  return (
    <div className="loading-container">
      <div
        className="loading-bar"
        style={{ transform: `scaleX(${progress})` }}
      ></div>

      {/* <div className="loading-spinner">
        <FadeLoader color="#ffffff" />
      </div> */}
    </div>
  );
}

export default LoadingBar;
