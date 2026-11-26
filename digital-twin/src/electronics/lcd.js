// 01. Imports

import * as THREE from 'three';
import { LCD_LAYOUT } from '../config/scene.config.js';
import { createBox, createCylinder, createMesh } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Configuración

const SCREEN_WIDTH_PX = 512;
const SCREEN_HEIGHT_PX = 144;
const PIN_COUNT = 16;
const SCREW_POSITIONS = [[-1.14, -0.4], [-1.14, 0.4], [1.14, -0.4], [1.14, 0.4]];

const LCD_COLORS = {
  background: '#0816a6',
  text: '#e4f6ff',
};

// 03. Modelo de la pantalla LCD 16 × 2

// Crea la LCD con su placa, marco, pines y una pantalla dinámica (canvas).
export function createLcd(scene, palette) {
  const lcd = new THREE.Group();
  lcd.scale.setScalar(LCD_LAYOUT.scale);
  lcd.position.set(...LCD_LAYOUT.position);
  lcd.rotation.order = 'YXZ';
  lcd.rotation.set(...LCD_LAYOUT.rotation);
  scene.add(lcd);

  // Placa verde, marco negro y cristal azul.
  createBox(2.5, 0.1, 1.02, 0, 0, 0, palette.pcb, lcd);
  createBox(2.18, 0.14, 0.73, 0, 0.08, 0, palette.black, lcd);
  createBox(1.96, 0.025, 0.52, 0, 0.165, 0, createMaterial(0x102c57, 0.22, 0.1), lcd);
  for (const [x, z] of SCREW_POSITIONS) {
    createCylinder(0.048, 0.025, x, 0.07, z, palette.silver, lcd);
  }
  for (let i = 0; i < PIN_COUNT; i++) {
    createBox(0.035, 0.065, 0.035, -1.05 + i * 0.135, 0.08, 0.46, palette.gold, lcd);
  }

  // Canvas donde se escribe el texto de la pantalla.
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_WIDTH_PX;
  canvas.height = SCREEN_HEIGHT_PX;
  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Pads de cobre y pines soldados.
  for (let i = 0; i < PIN_COUNT; i++) {
    createCylinder(0.038, 0.012, -1.05 + i * 0.135, 0.057, 0.46, palette.silver, lcd);
    createBox(0.018, 0.09, 0.018, -1.05 + i * 0.135, 0.115, 0.46, palette.gold, lcd);
  }
  for (const [x, z] of SCREW_POSITIONS) {
    createCylinder(0.024, 0.032, x, 0.081, z, palette.black, lcd);
  }

  // Cara visible de la pantalla (no la afecta la iluminación).
  const face = createMesh(
    new THREE.PlaneGeometry(1.94, 0.5),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
    0, 0.181, 0,
    lcd,
  );
  face.rotation.x = -Math.PI / 2;

  return { group: lcd, display: { context, texture } };
}

// 04. Contenido de la pantalla

// Escribe en la LCD el volumen total y los tinacos llenos (dos líneas, como la LCD real).
export function drawLcdScreen(display, { totalVolume, fullTanks, tankCount }) {
  const { context, texture } = display;
  context.fillStyle = LCD_COLORS.background;
  context.fillRect(0, 0, SCREEN_WIDTH_PX, SCREEN_HEIGHT_PX);
  context.fillStyle = LCD_COLORS.text;
  context.font = 'bold 41px monospace';
  context.textBaseline = 'middle';
  context.fillText(`Vol:${Math.round(totalVolume)}mL`, 18, 40);
  context.fillText(`Tanques:${fullTanks}/${tankCount}`, 18, 104);
  texture.needsUpdate = true;
}
