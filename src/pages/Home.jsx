import React, { useEffect, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";

import Interface from "../components/Interface/Index";
import Cuisine from "../components/Cuisine/Cuisine.jsx";

function Home() {
  const [isScenarioChanged, setIsScenarioChanged] = useState(false);
  const [isWaterMoving, setIsWaterMoving] = useState(false);

  const toggleAnimation = () => {
    setIsWaterMoving((prev) => !prev);
  };

  const toggleScenario = () => {
    setIsScenarioChanged((prev) => !prev); // Toggle entre true et false
  };

  return (
    <>
      <Leva hidden={false} collapsed={true} />
      <div className="webgl">
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
      </div>
    </>
  );
}
export default Home;
