// 01. Imports

import * as THREE from 'three';
import { createBox, createCylinder, createMesh } from '../utils/geometry.js';

// 02. Configuración

const TRANSDUCER_OFFSETS_X = [-0.12, 0.12]; // Los dos "ojos" del HC-SR04.
const PIN_COUNT = 4; // VCC, Trig, Echo, GND.

// 03. Sensor ultrasónico HC-SR04

// Modelo del sensor montado boca abajo sobre el tinaco: placa azul,
// dos transductores con malla metálica y cuatro pines.
export function createUltrasonicSensor(parent, palette) {
  const sensor = new THREE.Group();
  sensor.position.set(0, 1.66, -0.08);
  parent.add(sensor);

  // Placa del módulo.
  createBox(0.42, 0.037, 0.2, 0, 0, 0, palette.blue, sensor);

  // Carcasa, cara frontal y anillo de cada transductor.
  for (const offsetX of TRANSDUCER_OFFSETS_X) {
    createCylinder(0.081, 0.085, offsetX, -0.058, 0, palette.silver, sensor);
    createCylinder(0.061, 0.009, offsetX, -0.104, 0, palette.black, sensor);
    const ring = createMesh(new THREE.TorusGeometry(0.069, 0.009, 8, 28), palette.silver, offsetX, -0.108, 0, sensor);
    ring.rotation.x = Math.PI / 2;
  }

  // Conector de pines: base negra y patilla metálica.
  for (let pin = 0; pin < PIN_COUNT; pin++) {
    createBox(0.025, 0.045, 0.025, -0.1 + pin * 0.06, 0.035, 0.075, palette.black, sensor);
    createBox(0.012, 0.09, 0.012, -0.1 + pin * 0.06, 0.075, 0.075, palette.silver, sensor);
  }

  // Malla fina dentro de cada transductor (puntos dentro de un círculo).
  for (const offsetX of TRANSDUCER_OFFSETS_X) {
    for (let a = -4; a <= 4; a++) {
      for (let b = -4; b <= 4; b++) {
        if (a * a + b * b <= 19) {
          createCylinder(0.003, 0.003, offsetX + a * 0.012, -0.110, b * 0.012, palette.silver, sensor);
        }
      }
    }
  }

  // Tornillos de montaje y cristal oscilador.
  for (const offsetX of [-0.18, 0.18]) {
    createCylinder(0.018, 0.009, offsetX, 0.022, 0.065, palette.silver, sensor);
  }
  createBox(0.09, 0.018, 0.045, 0, 0.029, 0.055, palette.black, sensor);

  return sensor;
}
