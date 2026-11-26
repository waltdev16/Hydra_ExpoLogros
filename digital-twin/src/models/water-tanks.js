// 01. Imports

import * as THREE from 'three';
import { EQUIPMENT_LAYOUT, TANK_POSITIONS } from '../config/scene.config.js';
import { createBox, createCylinder, createMesh } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';
import { createUltrasonicSensor } from '../electronics/ultrasonic-sensor.js';
import { createServo } from '../electronics/servo.js';

// 02. Configuración

// Medidas del tinaco 3D (unidades de escena, antes de escalar el grupo).
export const TANK_GEOMETRY = {
  baseY: 0.2, // Altura de la base del tinaco.
  liquidBaseY: 0.095, // Fondo interior donde empieza el agua.
  liquidMaxHeight: 1.39, // Altura del agua cuando el tinaco está lleno.
};

const REINFORCEMENT_RINGS_Y = [0.18, 0.48, 0.78, 1.08, 1.37];

// 03. Conversión de coordenadas

// Convierte un punto local del grupo de tinacos a coordenadas de la escena.
export function toEquipmentWorld([x, y, z]) {
  const { scale, position } = EQUIPMENT_LAYOUT;
  return [x * scale + position[0], y * scale + position[1], z * scale + position[2]];
}

// 04. Un tinaco

function createTank(index, x, z, palette, materials, parent) {
  const group = new THREE.Group();
  group.position.set(x, TANK_GEOMETRY.baseY, z);
  parent.add(group);

  // Base, borde superior y tapa cónica.
  createCylinder(0.53, 0.095, 0, 0.047, 0, palette.white, group);
  createCylinder(0.54, 0.055, 0, 1.48, 0, palette.white, group);
  createCylinder(0.38, 0.16, 0, 1.55, 0, palette.white, group, 0.52);

  // Cuerpo blanco con una ventana transparente hacia la cámara para ver el agua.
  createMesh(
    new THREE.CylinderGeometry(0.51, 0.51, 1.4, 64, 1, true, 0.66, Math.PI * 2 - 1.32),
    materials.shell, 0, 0.76, 0, group,
  );
  createMesh(
    new THREE.CylinderGeometry(0.512, 0.512, 1.4, 32, 1, true, -0.66, 1.32),
    materials.window, 0, 0.76, 0, group,
  );

  // Anillos de refuerzo.
  for (const ringY of REINFORCEMENT_RINGS_Y) {
    const ring = createMesh(new THREE.TorusGeometry(0.515, 0.018, 8, 64), palette.white, 0, ringY, 0, group);
    ring.rotation.x = Math.PI / 2;
  }

  // Agua y su superficie. La simulación cambia su altura según el nivel.
  const liquid = createCylinder(0.485, 1, 0, 0.07, 0, palette.water, group);
  const surface = createCylinder(0.486, 0.012, 0, 0.12, 0, createMaterial(0x63c8eb, 0.18, 0.12), group);

  // Compuerta: gira sobre su borde trasero. Colores alternos blanco y negro.
  const lid = new THREE.Group();
  lid.position.set(0, 1.53, -0.51);
  group.add(lid);
  createCylinder(0.53, 0.075, 0, 0, 0.51, index % 2 ? palette.white : palette.black, lid);
  createCylinder(0.075, 0.07, 0, 0.06, 0.51, palette.silver, lid);

  // Soporte de madera que sostiene el sensor sobre el tinaco.
  createBox(0.075, 1.75, 0.075, -0.58, 0.87, -0.18, palette.wood, group);
  createBox(0.075, 1.75, 0.075, 0.58, 0.87, -0.18, palette.wood, group);
  createBox(1.22, 0.08, 0.14, 0, 1.72, -0.18, palette.wood, group);

  const sensor = createUltrasonicSensor(group, palette);
  const { motor, arm } = createServo(group, palette);

  // Conector lateral de entrada/salida de agua.
  createCylinder(0.09, 0.13, 0, 0.3, 0.52, palette.silver, group).rotation.x = Math.PI / 2;

  // level va de 0 (vacío) a 1 (lleno).
  return { x, z, group, liquid, surface, lid, arm, motor, sensor, level: 0 };
}

// 05. Grupo de tinacos

// Crea los cuatro tinacos dentro de un grupo escalado y posicionado en la escena.
export function createWaterTanks(scene, palette) {
  const materials = {
    window: new THREE.MeshPhysicalMaterial({
      color: 0xf5f5f0, roughness: 0.24, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide,
    }),
    shell: new THREE.MeshStandardMaterial({ color: 0xf5f4ed, roughness: 0.35, side: THREE.DoubleSide }),
  };

  const equipment = new THREE.Group();
  scene.add(equipment);
  const tanks = TANK_POSITIONS.map(([x, z], index) => createTank(index, x, z, palette, materials, equipment));

  equipment.scale.setScalar(EQUIPMENT_LAYOUT.scale);
  equipment.position.set(...EQUIPMENT_LAYOUT.position);
  return tanks;
}
