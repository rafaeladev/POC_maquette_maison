import React from "react";
import textures from "../data/textures.json";
import { loadTextures } from "../utils/textureLoader";

function TexturesSales() {
  const texturesSalesList = [
    "asphalt",
    "carpet",
    "beton",
    "sol_sdb",
    "cuisine_sol",
    "sol_salon",
    "herbe",
    "cuir",
    "plastique_noir",
    "plastique_blanc",
    "vegetation",
    "bois",
  ];

  const texturesSalesArray = texturesSalesList.forEach((texture) => {
    console.log(texture);
    loadTextures(`${texture}_sale`);
  });

  return texturesSalesArray;
}

export default TexturesSales;
