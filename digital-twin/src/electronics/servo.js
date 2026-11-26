// 01. Imports

import * as THREE from 'three';
import { createBox, createCylinder } from '../utils/geometry.js';

// 02. Servomotor

// Servomotor azul con brazo blanco. El brazo gira 180° al cerrar la compuerta.
export function createServo(parent, palette) {
  const motor = new THREE.Group();
  motor.position.set(0.57, 1.52, -0.45);
  parent.add(motor);

  // Cuerpo, pestañas de montaje y eje.
  createBox(0.23, 0.19, 0.2, 0, 0, 0, palette.blue, motor);
  createBox(0.29, 0.035, 0.2, 0, -0.08, 0, palette.blue, motor);
  createCylinder(0.055, 0.055, 0, 0.11, 0, palette.white, motor);

  // Brazo giratorio (se anima en simulation/actuators.js).
  const arm = new THREE.Group();
  arm.position.y = 0.15;
  motor.add(arm);
  createBox(0.28, 0.025, 0.045, 0, 0, 0, palette.white, arm);

  return { motor, arm };
}
