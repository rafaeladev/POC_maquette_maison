import './style.css';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience.jsx';
import Scene from './Scene.jsx';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(
    <>
        <Canvas
            flat // stop the use of the tone mapping => colors became ok as the one we have in blender
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [-18.8, 12.06, 9.58],
            }}
        >
            <Scene />
        </Canvas>
        {/* <div className='interface'>
            <div
                className='restart'
                onClick={restart()}
            >
                Restart
            </div>
        </div> */}
    </>
);
