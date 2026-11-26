// 01. Imports

import * as THREE from 'three';
import { CAMERA_CONFIG } from '../config/scene.config.js';

// 02. Cámara

// Cámara en perspectiva que ocupa toda la ventana (o el iframe).
export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    innerWidth / innerHeight,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far,
  );
  camera.position.set(...CAMERA_CONFIG.position);
  return camera;
}
