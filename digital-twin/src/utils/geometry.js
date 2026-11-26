// 01. Imports

import * as THREE from 'three';

// 02. Helpers de geometría
// Funciones cortas para crear piezas sin repetir código en cada modelo.

// Crea una malla, la coloca en (x, y, z) y la agrega al objeto padre.
export function createMesh(geometry, material, x, y, z, parent) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  // Los materiales transparentes no proyectan sombra.
  mesh.castShadow = !material.transparent;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// Caja: ancho (X), alto (Y) y fondo (Z).
export function createBox(width, height, depth, x, y, z, material, parent) {
  return createMesh(new THREE.BoxGeometry(width, height, depth), material, x, y, z, parent);
}

// Cilindro vertical. bottomRadius permite hacer conos truncados.
export function createCylinder(radius, height, x, y, z, material, parent, bottomRadius = radius) {
  return createMesh(new THREE.CylinderGeometry(radius, bottomRadius, height, 48), material, x, y, z, parent);
}

// Tubo curvo que pasa suavemente por una lista de puntos [x, y, z].
export function createTube(points, radius, material, parent) {
  const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
  return createMesh(new THREE.TubeGeometry(curve, 48, radius, 8, false), material, 0, 0, 0, parent);
}
