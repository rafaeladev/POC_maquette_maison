import { TextureLoader } from 'three';
import textures from '../data/textures.json';

const textureCache = {};

export const loadTextures = async (materialName) => {
    if (!textures.materials[materialName]) {
        throw new Error(`Material ${materialName} not found in textures.json`);
    }

    if (textureCache[materialName]) {
        return textureCache[materialName];
    }

    const loader = new TextureLoader();
    const texturePaths = textures.materials[materialName];

    const loadedTextures = await Promise.all(
        Object.keys(texturePaths).map((key) => {
            return new Promise((resolve, reject) => {
                loader.load(
                    texturePaths[key],
                    (texture) => resolve({ [key]: texture }),
                    undefined,
                    (error) => reject(error)
                );
            });
        })
    );

    const textureObject = loadedTextures.reduce((acc, texture) => {
        return { ...acc, ...texture };
    }, {});

    textureCache[materialName] = textureObject;
    return textureObject;
};
