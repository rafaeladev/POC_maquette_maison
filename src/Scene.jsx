// Code source du composant Scene
// Ce composant est responsable de l'affichage de la scène 3D

// imports React
import React, { useRef, useEffect, useState, useMemo } from 'react';

// imports drei
import { OrbitControls, Environment, useAnimations, Text, Stage } from '@react-three/drei';

// imports React Three Fiber
import { useFrame, useLoader } from '@react-three/fiber';

// imports Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// imports des shaders
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';
import waterFragmentShaderSide from './shaders/waterSide/fragment.glsl';

// imports des composants
import { useControls } from 'leva';

// imports des utils .js
import { startAnimation } from './utils/WaterAnimation.js';
// import { useTextures } from './utils/textureLoader.js';
import { loadTextures } from './utils/textureLoader.js';
import textures from './data/textures.json';

// Approche  n°2 avec Water from three-stdlib
import Ocean from './Ocean.jsx';

const applyMaterial = (node, loadedTextures) => {
    const materialOptions = {
        map: loadedTextures.colorMap || null,
        normalMap: loadedTextures.normalMap || null,
        roughnessMap: loadedTextures.roughnessMap || null,
    };

    if (materialOptions.normalMap) {
        materialOptions.normalMap.wrapS = THREE.RepeatWrapping;
        materialOptions.normalMap.wrapT = THREE.RepeatWrapping;
    }

    materialOptions.map.wrapS = THREE.RepeatWrapping;
    materialOptions.map.wrapT = THREE.RepeatWrapping;

    materialOptions.roughnessMap.wrapS = THREE.RepeatWrapping;
    materialOptions.roughnessMap.wrapT = THREE.RepeatWrapping;

    node.material = new THREE.MeshStandardMaterial(materialOptions);
};

