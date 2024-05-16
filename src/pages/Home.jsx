import React, { useEffect, useState, Suspense } from 'react';

import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';

import Interface from '../components/Interface.jsx';
import Cuisine from '../components/Cuisine.jsx';
import LoadingBar from '../components/LoadingBar.jsx';

function Home() {
    const [isScenarioChanged, setIsScenarioChanged] = useState(false);
    const [isWaterMoving, setIsWaterMoving] = useState(false);
    const [isWaterMovingUp, setIsWaterMovingUp] = useState(false);

    const toggleWaterMovingUp = () => {
        setIsWaterMovingUp((prev) => !prev);
    };

    const toggleWaterMoving = () => {
        setIsWaterMoving((prev) => !prev);
    };

    const toggleScenario = () => {
        setIsScenarioChanged((prev) => !prev); // Toggle entre true et false
    };

    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setProgress((prev) => {
    //             if (prev < 1) {
    //                 return prev + 0.1;
    //             } else {
    //                 clearInterval(interval);
    //                 setIsLoading(false);
    //                 return 1;
    //             }
    //         });
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <>
            {/* <LoadingBar isLoading={isLoading} progress={progress} /> */}
            <Leva
                hidden={false}
                collapsed={true}
            />
            {/* {!isLoading && ( */}
            <div className='webgl'>
                <Suspense fallback={<LoadingBar />}>
                    <Canvas
                        flat
                        camera={{
                            fov: 45,
                            near: 0.1,
                            far: 200,
                            position: [-18.8, 12.06, 9.58],
                        }}
                    >
                        <Cuisine
                            isScenarioChanged={isScenarioChanged}
                            toggleScenario={toggleScenario}
                            toggleAnimation={toggleWaterMoving}
                            isWaterMoving={isWaterMoving}
                            isWaterMovingUp={isWaterMovingUp}
                        />
                    </Canvas>
                    <Interface
                        toggleWaterMovingUp={toggleWaterMovingUp}
                        toggleWaterMoving={toggleWaterMoving}
                        isWaterMovingUp={isWaterMovingUp}
                        isWaterMoving={isWaterMoving}
                        isScenarioChanged={isScenarioChanged}
                    />
                </Suspense>
            </div>
            {/* )} */}
        </>
    );
}
export default Home;
