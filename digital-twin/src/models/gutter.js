// 01. Imports

import * as THREE from 'three';
import { createCylinder, createMesh } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Canaleta

// Canal semicircular abierto bajo el borde del tejado. Recoge el agua de lluvia
// y la conduce hacia la tubería de captación.
export function createGutter(house, palette) {
  const capMaterial = createMaterial(0x9ba5ae, 0.28, 0.65);

  const gutter = new THREE.Group();
  gutter.position.set(-1.49, 2.31, -0.45);
  gutter.rotation.x = Math.PI / 2;
  house.add(gutter);

  // Medio cilindro abierto (solo la mitad inferior).
  createMesh(
    new THREE.CylinderGeometry(0.16, 0.16, 3.7, 48, 1, true, Math.PI / 2, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0xadb9c4, metalness: 0.65, roughness: 0.28, side: THREE.DoubleSide }),
    0, 0, 0,
    gutter,
  );

  // Tapas semiesféricas en ambos extremos.
  for (const z of [-2.25, 1.35]) {
    createMesh(
      new THREE.SphereGeometry(0.16, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
      capMaterial,
      -1.49, 2.31, z,
      house,
    );
  }

  // Bordes metálicos a lo largo de la canaleta.
  for (const x of [-1.64, -1.34]) {
    const rail = createCylinder(0.022, 3.72, x, 2.31, -0.45, palette.silver, house);
    rail.rotation.x = Math.PI / 2;
  }

  return gutter;
}