function Scene(props) {
    // ---  Debug controls --- //

    // Approche n°1 avec shaderMaterial
    const { Elevation, FrequencyX, FrequencyY, Speed } = useControls('Big Waves', {
        Elevation: { value: 0.02, min: 0, max: 1, step: 0.001 },
        FrequencyX: { value: 2.5, min: 0, max: 10, step: 0.001 },
        FrequencyY: { value: 2.5, min: 0, max: 10, step: 0.001 },
        Speed: { value: 1.72, min: 0, max: 4, step: 0.001 },
    });

    const { uSmallWavesElevation, uSmallWavesFrequency, uSmallWavesSpeed, uSmallIterations } =
        useControls('Small Waves', {
            uSmallWavesElevation: { value: 0.07, min: 0, max: 1, step: 0.001 },
            uSmallWavesFrequency: { value: 2.43, min: 0, max: 30, step: 0.001 },
            uSmallWavesSpeed: { value: 0.97, min: 0, max: 4, step: 0.001 },
            uSmallIterations: { value: 1, min: 0, max: 5, step: 1 },
        });

    const { depthColor, surfaceColor, uColorOffset, uColorMultiplier, uOpacity } = useControls(
        'Waves colors',
        {
            depthColor: '#5e98ba',
            surfaceColor: '#c1def5',
            uColorOffset: { value: 0.08, min: 0, max: 1, step: 0.001 },
            uColorMultiplier: { value: 5, min: 0, max: 10, step: 0.001 },
            uOpacity: { value: 0.2, min: 0, max: 1, step: 0.01 },
        }
    );

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

    const orbitControls = useControls('Orbit Controls', {
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

    // ---  Debug controls --- //

    // --- Model --- //
    const { nodes, animations } = useLoader(GLTFLoader, './model/Maquette_v4.glb');

    const [texturesLoaded, setTexturesLoaded] = useState(false);

    useEffect(() => {
        const loadAllTextures = async () => {
            const promises = Object.keys(nodes).map(async (key) => {
                const node = nodes[key];

                if (node && node.material) {
                    const materialName = node.material.name;
                    console.log(materialName);
                    if (materialName && textures.materials[materialName]) {
                        try {
                            const loadedTextures = await loadTextures(materialName);
                            applyMaterial(node, loadedTextures);
                        } catch (error) {
                            console.error(
                                `Failed to load textures for material ${materialName}:`,
                                error
                            );
                        }
                    }
                }
            });

            await Promise.all(promises);
            setTexturesLoaded(true);
        };

        loadAllTextures();
    }, [nodes]);

    // Ref
    const eauPiscine = useRef();
    const eauInterieur = useRef();
    const eauExterieur = useRef();
    const eauPiscineCote = useRef();
    const eauInterieurCote = useRef();
    const eauExterieurCote = useRef();
    const buttonCube = useRef();

    // --- Model --- //

    // --- Textures --- //

    // --- Textures --- //

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
    const cameraPosition = new THREE.Vector3((5, 2, -2));
    const cameraTarget = new THREE.Vector3((10, 5, 0));

    // --- Camera --- //

    // --- Animation de l'eau --- //
    // Animation du shader material
    useFrame(({ camera, clock }) => {
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
        /*    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget); */
    });

    // Animations montée de l'eau
    const [showCoteMeshes, setShowCoteMeshes] = useState(false);

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
        // Ne procéder que si isWaterMoving est true pour éviter les déclenchements inutiles.
        if (!props.isWaterMoving) return;

        // Afficher les côtes de l'eau qui sont cachées par défaut
        setShowCoteMeshes(true);

        // Déterminer si l'animation doit être inversée en fonction de isWaterMovingUp
        const reverse = !props.isWaterMovingUp;

        // Démarrer toutes les animations
        const animationNames = [
            'eauExterieur0To80',
            'eauPiscine0To80',
            'eauInterieur0to80',
            'eauInterieurCote0to80',
            'eauPiscineCote0To80',
            'eauExterieurCote0To80',
        ];

        animationNames.forEach((name, index) => {
            startAnimation(name, animationsClips[index], reverse);
        });

        // Définir un timeout pour mettre à jour l'état après 5 secondes
        const timeoutId = window.setTimeout(() => {
            props.toggleAnimation(false);
            props.toggleScenario(!reverse);
            if (reverse) {
                setShowCoteMeshes(false);
            }
        }, 5000);

        // Cleanup function pour clear le timeout si le composant est démonté
        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        props.isWaterMoving,
        props.isWaterMovingUp,
        props.toggleAnimation,
        props.toggleScenario,
        animationsClips,
    ]);

    // Fonction pour gérer le clic sur le bouton
    const handlePress = () => {
        buttonCube.current.position.y -= 0.1;
    };

    const handleRelease = () => {
        buttonCube.current.position.y += 0.1;
    };

    const restart = () => {
        // Vérifier si le scénario a changé et si l'eau ne monte pas ou ne descend pas
        if (props.isScenarioChanged && !props.isWaterMovingUp && !props.isWaterMoving) {
            // Réinitialiser le scénario
            props.handleReset();
        } else {
            props.toggleAnimation(true);
            props.toggleWaterMovingUp(!props.isWaterMovingUp);
        }
    };

    // --- Animation de l'eau --- //

    // --- Loading des objets --- //
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (nodes && Object.keys(nodes).length > 0 && animations) {
            setIsLoaded(true);
        }
    }, [nodes, animations]);

    if (!isLoaded) {
        return;
    }

    // Function d'aide pour obtenir la référence pour un certain clé
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
                return null; // Case de défaut
        }
    }
    // --- Loading des objets --- //

    return (
        <>
            <color
                args={['#241B27']}
                attach='background'
            />
            <OrbitControls
            /*   enableZoom={orbitControls.enableZoom}
        enableRotate={orbitControls.enableRotate}
        autoRotate={orbitControls.autoRotate}
        autoRotateSpeed={orbitControls.autoRotateSpeed}
        minDistance={orbitControls.minDistance}
        maxDistance={orbitControls.maxDistance}
        target={orbitControls.target} */
            />

            {/* <Stage
                shadows={{ type: shadowType, opacity: shadowOpacity, blur: shadowBlur }}
                environment={environmentType}
                preset={preset}
                intensity={stageIntensity}
            > */}
            {/* Affichage du modèle */}
            {Object.keys(nodes).map((key) => {
                // Exclure la scène du rendu et les salissures
                if (
                    key === 'Scene' ||
                    key === 'structure_salissure_interieure' ||
                    key === 'structure_salissure_exterieure'
                ) {
                    return null;
                }

                // Gérer les cas spéciaux d'eau
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
                                visible={
                                    key === 'eau_piscine' || key === 'eau_piscine_cote'
                                        ? true
                                        : showCoteMeshes
                                }
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

            {/* Texte bouton */}
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

            {/* Cube */}
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
            {/* </Stage> */}
        </>
    );
}

export default Scene;
