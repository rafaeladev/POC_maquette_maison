import React, { useMemo, useRef, useEffect, useState, Suspense } from "react";
import {
  useGLTF,
  OrbitControls,
  Environment,
  useAnimations,
  useHelper,
  SoftShadows,
  BakeShadows,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { useControls } from "leva";

import { startAnimation } from "../utils/WaterAnimation";

import waterVertexShader from "../shaders/water/vertex.glsl";
import waterFragmentShader from "../shaders/water/fragment.glsl";

import * as THREE from "three";

function Cuisine(props) {
  const controls = useRef();
  // Model
  const { nodes, animations } = useGLTF("./model/cuisine/POC_cuisine.glb");

  // ------------ Leva UI ------------ //
  const { cameraX, cameraY, cameraZ, cameraFov, cameraNear, cameraFar } =
    useControls("Camera", {
      cameraX: { value: 6.2, step: 0.1, label: "Camera X" },
      cameraY: { value: 2, step: 0.1, label: "Camera Y" },
      cameraZ: { value: 4.2, step: 0.1, label: "Camera Z" },
      cameraFov: { value: 40, step: 1, label: "FOV" },
      cameraNear: { value: 1.4, step: 0.1, label: "Near" },
      cameraFar: { value: 200, step: 1, label: "Far" },
    });

  // const maquettePosition = useControls({
  //     x: { value: -4.9, step: 0.1, label: 'X' },
  //     y: { value: -0.2, step: 0.1, label: 'Y' },
  //     z: { value: 1.1, step: 0.1, label: 'Z' },
  // });

  const orbitControls = useControls("Orbit Controls", {
    // enable: true,
    // enableDamping: true,
    // dampingFactor: 0.25,
    enableZoom: true,
    enableRotate: true,
    // enablePan: true,
    autoRotate: false,
    autoRotateSpeed: 0.5,
    // enableKeys: true,
    // enableZoomSpeed: 1,
    // enableRotateSpeed: 1,
    // enablePanSpeed: 1,
    // zoomSpeed: 1,
    // rotateSpeed: 1,
    // panSpeed: 1,
    // minPolarAngle: 0,
    // maxPolarAngle: Math.PI,
    // minAzimuthAngle: -Infinity,
    // maxAzimuthAngle: Infinity,
    minDistance: -10,
    maxDistance: 5,
    // damping: 0.25,
    // screenSpacePanning: true,
    // keyPanSpeed: 7,
    // dynamicDampingFactor: 0.2,
    target: [5.5, 1, 0.2],
    // position: [2.6, 1.6, 4.2],
  });

  // Approche n°1 avec shaderMaterial
  const {
    uBigWavesElevation,
    uBigWavesFrequencyX,
    uBigWavesFrequencyY,
    uBigWavesSpeed,
  } = useControls("Big Waves", {
    uBigWavesElevation: { value: 0.02, min: 0, max: 1, step: 0.001 },
    uBigWavesFrequencyX: { value: 2.5, min: 0, max: 10, step: 0.001 },
    uBigWavesFrequencyY: { value: 2.5, min: 0, max: 10, step: 0.001 },
    uBigWavesSpeed: { value: 1.72, min: 0, max: 4, step: 0.001 },
  });

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

  const { depthColor, surfaceColor, uColorOffset, uColorMultiplier } =
    useControls("Waves colors", {
      depthColor: "#5e98ba",
      surfaceColor: "#c1def5",
      uColor: { value: 0.08, min: 0, max: 1, step: 0.001 },
      uColorMultiplier: { value: 5, min: 0, max: 10, step: 0.001 },
    });

  // Camera
  const { camera } = useThree();

  // tick function for camera
  /*   useFrame((state) => {
    // Update camera position based on Leva controls
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.updateProjectionMatrix();
  }); */

  // Shader material
  const fragmentShader = waterFragmentShader;
  const vertexShader = waterVertexShader;

  const data = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: uBigWavesElevation },
        uBigWavesFrequency: {
          value: new THREE.Vector2(uBigWavesFrequencyX, uBigWavesFrequencyY),
        },
        uBigWavesSpeed: { value: uBigWavesSpeed },
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
      uBigWavesElevation,
      uBigWavesFrequencyX,
      uBigWavesFrequencyY,
      uBigWavesSpeed,
      uSmallWavesElevation,
      uSmallWavesFrequency,
      uSmallWavesSpeed,
      uSmallIterations,
      depthColor,
      surfaceColor,
    ]
  );

  //0 receiveShadow, 1 castShadow, 2 receiveShadow et castShadow
  const objetInchangeables = [
    { nom: "Murs", shadow: 2 },
    { nom: "Sol_salon", shadow: 0 },
    { nom: "Sol_sdb", shadow: 0 },
    { nom: "Cloisons", shadow: 2 },
    { nom: "Piscine", shadow: 0 },
    { nom: "Terrain", shadow: 0 },
    { nom: "Bordure_maquette", shadow: 0 },
    { nom: "cuisine_frigo_intact_1", shadow: 0 },
    { nom: "cuisine_frigo_intact_2", shadow: 0 },
  ];

  const objetAbimes = [
    { nom: "cuisine_plan_de_travail_abime", shadow: 1 },
    { nom: "cuisine_frigo_porte_abime", shadow: 1 },
    { nom: "cuisine_table_et_chaises_abime", shadow: 1 },
    { nom: "cuisine_sol_abime", shadow: 0 },
    { nom: "Salissure_interieure", shadow: 0 },
  ];

  const eauMesh = ["Eau_interieur", "Eau_exterieur", "Eau_piscine"];

  // Fonction pour ajouter les enfants d'un objet à la liste des objets abîmés si l'objet est un groupe
  const ajouterEnfantsSiGroupe = (item, nodes) => {
    if (nodes[item.nom] && nodes[item.nom].children) {
      nodes[item.nom].children.forEach((child) => {
        // Vérifiez si l'enfant est déjà inclus pour éviter les doublons
        if (!objetAbimes.some((e) => e.nom === child.name)) {
          objetAbimes.push({ nom: child.name, shadow: item.shadow }); // Assumer le même état d'ombre que le parent
          ajouterEnfantsSiGroupe(
            { nom: child.name, shadow: item.shadow },
            nodes
          );
        }
      });
    }
  };

  // Ajouter les enfants des objets abîmés
  objetAbimes.forEach((item) => {
    ajouterEnfantsSiGroupe(item, nodes);
  });

  objetInchangeables.forEach((item) => {
    ajouterEnfantsSiGroupe(item, nodes);
  });

  // Array d'objets qui ne sont pas abîmés pour afficher scénario default
  const objetsPasAbimes = Object.keys(nodes).filter(
    (key) =>
      !objetAbimes.some((item) => item.nom === key) &&
      !objetInchangeables.some((item) => item.nom === key)
  );

  /*   // Array d'objets qui sont des mesh d'eau
  const eauArray = Object.keys(nodes).filter((key) => eauMesh.includes(key)); */

  const objetsInchangeables = useMemo(() => {
    return objetInchangeables.map((item, index) => {
      return (
        <primitive
          key={`${item.nom}-${index}`}
          object={nodes[item.nom]}
          castShadow={
            item.shadow === 1 ? true : item.shadow === 2 ? true : false
          }
          receiveShadow={
            item.shadow === 0 ? true : item.shadow === 2 ? true : false
          }
        />
      );
      /* } */
    });
  }, [nodes, objetInchangeables]);

  // Ref
  const eauPiscine = useRef();
  const eauInterieur = useRef();
  const eauExterieur = useRef();
  const tableRef = useRef();
  const directionalLight = useRef();
  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  const objetsScene = useMemo(() => {
    return objetsPasAbimes.map((key, index) => {
      if (key === "Scene") {
        return;
      }

      if (
        key === "Eau_exterieur" ||
        key === "Eau_piscine" ||
        key === "Eau_interieur"
      ) {
        return (
          <primitive
            key={`${key}-${index}`}
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
      } else if (key === "Eau_evier_cuisine") {
        return (
          <primitive
            key={`${key}-${index}`}
            object={nodes[key]}
            visible={false}
          />
        );
      }
      if (!props.isScenarioChanged) {
        if (key === "cuisine_sol_intact") {
          return (
            <primitive
              key={`${key}-${index}`}
              object={nodes[key]}
              receiveShadow
            />
          ); //receiveShadow
        } else {
          return (
            <primitive
              key={`${key}-${index}`}
              object={nodes[key]}
              castShadow
            ></primitive>
          );
        }
      } else {
        return objetAbimes.map((key, index) => {
          console.log(key.nom, nodes[key.nom]);
          console.log(
            <primitive
              key={`${key}-${index}`}
              object={nodes[key.nom]}
              castShadow={
                key.shadow === 1 ? true : key.shadow === 2 ? true : false
              }
              receiveShadow={
                key.shadow === 0 ? true : key.shadow === 2 ? true : false
              }
            />
          );
          return (
            <primitive
              key={`${key}-${index}`}
              object={nodes[key.nom]}
              castShadow={
                key.shadow === 1 ? true : key.shadow === 2 ? true : false
              }
              receiveShadow={
                key.shadow === 0 ? true : key.shadow === 2 ? true : false
              }
            />
          ); //receiveShadow
          /*    console.log(key, nodes[key]); */
        });
      }
    });
  }, [objetsPasAbimes, nodes]);

  // Animation niveau d'eau
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);
  const toggleIsAnimationEnd = () => {
    setIsAnimationEnd((prev) => !prev);
  };

  const animationsClips = [
    useAnimations(animations, nodes.Eau_exterieur),
    useAnimations(animations, nodes.Eau_piscine),
    useAnimations(animations, nodes.Eau_interieur),
  ];

  useEffect(() => {
    if (props.isWaterMoving && props.isWaterMovingUp) {
      /* console.log("Animation démarrée", props.isWaterMoving); */
      startAnimation("eauExterieur0To80", animationsClips[0]);
      startAnimation("eauPiscine0To80", animationsClips[1]);
      startAnimation("eauInterieur0to80", animationsClips[2]);
      window.setTimeout(() => {
        props.toggleScenario(true);
        props.toggleAnimation(false);

        setIsAnimationEnd(true);
      }, 5000);
    } else if (props.isWaterMoving && !props.isWaterMovingUp) {
      startAnimation("eauExterieur0To80", animationsClips[0], true);
      startAnimation("eauPiscine0To80", animationsClips[1], true);
      startAnimation("eauInterieur0to80", animationsClips[2], true);
      window.setTimeout(() => {
        props.toggleAnimation(false);
        setIsAnimationEnd(true);
      }, 5000);
    }
    // } else if (!props.isWaterMoving && props.isScenarioChanged) {
    //     console.log('je suis la');
    //     props.toggleScenario(false);
    // }
  }, [props.isWaterMoving]);

  useFrame(({ clock }) => {
    /*  eauExterieur.current.material.uniforms.uTime.value = clock.getElapsedTime();
    eauInterieur.current.material.uniforms.uTime.value = clock.getElapsedTime();*/
    eauPiscine.current.material.uniforms.uTime.value = clock.getElapsedTime();
    /*  console.log(tableRef.current); */
    // if (isAnimationEnd === true) {
    //   eauExterieur.current.visible = false;
    //   eauInterieur.current.visible = false;
    //   eauPiscine.current.visible = false;
    // }
  });
  const {
    dLightPosition,
    dLightIntensity,
    shadowNear,
    shadowFar,
    shadowTop,
    shadowRight,
    shadowBottom,
    shadowLeft,
  } = useControls("Directional Light", {
    dLightPosition: { value: [13.5, 5.5, 1.6], step: 0.1 },
    dLightIntensity: { value: 0.5, step: 0.1 },
    shadowNear: { value: 1, step: 0.1 },
    shadowFar: { value: 10, step: 0.1 },
    shadowTop: { value: 5, step: 0.1 },
    shadowRight: { value: 5, step: 0.1 },
    shadowBottom: { value: -5, step: 0.1 },
    shadowLeft: { value: -5, step: 0.1 },
  });

  return (
    <>
      {/*    <Environment path="/envMap/" files="potsdamer_platz_256.hdr" castShadow /> */}
      <directionalLight
        ref={directionalLight}
        position={dLightPosition}
        intensity={dLightIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      {/*     <AccumulativeShadows
        position={[2, 0.01, 0]}
        scale={15}
        opacity={0.8}
        frames={100}
        temporal
      >
           <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={3}
          position={dLightPosition}
        /> 
      </AccumulativeShadows> */}
      <color args={["#241B27"]} attach="background" />
      <OrbitControls makeDefault />
      {/*    <BakeShadows /> */}
      {/*  <SoftShadows size={25} samples={10} focus={0} /> */}
      {/*   <OrbitControls
        ref={controls}
        enableZoom={orbitControls.enableZoom}
        enableRotate={orbitControls.enableRotate}
        autoRotate={orbitControls.autoRotate}
        autoRotateSpeed={orbitControls.autoRotateSpeed}
        minDistance={orbitControls.minDistance}
        maxDistance={orbitControls.maxDistance}
        target={orbitControls.target}
      /> */}
      {/* <PresentationControls
                enabled={true} // the controls can be disabled by setting this to false
                global={false} // Spin globally or by dragging the model
                cursor={true} // Whether to toggle cursor style on drag
                snap={{ mass: 4, tension: 400 }} // Snap-back to center (can also be a spring config)
                speed={1} // Speed factor
                zoom={1} // Zoom factor when half the polar-max is reached
                rotation={[0, 0, 0]} // Default rotation
                polar={[0, Math.PI / 2]} // Vertical limits
                azimuth={[-Infinity, Infinity]} // Horizontal limits
                config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
            > */}

      {objetsInchangeables}

      {objetsScene}

      {/* </PresentationControls> */}
    </>
  );
}

export default Cuisine;
