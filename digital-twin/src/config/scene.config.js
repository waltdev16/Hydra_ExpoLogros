// HYDRA V7.1 — Scene parameters (camera, lights and component layout).
// Cambiar estos valores modifica la apariencia de la escena.

// 01. Escena y renderizado

export const SCENE_CONFIG = {
  backgroundColor: 0x000000,
  fogColor: 0x000000,
  fogNear: 40,
  fogFar: 85,
};

export const RENDERER_CONFIG = {
  maxPixelRatio: 2, // Limita la resolución en pantallas de alta densidad.
  toneMappingExposure: 1.1,
};

// Semilla de los valores aleatorios: arbustos, grava y lluvia siempre iguales.
export const SCENE_RANDOM_SEED = 8;

// 02. Cámara y controles

export const CAMERA_CONFIG = {
  fov: 36,
  near: 0.1,
  far: 100,
  position: [20, 10, 23], // Posición inicial de la cámara.
};

export const CONTROLS_CONFIG = {
  target: [-1.6, 3.1, -0.7], // Punto al que mira la cámara.
  enableDamping: true,
  minDistance: 7, // Zoom máximo.
  maxDistance: 48, // Zoom mínimo.
  maxPolarAngle: Math.PI * 0.49, // Impide mirar por debajo del suelo.
  autoRotateSpeed: 0.35,
};

// 03. Iluminación

export const LIGHTING_CONFIG = {
  hemisphere: { skyColor: 0xffffff, groundColor: 0x313a48, intensity: 1.25 },
  sun: {
    color: 0xfff4e6,
    intensity: 3.5,
    position: [-6, 12, 8],
    shadowMapSize: 2048,
    shadowArea: { left: -10, right: 10, top: 10, bottom: -10 },
    shadowBias: -0.0005,
  },
  rim: { color: 0xcce8ff, intensity: 3, position: [7, 5, -6] },
  fill: { color: 0xffffff, intensity: 1.15, position: [1, 4, 9] },
  // Entorno de estudio que genera los reflejos de metales y plásticos.
  environment: {
    backgroundColor: 0x343b44,
    blurSigma: 0.08,
    intensity: 0.65,
    // Paneles de luz: [x, y, z, ancho, alto].
    panels: [
      [-5, 5, 0, 5, 3],
      [4, 3, -4, 3, 5],
      [0, 7, 3, 6, 2],
    ],
  },
};

// 04. Casa

export const HOUSE_LAYOUT = {
  // Centro de la casa en sus coordenadas locales (antes de escalar).
  origin: { x: -3.35, z: -0.45 },
  // Cuerpo principal: ancho (X), alto y fondo (Z).
  width: 3.2,
  wallHeight: 2.15,
  depth: 3.1,
  wallCenterY: 1.2,
  gableHeight: 1.18, // Altura del triángulo del tejado.
  gableBaseY: 2.275,
  // Escala y posición final de toda la casa en la escena.
  scale: 2.35,
  position: [2.9, -0.05, -1.1],
};

// 05. Depósitos

// Posiciones [x, z] de los tinacos en coordenadas locales. Frente = +Z, izquierda = -X.
// 0 = fondo izquierdo, 1 = fondo derecho, 2 = frente izquierdo, 3 = frente derecho.
export const TANK_POSITIONS = [
  [-0.75, -0.85],
  [0.48, -0.85],
  [-0.75, 0.55],
  [0.48, 0.55],
];

// Grupo que contiene los cuatro tinacos (escala y posición final).
export const EQUIPMENT_LAYOUT = {
  scale: 1.55,
  position: [2.6, 0.08, -3.1],
};

// 06. Electrónica

export const ELECTRONICS_LAYOUT = {
  // Arduino y protoboard comparten un grupo montado sobre la repisa de vidrio.
  scale: 0.38,
  rotationY: Math.PI / 2,
  position: [-1.08, 2.088, 1.6],
  // Centro del Arduino y posición de la protoboard dentro del grupo.
  arduinoCenter: { x: 3.12, z: 1.25 },
  breadboardPosition: [6.2, 0.47, 1.25],
};

// Pantalla LCD montada en la pared de la casa.
export const LCD_LAYOUT = {
  scale: 0.7,
  position: [-1.17, 3.48, -0.16],
  rotation: [Math.PI / 2, Math.PI / 2, 0],
};

// 07. Estación de trabajo (escritorio y laptop)

export const WORKSTATION_LAYOUT = {
  deskPosition: [3.8, 0.9, 3.45],
  laptopPosition: [3.8, 0.94, 3.45],
  laptopScale: 0.65,
};
