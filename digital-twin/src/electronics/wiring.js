// 01. Imports

import * as THREE from 'three';
import { ELECTRONICS_LAYOUT } from '../config/scene.config.js';
import { createTube } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Configuración

const WIRE_COLORS = [0xe83b39, 0x22252b, 0x2196f3, 0xf9b72c, 0x47ad5b, 0x8d5acb, 0xffffff, 0xf17824];
const WIRE_RADIUS = 0.009;
const BOARD_WIRE_COUNT = 8;
const SENSOR_PIN_COUNT = 4;

// 03. Cables Arduino → protoboard → LCD

// Los cables se trazan con coordenadas de la escena, por eso primero se
// actualizan las matrices de todos los objetos.
export function createBoardWiring(scene, electronics, breadboard, lcd) {
  const headerZ = ELECTRONICS_LAYOUT.arduinoCenter.z - 0.53;
  scene.updateMatrixWorld(true);

  for (let i = 0; i < BOARD_WIRE_COUNT; i++) {
    const arduinoPin = electronics.localToWorld(new THREE.Vector3(2.6 + i * 0.11, 0.66, headerZ));
    const breadboardHole = breadboard.localToWorld(new THREE.Vector3(-0.8 + i * 0.17, 0.105, 0.35));
    const cableHeight = 2.48 + i * 0.012;
    createTube(
      [arduinoPin.toArray(), [arduinoPin.x, cableHeight, arduinoPin.z], [breadboardHole.x, cableHeight, breadboardHole.z], breadboardHole.toArray()],
      WIRE_RADIUS, createMaterial(WIRE_COLORS[i]), scene,
    );

    const lcdPin = lcd.localToWorld(new THREE.Vector3(-0.8 + i * 0.2, 0.1, 0.46));
    createTube(
      [breadboardHole.toArray(), [-0.99, 2.48, breadboardHole.z], [-0.99, 2.88, lcdPin.z], [lcdPin.x, 2.98, lcdPin.z], lcdPin.toArray()],
      WIRE_RADIUS, createMaterial(WIRE_COLORS[i]), scene,
    );
  }
}

// 04. Cables de los sensores ultrasónicos → Arduino

// Cuatro cables por sensor (VCC, Trig, Echo, GND) que suben, cruzan y bajan hasta la placa.
export function createSensorWiring(scene, tanks, electronics) {
  const headerZ = ELECTRONICS_LAYOUT.arduinoCenter.z + 0.53;
  scene.updateMatrixWorld(true);

  for (const tank of tanks) {
    for (let i = 0; i < SENSOR_PIN_COUNT; i++) {
      const sensorPin = tank.sensor.localToWorld(new THREE.Vector3(-0.1 + i * 0.06, 0.075, 0.075));
      const arduinoPin = electronics.localToWorld(new THREE.Vector3(2.6 + i * 0.1, 0.66, headerZ));
      const wallX = -1.02 + i * 0.025;
      createTube(
        [
          sensorPin.toArray(),
          [sensorPin.x, 3.08, sensorPin.z],
          [wallX, 3.08, sensorPin.z],
          [wallX, 2.55, arduinoPin.z],
          [arduinoPin.x, 2.55, arduinoPin.z],
          arduinoPin.toArray(),
        ],
        WIRE_RADIUS, createMaterial(WIRE_COLORS[i]), scene,
      );
    }
  }
}
