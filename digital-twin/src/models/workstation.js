// 01. Imports

import * as THREE from 'three';
import { WORKSTATION_LAYOUT } from '../config/scene.config.js';
import { createBox, createMesh } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Configuración

const SCREEN_WIDTH_PX = 640;
const SCREEN_HEIGHT_PX = 400;
const KEY_ROWS = 5;
const KEY_COLUMNS = 13;

// 03. Escritorio

function createDesk(scene, palette) {
  const [deskX, deskY, deskZ] = WORKSTATION_LAYOUT.deskPosition;
  createBox(1.85, 0.1, 1.25, deskX, deskY, deskZ, palette.wood, scene);

  // Cuatro patas en las esquinas.
  for (const offsetX of [-0.75, 0.75]) {
    for (const offsetZ of [-0.48, 0.48]) {
      createBox(0.07, 0.78, 0.07, deskX + offsetX, 0.49, deskZ + offsetZ, palette.black, scene);
    }
  }
}

// 04. Laptop

// Crea el escritorio y la laptop. La pantalla es un canvas que la terminal
// actualiza con el monitor serial simulado.
export function createWorkstation(scene, palette) {
  const laptop = new THREE.Group();
  laptop.position.set(...WORKSTATION_LAYOUT.laptopPosition);
  laptop.scale.setScalar(WORKSTATION_LAYOUT.laptopScale);
  scene.add(laptop);

  createDesk(scene, palette);

  // Base de aluminio, teclado y touchpad.
  const aluminum = createMaterial(0x606872, 0.28, 0.75);
  createBox(2.15, 0.1, 1.42, 0, 0.08, 0, aluminum, laptop);
  createBox(2.05, 0.025, 1.33, 0, 0.145, 0, palette.black, laptop);
  createBox(0.68, 0.012, 0.37, 0, 0.166, 0.43, aluminum, laptop);
  for (let row = 0; row < KEY_ROWS; row++) {
    for (let column = 0; column < KEY_COLUMNS; column++) {
      createBox(0.12, 0.025, 0.105, -0.91 + column * 0.15, 0.17, -0.51 + row * 0.13, createMaterial(0x292c31), laptop);
    }
  }

  // Pantalla inclinada hacia atrás.
  const monitor = new THREE.Group();
  monitor.position.set(0, 0.14, -0.68);
  monitor.rotation.x = -0.18;
  laptop.add(monitor);
  createBox(2.15, 1.35, 0.085, 0, 0.675, 0, aluminum, monitor);
  createBox(2.06, 1.26, 0.025, 0, 0.675, 0.055, palette.black, monitor);

  // Imagen de la pantalla: se dibuja en un canvas 2D y se usa como textura.
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_WIDTH_PX;
  canvas.height = SCREEN_HEIGHT_PX;
  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  createMesh(
    new THREE.PlaneGeometry(1.96, 1.14),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
    0, 0.675, 0.071,
    monitor,
  );

  return { laptop, screen: { context, texture, width: SCREEN_WIDTH_PX, height: SCREEN_HEIGHT_PX } };
}
