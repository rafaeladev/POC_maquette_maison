// Code source du composant Scene
// Ce composant est responsable de l'affichage de la scène 3D

// imports React
import React, { useRef, useEffect, useState, useMemo } from "react";

// imports drei
import { OrbitControls, useAnimations, Sky } from "@react-three/drei";

// imports React Three Fiber
import { useFrame, useLoader } from "@react-three/fiber";

// imports Three.js
import * as THREE from "three";
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
import { loadTextures } from "./utils/textureLoader.js";
import textures from "./data/textures.json";

// Approche  n°2 avec Water from three-stdlib
import Ocean from "./Ocean.jsx";

// Fonction pour appliquer les textures aux objets
const applyMaterial = (node, loadedTextures, name) => {
  let materialOptions;

  // console.log(name);
  if (
    name === "plastique_blanc" ||
    name === "Plastique_noir" ||
    name === "plante" ||
    name === "Cuir"
  ) {
    materialOptions = {
      color:
        name === "plastique_blanc"
          ? 0xffffff
          : name === "Plastique_noir"
          ? 0x000000
          : name === "plante"
          ? 0x6e7d65
          : 0x3b2517,
      name: name,
    };
  } else {
    materialOptions = {
      map: loadedTextures.colorMap || null,
      normalMap: loadedTextures.normalMap || null,
      roughnessMap: loadedTextures.roughnessMap || null,
      metalnessMap: loadedTextures.metalnessMap || null,
      alphaMap: loadedTextures.alphaMap || null,
      name: name,
    };
  }

  if (materialOptions.normalMap) {
    materialOptions.normalMap.wrapS = THREE.RepeatWrapping;
    materialOptions.normalMap.wrapT = THREE.RepeatWrapping;
  }

  if (materialOptions.map) {
    materialOptions.map.wrapS = THREE.RepeatWrapping;
    materialOptions.map.wrapT = THREE.RepeatWrapping;
  }

  if (materialOptions.roughnessMap) {
    materialOptions.roughnessMap.wrapS = THREE.RepeatWrapping;
    materialOptions.roughnessMap.wrapT = THREE.RepeatWrapping;
  }

  if (materialOptions.metalnessMap) {
    materialOptions.metalnessMap.wrapS = THREE.RepeatWrapping;
    materialOptions.metalnessMap.wrapT = THREE.RepeatWrapping;
  }

  // if (materialOptions.alphaMap) {
  //     materialOptions.alphaMap.wrapS = THREE.RepeatWrapping;
  //     materialOptions.alphaMap.wrapT = THREE.RepeatWrapping;
  // }

  node.material = new THREE.MeshStandardMaterial(materialOptions);
  node.material.needsUpdate = true;
};

function Scene(props) {
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

  const { sunPosition } = useControls("Sun", {
    sunPosition: { value: [-3.9, 9.9, 10.1], step: 0.1 },
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

  const { dLightPosition, dLightIntensity, dLightTarget } = useControls(
    "Directional Light",
    {
      dLightPosition: { value: [-4.6, 3.2, -7.6], step: 0.1 },
      dLightIntensity: { value: 0.1, step: 0.1 },
      dLightTarget: { value: [0, 0, 0] },
    }
  );

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
  const overlayMaterialRef = useRef();

  // -- Overlay material -- //
  const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uAlpha: { value: 0.15 },
    },
    vertexShader: `
               void main()
               {
                  gl_Position = vec4(position, 1.0);
               }
           `,
    fragmentShader: `
               uniform float uAlpha;
   
               void main()
               {
                   gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
               }
           `,
  });
  // -- Overlay material -- //

  // --- Model --- //
  const loadingManager = new THREE.LoadingManager();

  loadingManager.onLoad = () => {
    props.setIsLoaded(true); // Set isLoaded to true when everything is loaded
  };

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal;
    props.setLoadingProgress(progress); // Update loading progress
    /*   console.log(
      `Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`
    );
    console.log(progress); */
  };

  // Use the loading manager with useLoader

  const { nodes, animations } = useLoader(
    GLTFLoader,
    "./model/Maquette_v9.glb",
    (loader) => {
      loader.manager = loadingManager;
    }
  );

  console.log("animations : ", animations);

  const maquette_scenario_a_avant = nodes.maquette_scenario_a_avant;
  const maquette_scenario_a_apres = nodes.maquette_scenario_a_apres;
  const maquette_scenario_b_avant = nodes.maquette_scenario_b_avant;
  const maquette_scenario_b_apres = nodes.maquette_scenario_b_apres;
  const maquette_scenario_c_avant = nodes.maquette_scenario_c_avant;
  const maquette_scenario_c_apres = nodes.maquette_scenario_c_apres;

  /*   const gltf = useLoader(
    GLTFLoader,
    "./model/Maquette_v9_compressed.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("./draco/"); // Assurez-vous que ce chemin est correct
      loader.setDRACOLoader(dracoLoader);
    }
  );

  const nodes = useMemo(() => gltf.nodes, [gltf]);
  console.log(nodes);
  const animations = useMemo(() => gltf.animations, [gltf]); */

  /*   const [damagedNodes, setDamagedNodes] = useState({});
  const [cleanNodes, setCleanNodes] = useState({}); */

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
        uOpacity: { value: 0.8 },
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

  // Scenario
  const [scenario, setScenario] = useState("A");

  const animationNames = [
    "eau_exterieur_scenario_abc_montee",
    "eau_piscine_scenario_abc_montee",
    "eau_piscine_scenario_abc_montee",
    "eau_exterieur_scenario_abc_montee",
    "eau_interieur_scenario_a_montee",
    "eau_interieur_scenario_a_montee",
  ];

  const animationsClips = [
    useAnimations(animations, nodes.eau_exterieur),
    useAnimations(animations, nodes.eau_piscine),
    useAnimations(animations, nodes.eau_piscine_cote),
    useAnimations(animations, nodes.eau_exterieur_cote),
    useAnimations(animations, nodes.eau_interieur_cote),
    useAnimations(animations, nodes.eau_interieur),
  ];

  console.log(animationsClips);

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

        props.toggleTextures(true);
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
      <Sky sunPosition={sunPosition} />
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
      <mesh
        geometry={overlayGeometry}
        material={overlayMaterial}
        ref={overlayMaterialRef}
      />
      <primitive object={nodes.maquette_plan} />
      <primitive
        key={props.resetKey} // Use resetKey to force re-render
        object={
          props.isScenarioChanged
            ? maquette_scenario_a_apres
            : maquette_scenario_a_avant
        }
      />
    </>
  );
}

export default Scene;
