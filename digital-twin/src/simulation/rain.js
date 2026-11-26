// 01. Imports

import * as THREE from 'three';
import { HOUSE_LAYOUT } from '../config/scene.config.js';
import { RAIN_CONFIG } from '../config/simulation.config.js';
import { random } from '../utils/math.js';

// 02. Configuración

// Posición X de la cumbrera del tejado en la escena.
const ROOF_RIDGE_X = HOUSE_LAYOUT.origin.x * HOUSE_LAYOUT.scale + HOUSE_LAYOUT.position[0];

// 03. Creación

// Cada gota es un segmento de línea; todas comparten una sola geometría.
export function createRain(scene) {
  const { area } = RAIN_CONFIG;
  const drops = [];
  for (let i = 0; i < RAIN_CONFIG.dropCount; i++) {
    drops.push({
      x: area.minX + random() * area.width,
      y: area.minY + random() * area.height,
      z: area.minZ + random() * area.depth,
      speed: RAIN_CONFIG.minSpeed + random() * RAIN_CONFIG.speedRange,
    });
  }

  // Dos puntos (x, y, z) por gota.
  const positions = new Float32Array(RAIN_CONFIG.dropCount * 6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const lines = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color: RAIN_CONFIG.color, transparent: true, opacity: RAIN_CONFIG.opacity }),
  );
  scene.add(lines);

  return { lines, drops, positions, geometry };
}

// 04. Animación

// Hace caer las gotas; al tocar el tejado reaparecen arriba.
export function updateRain(rain, deltaTime, raining) {
  rain.lines.visible = raining;

  rain.drops.forEach((drop, i) => {
    drop.y -= drop.speed * deltaTime;
    // Altura del tejado bajo la gota: más alta en la cumbrera, más baja en los bordes.
    const roofY = RAIN_CONFIG.roofPeakHeight - Math.abs(drop.x - ROOF_RIDGE_X) * RAIN_CONFIG.roofSlope;
    if (drop.y < roofY) drop.y = RAIN_CONFIG.respawnHeight + random();
    rain.positions.set(
      [drop.x, drop.y, drop.z, drop.x + RAIN_CONFIG.streakOffsetX, drop.y - RAIN_CONFIG.streakLength, drop.z],
      i * 6,
    );
  });

  rain.geometry.attributes.position.needsUpdate = true;
}
