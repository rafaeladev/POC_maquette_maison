import React, { useEffect, useState, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";

import Interface from "../components/Interface/Index";
import Cuisine from "../components/Cuisine/Cuisine.jsx";
import LoadingBar from "../components/LoadingBar/index";

function Home() {
  const [isScenarioChanged, setIsScenarioChanged] = useState(false);
  const [isWaterMoving, setIsWaterMoving] = useState(false);

  const toggleAnimation = () => {
    setIsWaterMoving((prev) => !prev);
  };

  const toggleScenario = () => {
    setIsScenarioChanged((prev) => !prev); // Toggle entre true et false
  };

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 1) {
          return prev + 0.1;
        } else {
          clearInterval(interval);
          setIsLoading(false);
          return 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LoadingBar isLoading={isLoading} progress={progress} />
      <Leva hidden={false} collapsed={true} />
      {!isLoading && (
        <div className="webgl">
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
                toggleAnimation={toggleAnimation}
                isWaterMoving={isWaterMoving}
              />
            </Canvas>
            <Interface toggleAnimation={toggleAnimation} />
          </Suspense>
        </div>
      )}
    </>
  );
}
export default Home;
