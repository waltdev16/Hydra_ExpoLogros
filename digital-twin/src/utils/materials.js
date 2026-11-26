// 01. Imports

import * as THREE from 'three';

// 02. Material estándar

// Material mate o metálico según rugosidad (roughness) y metalicidad (metalness).
export function createMaterial(color, roughness = 0.55, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

// 03. Paleta compartida

// Materiales reutilizados por varios modelos. Se crean una sola vez.
export function createPalette() {
  return {
    wood: createMaterial(0x70452d),
    green: createMaterial(0x49723b),
    roof: createMaterial(0x454a52, 0.48, 0.22),
    black: createMaterial(0x181b20),
    silver: createMaterial(0xbfc5ca, 0.24, 0.8),
    white: createMaterial(0xf3f0e7),
    blue: createMaterial(0x087b80),
    pcb: createMaterial(0x197e47),
    gold: createMaterial(0xcda652, 0.3, 0.75),
    // Vidrio de la repisa.
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xc8eaff,
      transparent: true,
      opacity: 0.23,
      roughness: 0.12,
      metalness: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    // Agua dentro de los tinacos.
    water: new THREE.MeshPhysicalMaterial({
      color: 0x36b6e8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.16,
      metalness: 0.12,
      depthWrite: false,
    }),
    // Tuberías transparentes de captación y conexión entre tinacos.
    pipe: new THREE.MeshPhysicalMaterial({
      color: 0xa9ddf5,
      transparent: true,
      opacity: 0.38,
      roughness: 0.09,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  };
}
