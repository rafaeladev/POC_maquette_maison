import React, { useRef, useEffect, useState, useMemo } from 'react';

import {
    useGLTF,
    OrbitControls,
    Environment,
    useAnimations,
    shaderMaterial,
    Text,
    Center,
    Stage,
    ContactShadows,
} from '@react-three/drei';

import { useFrame, useLoader, useThree, extend } from '@react-three/fiber';

import * as THREE from 'three';
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

import waterFragmentShaderSide from './shaders/waterSide/fragment.glsl';

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

    const {
        presetValues,
        shadowType,
        shadowOpacity,
        shadowBlur,
        environmentType,
        preset,
        stageIntensity,
    } = useControls('Stage', {
        shadowType: { options: ['contact', 'accumulative'], value: 'contact' },
        shadowOpacity: { value: 0.2, min: 0, max: 1, step: 0.01 },
        shadowBlur: { value: 0, min: 0, max: 10, step: 1 },
        environmentType: {
            options: [
                'sunset',
                'dawn',
                'night',
                'warehouse',
                'city',
                'park',
                'forest',
                'lobby',
                'studio',
            ],
            value: 'sunset',
        },
        preset: {
            options: ['portrait', 'rembrandt', 'upfront', 'soft'],
            value: 'rembrandt',
        },
        stageIntensity: { value: 0.3, min: 0, max: 1, step: 0.01 },
        presetValues: { value: [1, 1, 1], step: 0.1 },
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
    const eauPiscineCote = useRef();
    const eauInterieurCote = useRef();
    const eauExterieurCote = useRef();
    const meshRef = useRef();
    const buttonCube = useRef();
    const materialRef = useRef();

    // Shader material
    const fragmentShader = waterFragmentShader;
    const vertexShader = waterVertexShader;

    const fragmentShaderSide = waterFragmentShaderSide;

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

    const data2 = useMemo(
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
            fragmentShader: fragmentShaderSide,
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
        if (
            eauExterieur.current &&
            eauInterieur.current &&
            eauPiscine.current &&
            eauExterieurCote.current &&
            eauInterieurCote.current &&
            eauPiscineCote.current
        ) {
            eauExterieur.current.material.uniforms.uTime.value = clock.getElapsedTime();
            eauInterieur.current.material.uniforms.uTime.value = clock.getElapsedTime();
            eauPiscine.current.material.uniforms.uTime.value = clock.getElapsedTime();
            eauExterieurCote.current.material.uniforms.uTime.value = clock.getElapsedTime();
            eauInterieurCote.current.material.uniforms.uTime.value = clock.getElapsedTime();
            eauPiscineCote.current.material.uniforms.uTime.value = clock.getElapsedTime();
        }
        // console.log(eauExterieur.current);
    });

    // Animations
    const animationClip = useAnimations(animations, nodes.eau_exterieur);
    const animationsClips = [
        useAnimations(animations, nodes.eau_exterieur),
        useAnimations(animations, nodes.eau_piscine),
        useAnimations(animations, nodes.eau_interieur),
        useAnimations(animations, nodes.eau_interieur_cote),
        useAnimations(animations, nodes.eau_piscine_cote),
        useAnimations(animations, nodes.eau_exterieur_cote),
    ];

    // Animation de l'eau
    useEffect(() => {
        if (props.isWaterMoving && props.isWaterMovingUp) {
            startAnimation('eauExterieur0To80', animationsClips[0]);
            startAnimation('eauPiscine0To80', animationsClips[1]);
            startAnimation('eauInterieur0to80', animationsClips[2]);
            startAnimation('eauInterieurCote0to80', animationsClips[3]);
            startAnimation('eauPiscineCote0To80', animationsClips[4]);
            startAnimation('eauExterieurCote0To80', animationsClips[5]);
            window.setTimeout(() => {
                props.toggleAnimation(false);
                props.toggleScenario(true);
            }, 5000);
        } else if (props.isWaterMoving && !props.isWaterMovingUp) {
            startAnimation('eauExterieur0To80', animationsClips[0], true);
            startAnimation('eauPiscine0To80', animationsClips[1], true);
            startAnimation('eauInterieur0to80', animationsClips[2], true);
            startAnimation('eauInterieurCote0to80', animationsClips[3], true);
            startAnimation('eauPiscineCote0To80', animationsClips[4], true);
            startAnimation('eauExterieurCote0To80', animationsClips[5], true);
            window.setTimeout(() => {
                props.toggleAnimation(false);
                props.toggleScenario(false);
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
        // Check if the button is supposed to say "Reset"

        if (props.isScenarioChanged && !props.isWaterMovingUp && !props.isWaterMoving) {
            // Call a different function when the button says "Reset"
            props.handleReset(); // Assuming `handleReset` is the function you want to call
        } else {
            props.toggleAnimation(true);
            props.toggleWaterMovingUp(!props.isWaterMovingUp);
        }
    };

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (nodes && Object.keys(nodes).length > 0 && animations) {
            setIsLoaded(true);
        }
    }, [nodes, animations]);

    if (!isLoaded) {
        return;
    }

    // Helper function to get the correct ref based on the key
    function getRefForKey(key) {
        switch (key) {
            case 'eau_exterieur':
                return eauExterieur;
            case 'eau_exterieur_cote':
                return eauExterieurCote;
            case 'eau_piscine':
                return eauPiscine;
            case 'eau_piscine_cote':
                return eauPiscineCote;
            case 'eau_interieur':
                return eauInterieur;
            case 'eau_interieur_cote':
                return eauInterieurCote;
            default:
                return null; // Default case if none matches
        }
    }

    return (
        <>
            <color
                args={['#241B27']}
                attach='background'
            />

            <OrbitControls makeDefault />

            <Stage
                shadows={{ type: shadowType, opacity: shadowOpacity, blur: shadowBlur }}
                environment={environmentType}
                preset={preset}
                intensity={stageIntensity}
            >
                {/* Affichage du modèle */}
                {Object.keys(nodes).map((key) => {
                    // Exclure la scène du rendu
                    if (key === 'Scene') {
                        return null;
                    }

                    // Gérer les cas spéciaux d'eau
                    // Inside your component's return statement

                    if (
                        key === 'eau_exterieur' ||
                        key === 'eau_piscine' ||
                        key === 'eau_interieur' ||
                        key === 'eau_exterieur_cote' ||
                        key === 'eau_piscine_cote' ||
                        key === 'eau_interieur_cote'
                    ) {
                        return (
                            <React.Fragment key={key}>
                                <primitive
                                    key={`${key}-firstChild`}
                                    object={nodes[key]}
                                    ref={getRefForKey(key)} // Use the helper function to determine the ref
                                >
                                    <shaderMaterial
                                        attach='material'
                                        args={
                                            key === 'eau_exterieur' ||
                                            key === 'eau_piscine' ||
                                            key === 'eau_interieur'
                                                ? [data]
                                                : [data2]
                                        }
                                    />
                                </primitive>
                            </React.Fragment>
                        );
                    }

                    // Render logic for other keys, if any

                    // Cas par défaut pour les autres nœuds
                    return (
                        <primitive
                            key={key}
                            object={nodes[key]}
                            castShadow
                            receiveShadow
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
            </Stage>
        </>
    );
}

export default Scene;
