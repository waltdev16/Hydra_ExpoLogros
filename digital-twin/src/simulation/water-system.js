// 01. Imports

import { FILL_ORDER, FILL_RATE, FULL_THRESHOLD } from '../config/simulation.config.js';
import { TANK_GEOMETRY } from '../models/water-tanks.js';

// 02. Llenado secuencial

// Llena un tinaco a la vez siguiendo FILL_ORDER. Devuelve la posición en
// FILL_ORDER del tinaco que se está llenando (-1 si todos están llenos).
// Cuando para la lluvia el agua se conserva: no hay pérdidas.
export function updateWaterLevels(tanks, deltaTime, raining) {
  const activeIndex = FILL_ORDER.findIndex(tankIndex => tanks[tankIndex].level < FULL_THRESHOLD);

  if (raining && activeIndex >= 0) {
    const tank = tanks[FILL_ORDER[activeIndex]];
    tank.level = Math.min(1, tank.level + deltaTime * FILL_RATE);
    if (tank.level >= FULL_THRESHOLD) tank.level = 1;
  }

  return activeIndex;
}

// 03. Agua visible

// Ajusta la altura del cilindro de agua y su superficie según el nivel.
export function updateLiquidMeshes(tanks) {
  const { liquidBaseY, liquidMaxHeight } = TANK_GEOMETRY;

  tanks.forEach(tank => {
    const height = liquidMaxHeight * tank.level;
    const hasWater = height > 0.001;
    tank.liquid.visible = hasWater;
    tank.surface.visible = hasWater;
    tank.liquid.scale.y = Math.max(0.001, height);
    tank.liquid.position.y = liquidBaseY + height / 2;
    tank.surface.position.y = liquidBaseY + height;
  });
}
