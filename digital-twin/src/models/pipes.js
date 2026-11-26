// 01. Imports

import { PRIMARY_TANK } from '../config/simulation.config.js';
import { createTube } from '../utils/geometry.js';
import { toEquipmentWorld } from './water-tanks.js';

// 02. Recorridos del agua

// Recorrido del agua dentro de la canaleta (coordenadas de la escena).
const GUTTER_FLOW_PATH = [
  [-0.6015, 5.3785, -6.3875],
  [-0.6015, 5.3785, -1.1],
  [-0.6015, 5.3785, 2.0725],
];

// Tuberías entre tinacos (coordenadas locales del grupo de tinacos),
// en el mismo orden que el llenado: 2 → 0 → 1 → 3.
const TANK_LINKS = [
  [[-0.75, 0.49, 0.04], [-0.75, 0.49, -0.15], [-0.75, 0.49, -0.34]], // 2 → 0, lado izquierdo.
  [[-0.24, 0.49, -0.85], [-0.13, 0.49, -0.85], [-0.03, 0.49, -0.85]], // 0 → 1, fondo.
  [[0.48, 0.49, -0.34], [0.48, 0.49, -0.15], [0.48, 0.49, 0.04]], // 1 → 3, lado derecho.
];

const LINK_RADIUS = 0.09;
const INLET_RADIUS = 0.085;

// 03. Tubería de captación

// Puntos de la bajante: sale del extremo de la canaleta, baja por la pared
// y entra por la tapa del tinaco principal.
function getInletPipePoints(primaryTank) {
  const inlet = toEquipmentWorld([primaryTank.x, 1.78, primaryTank.z + 0.24]);
  return [
    [-0.6015, 5.3785, 2.0725],
    [-0.6, 5.14, 2.0725],
    [-0.88, 4.92, 1.85],
    [-0.88, 4.65, -2.3],
    [-0.65, 4.43, inlet[2]],
    [inlet[0], 3.65, inlet[2]],
    inlet,
  ];
}

// 04. Creación de tuberías

// Crea las conexiones entre tinacos y la tubería de captación.
// Devuelve también los recorridos que usa la animación del agua.
export function createPipes(scene, palette, tanks) {
  const linkPaths = TANK_LINKS.map(points => points.map(toEquipmentWorld));
  for (const points of linkPaths) {
    createTube(points, LINK_RADIUS, palette.pipe, scene);
  }

  const inletPoints = getInletPipePoints(tanks[PRIMARY_TANK]);
  const inletPipe = createTube(inletPoints, INLET_RADIUS, palette.pipe, scene);

  // Orden de los recorridos: canaleta, captación y conexiones 2→0, 0→1, 1→3.
  const flowPaths = [GUTTER_FLOW_PATH, inletPoints, ...linkPaths];
  return { inletPipe, flowPaths };
}
