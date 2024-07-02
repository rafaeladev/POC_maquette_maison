import React from "react";
import textures from "../data/textures.json";
import { loadTextures } from "../utils/textureLoader";
import { useLoader } from "@react-three/fiber";

export const TexturesSales = (colorMapName, normalMapName, roughMapName) => {
  const colorMap = useLoader(loadTextures, colorMapName);

  if (normalMap) {
    const normalMap = useLoader(loadTextures, normalMapName);
  } else {
    const normalMap = null;
  }
  const roughMap = useLoader(loadTextures, roughMapName);

  return { colorMap, normalMap, roughMap };
};
