import * as THREE from "three";

// Function to dispose of geometries, materials, and textures
const disposeResource = (resource) => {
  if (resource.geometry) {
    resource.geometry.dispose();
  }

  if (resource.material) {
    if (Array.isArray(resource.material)) {
      resource.material.forEach((material) => {
        if (material.map) material.map.dispose();
        if (material.lightMap) material.lightMap.dispose();
        if (material.bumpMap) material.bumpMap.dispose();
        if (material.normalMap) material.normalMap.dispose();
        if (material.specularMap) material.specularMap.dispose();
        if (material.envMap) material.envMap.dispose();
        material.dispose();
      });
    } else {
      if (resource.material.map) resource.material.map.dispose();
      if (resource.material.lightMap) resource.material.lightMap.dispose();
      if (resource.material.bumpMap) resource.material.bumpMap.dispose();
      if (resource.material.normalMap) resource.material.normalMap.dispose();
      if (resource.material.specularMap)
        resource.material.specularMap.dispose();
      if (resource.material.envMap) resource.material.envMap.dispose();
      resource.material.dispose();
    }
  }
};

// Function to dispose of the entire scene
const disposeScene = (scene) => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      disposeResource(object);
    }
  });
};

export { disposeScene };
