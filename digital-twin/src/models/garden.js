// 01. Imports

import * as THREE from 'three';
import { HOUSE_LAYOUT } from '../config/scene.config.js';
import { createBox, createMesh } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';
import { random } from '../utils/math.js';

// 02. Configuración

const PLANTER_POSITIONS_X = [-4.5, -2.2];
const BUSHES_PER_PLANTER = 45;
const BUSH_COLORS = [0x326c23, 0x57932c, 0x87ad3a];
const GRAVEL_STONES = 170;

// 03. Jardín

// Crea dos jardineras con arbustos y un camino de grava frente a la casa.
// Usa el generador con semilla: el orden de las llamadas a random() no debe cambiar.
export function createGarden(house, palette) {
  for (const planterX of PLANTER_POSITIONS_X) {
    createBox(0.75, 0.25, 1.65, planterX, 0.27, 1.95, palette.green, house);

    for (let i = 0; i < BUSHES_PER_PLANTER; i++) {
      const bush = createMesh(
        new THREE.IcosahedronGeometry(0.12 + random() * 0.13, 1),
        createMaterial(BUSH_COLORS[i % 3]),
        planterX + (random() - 0.5) * 0.56,
        0.46 + random() * 0.3,
        1.95 + (random() - 0.5) * 1.4,
        house,
      );
      bush.scale.y = 1.25;
    }
  }

  // Piedras aplanadas en dos tonos de arena.
  for (let i = 0; i < GRAVEL_STONES; i++) {
    const stone = createMesh(
      new THREE.IcosahedronGeometry(0.04 + random() * 0.035, 0),
      createMaterial(i % 2 ? 0xc3a37c : 0x91704c),
      HOUSE_LAYOUT.origin.x + (random() - 0.5) * 0.7,
      0.17,
      1.2 + random() * 1.6,
      house,
    );
    stone.scale.y = 0.5;
  }
}
