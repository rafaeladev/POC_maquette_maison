// Import pour l'animation
import { useRef } from 'react';

// Helpers de Drei pour la scene
import {
    shaderMaterial,
    Sparkles,
    Center,
    useTexture,
    useGLTF,
    OrbitControls,
    Environment,
    Text,
} from '@react-three/drei';

// Import des shaders
// import portalVertexShader from './shaders/portal/vertex.glsl';
// import portalFragmentShader from './shaders/portal/fragment.glsl';

// Import pour avoir les couleurs de THREE.js
import * as THREE from 'three';
import { useState } from 'react';

// import des fonctionnalités React pour Three (donc issues de react three fiber)
import { extend, useFrame } from '@react-three/fiber';
import ArTest from './ar';

export default function Experience() {
    const [isMoving, setIsMoving] = useState(false);
    const [targetHeight, setTargetHeight] = useState(1);
    const model = useGLTF('./model/POC_Maquette.glb');
    // console.log(model);

    // Model
    const { nodes, materials } = useGLTF('./model/POC_Maquette_v2.glb');
    // console.log(nodes);
    // console.log(nodes.Eau_interieur.position);

    const eau_int = useRef();
    const buttonCube = useRef();

    const restart = () => {
        console.log('restart');
        setIsMoving(true);
        setTargetHeight(targetHeight === 1 ? 0 : 1);
    };

    useFrame((state) => {
        if (isMoving) {
            const currentY = eau_int.current.position.y;
            const deltaY = (targetHeight - currentY) * 0.1; // Vitesse de déplacement

            if (Math.abs(deltaY) < 0.001) {
                setIsMoving(false);
            } else {
                eau_int.current.position.y += deltaY;
            }
        }
    });

    const handlePress = () => {
        buttonCube.current.position.y -= 0.1; // Déplace le bouton vers le bas lorsque pressé
    };

    const handleRelease = () => {
        buttonCube.current.position.y += 0.1; // Remet le bouton à sa position initiale lorsque relâché
        restart(); // Démarre l'animation lorsque le bouton est relâché
    };

    return (
        <>
            <Environment
                path='/envMap/'
                files='potsdamer_platz_256.hdr'
            />
            <color
                args={['#241B27']}
                attach='background'
            />
            <OrbitControls makeDefault />
            <directionalLight
                castShadow
                position={[1, 2, 3]}
                intensity={0.2}
                shadow-normalBias={0.04}
            />
            <ambientLight intensity={0.1} />
            <Center>
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
                        document.body.style.cursor = 'pointer';
                    }}
                    onPointerLeave={() => {
                        document.body.style.cursor = 'default';
                    }}
                >
                    <boxGeometry args={[1, 0.5, 2]} />
                    <meshStandardMaterial color='purple' />
                </mesh>
                {/* Terrain */}
                <mesh
                    geometry={nodes.Terrain.children[0].geometry}
                    material={materials.terre}
                    receiveShadow
                ></mesh>
                <mesh
                    geometry={nodes.Terrain.children[1].geometry}
                    material={materials.herbe}
                    receiveShadow
                ></mesh>
                <mesh
                    geometry={nodes.Terrain.children[2].geometry}
                    material={materials.carrelage_jaune}
                    receiveShadow
                ></mesh>
                <mesh
                    geometry={nodes.Terrain.children[3].geometry}
                    material={materials.beton}
                    receiveShadow
                ></mesh>
                <mesh
                    geometry={nodes.Terrain.children[4].geometry}
                    material={materials.sol_salon}
                    receiveShadow
                ></mesh>
                <mesh
                    geometry={nodes.Terrain.children[5].geometry}
                    material={materials.sol_cuisine}
                    receiveShadow
                ></mesh>
                <mesh
                    geometry={nodes.Terrain.children[6].geometry}
                    material={materials.sol_sdb}
                    receiveShadow
                ></mesh>
                <mesh
                    geometry={nodes.Terrain.children[7].geometry}
                    material={materials.defaut}
                    receiveShadow
                ></mesh>
                {/* Murs */}
                <mesh
                    geometry={nodes.Murs.children[0].geometry}
                    material={materials.Mur}
                ></mesh>
                <mesh
                    geometry={nodes.Murs.children[1].geometry}
                    material={materials.Decoupe}
                ></mesh>
                {/* Cloisons */}
                <mesh
                    geometry={nodes.Cloisons.children[0].geometry}
                    material={materials.Mur}
                    castShadow
                ></mesh>
                <mesh
                    geometry={nodes.Cloisons.children[1].geometry}
                    material={materials.Decoupe}
                ></mesh>
                {/* canapé */}
                <mesh
                    geometry={nodes.Canape.geometry}
                    material={materials.Canape}
                ></mesh>

                {/* Eau */}
                <mesh
                    ref={eau_int}
                    geometry={nodes.Eau_exterieur.geometry}
                    material={materials.Eau}
                >
                    <meshStandardMaterial
                        transparent={true}
                        opacity={0.8}
                        color='skyblue'
                    />
                </mesh>
                <mesh
                    geometry={nodes.Eau_interieur.geometry}
                    material={materials.Eau}
                >
                    <meshStandardMaterial
                        transparent={true}
                        opacity={0.8}
                        color='skyblue'
                    />
                </mesh>
            </Center>
        </>
    );
}
