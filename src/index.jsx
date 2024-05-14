import './style.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene.jsx';
import Cuisine from './Cuisine.jsx';
import { useControls, Leva } from 'leva';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
    <React.StrictMode>
        <Leva hidden={false} />
        <Canvas
            flat // stop the use of the tone mapping => colors became ok as the one we have in blender
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [-18.8, 12.06, 9.58],
            }}
        >
            {/* <Scene /> */}
            <Cuisine />
        </Canvas>
    </React.StrictMode>
);
