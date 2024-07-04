import React, { useEffect, useState, Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Sky } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import Interface from "../components/Interface.jsx";
import Cuisine from "../components/Cuisine.jsx";
import LoadingBar from "../components/LoadingBar.jsx";

import { Perf } from "r3f-perf";

import { useControls } from "leva";
import Scene from "../Scene.jsx";
import FadeLoaderComponent from "../components/FadeLoader.jsx";

function Home() {
  const [isScenarioChanged, setIsScenarioChanged] = useState(false);
  const [isWaterMoving, setIsWaterMoving] = useState(false);
  const [isWaterMovingUp, setIsWaterMovingUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [newCameraPosition, setNewCameraPosition] = useState({
    x: -12.08,
    y: 5.28,
    z: 9.7,
  });

  const [newCameraLookAt, setNewCameraLookAt] = useState({ x: 0, y: 0, z: 0 });

  const [changeTextures, setChangeTextures] = useState(false);
  const [resetTextures, setResetTextures] = useState(false);

  const toggleWaterMovingUp = () => {
    setIsWaterMovingUp((prev) => !prev);
  };

  const toggleWaterMoving = () => {
    setIsWaterMoving((prev) => !prev);
  };

  const toggleScenario = () => {
    setIsScenarioChanged((prev) => !prev); // Toggle entre true et false
  };

  const toggleReset = () => {
    setIsReset((prev) => !prev);
  };

  const toggleTextures = () => {
    setChangeTextures((prev) => !prev);
  };

  const handleCameraPosition = (location) => {
    if (location === "cuisine") {
      setNewCameraPosition({ x: 6.45, y: 1.77, z: 4.52 });
      setNewCameraLookAt({ x: -0.18, y: 0.23, z: 0.04 });
    } else if (location === "salon") {
      setNewCameraPosition({ x: -0.88, y: 1.23, z: 1.25 });
      setNewCameraLookAt({ x: 0, y: 0, z: 0 });
    } else if (location === "sdb") {
      setNewCameraPosition({ x: 5.099, y: 1.281, z: -7.843 });
      setNewCameraLookAt({ x: 0, y: 0, z: 0 });
    } else if (location === "jardin") {
      setNewCameraPosition({ x: -7.12, y: 3.64, z: 9.33 });
      setNewCameraLookAt({ x: 0, y: 0, z: 0 });
    }
  };

  const handleReset = () => {
    setIsReset(true);
    setIsScenarioChanged();
    setIsWaterMoving();
    setIsWaterMovingUp();
    setResetKey((prevKey) => prevKey + 1); // Change the key to force a re-render

    setChangeTextures(false);
    setResetTextures(true);

    setTimeout(() => {
      setIsReset(false);
      setResetTextures(false);
    }, 100); // Reset the reset state after a short delay to allow re-rendering
  };

  const { dLightPosition, dLightIntensity } = useControls("Directional Light", {
    dLightPosition: { value: [0, 10, 0], step: 0.1 },
    dLightIntensity: { value: 1, step: 0.1 },
  });

  /*   const { sLightPosition, sLightAngle, sLightPenumbra } = useControls(
    "Spot Light",
    {
      sLightPosition: { value: [10, 10, 10], step: 0.1 },
      sLightAngle: { value: 0.15, step: 0.1 },
      sLightPenumbra: { value: 1, step: 0.1 },
    }
  ); */

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("environment map", {
      envMapIntensity: { value: 7, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 28, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });

  /*   const { sunPosition } = useControls("Sun", {
    sunPosition: { value: [-4.6, 3.2, -7.6], step: 0.1 },
  });
 */

  return (
    <>
      {/* <LoadingBar isLoading={isLoading} progress={progress} /> */}

      <Leva hidden={false} collapsed={true} />

      {/* {!isLoading && ( */}

      <Suspense fallback={<FadeLoaderComponent />}>
        <div className="webgl">
          <Canvas
            shadows={true}
            flat
            camera={{
              fov: 45,
              near: 0.1,
              far: 200,
              position: [-12.08, 5.28, 9.7],
            }}
          >
            <color attach="background" args={["#241B27"]} />
            <Perf position="top-left" />
            <Environment preset="sunset" intensity={envMapIntensity} />
            {/*   <ambientLight intensity={0.5} /> */}

            {/* <directionalLight
                            position={dLightPosition}
                            intensity={dLightIntensity}
                            ref={dirLight}
                            castShadow
                        />
                        <directionalLightHelper light={dirLight} /> */}
            {/*   <spotLight
              position={sLightPosition}
              angle={sLightAngle}
              penumbra={sLightPenumbra}
              castShadow
            /> */}
            {/*  <Suspense fallback={null}>
              <Cuisine
                isScenarioChanged={isScenarioChanged}
                toggleScenario={toggleScenario}
                toggleAnimation={toggleWaterMoving}
                isWaterMoving={isWaterMoving}
                isWaterMovingUp={isWaterMovingUp}
                toggleReset={handleReset}
                isReset={isReset}
              />
            </Suspense> */}
            {/*  <Sky
            
              sunPosition={sunPosition}
              
            /> */}

            <Scene
              isScenarioChanged={isScenarioChanged}
              toggleScenario={toggleScenario}
              toggleAnimation={toggleWaterMoving}
              toggleWaterMovingUp={toggleWaterMovingUp}
              isWaterMoving={isWaterMoving}
              isWaterMovingUp={isWaterMovingUp}
              toggleReset={toggleReset}
              isReset={isReset}
              resetTextures={resetTextures}
              changeTextures={changeTextures}
              toggleTextures={toggleTextures}
              newCameraPosition={newCameraPosition}
              newCameraLookAt={newCameraLookAt}
            />
          </Canvas>
        </div>
        <Interface
          toggleWaterMovingUp={toggleWaterMovingUp}
          toggleWaterMoving={toggleWaterMoving}
          isWaterMovingUp={isWaterMovingUp}
          isWaterMoving={isWaterMoving}
          isScenarioChanged={isScenarioChanged}
          handleReset={handleReset}
          isReset={isReset}
          toggleReset={toggleReset}
          handleCameraPosition={handleCameraPosition}
        />
      </Suspense>

      {/* )} */}
    </>
  );
}
export default Home;
