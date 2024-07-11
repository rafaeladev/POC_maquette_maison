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

import { Vector3 } from "three";

function Home() {
  const [isScenarioChanged, setIsScenarioChanged] = useState(false);
  const [isWaterMoving, setIsWaterMoving] = useState(false);
  const [isWaterMovingUp, setIsWaterMovingUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Loading bar
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Camera animation
  const [cameraPosition, setCameraPosition] = useState(
    new Vector3(-12.08, 5.28, 9.7)
  );
  const [cameraTarget, setCameraTarget] = useState(new Vector3(0, 0, 0));
  const [moveCamera, setMoveCamera] = useState(true);
  const [menuButtonClick, setMenuButtonClick] = useState(false);

  // Texture change
  const [changeTextures, setChangeTextures] = useState(false);
  const [resetTextures, setResetTextures] = useState(false);

  // Change of states for the water animation
  const toggleWaterMovingUp = () => {
    setIsWaterMovingUp((prev) => !prev);
  };

  const toggleWaterMoving = () => {
    setIsWaterMoving((prev) => !prev);
  };

  // Change of states for the scenario
  const toggleScenario = () => {
    setIsScenarioChanged((prev) => !prev); // Toggle entre true et false
  };

  // Change of states for the reset
  const toggleReset = () => {
    setIsReset((prev) => !prev);
  };

  // Change of states for the textures
  const toggleTextures = () => {
    setChangeTextures((prev) => !prev);
  };

  // Change of states for the camera position
  const toggleCameraPosition = () => {
    setMoveCamera((prev) => !prev);
  };

  // Function do handle the change of positions for the camera
  const handleCameraPosition = (location) => {
    setMoveCamera(true); // Passez en mode automatique
    setMenuButtonClick(true);
    if (location === "cuisine") {
      setCameraPosition(new Vector3(5.94, 1.85, 4.13));
      setCameraTarget(new Vector3(5, 1, 0));
    } else if (location === "salon") {
      setCameraPosition(new Vector3(-0.88, 1, 1.25));
      setCameraTarget(new Vector3(3, 0.34, -3.2));
    } else if (location === "sdb") {
      setCameraPosition(new Vector3(3.65, 1.25, -5.42));
      setCameraTarget(new Vector3(8, 0, 0));
    } else if (location === "jardin") {
      setCameraPosition(new Vector3(-7.12, 3.64, 9.33));
      setCameraTarget(new Vector3(3, 0.34, -3.2));
    }
  };

  // Function to reset of the animations
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
    }, 200); // Reset the reset state after a short delay to allow re-rendering
  };

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("environment map", {
      envMapIntensity: { value: 7, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 28, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });

  useEffect(() => {
    console.log(progress);
  }, [isLoaded, progress]);

  return (
    <>
      <LoadingBar isLoading={!isLoaded} progress={progress} />

      <Leva hidden={false} collapsed={true} />

      {/* <Suspense fallback={<FadeLoaderComponent />}> */}
      <>
        <div className="webgl">
          <Canvas
            shadows={true}
            flat
            camera={{
              fov: 45,
              near: 0.1,
              far: 200,
              position: cameraPosition,
            }}
          >
            <color attach="background" args={["#302D38"]} />
            <Perf position="top-left" />
            <Environment preset="sunset" intensity={envMapIntensity} />

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
              cameraPosition={cameraPosition}
              cameraTarget={cameraTarget}
              moveCamera={moveCamera}
              setMoveCamera={toggleCameraPosition}
              menuButtonClick={menuButtonClick}
              setIsLoaded={setIsLoaded}
              setLoadingProgress={setProgress}
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
      </>
      {/* </Suspense> */}
      {/* )} */}
    </>
  );
}
export default Home;
