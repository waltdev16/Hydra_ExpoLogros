// 01. Imports

import * as THREE from 'three';
import { HOUSE_LAYOUT } from '../config/scene.config.js';
import { createBox, createMesh } from '../utils/geometry.js';
import { createRoof } from './roof.js';
import { createGarden } from './garden.js';

// 02. Casa

// Crea la casa completa (paredes, puerta, tejado y jardín) dentro de un grupo.
// Las piezas se modelan a escala pequeña y al final se amplía todo el grupo.
export function createHouse(scene, palette) {
  const { origin, width, wallHeight, depth, wallCenterY, gableHeight, gableBaseY } = HOUSE_LAYOUT;
  const house = new THREE.Group();
  scene.add(house);

  // Paredes.
  createBox(width, wallHeight, depth, origin.x, wallCenterY, origin.z, palette.green, house);

  // Triángulo de la fachada (gablete) extruido a lo largo del fondo de la casa.
  const gable = new THREE.Shape();
  gable.moveTo(-width / 2, 0);
  gable.lineTo(width / 2, 0);
  gable.lineTo(0, gableHeight);
  gable.closePath();
  createMesh(
    new THREE.ExtrudeGeometry(gable, { depth, bevelEnabled: false }),
    palette.green,
    origin.x, gableBaseY, origin.z - depth / 2,
    house,
  );

  // Puerta: marco, hoja de madera y perilla.
  createBox(0.83, 1.43, 0.1, origin.x, 0.85, origin.z + 1.59, palette.black, house);
  createBox(0.7, 1.35, 0.12, origin.x, 0.83, origin.z + 1.64, palette.wood, house);
  createMesh(new THREE.SphereGeometry(0.045, 12, 8), palette.gold, origin.x + 0.24, 0.85, origin.z + 1.72, house);

  createRoof(house, palette);
  createGarden(house, palette);

  // Escala y posición final de la casa en la escena.
  house.scale.setScalar(HOUSE_LAYOUT.scale);
  house.position.set(...HOUSE_LAYOUT.position);
  return house;
}
