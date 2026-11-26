// 01. Imports

import firmwareSource from '../../../firmware/Hydra_Arduino/Hydra_Arduino.ino?raw';
import { PRIMARY_TANK, SCREEN_VISIBLE_LINES, SERIAL_HISTORY_LINES, TANK_CAPACITY_ML } from '../config/simulation.config.js';
import { getFullTankCount, getTotalVolume, systemState } from '../simulation/system-state.js';
import { getSensorDistanceCm } from '../simulation/sensors.js';
import { getGateLabel, getServoDegrees } from '../simulation/actuators.js';

// 02. Configuración

const SCREEN_COLORS = { background: '#10151c', text: '#6ee7a0' };

// 03. Terminal de la computadora

// Ventana con el firmware original, el monitor serial simulado y la telemetría.
// Además dibuja las últimas líneas en la pantalla 3D de la laptop.
export function createTerminal({ screen, controls, tanks }) {
  const dialog = document.querySelector('#terminal');
  const serialElement = document.querySelector('#serial');
  const statusElement = document.querySelector('#status');
  const serialLines = [];

  // Muestra el código Arduino de 2025 (solo lectura; no se ejecuta).
  document.querySelector('#source').textContent = firmwareSource;

  // Mientras la ventana está abierta se bloquea la cámara.
  document.querySelector('#close').onclick = () => dialog.close();
  dialog.addEventListener('close', () => {
    controls.enabled = true;
  });

  function open() {
    dialog.showModal();
    controls.enabled = false;
  }

  // Dibuja el monitor serial en la pantalla de la laptop.
  function drawLaptopScreen() {
    const { context, texture, width, height } = screen;
    context.fillStyle = SCREEN_COLORS.background;
    context.fillRect(0, 0, width, height);
    context.fillStyle = SCREEN_COLORS.text;
    context.font = '24px monospace';
    context.fillText('HYDRA / SERIAL 9600', 24, 36);
    context.font = '18px monospace';
    serialLines.slice(-SCREEN_VISIBLE_LINES).forEach((line, i) => context.fillText(line, 24, 75 + i * 29));
    texture.needsUpdate = true;
  }

  // Agrega una línea al monitor serial y actualiza la telemetría.
  function update() {
    const { gatesClosed, raining, elapsedTime } = systemState;
    const totalVolume = getTotalVolume(tanks);
    const fullTanks = getFullTankCount(tanks);
    const distance = getSensorDistanceCm(tanks[PRIMARY_TANK]);

    serialLines.push(`[${elapsedTime.toFixed(1)}s] Vol: ${totalVolume.toFixed(0)} mL | ${fullTanks}/${tanks.length} | ${getGateLabel(gatesClosed)}`);
    if (serialLines.length > SERIAL_HISTORY_LINES) serialLines.shift();
    serialElement.textContent = serialLines.join('\n');
    serialElement.scrollTop = serialElement.scrollHeight;

    statusElement.textContent = [
      `Sensor principal: ${distance.toFixed(2)} cm`,
      `Servo: ${getServoDegrees(gatesClosed)}°`,
      `Lluvia: ${raining ? 'ON' : 'OFF'}`,
      `Capacidad simulada: ${Math.round(tanks.length * TANK_CAPACITY_ML)} mL`,
    ].join('\n');

    drawLaptopScreen();
  }

  return { open, update, isOpen: () => dialog.open };
}
