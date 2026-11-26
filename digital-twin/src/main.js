// HYDRA V7.1 — Digital twin entry point.
// Este archivo solo conecta los módulos. El orden de creación de los modelos
// se conserva para que la escena sea idéntica a la versión original.

// 01. Imports

import * as THREE from 'three';
import './styles/main.css';

import { CONTROLS_CONFIG, ELECTRONICS_LAYOUT } from './config/scene.config.js';
import { LCD_UPDATE_INTERVAL, MAX_FRAME_TIME, TERMINAL_UPDATE_INTERVAL } from './config/simulation.config.js';

import { createScene } from './core/scene.js';
import { createCamera } from './core/camera.js';
import { createRenderer, enableAutoResize } from './core/renderer.js';
import { createControls } from './core/controls.js';
import { addEnvironmentReflections, addLighting } from './core/lighting.js';
import { createPalette } from './utils/materials.js';

import { createStage } from './models/stage.js';
import { createHouse } from './models/house.js';
import { createGutter } from './models/gutter.js';
import { createWaterTanks } from './models/water-tanks.js';
import { createGlassShelf } from './models/glass-shelf.js';
import { createPipes } from './models/pipes.js';
import { createWorkstation } from './models/workstation.js';

import { createArduino } from './electronics/arduino.js';
import { createBreadboard } from './electronics/breadboard.js';
import { createLcd, drawLcdScreen } from './electronics/lcd.js';
import { createBoardWiring, createSensorWiring } from './electronics/wiring.js';

import { areAllTanksFull, getFullTankCount, getTotalVolume, systemState } from './simulation/system-state.js';
import { updateLiquidMeshes, updateWaterLevels } from './simulation/water-system.js';
import { updateGates } from './simulation/actuators.js';
import { createRain, updateRain } from './simulation/rain.js';
import { createWaterFlow, updateWaterFlow } from './simulation/water-flow.js';

import { createComponentCards, registerHydraComponents } from './interaction/component-cards.js';
import { createTerminal } from './interaction/terminal.js';
import { setupSelection } from './interaction/selection.js';
import { setupKeyboardControls } from './interaction/keyboard.js';

// 02. Núcleo: escena, cámara, renderizador, controles y luces

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const controls = createControls(camera, renderer.domElement);
addLighting(scene);
addEnvironmentReflections(scene, renderer);
const palette = createPalette();

// 03. Modelos: plataforma, casa, canaleta y tinacos

createStage(scene, palette);
const house = createHouse(scene, palette);
const gutter = createGutter(house, palette);
const tanks = createWaterTanks(scene, palette);

// 04. Electrónica: Arduino y protoboard sobre la repisa, LCD en la pared

const electronics = new THREE.Group();
scene.add(electronics);
createArduino(electronics, palette, renderer);
const breadboard = createBreadboard(electronics, palette);
electronics.scale.setScalar(ELECTRONICS_LAYOUT.scale);
electronics.rotation.y = ELECTRONICS_LAYOUT.rotationY;
electronics.position.set(...ELECTRONICS_LAYOUT.position);

const lcd = createLcd(scene, palette);
createGlassShelf(scene, palette);
createBoardWiring(scene, electronics, breadboard, lcd.group);

// 05. Tuberías, cableado de sensores y estación de trabajo

const { inletPipe, flowPaths } = createPipes(scene, palette, tanks);
createSensorWiring(scene, tanks, electronics);
const workstation = createWorkstation(scene, palette);

// 06. Interacción: tarjetas, terminal, selección y teclado

const cards = createComponentCards();
registerHydraComponents(cards, { inletPipe, gutter, electronics, breadboard, lcd: lcd.group, tanks });
const terminal = createTerminal({ screen: workstation.screen, controls, tanks });
setupSelection({ renderer, camera, laptop: workstation.laptop, cards, terminal });
setupKeyboardControls({ renderer, controls, cards, terminal, tanks });

// 07. Simulación: lluvia y flujo de agua

const rain = createRain(scene);
const waterFlow = createWaterFlow(scene, flowPaths);

// 08. Bucle de animación

const clock = new THREE.Clock();
let terminalTimer = 0;
let lcdTimer = 1; // Empieza alto para que la LCD se actualice en el primer cuadro.

// Escribe en la LCD los datos actuales de la simulación.
function refreshLcd() {
  drawLcdScreen(lcd.display, {
    totalVolume: getTotalVolume(tanks),
    fullTanks: getFullTankCount(tanks),
    tankCount: tanks.length,
  });
}

function animate() {
  requestAnimationFrame(animate);
  const deltaTime = Math.min(clock.getDelta(), MAX_FRAME_TIME);
  systemState.elapsedTime += deltaTime;

  // Llenado y cierre de compuertas cuando todos los tinacos están llenos.
  const activeIndex = updateWaterLevels(tanks, deltaTime, systemState.raining);
  systemState.gatesClosed = areAllTanksFull(tanks);
  updateLiquidMeshes(tanks);
  updateGates(tanks, systemState.gatesClosed, deltaTime);

  updateRain(rain, deltaTime, systemState.raining);
  updateWaterFlow(waterFlow, systemState.elapsedTime, systemState.raining && !systemState.gatesClosed, activeIndex);

  // Monitor serial: una línea por segundo.
  terminalTimer += deltaTime;
  if (terminalTimer >= TERMINAL_UPDATE_INTERVAL) {
    terminal.update();
    terminalTimer = 0;
  }

  // LCD y tarjeta abierta.
  lcdTimer += deltaTime;
  if (lcdTimer >= LCD_UPDATE_INTERVAL) {
    refreshLcd();
    cards.refresh();
    lcdTimer = 0;
  }

  controls.autoRotate = systemState.autoRotate;
  controls.autoRotateSpeed = CONTROLS_CONFIG.autoRotateSpeed;
  controls.update();
  renderer.render(scene, camera);
}

// 09. Inicio

refreshLcd();
terminal.update();
animate();
enableAutoResize(camera, renderer);
