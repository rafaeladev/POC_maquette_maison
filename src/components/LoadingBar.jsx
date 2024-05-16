import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import '../styles/LoadingBar.css'; // Assurez-vous d'avoir un fichier CSS pour les styles

function LoadingBar({ isLoading, progress }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!isLoading && isLoaded) {
            gsap.to('.loading-bar', {
                scaleX: 0,
                duration: 3,
                delay: 1,
                onComplete: () => {
                    document.querySelector('.loading-bar').classList.add('ended');
                },
            });
        }
    }, [isLoading, isLoaded]);

    useEffect(() => {
        if (progress >= 1) {
            setIsLoaded(true);
        }
    }, [progress]);

    return (
        <div
            className='loading-bar'
            style={{ transform: `scaleX(${progress})` }}
        ></div>
    );
}

export default LoadingBar;
