import React from "react";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { useControls } from "leva";

function Cuisine() {
  // Model
  const { nodes, animations } = useGLTF("./model/cuisine/POC_cuisine.glb");

  const { cameraX, cameraY, cameraZ, cameraFov, cameraNear, cameraFar } =
    useControls({
      cameraX: { value: -3.85, step: 0.1, label: "Camera X" },
      cameraY: { value: 12.06, step: 0.1, label: "Camera Y" },
      cameraZ: { value: 9.58, step: 0.1, label: "Camera Z" },
      cameraFov: { value: 45, step: 1, label: "FOV" },
      cameraNear: { value: 0.1, step: 0.1, label: "Near" },
      cameraFar: { value: 200, step: 1, label: "Far" },
    });

  const maquettePosition = useControls({
    x: { value: 0, step: 0.1, label: "X" },
    y: { value: 0, step: 0.1, label: "Y" },
    z: { value: 0, step: 0.1, label: "Z" },
  });

  const { camera } = useThree();

  useFrame((state) => {
    // Update camera position based on Leva controls
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.fov = cameraFov;
    camera.near = cameraNear;
    camera.far = cameraFar;

    camera.updateProjectionMatrix();

    /* console.log(state.scene.position); */
  });

  return (
    <>
      <Environment path="/envMap/" files="potsdamer_platz_256.hdr" />

      <color args={["#241B27"]} attach="background" />
      <OrbitControls makeDefault />
      <group
        position={[maquettePosition.x, maquettePosition.y, maquettePosition.z]}
      >
        {Object.keys(nodes).map((key) => {
          return <primitive key={key} object={nodes[key]} />;
        })}
      </group>
    </>
  );
}

export default Cuisine;
