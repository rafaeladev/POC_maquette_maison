import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { useThree, useLoader, useFrame, extend } from "@react-three/fiber";
import { Water } from "three-stdlib";

extend({ Water });

/* console.log("Water", Water); */

// Approche  n°2 avec Water from three-stdlib
function Ocean(props) {
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, "/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);

  console.log("geometrie", geom);
  console.log("props geometrie", props.nodes.geometry);

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      format: gl.encoding,
    }),
    [waterNormals]
  );
  useFrame(
    (state, delta) => (ref.current.material.uniforms.time.value += delta)
  );
  return (
    <water
      ref={ref}
      args={[geom, config]}
      position-y={-0.09}
      rotation-x={-Math.PI / 2}
    />
  );
}

export default Ocean;
