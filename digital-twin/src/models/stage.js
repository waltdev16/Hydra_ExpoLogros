// 01. Imports

import { createBox, createCylinder } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Suelo y plataforma

// Crea el suelo oscuro y la base elevada sobre la que está la maqueta.
export function createStage(scene, palette) {
  // Suelo general de la escena.
  createBox(100, 0.1, 100, 0, -0.45, 0, createMaterial(0x070707), scene);

  // Plataforma: borde negro y superficie gris.
  createBox(17, 0.35, 12, -2, -0.12, -0.6, palette.black, scene);
  createBox(16.88, 0.07, 11.88, -2, 0.09, -0.6, createMaterial(0x27292d), scene);

  // Cuatro patas bajo la plataforma.
  for (const x of [-4.8, 4.8]) {
    for (const z of [-2.5, 2.5]) {
      createCylinder(0.2, 0.18, x, -0.36, z, palette.black, scene);
    }
  }
}
