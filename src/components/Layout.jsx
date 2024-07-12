import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Layout() {
    // État pour stocker la largeur et la hauteur actuelles de .siteWrapper
    const [dimensions, setDimensions] = useState({ width: 568, height: 320 });

    useEffect(() => {
        const updateDimensions = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const widthScaleFactor = windowWidth / dimensions.width;

            const heightScaleFactor = windowHeight / dimensions.height;

            const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);

            // Mettez à jour la taille de police basée sur le scaleFactor
            document.documentElement.style.setProperty('--font-size-p', `${14 * scaleFactor}px`);

            if (windowWidth > 768) {
                document.documentElement.style.setProperty(
                    '--font-size-p',
                    `${10 * scaleFactor}px`
                );
            }
            setDimensions({
                width: 568 * scaleFactor,
                height: 320 * scaleFactor,
            });
        };
        // Appeler updateDimensions au montage pour initialiser les dimensions
        updateDimensions();

        // Ajouter un écouteur d'événement pour les changements de taille de la fenêtre
        window.addEventListener('resize', updateDimensions);

        // Nettoyer l'écouteur d'événement lors du démontage du composant
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    return (
        <>
            <main>
                <div
                    className='siteWrapper'
                    style={{ width: `100%`, height: `100%` }}
                >
                    <Outlet />
                </div>
            </main>
        </>
    );
}

export default Layout;
