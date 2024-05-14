import React, { useMemo, useRef } from 'react';
import { useGLTF, OrbitControls, Environment, PresentationControls } from '@react-three/drei';
import { useFrame, useThree, useLoader } from '@react-three/fiber';

import { useControls } from 'leva';

import { TextureLoader } from 'three';

function Cuisine() {
    const controls = useRef();
    // Model
    const { nodes, animations } = useGLTF('./model/cuisine/POC_cuisine.glb');

    // ------------ Leva UI ------------ //
    const { cameraX, cameraY, cameraZ, cameraFov, cameraNear, cameraFar } = useControls('Camera', {
        cameraX: { value: 6.2, step: 0.1, label: 'Camera X' },
        cameraY: { value: 2, step: 0.1, label: 'Camera Y' },
        cameraZ: { value: 4.2, step: 0.1, label: 'Camera Z' },
        cameraFov: { value: 40, step: 1, label: 'FOV' },
        cameraNear: { value: 1.4, step: 0.1, label: 'Near' },
        cameraFar: { value: 200, step: 1, label: 'Far' },
    });

    // const maquettePosition = useControls({
    //     x: { value: -4.9, step: 0.1, label: 'X' },
    //     y: { value: -0.2, step: 0.1, label: 'Y' },
    //     z: { value: 1.1, step: 0.1, label: 'Z' },
    // });

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

    // Camera
    const { camera } = useThree();

    // tick function for camera
    useFrame((state) => {
        // Update camera position based on Leva controls
        camera.position.set(cameraX, cameraY, cameraZ);
        camera.updateProjectionMatrix();
    });

    // Texture
    // const crasseMurs = useLoader(TextureLoader, '/textures/crasse_murs.jpg');
    // const facadeCuisineSale = useLoader(TextureLoader, '/textures/facade_cuisine_sale.jpg');
    // const solCuisineSale = useLoader(TextureLoader, '/textures/sol_cuisine_sale.jpg');
    // const boisSale = useLoader(TextureLoader, '/textures/texture_bois_sale.jpg');

    const objetAbimes = [
        'Salissure_interieure',
        'Salissure_exterieure',
        'Chaise_cuisine_02_renversée',
        'Chaise_cuisine_03_renversée',
        'Chaise_cuisine_04_renversée',
        'Chaise_cuisine_05_renversée',
        'Table_cuisine_renversée',
        'Frigo_porte_ouverte',
        'Scene', // ne pas oublier de retirer la scène
        'Cube012', // frigo porte (bug)
        'Cube012_1', // frigo porte (bug)
    ];

    const objetVariables = [
        'Chaise_cuisine_01',
        'Chaise_cuisine_02',
        'Chaise_cuisine_03',
        'Chaise_cuisine_04',
        'Chaise_cuisine_05',
        'Chaise_cuisine_06',
        'Table_cuisine',
        'Frigo_porte_fermée',
        'Sol_cuisine',
        'Plans_de_travail',
    ];

    const chaises = [
        'Chaise_cuisine_01',
        'Chaise_cuisine_02',
        'Chaise_cuisine_03',
        'Chaise_cuisine_04',
        'Chaise_cuisine_05',
        'Chaise_cuisine_06',
    ];
    const table = 'Table_cuisine';
    const sol = 'Sol_cuisine';
    const plansDeTravail = 'Plans_de_travail';

    const cleanMaterials = ['façade_cuisine_propre'];

    const eauMesh = ['Eau_interieur', 'Eau_lavabos'];

    const objetsPasAbimes = Object.keys(nodes).filter((key) => !objetAbimes.includes(key));

    const eauArray = Object.keys(nodes).filter((key) => eauMesh.includes(key));
    const objetsVariablesArray = Object.keys(nodes).filter((key) => objetVariables.includes(key));

    const arrayOfNodes = useMemo(() => {
        return objetsPasAbimes.map((key) => {
            console.log(key, nodes[key]);
            if (objetsVariablesArray.includes(key)) {
                return (
                    <primitive
                        key={key}
                        object={nodes[key]}
                    >
                        <meshStandardMaterial
                            // map={texture}
                            color={`${
                                key === table || chaises.includes(key) || key === plansDeTravail
                                    ? '#4B3F39'
                                    : '#4B3F39'
                            }`} // Applique une couleur sur la texture
                            opacity={1} // Définit l'opacité du matériau
                            transparent={false} // Nécessaire pour que l'opacité prenne effet
                        />
                    </primitive>
                );
            }

            return (
                <primitive
                    key={key}
                    object={nodes[key]}
                />
            );
        });
    }, [objetsPasAbimes, nodes]);

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
            {/* <OrbitControls makeDefault /> */}
            <OrbitControls
                ref={controls}
                // enableDamping={orbitControls.enableDamping}
                // dampingFactor={orbitControls.dampingFactor}
                enableZoom={orbitControls.enableZoom}
                enableRotate={orbitControls.enableRotate}
                // enablePan={orbitControls.enablePan}
                autoRotate={orbitControls.autoRotate}
                autoRotateSpeed={orbitControls.autoRotateSpeed}
                // enableKeys={orbitControls.enableKeys}
                // enableZoomSpeed={orbitControls.enableZoomSpeed}
                // enableRotateSpeed={orbitControls.enableRotateSpeed}
                // enablePanSpeed={orbitControls.enablePanSpeed}
                // zoomSpeed={orbitControls.zoomSpeed}
                // rotateSpeed={orbitControls.rotateSpeed}
                // panSpeed={orbitControls.panSpeed}
                // minPolarAngle={orbitControls.minPolarAngle}
                // maxPolarAngle={orbitControls.maxPolarAngle}
                // minAzimuthAngle={orbitControls.minAzimuthAngle}
                // maxAzimuthAngle={orbitControls.maxAzimuthAngle}
                minDistance={orbitControls.minDistance}
                maxDistance={orbitControls.maxDistance}
                // damping={orbitControls.damping}
                // screenSpacePanning={orbitControls.screenSpacePanning}
                // keyPanSpeed={orbitControls.keyPanSpeed}
                // dynamicDampingFactor={orbitControls.dynamicDampingFactor}
                target={orbitControls.target}
                // position={orbitControls.position}
            />
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

            {arrayOfNodes}

            {/* </PresentationControls> */}
        </>
    );
}

export default Cuisine;
