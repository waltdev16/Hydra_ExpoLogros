// 01. Imports

import * as THREE from 'three';
import { ELECTRONICS_LAYOUT } from '../config/scene.config.js';
import { createBox, createCylinder, createMesh } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Configuración

// Fotografía de la superficie del Arduino UNO (carpeta public/assets/textures).
const BOARD_TEXTURE_URL = `${import.meta.env.BASE_URL}assets/textures/uno-surface.jpg`;
const HEADER_PIN_COUNT = 14;

// 03. Serigrafía de respaldo

// Dibuja una serigrafía sencilla. Se ve mientras carga la fotografía
// o si la fotografía no se puede cargar.
function createSilkscreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  context.fillStyle = '#0874a7';
  context.fillRect(0, 0, 512, 256);
  context.fillStyle = '#ffffff';
  context.font = 'bold 32px sans-serif';
  context.fillText('UNO', 220, 108);
  context.font = '16px monospace';
  context.fillText('DIGITAL  PWM', 150, 24);
  context.fillText('POWER     ANALOG IN', 115, 244);
  context.strokeStyle = '#b8d5e5';
  context.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    context.beginPath();
    context.moveTo(70 + i * 30, 40);
    context.lineTo(70 + i * 30, 65 + (i % 3) * 12);
    context.lineTo(240, 115 + i * 3);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// 04. Componentes principales de la placa

function createBoardComponents(parent, palette, centerX, centerZ) {
  // Placa base.
  createBox(1.9, 0.1, 1.24, centerX, 0.43, centerZ, palette.blue, parent);

  // Microcontrolador ATmega y sus patillas.
  createBox(0.94, 0.13, 0.38, centerX + 0.17, 0.55, centerZ + 0.2, palette.black, parent);
  for (let i = 0; i < 14; i++) {
    for (const side of [-1, 1]) {
      createBox(0.034, 0.055, 0.1, centerX - 0.24 + i * 0.06, 0.51, centerZ + 0.2 + side * 0.24, palette.silver, parent);
    }
  }

  // Conector USB y conector de alimentación.
  createBox(0.42, 0.29, 0.47, centerX - 0.83, 0.59, centerZ - 0.25, palette.silver, parent);
  createBox(0.33, 0.28, 0.32, centerX - 0.82, 0.59, centerZ + 0.36, palette.black, parent);

  // Capacitores electrolíticos.
  for (const x of [centerX - 0.48, centerX - 0.25]) {
    createCylinder(0.095, 0.24, x, 0.6, centerZ + 0.45, palette.black, parent);
    createCylinder(0.084, 0.02, x, 0.73, centerZ + 0.45, palette.silver, parent);
  }

  // Tiras de pines hembra (digitales arriba, analógicos y alimentación abajo).
  for (const z of [centerZ - 0.53, centerZ + 0.53]) {
    createBox(1.45, 0.16, 0.14, centerX + 0.14, 0.55, z, palette.black, parent);
    for (let i = 0; i < HEADER_PIN_COUNT; i++) {
      createBox(0.034, 0.014, 0.045, centerX - 0.51 + i * 0.1, 0.64, z, palette.gold, parent);
    }
  }

  // Componentes pequeños de montaje superficial.
  for (let i = 0; i < 12; i++) {
    createBox(
      0.07, 0.055, 0.045,
      centerX - 0.1 + (i % 4) * 0.14, 0.51, centerZ - 0.28 + Math.floor(i / 4) * 0.1,
      i % 3 ? palette.black : palette.silver,
      parent,
    );
  }
}

// 05. Superficie fotográfica y detalles en relieve

function createBoardSurface(parent, palette, renderer, centerX, centerZ) {
  const boardFace = createMesh(
    new THREE.PlaneGeometry(1.88, 1.22),
    new THREE.MeshStandardMaterial({ map: createSilkscreenTexture(), roughness: 0.48, metalness: 0.12 }),
    centerX, 0.482, centerZ,
    parent,
  );
  boardFace.rotation.x = -Math.PI / 2;

  // Reemplaza la serigrafía por la fotografía cuando termina de cargar.
  new THREE.TextureLoader().load(BOARD_TEXTURE_URL, texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    boardFace.material.map = texture;
    boardFace.material.needsUpdate = true;
  });

  // Chips de montaje superficial con contactos dorados.
  for (let i = 0; i < 22; i++) {
    const x = centerX - 0.66 + (i % 7) * 0.105;
    const z = centerZ - 0.36 + Math.floor(i / 7) * 0.12;
    createBox(0.055, 0.023, 0.038, x, 0.5, z, i % 3 === 0 ? palette.black : palette.silver, parent);
    for (const side of [-1, 1]) {
      createBox(0.018, 0.012, 0.045, x + side * 0.033, 0.5, z, palette.gold, parent);
    }
  }

  // Cristal oscilador y regulador.
  createBox(0.3, 0.05, 0.12, centerX - 0.38, 0.52, centerZ + 0.06, palette.silver, parent);
  createBox(0.19, 0.05, 0.19, centerX - 0.46, 0.52, centerZ - 0.13, palette.black, parent);

  // Aberturas de los pines hembra.
  for (const z of [centerZ - 0.53, centerZ + 0.53]) {
    for (let i = 0; i < HEADER_PIN_COUNT; i++) {
      const x = centerX - 0.51 + i * 0.1;
      createBox(0.052, 0.012, 0.07, x, 0.653, z, palette.black, parent);
      createBox(0.026, 0.013, 0.033, x, 0.66, z, createMaterial(0x070809), parent);
    }
  }

  // Tornillos en las cuatro esquinas.
  for (const x of [centerX - 0.83, centerX + 0.82]) {
    for (const z of [centerZ - 0.52, centerZ + 0.52]) {
      createCylinder(0.055, 0.018, x, 0.496, z, palette.silver, parent);
      createCylinder(0.027, 0.019, x, 0.505, z, palette.black, parent);
    }
  }

  // Conector ICSP lateral.
  createBox(0.03, 0.15, 0.27, centerX - 1.05, 0.59, centerZ - 0.25, palette.black, parent);
  for (let i = 0; i < 3; i++) {
    createBox(0.025, 0.025, 0.055, centerX - 1.07, 0.56 + i * 0.04, centerZ - 0.25, palette.gold, parent);
  }
}

// 06. Arduino UNO

// Crea el Arduino UNO R3 completo dentro del grupo indicado.
export function createArduino(parent, palette, renderer) {
  const { x: centerX, z: centerZ } = ELECTRONICS_LAYOUT.arduinoCenter;
  createBoardComponents(parent, palette, centerX, centerZ);
  createBoardSurface(parent, palette, renderer, centerX, centerZ);
}
