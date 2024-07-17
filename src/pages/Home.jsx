import React, { useEffect, useState, Suspense, useRef } from "react";

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

import { useLocation, useNavigate, useParams } from "react-router-dom";

// Context
import { useCanvas } from "../utils/Context/CanvasContext.jsx";
import { useInView } from "react-intersection-observer";

import { useIntersection } from "react-use";
const DisableRender = () => useFrame(() => null, 1000);

function Home() {
  const canvasRef = useCanvas();
  const useInView = () => {
    const ref = useRef(null);
    const threshold = 0.05;
    const intersection = useIntersection(ref, {
      root: null,
      rootMargin: "0px",
      threshold,
    });

    return {
      ref,
      inView: intersection && intersection.intersectionRatio > threshold,
    };
  };
  const { ref, inView } = useInView();

  const toggleClose = () => {
    setClose((prev) => !prev);
  };

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

  // Change of states for the camera position
  const toggleCameraPosition = () => {
    setMoveCamera((prev) => !prev);
  };

  // Function do handle the change of positions for the camera
  const cameraPositions = [
    {
      location: "Maison globale",
      position: new Vector3(-12.08, 5.28, 9.7),
      target: new Vector3(0, 0, 0),
    },
    {
      location: "Cuisine",
      position: new Vector3(5.94, 1.85, 4.13),
      target: new Vector3(5, 1, 0),
    },
    {
      location: "Salon",
      position: new Vector3(-0.88, 1, 1.25),
      target: new Vector3(3, 0.34, -3.2),
    },
    {
      location: "Salle de bain",
      position: new Vector3(3.65, 1.25, -5.42),
      target: new Vector3(8, 0, 0),
    },
    {
      location: "Jardin",
      position: new Vector3(-7.12, 3.64, 9.33),
      target: new Vector3(3, 0.34, -3.2),
    },
  ];

  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

  const handleCameraPositionChange = (direction) => {
    setMoveCamera(true); // Passez en mode automatique
    setMenuButtonClick(true);

    let newIndex = currentPositionIndex + direction;

    if (newIndex < 0) {
      newIndex = cameraPositions.length - 1;
    } else if (newIndex >= cameraPositions.length) {
      newIndex = 0;
    }

    setCurrentPositionIndex(newIndex);
    setCameraPosition(cameraPositions[newIndex].position);
    setCameraTarget(cameraPositions[newIndex].target);
  };

  // Function to reset of the animations
  const handleReset = () => {
    setIsReset(true);
    toggleScenario(false);
    setIsWaterMoving();
    setIsWaterMovingUp();
    setResetKey((prevKey) => prevKey + 1); // Change the key to force a re-render

    console.log(isScenarioChanged);
    setTimeout(() => {
      setIsReset(false);
    }, 200); // Reset the reset state after a short delay to allow re-rendering
  };

  return (
    <>
      <LoadingBar isLoading={!isLoaded} progress={progress} />

      <Leva hidden={true} collapsed={true} />
      <div className="canvasContainer" ref={ref}>
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
          {!inView && <DisableRender />}
          <color attach="background" args={["#302D38"]} />
          {/*     <Perf position="top-left" /> */}
          <Environment preset="sunset" intensity={7} />

          <Scene
            key={resetKey} // force re-render
            isScenarioChanged={isScenarioChanged}
            toggleScenario={toggleScenario}
            toggleAnimation={toggleWaterMoving}
            toggleWaterMovingUp={toggleWaterMovingUp}
            isWaterMoving={isWaterMoving}
            isWaterMovingUp={isWaterMovingUp}
            toggleReset={toggleReset}
            isReset={isReset}
            resetKey={resetKey}
            cameraPosition={cameraPosition}
            cameraTarget={cameraTarget}
            moveCamera={moveCamera}
            setMoveCamera={toggleCameraPosition}
            menuButtonClick={menuButtonClick}
            setIsLoaded={setIsLoaded}
            setLoadingProgress={setProgress}
            inView={inView}
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
        handleCameraPositionChange={handleCameraPositionChange}
        titleScenario={cameraPositions[currentPositionIndex].location}
        setClose={toggleClose}
      />
    </>
  );
}
export default Home;
