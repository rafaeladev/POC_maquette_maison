// Code source du composant Scene
// Ce composant est responsable de l'affichage de la scène 3D

// imports React
import React, { useRef, useEffect, useState, useMemo } from "react";

// imports drei
import {
  OrbitControls,
  useAnimations,
  Text,
  Stage,
  useHelper,
  Sky,
  BakeShadows,
  ContactShadows,
  SoftShadows,
  PresentationControls,
} from "@react-three/drei";

// imports React Three Fiber
import { useFrame, useLoader, useThree } from "@react-three/fiber";

// imports Three.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Vector3 } from "three";

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
import { TexturesSales } from "./utils/texturesSales.js";

import { TextureLoader } from "three";

// Approche  n°2 avec Water from three-stdlib
import Ocean from "./Ocean.jsx";
import { or } from "three/examples/jsm/nodes/Nodes.js";

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

  const { cameraX, cameraY, cameraZ, cameraFov, cameraNear, cameraFar } =
    useControls("Camera", {
      cameraX: { value: 6.2, step: 0.1, label: "Camera X" },
      cameraY: { value: 2, step: 0.1, label: "Camera Y" },
      cameraZ: { value: 4.2, step: 0.1, label: "Camera Z" },
      cameraFov: { value: 40, step: 1, label: "FOV" },
      cameraNear: { value: 1.4, step: 0.1, label: "Near" },
      cameraFar: { value: 200, step: 1, label: "Far" },
    });

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

  /*   const { contactShadowPosition } = useControls("Contact Shadow", {
    position: { value: [0, 0, 0], step: 0.01 },
  }); */

  /*   const { position, rotation } = useControls("Text", {
    position: { value: [-5.53, -2.27, 0], step: 0.01 },
    rotation: { value: [4.71, 0, 4.7], step: 0.01 },
  });
 */

  const { sunPosition } = useControls("Sun", {
    sunPosition: { value: [-3.9, 9.9, 10.1], step: 0.1 },
  });

  const {
    presetValues,
    shadowType,
    shadowOpacity,
    shadowBlur,
    environmentType,
    preset,
    stageIntensity,
  } = useControls("Stage", {
    shadowType: { options: ["contact", "accumulative"], value: "contact" },
    shadowOpacity: { value: 0.9, min: 0, max: 1, step: 0.01 },
    shadowBlur: { value: 0, min: 0, max: 10, step: 1 },
    environmentType: {
      options: [
        "sunset",
        "dawn",
        "night",
        "warehouse",
        "city",
        "park",
        "forest",
        "lobby",
        "studio",
      ],
      value: "sunset",
    },
    preset: {
      options: ["portrait", "rembrandt", "upfront", "soft"],
      value: "rembrandt",
    },
    stageIntensity: { value: 0.0, min: 0, max: 1, step: 0.01 },
    presetValues: { value: [1, 1, 1], step: 0.1 },
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

  const { cameraTargetX, cameraTargetY, cameraTargetZ } = useControls(
    "Camera Target",
    {
      cameraTargetX: { value: 0, step: 0.5 },
      cameraTargetY: { value: 0, step: 0.5 },
      cameraTargetZ: { value: 0, step: 0.5 },
    }
  );

  /*  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  }); */

  // ---  Debug controls --- //

  // --- Model --- //
  const { nodes, animations } = useLoader(
    GLTFLoader,
    "./model/Maquette_v7.glb"
  );

  const [damagedNodes, setDamagedNodes] = useState({});
  const [cleanNodes, setCleanNodes] = useState({});

  useEffect(() => {
    // Créer des objets pour stocker les objets abîmés et propres
    const damaged = {};
    const clean = {};
    Object.keys(nodes).forEach((key) => {
      if (key.includes("_abime")) {
        damaged[key] = nodes[key];
      } else {
        clean[key] = nodes[key];
      }
    });
    setDamagedNodes(damaged);
    setCleanNodes(clean);
  }, [nodes]);

  const shouldShowNode = (key) => {
    if (props.isReset) {
      // Montrer les objets propres et cacher les abîmés en cas de reset
      return !key.includes("_abime");
    } else if (props.isScenarioChanged) {
      // Montrer les objets abîmés et cacher les doublons propres
      if (key.includes("_abime")) {
        return true;
      }

      // Trouver la version abîmée de la clé
      const baseKey = `${key}_abime`;

      if (damagedNodes[baseKey]) {
        if (nodes[key] && nodes[key].isGroup) {
          if (damagedNodes[`_1_${baseKey}`]) {
            return false;
          }

          // for (let i = 3; i < 4; i++) {
          //     console.log(`${key}_${i}`);
          //     if (cleanNodes[`${key}_${i}`]) {
          //         return false;
          //     }
          // }
          // console.log(nodes[key]);
          // // Supprimez les enfants du groupe
          // nodes[key].traverse((child) => {
          //     if (child !== nodes[key]) {
          //         child.visible = false;
          //     }
          // });
        }
        return false;
      }
    }
    // console.log(key);
    // console.log(!key.includes('_abime')); // Par défaut, montrer les objets propres et cacher les abîmés
    return !key.includes("_abime");
  };

  // --- Textures --- //
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // Fonction pour charger les textures
  const handleTextureLoading = async (nodes, textureAction) => {
    const promises = Object.keys(nodes).map(async (key) => {
      const node = nodes[key];

      if (node && node.material) {
        const materialName = node.material.name;
        let targetMaterialName = materialName;

        if (textureAction === "change") {
          targetMaterialName = `${materialName}_sale`;
        } else if (textureAction === "reset") {
          targetMaterialName = materialName.replace("_sale", "");
        }

        if (materialName && textures.materials[targetMaterialName]) {
          try {
            const loadedTextures = await loadTextures(targetMaterialName);

            if (textureAction === "reset" || textureAction === "change") {
              applyMaterial(node, loadedTextures, targetMaterialName);
            }
          } catch (error) {
            console.error(
              `Failed to load textures for material ${targetMaterialName}:`,
              error
            );
          }
        } else if (
          materialName &&
          (targetMaterialName === "plastique_blanc" ||
            targetMaterialName === "Plastique_noir" ||
            targetMaterialName === "plante" ||
            targetMaterialName === "Cuir") &&
          textureAction === "reset"
        ) {
          applyMaterial(node, null, targetMaterialName);
        }
      }
    });

    await Promise.all(promises);
  };

  useEffect(() => {
    const loadAllTextures = async () => {
      await handleTextureLoading(nodes, "load");
      setTexturesLoaded(true);
    };

    loadAllTextures();
  }, [nodes]);

  useEffect(() => {
    if (props.changeTextures) {
      const loadAllTextures = async () => {
        await handleTextureLoading(nodes, "change");
        setTexturesLoaded(true);
      };

      loadAllTextures();
    }
  }, [props.changeTextures]);

  useEffect(() => {
    if (props.resetTextures) {
      console.log("Reset textures");
      const resetAllTextures = async () => {
        await handleTextureLoading(nodes, "reset");
      };

      resetAllTextures();

      if (waterMaterialRef.current) {
        waterMaterialRef.current.uniforms.uDepthColor.value.set("#5e98ba");
        waterMaterialRef.current.uniforms.uSurfaceColor.value.set("#c1def5");
      }
      if (waterMaterialSideRef.current) {
        waterMaterialSideRef.current.uniforms.uDepthColor.value.set("#5e98ba");
        waterMaterialSideRef.current.uniforms.uSurfaceColor.value.set(
          "#c1def5"
        );
      }
    }
  }, [props.resetTextures, nodes]);

  // --- Textures --- //

  // References
  const eauPiscine = useRef();
  const eauExterieur = useRef();
  const eauPiscineCote = useRef();
  const eauExterieurCote = useRef();
  const orbitControlsRef = useRef();
  const waterMaterialRef = useRef();
  const waterMaterialSideRef = useRef();

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

  /* const smoothedCameraTarget = useRef(new THREE.Vector3()); */

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
  useFrame((state, delta) => {
    smoothedCameraPosition.lerp(props.cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(props.cameraTarget, 5 * delta);

    if (props.moveCamera) {
      state.camera.position.copy(smoothedCameraPosition);
      state.camera.lookAt(smoothedCameraTarget);
    }

    console.log(state.camera.position.x);
    console.log(props.moveCamera);

    if (state.camera.position.x === -12.080000000000002) {
      props.setMoveCamera();
    }

    if (orbitControlsRef.current) {
      /*  console.log(orbitControlsRef.current.object.position); */
      orbitControlsRef.current.target.copy(smoothedCameraTarget);
      orbitControlsRef.current.update();
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
      eauPiscineCote.current
    ) {
      eauExterieur.current.material.uniforms.uTime.value =
        clock.getElapsedTime();
      eauPiscine.current.material.uniforms.uTime.value = clock.getElapsedTime();
      eauExterieurCote.current.material.uniforms.uTime.value =
        clock.getElapsedTime();
      eauPiscineCote.current.material.uniforms.uTime.value =
        clock.getElapsedTime();
    }
    /*  console.log(camera.position); */

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
    "eauExterieur0To80",
    "eauPiscine0To80",
    "eauPiscineCote0To80",
    "eauExterieurCote0To80",
  ];

  const animationsClips = [
    useAnimations(animations, nodes.eau_exterieur),
    useAnimations(animations, nodes.eau_piscine),
    useAnimations(animations, nodes.eau_piscine_cote),
    useAnimations(animations, nodes.eau_exterieur_cote),
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
      /* console.log("Animation démarrée", props.isWaterMoving); */
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
        // props.toggleReset();
        /*   props.toggleTextures(); */
      }, 5000);
    }

    /* if (props.isReset) {
      setShowCoteMeshes(false);
    } */
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [props.isWaterMoving, props.isWaterMovingUp, animationsClips]);

  // --- Animation de l'eau --- //

  // --- Loading des objets --- //
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (nodes && Object.keys(nodes).length > 0 && animations) {
      setIsLoaded(true);
    }
  }, [nodes, animations]);

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
      default:
        return null; // Case de défaut
    }
  }
  // --- Loading des objets --- //

  // --- Render --- //
  return (
    <>
      {/*  <BakeShadows /> */}
      {/*  <ContactShadows
        position={[0, -0.0, 0]}
        opacity={1}
        scale={15}
        resolution={512}
        blur={2}
        frames={1}
      /> */}

      {/*  pour flutter les shadows, pour qu'elles ne soyent pas sharp*/}
      {/*   <SoftShadows size={5} samples={20} focus={0} /> */}

      <OrbitControls
        ref={orbitControlsRef}
        target={props.cameraTarget}
        enableDamping
        dampingFactor={0.25}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        maxDistance={20}
      />

      <directionalLight
        ref={directionalLight}
        position={sunPosition}
        intensity={dLightIntensity}
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

      {/*  <Sky sunPosition={sunPosition} /> */}

      {/* Affichage du modèle */}
      {Object.keys(nodes).map((key) => {
        // Exclure la scène du rendu et les salissures
        if (key === "Scene") {
          return null;
        }
        // Utiliser shouldShowNode pour déterminer si le nœud doit être affiché
        if (!shouldShowNode(key)) {
          return null;
        }
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
          key === "eau_piscine_cote"
        ) {
          return (
            <React.Fragment key={key}>
              <primitive
                key={`${key}-firstChild`}
                object={nodes[key]}
                ref={getRefForKey(key)} // Use the helper function to determine the ref
                visible={
                  key === "eau_piscine" || key === "eau_piscine_cote"
                    ? true
                    : showCoteMeshes
                }
              >
                <shaderMaterial
                  attach="material"
                  ref={
                    key === "eau_exterieur" || key === "eau_piscine"
                      ? waterMaterialRef
                      : waterMaterialSideRef
                  }
                  args={
                    key === "eau_exterieur" || key === "eau_piscine"
                      ? [data]
                      : [data2]
                  }
                />
              </primitive>
            </React.Fragment>
          );
        } else if (
          key === "salon_sol" ||
          key === "cuisine_sol" ||
          key === "sdb_sol" ||
          key === "exterieur_terrain"
        ) {
          return <primitive key={key} object={nodes[key]} receiveShadow />;
        }

        // Cas par défaut pour les autres nœuds
        return (
          <primitive key={key} object={nodes[key]} castShadow receiveShadow />
        );
      })}
    </>
  );
}

export default Scene;
