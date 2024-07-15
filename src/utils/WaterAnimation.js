import { LoopOnce } from "three";

// Fonction pour démarrer l'animation de l'eau
export const startAnimation = (name, animationClip, reverse = false) => {
  console.log("startAnimation:", name, animationClip);
  const action = animationClip.actions[name];
  if (action) {
    action.reset(); // Réinitialise l'état de l'action
    action.setLoop(LoopOnce, 1);
    action.clampWhenFinished = true;
    action.timeScale = reverse ? -1 : 1; // Définir le sens de l'animation

    action.play();
    action.paused = false;

    // Réinitialiser le temps de l'animation en fonction du sens
    if (reverse) {
      action.time = action.getClip().duration;
    } else {
      action.time = 0;
    }
  } else {
    console.log("Action not found:", name); // Debug si une action n'est pas trouvée
  }
};
