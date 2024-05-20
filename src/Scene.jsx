import React, { useRef, useEffect, useState, useMemo } from 'react';

import {
    useGLTF,
    OrbitControls,
    Environment,
    useAnimations,
    shaderMaterial,
    Text,
    Center,
} from '@react-three/drei';

import { LoopOnce, Mesh } from 'three';

import { useFrame, useLoader, useThree, extend } from '@react-three/fiber';

import * as THREE from 'three';
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

import { useControls } from 'leva';

import { startAnimation } from './utils/WaterAnimation.js';

// Approche  n°2 avec Water from three-stdlib
import Ocean from './Ocean.jsx';

function Scene(props) {
    // Debug controls
    const { depthColor, surfaceColor } = useControls({
        depthColor: '#5e98ba',
        surfaceColor: '#c1def5',
    });

    // Approche n°1 avec shaderMaterial
    const {
        uBigWavesElevation,
        uBigWavesFrequencyX,
        uBigWavesFrequencyY,
        uBigWavesSpeed,
        uSmallWavesElevation,
        uSmallWavesFrequency,
        uSmallWavesSpeed,
        uSmallIterations,
        uColorOffset,
        uColorMultiplier,
    } = useControls({
        uBigWavesElevation: { value: 0.02, min: 0, max: 1, step: 0.001 },
        uBigWavesFrequencyX: { value: 2.5, min: 0, max: 10, step: 0.001 },
        uBigWavesFrequencyY: { value: 2.5, min: 0, max: 10, step: 0.001 },
        uBigWavesSpeed: { value: 1.72, min: 0, max: 4, step: 0.001 },

        uSmallWavesElevation: { value: 0.07, min: 0, max: 1, step: 0.001 },
        uSmallWavesFrequency: { value: 2.43, min: 0, max: 30, step: 0.001 },
        uSmallWavesSpeed: { value: 0.97, min: 0, max: 4, step: 0.001 },
        uSmallIterations: { value: 1, min: 0, max: 5, step: 1 },
        uColorOffset: { value: 0.08, min: 0, max: 1, step: 0.001 },
        uColorMultiplier: { value: 5, min: 0, max: 10, step: 0.001 },
    });

    const { position, rotation } = useControls('Text', {
        position: { value: [-5.53, -2.27, 0], step: 0.01 },
        rotation: { value: [4.71, 0, 4.7], step: 0.01 },
    });

    // States
    const [isMoving, setIsMoving] = useState(false);
    /*   const [isLoaded, setIsLoaded] = useState(false); */

    // Model
    // const scene = useGLTF('./model/POC_Maquette_v2.glb');
    const { nodes, animations } = useGLTF('./model/Maquette_v1.glb');

    // Ref
    const eauPiscine = useRef();
    const eauInterieur = useRef();
    const eauExterieur = useRef();
    const meshRef = useRef();
    const buttonCube = useRef();
    const materialRef = useRef();

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

    // Animation de l'eau
    useFrame(({ clock }) => {
        eauExterieur.current.material.uniforms.uTime.value = clock.getElapsedTime();
        eauInterieur.current.material.uniforms.uTime.value = clock.getElapsedTime();
        eauPiscine.current.material.uniforms.uTime.value = clock.getElapsedTime();
    });

    // Animations
    const animationClip = useAnimations(animations, nodes.eau_exterieur);
    const animationsClips = [
        useAnimations(animations, nodes.eau_exterieur),
        useAnimations(animations, nodes.eau_piscine),
        useAnimations(animations, nodes.eau_interieur),
    ];

    // Animation de l'eau
    useEffect(() => {
        if (props.isWaterMoving && props.isWaterMovingUp) {
            startAnimation('eauExterieur0To80', animationsClips[0]);
            startAnimation('eauPiscine0To80', animationsClips[1]);
            startAnimation('eauInterieur0to80', animationsClips[2]);
            window.setTimeout(() => {
                props.toggleAnimation(false);
            }, 5000);
        } else if (props.isWaterMoving && !props.isWaterMovingUp) {
            startAnimation('eauExterieur0To80', animationsClips[0], true);
            startAnimation('eauPiscine0To80', animationsClips[1], true);
            startAnimation('eauInterieur0to80', animationsClips[2], true);
            window.setTimeout(() => {
                props.toggleAnimation(false);
            }, 5000);
        }
    }, [props.isWaterMoving]);

    // Fonction pour gérer le clic sur le bouton
    const handlePress = () => {
        buttonCube.current.position.y -= 0.1;
    };

    const handleRelease = () => {
        buttonCube.current.position.y += 0.1;
    };

    const restart = () => {
        if (props.isWaterMovingUp) {
            props.toggleWaterMovingUp(false);
        } else {
            props.toggleWaterMovingUp(true);
        }
        props.toggleAnimation(true);
    };

    return (
        <>
            {/* Environnement */}
            <Environment
                path='/envMap/'
                files='potsdamer_platz_256.hdr'
            />

            <color
                args={['#241B27']}
                attach='background'
            />

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
                if (key === 'eau_exterieur' || key === 'eau_piscine' || key === 'eau_interieur') {
                    // nodes[key].material.transparent = true;
                    // nodes[key].material.opacity = 0.8;
                    return (
                        // Approche  n°2 avec Water from three-stdlib
                        // <mesh
                        //     key={key}
                        //     ref={
                        //         key === 'Eau_exterieur'
                        //             ? eauExterieur
                        //             : key === 'Eau_interieur'
                        //             ? eauInterieur
                        //             : eauPiscine
                        //     }
                        // >
                        //     <Ocean
                        //         key={key}
                        //         nodes={nodes[key]}
                        //         isMoving={isMoving}
                        //         setIsMoving={setIsMoving}
                        //     />
                        // </mesh>

                        // Shader material n°1
                        <primitive
                            key={key}
                            object={nodes[key]}
                            ref={
                                key === 'eau_exterieur'
                                    ? eauExterieur
                                    : key === 'eau_interieur'
                                    ? eauInterieur
                                    : eauPiscine
                            }
                        >
                            <shaderMaterial
                                attach='material'
                                args={[data]}
                            />
                        </primitive>

                        // <primitive key={key} object={nodes[key]} />
                    );
                } else if (key === 'Scene') {
                    return null;
                }
                return (
                    <primitive
                        key={key}
                        object={nodes[key]}
                    />
                );
            })}

            <Text
                font='./fonts/OpenSans-Regular.woff'
                fontSize={0.2}
                position={position}
                rotation={rotation}
                maxWidth={1.6}
                color='white'
                textAlign='center'
            >
                Click to start water animation
            </Text>

            {/*  Cube */}
            <mesh
                ref={buttonCube}
                position-x={-5.5}
                position-y={-2.55}
                scale={1}
                onClick={restart}
                onPointerDown={handlePress} // Appelé lorsque le bouton est pressé
                onPointerUp={handleRelease} // Appelé lorsque le bouton est relâché
                onPointerEnter={() => {
                    document.body.style.cursor = 'pointer';
                }}
                onPointerLeave={() => {
                    document.body.style.cursor = 'default';
                }}
            >
                <boxGeometry args={[1, 0.5, 2]} />
                <meshStandardMaterial color='purple' />
            </mesh>
        </>
    );
}

export default Scene;
