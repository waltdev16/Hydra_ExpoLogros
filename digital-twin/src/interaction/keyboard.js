// 01. Imports

import { resetSimulation, systemState } from '../simulation/system-state.js';

// 02. Controles de teclado y ratón

// Espacio o doble clic: lluvia ON/OFF · R: reiniciar · A: rotación automática
// Esc: cerrar la tarjeta (y la terminal, de forma nativa del <dialog>).
export function setupKeyboardControls({ renderer, controls, cards, terminal, tanks }) {
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') cards.hide();

    // Con la terminal abierta el teclado no afecta la simulación.
    if (terminal.isOpen()) return;

    if (event.code === 'Space') {
      event.preventDefault(); // Evita que la página haga scroll.
      systemState.raining = !systemState.raining;
    }
    if (event.key.toLowerCase() === 'r') resetSimulation(tanks);
    if (event.key.toLowerCase() === 'a') systemState.autoRotate = !systemState.autoRotate;
  });

  renderer.domElement.addEventListener('dblclick', () => {
    systemState.raining = !systemState.raining;
  });

  // Si el usuario mueve la cámara, se detiene la rotación automática.
  controls.addEventListener('start', () => {
    systemState.autoRotate = false;
  });
}
