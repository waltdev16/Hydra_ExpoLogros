// 01. Imports

import * as THREE from 'three';
import { ELECTRONICS_LAYOUT } from '../config/scene.config.js';
import { createBox } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Configuración

const COLUMNS = 32;
const ROWS = 10;

// 03. Posiciones de los orificios

// Calcula la matriz de cada orificio. Hay un canal central entre la fila 4 y la 5.
function fillHoleMatrices(instancedMesh, y) {
  const helper = new THREE.Object3D();
  let index = 0;
  for (let column = 0; column < COLUMNS; column++) {
    for (let row = 0; row < ROWS; row++) {
      helper.position.set(-1.13 + column * 0.073, y, -0.49 + row * 0.108 + (row >= 5 ? 0.06 : 0));
      helper.updateMatrix();
      instancedMesh.setMatrixAt(index++, helper.matrix);
    }
  }
}

// 04. Protoboard

// Crea la protoboard. Los 320 orificios usan InstancedMesh para dibujarse
// en una sola llamada a la GPU.
export function createBreadboard(parent, palette) {
  const breadboard = new THREE.Group();
  breadboard.position.set(...ELECTRONICS_LAYOUT.breadboardPosition);
  parent.add(breadboard);

  createBox(2.55, 0.18, 1.3, 0, 0, 0, palette.white, breadboard);

  // Orificios oscuros.
  const holes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.035, 0.009, 0.035), palette.black, COLUMNS * ROWS);
  fillHoleMatrices(holes, 0.095);
  breadboard.add(holes);

  // Canal central.
  createBox(2.36, 0.012, 0.075, 0, 0.099, 0, createMaterial(0xc8c3b8), breadboard);

  // Contactos metálicos dentro de cada orificio.
  const contacts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.012, 0.006, 0.018), palette.silver, COLUMNS * ROWS);
  fillHoleMatrices(contacts, 0.1);
  breadboard.add(contacts);

  // Líneas de alimentación: roja (+) y azul (−) en cada borde.
  for (const z of [-0.61, 0.61]) {
    createBox(2.3, 0.009, 0.018, 0, 0.101, z, createMaterial(0xd52c39), breadboard);
    createBox(2.3, 0.009, 0.018, 0, 0.101, z * 0.91, palette.blue, breadboard);
  }

  return breadboard;
}
