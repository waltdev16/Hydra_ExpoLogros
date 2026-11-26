// 01. Imports

import { FULL_THRESHOLD, TANK_CAPACITY_ML } from '../config/simulation.config.js';

// 02. Estado compartido

// Estado único de la simulación. Lo leen la LCD, la terminal y las tarjetas,
// por eso todos muestran siempre los mismos datos.
export const systemState = {
  raining: true, // Lluvia activa (Espacio o doble clic la alterna).
  autoRotate: false, // Rotación automática de la cámara (tecla A).
  gatesClosed: false, // Compuertas cerradas cuando todos los tinacos están llenos.
  elapsedTime: 0, // Segundos simulados desde que cargó la página.
};

// 03. Lecturas derivadas

// Volumen total almacenado en mL.
export function getTotalVolume(tanks) {
  return tanks.reduce((sum, tank) => sum + tank.level * TANK_CAPACITY_ML, 0);
}

// Volumen de un tinaco en mL.
export function getTankVolume(tank) {
  return tank.level * TANK_CAPACITY_ML;
}

function isTankFull(tank) {
  return tank.level >= FULL_THRESHOLD;
}

// Cantidad de tinacos llenos.
export function getFullTankCount(tanks) {
  return tanks.filter(isTankFull).length;
}

export function areAllTanksFull(tanks) {
  return tanks.every(isTankFull);
}

// 04. Reinicio

// Vacía los tinacos, abre las compuertas y vuelve a activar la lluvia (tecla R).
export function resetSimulation(tanks) {
  tanks.forEach(tank => {
    tank.level = 0;
  });
  systemState.gatesClosed = false;
  systemState.raining = true;
}
