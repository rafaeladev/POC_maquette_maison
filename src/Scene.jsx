// Code source du composant Scene
// Ce composant est responsable de l'affichage de la scène 3D

// imports React
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// imports drei
import { OrbitControls, useAnimations, Sky, Html } from "@react-three/drei";
import { BakeShadows } from "@react-three/drei";

// imports React Three Fiber
import { useFrame, useLoader } from "@react-three/fiber";

// imports Three.js
import * as THREE from "three";
import { Sprite, SpriteMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// imports des shaders
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";
import waterFragmentShaderSide from "./shaders/waterSide/fragment.glsl";

// imports des composants
import { useControls } from "leva";

// imports des utils .js
import { startAnimation } from "./utils/WaterAnimation.js";
import useStore from "./utils/store.js";

// Approche  n°2 avec Water from three-stdlib
import Ocean from "./Ocean.jsx";

import { IoClose } from "react-icons/io5";

import { useInView } from "react-intersection-observer";

const DisableRender = () => useFrame(() => null, 1000);

// Fonction pour ajouter des shadows
const enableShadows = (object) => {
  console.log("enableShadows called");
  let i = 0;
  object.traverse((child) => {
    if (child.isMesh) {
      if (
        child.material.name !== "terre" &&
        child.material.name !== "herbe" &&
        child.material.name !== "beton" &&
        child.material.name !== "asphalt" &&
        child.material.name !== "sol_cuisine" &&
        child.material.name !== "carpet" &&
        child.material.name !== "sol_salon" &&
        child.material.name !== "sol_sdb"
      ) {
        child.castShadow = true;
      }
      child.receiveShadow = true;
    }
    i = i + 1;
  });
};

function Scene(props) {
  const { ref, inView } = useInView();
  // Force reload when coming back to the page
  const [resetKey, setResetKey] = useState(0);

  // ---  Debug controls --- //
  // Approche n°1 avec shaderMaterial
  const { Elevation, FrequencyX, FrequencyY, Speed } = useControls(
    "Big Waves",
    {
      Elevation: { value: 0.02, min: 0, max: 1, step: 0.001 },
      FrequencyX: { value: 2.5, min: 0, max: 10, step: 0.001 },
      FrequencyY: { value: 2.5, min: 0, max: 10, step: 0.001 },
      Speed: { value: 1.72, min: 0, max: 4, step: 0.001 },
    }
  );

  const {
    uSmallWavesElevation,
    uSmallWavesFrequency,
    uSmallWavesSpeed,
    uSmallIterations,
  } = useControls("Small Waves", {
    uSmallWavesElevation: { value: 0.07, min: 0, max: 1, step: 0.001 },
    uSmallWavesFrequency: { value: 2.43, min: 0, max: 30, step: 0.001 },
    uSmallWavesSpeed: { value: 0.97, min: 0, max: 4, step: 0.001 },
    uSmallIterations: { value: 1, min: 0, max: 5, step: 1 },
  });

  const { depthColor, surfaceColor, uColorOffset, uColorMultiplier, uOpacity } =
    useControls("Waves colors", {
      depthColor: "#5e98ba",
      surfaceColor: "#c1def5",
      uColorOffset: { value: 0.08, min: 0, max: 1, step: 0.001 },
      uColorMultiplier: { value: 5, min: 0, max: 10, step: 0.001 },
      uOpacity: { value: 0.2, min: 0, max: 1, step: 0.01 },
    });

  const {
    sunPosition,
    turbidity,
    rayleigh,
    mieCoefficient,
    mieDirectionalG,
    distance,
  } = useControls("Sun", {
    sunPosition: { value: [-3.9, 9.9, 10.1], step: 0.1 },
    turbidity: { value: 4, min: 0, max: 20, step: 0.1 },
    rayleigh: { value: 3, min: 0, max: 10, step: 0.1 },
    mieCoefficient: { value: 0.33, min: 0, max: 1, step: 0.01 },
    mieDirectionalG: { value: 1, min: 0, max: 1, step: 0.01 },
    distance: { value: 450000, min: 0, max: 1000000, step: 100 },
  });

  const orbitControls = useControls("Orbit Controls", {
    enableDamping: false,
    dampingFactor: 0.25,
    enableZoom: true,
    enableRotate: true,
    enablePan: true,
    minPolarAngle: 0,
    maxPolarAngle: (80 * Math.PI) / 180,

    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    minDistance: -10,
    maxDistance: 17,
    /*  position0: props.cameraPosition, */
  });

  // ---  Debug controls --- //

  // References
  const eauPiscine = useRef();
  const eauExterieur = useRef();
  const eauPiscineCote = useRef();
  const eauExterieurCote = useRef();
  const eauInterieur = useRef();
  const eauInterieurCote = useRef();
  const orbitControlsRef = useRef();
  const waterMaterialRef = useRef();
  const waterMaterialSideRef = useRef();
  const sceneRef = useRef();
  const spriteRef = useRef();

  // --- Model --- //

  // Function to initialize the LoadingManager

  const initializeLoadingManager = () => {
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log("Loading started");
    };

    loadingManager.onLoad = () => {
      props.setIsLoaded(true); // Set isLoaded to true when everything is loaded
      console.log("Loading complete");
    };

    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      props.setLoadingProgress(progress); // Update loading progress
      /* console.log(
        `Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`
      );
      console.log(progress); */
    };

    return loadingManager;
  };

  const loadingManagerRef = useRef(initializeLoadingManager());

  const { nodes, animations } = useMemo(() => {
    return useLoader(GLTFLoader, "./model/Maquette_v11.glb", (loader) => {
      loader.manager = loadingManagerRef.current;
    });
  }, []);

  /*   const { nodes, animations } = useMemo(() => {
    return useLoader(GLTFLoader, "./model/Maquette_v11.glb", (loader) => {
      loader.manager = loadingManagerRef.current;
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("./draco/"); // Assurez-vous que ce chemin est correct
      loader.setDRACOLoader(dracoLoader);
    });
  }, [scenario]); // Reload when the scenario changes */

  // Scenario
  const scenario = useStore((state) => state.scenario);

  const {
    maquette_scenario_a_avant,
    maquette_scenario_a_apres,
    maquette_scenario_b_avant,
    maquette_scenario_b_apres,
    maquette_scenario_c_avant,
    maquette_scenario_c_apres,
  } = nodes;

  const scenariosAvant = useMemo(
    () => ({
      A: maquette_scenario_a_avant,
      B: maquette_scenario_b_avant,
      C: maquette_scenario_c_avant,
    }),
    [
      maquette_scenario_a_avant,
      maquette_scenario_b_avant,
      maquette_scenario_c_avant,
    ]
  );

  const scenariosApres = useMemo(
    () => ({
      A: maquette_scenario_a_apres,
      B: maquette_scenario_b_apres,
      C: maquette_scenario_c_apres,
    }),
    [
      maquette_scenario_a_apres,
      maquette_scenario_b_apres,
      maquette_scenario_c_apres,
    ]
  );

  const sceneAvant = useMemo(
    () => scenariosAvant[scenario],
    [scenariosAvant, scenario]
  );
  const sceneApres = useMemo(
    () => scenariosApres[scenario],
    [scenariosApres, scenario]
  );

  // Force reload when pathname changes
  useEffect(() => {
    setResetKey((prevKey) => prevKey + 1);

    const scene = props.isScenarioChanged ? sceneApres : sceneAvant;
    enableShadows(scene);
  }, [scenario, props.isScenarioChanged, sceneAvant, sceneApres]);

  // --- Model --- //

  // --- Lights --- //
  const directionalLight = useRef();
  /*   useHelper(directionalLight, THREE.DirectionalLightHelper, 1); */
  // --- Lights --- //

  // --- Shader material --- //
  const fragmentShader = waterFragmentShader;
  const vertexShader = waterVertexShader;
  const fragmentShaderSide = waterFragmentShaderSide;

  const data = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: Elevation },
        uBigWavesFrequency: {
          value: new THREE.Vector2(FrequencyX, FrequencyY),
        },
        uBigWavesSpeed: { value: Speed },
        uSmallWavesElevation: { value: uSmallWavesElevation },
        uSmallWavesFrequency: { value: uSmallWavesFrequency },
        uSmallWavesSpeed: { value: uSmallWavesSpeed },
        uSmallIterations: { value: uSmallIterations },
        uDepthColor: { value: new THREE.Color(depthColor) },
        uSurfaceColor: { value: new THREE.Color(surfaceColor) },
        uColorOffset: { value: uColorOffset },
        uColorMultiplier: { value: uColorMultiplier },
      },
      fragmentShader,
      vertexShader,
    }),
    [
      Elevation,
      FrequencyX,
      FrequencyY,
      Speed,
      uSmallWavesElevation,
      uSmallWavesFrequency,
      uSmallWavesSpeed,
      uSmallIterations,
      depthColor,
      surfaceColor,
    ]
  );

  const data2 = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: Elevation },
        uBigWavesFrequency: {
          value: new THREE.Vector2(FrequencyX, FrequencyY),
        },
        uBigWavesSpeed: { value: Speed },
        uSmallWavesElevation: { value: uSmallWavesElevation },
        uSmallWavesFrequency: { value: uSmallWavesFrequency },
        uSmallWavesSpeed: { value: uSmallWavesSpeed },
        uSmallIterations: { value: uSmallIterations },
        uDepthColor: { value: new THREE.Color(depthColor) },
        uSurfaceColor: { value: new THREE.Color(surfaceColor) },
        uColorOffset: { value: uColorOffset },
        uColorMultiplier: { value: uColorMultiplier },
        uOpacity: { value: 1 },
      },
      fragmentShader: fragmentShaderSide,
      vertexShader,
    }),
    [
      Elevation,
      FrequencyX,
      FrequencyY,
      Speed,
      uSmallWavesElevation,
      uSmallWavesFrequency,
      uSmallWavesSpeed,
      uSmallIterations,
      depthColor,
      surfaceColor,
      uOpacity,
    ]
  );
  // --- Shader material --- //

  // --- Sprite --- //
  const map = new THREE.TextureLoader().load("/pictos/Check.svg");
  const material = new THREE.SpriteMaterial({ map: map });
  const sprite = new THREE.Sprite(material);

  // --- Sprite --- //

  // --- Camera --- //
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(100, 100, 100)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const [isCameraAuto, setIsCameraAuto] = useState(true);

  /* useEffect(() => {
    if (props.cameraPosition && props.cameraTarget) {
      if (smoothedCameraPosition.current) {
        smoothedCameraPosition.current.copy(props.cameraPosition);
      }
      if (smoothedCameraTarget.current) {
        smoothedCameraTarget.current.copy(props.cameraTarget);
      }
    }
  }, [props.cameraPosition, props.cameraTarget]); */

  /*   useEffect(() => {
    smoothedCameraPosition.current.copy(props.cameraPosition);
    smoothedCameraTarget.current.copy(props.cameraTarget);
  }, [props.cameraPosition, props.cameraTarget]);
 */

  useEffect(() => {
    if (props.menuButtonClick) {
      setIsCameraAuto(true);
    }
  }, [
    props.isScenarioChanged,
    props.isWaterMoving,
    props.isWaterMovingUp,
    props.cameraPosition,
  ]);

  useFrame((state, delta) => {
    if (props.moveCamera && isCameraAuto) {
      smoothedCameraPosition.lerp(props.cameraPosition, 5 * delta);
      smoothedCameraTarget.lerp(props.cameraTarget, 5 * delta);

      state.camera.position.copy(smoothedCameraPosition);
      state.camera.lookAt(smoothedCameraTarget);

      if (orbitControlsRef.current) {
        /*  console.log(orbitControlsRef.current.object.position); */
        orbitControlsRef.current.target.copy(smoothedCameraTarget);
        orbitControlsRef.current.update();
      }

      // Vérifiez si la caméra a atteint la nouvelle position
      if (
        smoothedCameraPosition.distanceTo(props.cameraPosition) < 0.1 &&
        smoothedCameraTarget.distanceTo(props.cameraTarget) < 0.1
      ) {
        props.setMoveCamera(false); // Arrêtez de déplacer la caméra
        setIsCameraAuto(false); // Passez en mode manuel
      }
    }
  });

  // --- Camera --- //

  // --- Animation de l'eau --- //
  // Animation du shader material
  useFrame(({ camera, clock }) => {
    if (
      eauExterieur.current &&
      eauPiscine.current &&
      eauExterieurCote.current &&
      eauPiscineCote.current &&
      eauInterieur.current &&
      eauInterieurCote.current
    ) {
      eauExterieur.current.material.uniforms.uTime.value =
        clock.getElapsedTime();
      eauPiscine.current.material.uniforms.uTime.value = clock.getElapsedTime();
      eauExterieurCote.current.material.uniforms.uTime.value =
        clock.getElapsedTime();
      eauPiscineCote.current.material.uniforms.uTime.value =
        clock.getElapsedTime();
      eauInterieur.current.material.uniforms.uTime.value =
        clock.getElapsedTime();
      eauInterieurCote.current.material.uniforms.uTime.value =
        clock.getElapsedTime();
    }

    /*   if (cameraRef.current) {
      camera.position.copy(cameraRef.current.position0);
      camera.lookAt(cameraRef.current.target);
    } */

    /*  camera.position.copy(orbitControls.position0);
    camera.lookAt(orbitControls.target); */
  });

  // Animations montée de l'eau
  const [showCoteMeshes, setShowCoteMeshes] = useState(false);

  const getAnimationNames = (scenario) => [
    `eau_exterieur_scenario_abc_montee`,
    `eau_exterieur_cote_scenario_abc_montee`,
    `eau_interieur_cote_scenario_${scenario.toLowerCase()}_montee`,
    `eau_interieur_scenario_${scenario.toLowerCase()}_montee`,
    `eau_piscine_cote_scenario_abc_montee`,
    `eau_piscine_scenario_abc_montee`,
  ];

  const animationNames = useMemo(() => getAnimationNames(scenario), [scenario]);

  const animationsClips = [
    useAnimations(animations, nodes.eau_exterieur),
    useAnimations(animations, nodes.eau_exterieur_cote),
    useAnimations(animations, nodes.eau_interieur_cote),
    useAnimations(animations, nodes.eau_interieur),
    useAnimations(animations, nodes.eau_piscine_cote),
    useAnimations(animations, nodes.eau_piscine),
  ];

  // Animation de l'eau avec useEffect pour gérer les déclenchements
  useEffect(() => {
    // Ne procéder que si isWaterMoving est true pour éviter les déclenchements inutiles.
    if (!props.isWaterMoving) return;

    // Afficher les côtes de l'eau qui sont cachées par défaut
    setShowCoteMeshes(true);

    // Déterminer si l'animation doit être inversée en fonction de isWaterMovingUp
    const reverse = !props.isWaterMovingUp;

    let timeoutId;

    if (props.isWaterMoving && props.isWaterMovingUp) {
      animationNames.forEach((name, index) => {
        startAnimation(name, animationsClips[index], reverse);
      });

      timeoutId = window.setTimeout(() => {
        props.toggleScenario(true);
        props.toggleAnimation(false);

        if (waterMaterialRef.current) {
          waterMaterialRef.current.uniforms.uDepthColor.value.set("#b0a997");
          waterMaterialRef.current.uniforms.uSurfaceColor.value.set("#e3cfcf");
        }
        if (waterMaterialSideRef.current) {
          waterMaterialSideRef.current.uniforms.uDepthColor.value.set(
            "#b0a997"
          );
          waterMaterialSideRef.current.uniforms.uSurfaceColor.value.set(
            "#e3cfcf"
          );
        }
      }, 5000);
    } else if (props.isWaterMoving && !props.isWaterMovingUp) {
      animationNames.forEach((name, index) => {
        startAnimation(name, animationsClips[index], reverse);
      });

      timeoutId = window.setTimeout(() => {
        props.toggleAnimation();
        setShowCoteMeshes(false);
      }, 5000);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [props.isWaterMoving, props.isWaterMovingUp, animationsClips]);

  // --- Animation de l'eau --- //

  // --- Loading des objets --- //

  // Function d'aide pour obtenir la référence pour un certain clé
  function getRefForKey(key) {
    switch (key) {
      case "eau_exterieur":
        return eauExterieur;
      case "eau_exterieur_cote":
        return eauExterieurCote;
      case "eau_piscine":
        return eauPiscine;
      case "eau_piscine_cote":
        return eauPiscineCote;
      case "eau_interieur":
        return eauInterieur;
      case "eau_interieur_cote":
        return eauInterieurCote;
      default:
        return null; // Case de défaut
    }
  }
  // --- Loading des objets --- //

  // --- Render --- //
  return (
    <>
      {/*  {!inView && DisableRender()} */}
      {/*  <BakeShadows /> */}
      {/*   <SoftShadows size={5} samples={20} focus={0} /> */}
      <OrbitControls
        ref={orbitControlsRef}
        /*   enableDamping
        dampingFactor={0.25}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        maxDistance={20}
        enabled={!isCameraAuto}  */
      />
      <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
        color={0xffd0b5}
      />
      <Sky
        sunPosition={sunPosition}
        turbidity={turbidity}
        rayleigh={rayleigh}
        mieCoefficient={mieCoefficient}
        mieDirectionalG={mieDirectionalG}
        distance={distance}
      />
      {/*    <Html>
        <button className="title_bar_closeIcon" onClick={handleWindowClose}>
          <IoClose />
        </button>
      </Html> */}
      {/* Affichage du modèle */}
      {Object.keys(nodes).map((key) => {
        if (
          key === "structure_salissure_interieure" ||
          key === "structure_salissure_exterieure" ||
          key === "exterieur_flaques_eau" ||
          key === "exterieur_flaques_fioul"
        ) {
          if (!props.changeTextures) {
            return null;
          } else {
            return <primitive key={key} object={nodes[key]} />;
          }
        }

        // Gérer les cas spéciaux d'eau
        if (
          key === "eau_exterieur" ||
          key === "eau_piscine" ||
          key === "eau_exterieur_cote" ||
          key === "eau_piscine_cote" ||
          key === "eau_interieur" ||
          key === "eau_interieur_cote"
        ) {
          return (
            <React.Fragment key={key}>
              <primitive
                key={`${key}-firstChild`}
                object={nodes[key]}
                ref={getRefForKey(key)} // Use the helper function to determine the ref
                visible={
                  key === "eau_exterieur_cote" ||
                  key === "eau_interieur_cote" ||
                  key === "eau_interieur"
                    ? showCoteMeshes
                    : true
                }
              >
                <shaderMaterial
                  attach="material"
                  ref={
                    key === "eau_exterieur" ||
                    key === "eau_piscine" ||
                    key === "eau_interieur"
                      ? waterMaterialRef
                      : waterMaterialSideRef
                  }
                  args={
                    key === "eau_exterieur" ||
                    key === "eau_piscine" ||
                    key === "eau_interieur"
                      ? [data]
                      : [data2]
                  }
                />
              </primitive>
            </React.Fragment>
          );
        }
        return null;
      })}

      <primitive object={nodes.maquette_plan} />

      {/*    <sprite scale={[0.5, 0.5, 1]} position={[3, 1, -5.5]}>
        <spriteMaterial map={map} />
      </sprite> */}

      {props.inView && (
        <primitive
          key={props.resetKey} // Use resetKey to force re-render
          ref={sceneRef}
          object={props.isScenarioChanged ? sceneApres : sceneAvant}
          castShadow
          receiveShadow
        />
      )}
    </>
  );
}

export default Scene;
