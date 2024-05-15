import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { useThree, useLoader, useFrame, extend } from "@react-three/fiber";
import { Water } from "three-stdlib";

extend({ Water });

/* console.log('Water', Water); */

// Approche  n°2 avec Water from three-stdlib
function Ocean(props) {
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, "/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(12, 13), []);

  // console.log("geometrie", geom);
  // console.log('props geometrie', props.nodes.geometry);

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 0.1,
      fog: false,
      format: gl.encoding,
    }),
    [waterNormals]
  );

  // Animation de l'eau
  useFrame((state, delta) => {
    // Update the shader time value if the material and uniforms are defined
    if (
      ref.current &&
      ref.current.material &&
      ref.current.material.uniforms &&
      ref.current.material.uniforms.time
    ) {
      ref.current.material.uniforms.time.value += delta;
    }

    // Check if the object is supposed to move
    if (props.isMoving && ref.current) {
      // Increment the y position based on the time delta to make animation smooth
      ref.current.position.y += 0.1 * delta * 10;

      if (props.key === "Eau_piscine" && ref.current.position.y >= 0.8) {
        props.setIsMoving(false); // Stop moving if the 'eau_Piscine' reaches y = 3
      } else if (ref.current.position.y >= 5) {
        props.setIsMoving(false); // Stop moving if any other object reaches y = 5
      }
    }
  });

  /*  console.log(
    <water
      ref={ref}
      args={[props.nodes.geometry, config]}
      // position-y={5}
      // rotation-x={-Math.PI / 2}
    />
  ); */

  return (
    <water
      ref={ref}
      // args={[props.nodes.geometry, config]}
      args={[geom, config]}
      position-y={-0.1}
      rotation-x={-Math.PI / 2}
    />
  );
}

export default Ocean;
