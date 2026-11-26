// 01. Imports

import { FILL_ORDER, PRIMARY_TANK } from '../config/simulation.config.js';
import { getFullTankCount, getTankVolume, getTotalVolume, systemState } from '../simulation/system-state.js';
import { getSensorDistanceCm } from '../simulation/sensors.js';
import { getGateLabel, getServoDegrees } from '../simulation/actuators.js';

// 02. Textos de las tarjetas

// Título y descripción de cada componente. Para agregar una tarjeta nueva,
// añade una entrada aquí y regístrala en registerHydraComponents().
const COMPONENT_INFO = {
  inletPipe: {
    title: 'Tubería de captación',
    description: 'Transporta el agua desde la canaleta al tinaco principal.',
  },
  gutter: {
    title: 'Canaleta',
    description: 'Recoge el agua que escurre por el tejado.',
  },
  arduino: {
    title: 'Arduino UNO R3',
    description: 'Microcontrolador que procesa las mediciones y controla los actuadores.',
  },
  breadboard: {
    title: 'Protoboard',
    description: 'Placa de pruebas para conectar los componentes sin soldadura.',
  },
  lcd: {
    title: 'LCD 16 × 2',
    description: 'Muestra el volumen total y la cantidad de depósitos llenos.',
  },
  tank: {
    title: 'Tinaco',
    description: 'Almacena agua de lluvia. La capacidad corresponde al modelo de simulación.',
  },
  sensor: {
    title: 'Sensor ultrasónico HC-SR04',
    description: 'Mide la distancia a la superficie del agua mediante el eco ultrasónico.',
  },
  servo: {
    title: 'Servomotor',
    description: 'Acciona la compuerta de almacenamiento.',
  },
  gate: {
    title: 'Compuerta',
    description: 'Se cierra cuando los cuatro depósitos están llenos.',
  },
};

// 03. Tarjeta informativa (DOM)

// Controla la tarjeta flotante que aparece al hacer clic en un componente.
export function createComponentCards() {
  const card = document.querySelector('#component-card');
  const titleElement = document.querySelector('#component-title');
  const descriptionElement = document.querySelector('#component-description');
  const readingElement = document.querySelector('#component-reading');

  // Objeto 3D → { title, description, reading() }.
  const components = new Map();
  let selected = null;

  function register(object, title, description, reading = () => '') {
    components.set(object, { title, description, reading });
  }

  // Actualiza la lectura en vivo de la tarjeta abierta.
  function refresh() {
    if (selected && !card.hidden) readingElement.textContent = selected.reading();
  }

  function show(object) {
    selected = components.get(object);
    titleElement.textContent = selected.title;
    descriptionElement.textContent = selected.description;
    card.hidden = false;
    refresh();
  }

  function hide() {
    card.hidden = true;
    selected = null;
  }

  document.querySelector('#component-close').addEventListener('click', hide);

  return {
    register,
    show,
    hide,
    refresh,
    has: object => components.has(object),
    objects: () => components.keys(),
  };
}

// 04. Registro de los componentes de HYDRA

export function registerHydraComponents(cards, { inletPipe, gutter, electronics, breadboard, lcd, tanks }) {
  const info = COMPONENT_INFO;
  cards.register(inletPipe, info.inletPipe.title, info.inletPipe.description);
  cards.register(gutter, info.gutter.title, info.gutter.description);
  cards.register(electronics, info.arduino.title, info.arduino.description);
  cards.register(breadboard, info.breadboard.title, info.breadboard.description);
  cards.register(lcd, info.lcd.title, info.lcd.description,
    () => `${Math.round(getTotalVolume(tanks))} mL · ${getFullTankCount(tanks)}/${tanks.length} llenos`);

  tanks.forEach((tank, index) => {
    // Número del tinaco según el orden de llenado (1 = principal).
    const fillPosition = FILL_ORDER.indexOf(index) + 1;
    const primaryLabel = index === PRIMARY_TANK ? ' · Principal' : '';

    cards.register(tank.group, `${info.tank.title} ${fillPosition}${primaryLabel}`, info.tank.description,
      () => `${(tank.level * 100).toFixed(0)}% · ${getTankVolume(tank).toFixed(0)} mL`);
    cards.register(tank.sensor, info.sensor.title, info.sensor.description,
      () => `${getSensorDistanceCm(tank).toFixed(2)} cm (simulados)`);
    cards.register(tank.motor, info.servo.title, info.servo.description,
      () => `${getGateLabel(systemState.gatesClosed)} · ${getServoDegrees(systemState.gatesClosed)}°`);
    cards.register(tank.lid, info.gate.title, info.gate.description,
      () => getGateLabel(systemState.gatesClosed));
  });
}
