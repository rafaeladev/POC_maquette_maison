import React, { useRef, useEffect, useState, useMemo } from "react";

import {
  useGLTF,
  OrbitControls,
  Environment,
  useAnimations,
} from "@react-three/drei";

import { LoopOnce, Mesh } from "three";

import { useFrame } from "@react-three/fiber";

import * as THREE from "three";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

function Scene() {
  // Refs
  const buttonCube = useRef();

  // States
  const [isMoving, setIsMoving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Model
  // const scene = useGLTF('./model/POC_Maquette_v2.glb');
  const { nodes, animations } = useGLTF("./model/POC_Maquette_v2.glb");

  // Ref
  const eauPiscine = useRef();
  const eauInterieur = useRef();
  const eauExterieur = useRef();

  // Colors
  const debugObject = {};
  debugObject.depthColor = "#186691";
  debugObject.surfaceColor = "#9bd8ff";

  // Shader material
  const fragmentShader = waterFragmentShader;
  const vertexShader = waterVertexShader;

  const data = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
      },
      fragmentShader,
      vertexShader,
    }),
    []
  );

  useFrame((state, delta) => {
    eauExterieur.current.material.uniforms.uTime.value = delta;
    eauInterieur.current.material.uniforms.uTime.value = delta;
    eauPiscine.current.material.uniforms.uTime.value = delta;
  });

  // Animations
  const animationClip = useAnimations(animations, nodes.Eau_exterieur);
  const animationsClips = [
    useAnimations(animations, nodes.Eau_exterieur),
    useAnimations(animations, nodes.Eau_piscine),
    useAnimations(animations, nodes.Eau_interieur),
  ];

  // Fonction pour démarrer l'animation de l'eau
  const startAnimation = (name) => {
    console.log("Animation:", name);
    const action = animationClip.actions[name];
    const action2 = animationsClips[2].actions["eauInterieur0to80"];
    const action3 = animationsClips[1].actions["eauPiscine0To80"];

    if (action) {
      action.clampWhenFinished = true;
      action.setLoop(LoopOnce, 1);
      action2.setLoop(LoopOnce, 1);
      action3.setLoop(LoopOnce, 1);
      action2.clampWhenFinished = true;
      action3.clampWhenFinished = true;
      action.play();
      action2.play();
      action3.play();
    } else {
      console.log("Action not found:", name); // Pour déboguer si une action n'est pas trouvée
    }
  };

  // Animation de l'eau
  useEffect(() => {
    if (isMoving) {
      startAnimation("eauExterieur0To80");
      // startAnimation('eauInterieur0To80');
      // startAnimation('eauPiscine0To80');
    } else {
      // actions['eauExterieur0To80'].stop();
      // actions['eauInterieur0To80'].stop();
      // actions['eauPiscine0To80'].stop();
    }
  }, [isMoving]);

  // Fonction pour gérer le clic sur le bouton
  const handlePress = () => {
    buttonCube.current.position.y -= 0.1;
  };

  const handleRelease = () => {
    buttonCube.current.position.y += 0.1;
  };

  const restart = () => {
    setIsMoving(true);
  };

  return (
    <>
      {/* Environnement */}
      <Environment path="/envMap/" files="potsdamer_platz_256.hdr" />

      <color args={["#241B27"]} attach="background" />

      <OrbitControls makeDefault />

      {/* Lumière directionnelle */}
      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={0.2}
        shadow-normalBias={0.04}
      />

      {/* Lumière ambiante */}
      <ambientLight intensity={0.1} />

      {/* Affichage du modèle */}
      {Object.keys(nodes).map((key) => {
        if (
          key === "Eau_exterieur" ||
          key === "Eau_piscine" ||
          key === "Eau_interieur"
        ) {
          /*    nodes[key].material.transparent = true;
          nodes[key].material.opacity = 0.8; */

          return (
            <primitive
              key={key}
              object={nodes[key]}
              ref={
                key === "Eau_exterieur"
                  ? eauExterieur
                  : key === "Eau_interieur"
                  ? eauInterieur
                  : eauPiscine
              }
            >
              <shaderMaterial attach="material" args={[data]} />
            </primitive>
          );
        }
        return <primitive key={key} object={nodes[key]} />;
      })}

      {/*  Cube */}
      <mesh
        ref={buttonCube}
        position-x={-5}
        position-y={-1.55}
        scale={1}
        onClick={restart}
        onPointerDown={handlePress} // Appelé lorsque le bouton est pressé
        onPointerUp={handleRelease} // Appelé lorsque le bouton est relâché
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    </>
  );
}

export default Scene;
