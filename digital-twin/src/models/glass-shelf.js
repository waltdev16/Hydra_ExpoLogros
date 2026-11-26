// 01. Imports

import { createBox, createTube } from '../utils/geometry.js';

// 02. Repisa de vidrio

// Repisa transparente en la pared de la casa donde se apoya la electrónica,
// sostenida por dos ménsulas metálicas.
export function createGlassShelf(scene, palette) {
  createBox(1.16, 0.065, 2.75, -0.6325, 2.18, -0.1, palette.glass, scene);

  for (const z of [-1.15, 0.95]) {
    createBox(0.09, 0.52, 0.09, -1.13, 1.9, z, palette.silver, scene);
    createTube([[-1.13, 1.68, z], [-0.23, 2.13, z]], 0.045, palette.silver, scene);
  }
}
