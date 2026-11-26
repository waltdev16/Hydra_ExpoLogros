// 01. Imports

import * as THREE from 'three';
import { LIGHTING_CONFIG } from '../config/scene.config.js';

// 02. Luces

// Luz ambiental, sol con sombras, luz de contorno y luz de relleno.
export function addLighting(scene) {
  const { hemisphere, sun, rim, fill } = LIGHTING_CONFIG;

  scene.add(new THREE.HemisphereLight(hemisphere.skyColor, hemisphere.groundColor, hemisphere.intensity));

  // El sol es la única luz que proyecta sombras.
  const sunLight = new THREE.DirectionalLight(sun.color, sun.intensity);
  sunLight.position.set(...sun.position);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(sun.shadowMapSize, sun.shadowMapSize);
  Object.assign(sunLight.shadow.camera, sun.shadowArea);
  sunLight.shadow.bias = sun.shadowBias;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(rim.color, rim.intensity);
  rimLight.position.set(...rim.position);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(fill.color, fill.intensity);
  fillLight.position.set(...fill.position);
  scene.add(fillLight);
}

// 03. Reflejos de entorno

// Crea un "estudio" invisible con paneles blancos; sus reflejos dan brillo
// a los metales y plásticos de la escena.
export function addEnvironmentReflections(scene, renderer) {
  const { environment } = LIGHTING_CONFIG;
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(environment.backgroundColor);

  for (const [x, y, z, width, height] of environment.panels) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    );
    panel.position.set(x, y, z);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
  }

  const generator = new THREE.PMREMGenerator(renderer);
  scene.environment = generator.fromScene(studio, environment.blurSigma).texture;
  scene.environmentIntensity = environment.intensity;
  generator.dispose();
}
