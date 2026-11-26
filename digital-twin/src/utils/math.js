// 01. Imports

import { SCENE_RANDOM_SEED } from '../config/scene.config.js';

// 02. Generador pseudoaleatorio

// Generador congruencial lineal: con la misma semilla produce siempre la misma
// secuencia, así los arbustos, la grava y la lluvia aparecen igual en cada carga.
function createSeededRandom(seed) {
  let state = seed;
  return function random() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

// 03. Exports

// Instancia compartida por toda la escena. El orden de las llamadas importa:
// primero el jardín, después la lluvia.
export const random = createSeededRandom(SCENE_RANDOM_SEED);
