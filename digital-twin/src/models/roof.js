// 01. Imports

import * as THREE from 'three';
import { HOUSE_LAYOUT } from '../config/scene.config.js';
import { createBox } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Configuración

// Inclinación del tejado, calculada a partir del triángulo de la fachada.
const ROOF_PITCH = Math.atan2(HOUSE_LAYOUT.gableHeight, HOUSE_LAYOUT.width / 2);
const TILE_COLUMNS = 7;
const TILE_ROWS = 9;

// 03. Tejado

// Crea las dos aguas del tejado con tejas en tres tonos de gris.
export function createRoof(house, palette) {
  const { x: houseX, z: houseZ } = HOUSE_LAYOUT.origin;

  for (const side of [-1, 1]) {
    const roofHalf = new THREE.Group();
    roofHalf.position.set(houseX + side * 0.88, 2.88, houseZ);
    roofHalf.rotation.z = -side * ROOF_PITCH;
    house.add(roofHalf);

    // Placa base de esta mitad del tejado.
    createBox(2.17, 0.11, 3.65, 0, 0, 0, palette.roof, roofHalf);

    // Tejas: el tono alterna para que se distingan entre sí.
    for (let column = 0; column < TILE_COLUMNS; column++) {
      for (let row = 0; row < TILE_ROWS; row++) {
        const tileColor = 0x454a52 + ((column + row) % 3) * 0x050505;
        createBox(
          0.32, 0.07, 0.43,
          -0.94 + column * 0.31, 0.09, -1.6 + row * 0.4,
          createMaterial(tileColor, 0.42, 0.25),
          roofHalf,
        );
      }
    }
  }
}
