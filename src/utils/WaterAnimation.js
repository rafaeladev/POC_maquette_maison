import { LoopOnce } from 'three';

// Fonction pour démarrer l'animation de l'eau
export const startAnimation = (name, animationClip, reverse = false) => {
    const action = animationClip.actions[name];

    console.log('Starting animation:', name, 'Reverse:', reverse, 'Action:', action);

    if (action) {
        action.clampWhenFinished = true;
        action.setLoop(LoopOnce, 1);
        action.timeScale = reverse ? -1 : 1; // Vitesse de l'animation

        if (reverse) {
            action.paused = false;
            action.time = action.getClip().duration; // Commence à la fin si en sens inverse
            action.play();

            action.crossFadeTo(action, 0);
        } else {
            action.reset();
            action.paused = false;
            action.timeScale = 1;
            action.play();
        }
    } else {
        console.log('Action not found:', name); // Pour déboguer si une action n'est pas trouvée
    }
};
