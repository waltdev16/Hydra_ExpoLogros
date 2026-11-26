// 01. Imports

import * as THREE from 'three';
import { WATER_FLOW_CONFIG } from '../config/simulation.config.js';
import { createMesh } from '../utils/geometry.js';
import { createMaterial } from '../utils/materials.js';

// 02. Creación

// Crea pequeñas esferas de agua que recorren cada tubería.
export function createWaterFlow(scene, flowPaths) {
  return flowPaths.map(points => ({
    curve: new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point))),
    beads: Array.from({ length: WATER_FLOW_CONFIG.beadsPerPipe }, () => createMesh(
      new THREE.SphereGeometry(WATER_FLOW_CONFIG.beadRadius, 12, 8),
      createMaterial(WATER_FLOW_CONFIG.beadColor, 0.17),
      0, 0, 0,
      scene,
    )),
  }));
}

// 03. Animación

// Recorridos 0 y 1 (canaleta y captación) fluyen mientras llueve.
// Las conexiones entre tinacos (2, 3 y 4) se activan a medida que avanza el llenado.
export function updateWaterFlow(streams, elapsedTime, flowing, activeIndex) {
  streams.forEach(({ curve, beads }, pathIndex) => {
    const pipeActive = pathIndex < 2 || (activeIndex >= 1 && pathIndex <= activeIndex + 1);
    beads.forEach((bead, beadIndex) => {
      bead.visible = flowing && pipeActive;
      bead.position.copy(curve.getPointAt((elapsedTime * WATER_FLOW_CONFIG.speed + beadIndex / beads.length) % 1));
    });
  });
}
