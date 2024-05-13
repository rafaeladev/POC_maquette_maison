import React, { useMemo } from "react";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { useControls } from "leva";

function Cuisine() {
  // Model
  const { nodes, animations } = useGLTF("./model/cuisine/POC_cuisine.glb");

  const { cameraX, cameraY, cameraZ, cameraFov, cameraNear, cameraFar } =
    useControls({
      cameraX: { value: 2.6, step: 0.1, label: "Camera X" },
      cameraY: { value: 1.6, step: 0.1, label: "Camera Y" },
      cameraZ: { value: 4.2, step: 0.1, label: "Camera Z" },
      cameraFov: { value: 40, step: 1, label: "FOV" },
      cameraNear: { value: 1.4, step: 0.1, label: "Near" },
      cameraFar: { value: 200, step: 1, label: "Far" },
    });

  const maquettePosition = useControls({
    x: { value: -4.9, step: 0.1, label: "X" },
    y: { value: -0.2, step: 0.1, label: "Y" },
    z: { value: 1.1, step: 0.1, label: "Z" },
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

  const objetAbimes = [
    "Salissure_interieure",
    "Salissure_exterieure",
    "Chaise_cuisine_02_renversée",
    "Chaise_cuisine_03_renversée",
    "Chaise_cuisine_04_renversée",
    "Chaise_cuisine_05_renversée",
    "Table_cuisine_renversée",
    "Frigo_porte_ouverte",
    "Scene", // ne pas oublier de retirer la scène
    "Cube012", // frigo porte (bug)
    "Cube012_1", // frigo porte (bug)
  ];

  const objetVariables = [
    "Chaise_cuisine_01",
    "Chaise_cuisine_02",
    "Chaise_cuisine_03",
    "Chaise_cuisine_04",
    "Chaise_cuisine_05",
    "Chaise_cuisine_06",
    "Table_cuisine",
    "Frigo_porte_fermée",
    "Sol_cuisine",
    "Plans_de_travail",
  ];

  const cleanMaterials = ["façade_cuisine_propre"];

  const eauMesh = ["Eau_interieur", "Eau_lavabos"];

  const testArray = Object.keys(nodes).filter(
    (key) => !objetAbimes.includes(key)
  );

  const eauArray = Object.keys(nodes).filter((key) => eauMesh.includes(key));
  const objetsArray = Object.keys(nodes).filter((key) =>
    objetVariables.includes(key)
  );

  const arrayOfNodes = useMemo(() => {
    return testArray.map((key) => {
      if (nodes[key].material) {
        console.log(nodes[key].material);
      }

      return <primitive key={key} object={nodes[key]} />;
    });
  }, [testArray, nodes]);

  return (
    <>
      <Environment path="/envMap/" files="potsdamer_platz_256.hdr" />

      <color args={["#241B27"]} attach="background" />
      <OrbitControls makeDefault />
      <group
        position={[maquettePosition.x, maquettePosition.y, maquettePosition.z]}
      >
        {arrayOfNodes}
      </group>
    </>
  );
}

export default Cuisine;
