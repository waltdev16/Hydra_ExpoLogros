// 01. Imports

import * as THREE from 'three';
import { GATE_CONFIG } from '../config/simulation.config.js';

// 02. Compuertas y servomotores

// Mueve suavemente cada tapa y el brazo de su servo hacia la posición objetivo.
export function updateGates(tanks, gatesClosed, deltaTime) {
  const blend = Math.min(1, deltaTime * GATE_CONFIG.animationSpeed);
  const lidTarget = gatesClosed ? GATE_CONFIG.closedLidAngle : GATE_CONFIG.openLidAngle;
  const armTarget = gatesClosed ? GATE_CONFIG.closedServoAngle : GATE_CONFIG.openServoAngle;

  tanks.forEach(tank => {
    tank.lid.rotation.x = THREE.MathUtils.lerp(tank.lid.rotation.x, lidTarget, blend);
    tank.arm.rotation.y = THREE.MathUtils.lerp(tank.arm.rotation.y, armTarget, blend);
  });
}

// Ángulo del servo en grados, como se escribiría con servoMotor.write().
export function getServoDegrees(gatesClosed) {
  return gatesClosed ? GATE_CONFIG.closedServoDegrees : GATE_CONFIG.openServoDegrees;
}

// Texto del estado de la compuerta, igual que estadoTapa en el firmware.
export function getGateLabel(gatesClosed) {
  return gatesClosed ? 'Cerrada' : 'Abierta';
}
