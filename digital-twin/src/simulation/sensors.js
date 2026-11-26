// 01. Imports

import { TANK_HEIGHT_CM } from '../config/simulation.config.js';

// 02. Sensor ultrasónico simulado

// Distancia del sensor a la superficie del agua en cm.
// Recipiente vacío = 11 cm; lleno = 0 cm. En el firmware real se obtiene con
// pulseIn() y la velocidad del sonido; aquí se calcula a partir del nivel.
export function getSensorDistanceCm(tank) {
  return TANK_HEIGHT_CM * (1 - tank.level);
}
