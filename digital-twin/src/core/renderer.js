// 01. Imports

import * as THREE from 'three';
import { RENDERER_CONFIG } from '../config/scene.config.js';

// 02. Renderizador

// Crea el renderizador WebGL con sombras suaves y lo agrega a la página.
export function createRenderer(container = document.body) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, RENDERER_CONFIG.maxPixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = RENDERER_CONFIG.toneMappingExposure;
  container.appendChild(renderer.domElement);
  return renderer;
}

// 03. Ajuste de tamaño

// Ajusta cámara y lienzo cuando cambia el tamaño de la ventana o del iframe.
export function enableAutoResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
