// 01. Imports

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONTROLS_CONFIG } from '../config/scene.config.js';

// 02. Controles de órbita

// Permite girar (arrastrar), acercar (rueda) y desplazar la cámara.
export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.target.set(...CONTROLS_CONFIG.target);
  controls.enableDamping = CONTROLS_CONFIG.enableDamping;
  controls.minDistance = CONTROLS_CONFIG.minDistance;
  controls.maxDistance = CONTROLS_CONFIG.maxDistance;
  controls.maxPolarAngle = CONTROLS_CONFIG.maxPolarAngle;
  controls.update();
  return controls;
}
