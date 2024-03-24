import React from 'react';
import { Html } from '@react-three/drei';
import { useRef } from 'react';

function ARMarker() {
    return (
        <a-marker preset='hiro'>
            <a-box
                position='0 0.5 0'
                material='color: red;'
            ></a-box>
        </a-marker>
    );
}

function ArTest() {
    const markerRef = useRef();

    return (
        <>
            <ARMarker />
            <primitive object={markerRef.current}>
                <Html>
                    <div style={{ color: 'white', backgroundColor: 'black', padding: 10 }}>
                        Hello AR World!
                    </div>
                </Html>
            </primitive>
        </>
    );
}

export default ArTest;
