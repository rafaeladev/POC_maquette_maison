import { LoopOnce } from "three";

// Fonction pour démarrer l'animation de l'eau
export const startAnimation = (name, animationClip, reverse = false) => {
  const action = animationClip.actions[name];
  console.log("animation lancee");
  if (action) {
    action.clampWhenFinished = true;
    action.setLoop(LoopOnce, 1);

    // Définir la vitesse de l'animation à -1 pour la jouer en sens inverse
    action.timeScale = reverse ? -1 : 1;

    // Jouer l'animation à partir de la fin si elle est en sens inverse
    if (reverse) {
      action.paused = false; // Assurer que l'animation n'est pas en pause
      action.play();
      action.crossFadeTo(action, 0); // Commencer immédiatement l'animation
      action.time = action.getClip().duration; // Débuter à la fin de l'animation
    } else {
      action.play();
    }
  } else {
    console.log("Action not found:", name); // Pour déboguer si une action n'est pas trouvée
  }
};
