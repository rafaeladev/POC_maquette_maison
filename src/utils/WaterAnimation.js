import { LoopOnce } from "three";

// Fonction pour démarrer l'animation de l'eau
export const startAnimation = (name, animationClip) => {
  console.log("Animation:", name);
  const action = animationClip.actions[name];

  if (action) {
    action.clampWhenFinished = true;
    action.setLoop(LoopOnce, 1);

    action.play();
  } else {
    console.log("Action not found:", name); // Pour déboguer si une action n'est pas trouvée
  }
};
