import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import textures from "../data/textures.json";

export const useTextures = (materialName) => {
  const material = textures.materials[materialName];

  if (!material) {
    throw new Error(`Material ${materialName} not found in textures.json`);
  }

  const texturePaths = Object.values(material);
  const texturesArray = useLoader(TextureLoader, texturePaths);

  const loadedTextures = {};
  Object.keys(material).forEach((key, index) => {
    loadedTextures[key] = texturesArray[index];
  });

  return loadedTextures;
};
