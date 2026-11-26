// 01. Imports

import * as THREE from 'three';
import { SCENE_CONFIG } from '../config/scene.config.js';

// 02. Escena

// Crea la escena con fondo negro y niebla que difumina el horizonte.
export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE_CONFIG.backgroundColor);
  scene.fog = new THREE.Fog(SCENE_CONFIG.fogColor, SCENE_CONFIG.fogNear, SCENE_CONFIG.fogFar);
  return scene;
}
