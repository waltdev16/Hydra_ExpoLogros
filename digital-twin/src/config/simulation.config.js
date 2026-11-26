// HYDRA V7.1 — Simulation parameters.
// Todos los valores de comportamiento de la simulación se ajustan aquí.

// 01. Llenado de los tinacos

// Fracción del depósito que se llena por segundo (0.35 = 35 % por segundo).
export const FILL_RATE = 0.35;

// Orden de llenado usando los índices de TANK_POSITIONS (scene.config.js):
// 2 = frente izquierdo, 0 = fondo izquierdo, 1 = fondo derecho, 3 = frente derecho.
export const FILL_ORDER = [2, 0, 1, 3];

// El primer tinaco del orden recibe la tubería de captación y es el "principal".
export const PRIMARY_TANK = FILL_ORDER[0];

// Nivel (0 a 1) a partir del cual un tinaco se considera lleno.
export const FULL_THRESHOLD = 0.999;

// 02. Capacidad y sensores (medidas del prototipo físico de 2025)

// Altura y radio del recipiente en cm, iguales a alturaLata y radioLata del firmware.
export const TANK_HEIGHT_CM = 11;
export const TANK_RADIUS_CM = 3;

// Capacidad de cada depósito en mL (π · r² · h ≈ 311 mL).
export const TANK_CAPACITY_ML = Math.PI * TANK_RADIUS_CM ** 2 * TANK_HEIGHT_CM;

// 03. Compuertas y servomotores

export const GATE_CONFIG = {
  openLidAngle: -0.85, // Rotación de la tapa abierta (radianes).
  closedLidAngle: 0,
  openServoAngle: 0, // Rotación del brazo del servo (radianes).
  closedServoAngle: Math.PI,
  openServoDegrees: 0, // Valor mostrado en la terminal, como servoMotor.write().
  closedServoDegrees: 180,
  animationSpeed: 4, // Rapidez con la que la tapa alcanza su posición.
};

// 04. Lluvia

export const RAIN_CONFIG = {
  dropCount: 260, // Intensidad: número de gotas.
  area: { minX: -8.5, width: 7.2, minY: 9, height: 4, minZ: -5.4, depth: 8.3 },
  minSpeed: 2, // Velocidad de caída de las gotas (unidades por segundo).
  speedRange: 2, // Variación aleatoria añadida a minSpeed.
  respawnHeight: 12, // Altura a la que reaparece una gota al tocar el tejado.
  roofPeakHeight: 8.05, // Altura de la cumbrera usada para detectar el impacto.
  roofSlope: 0.7,
  streakOffsetX: 0.025, // Forma del trazo de cada gota.
  streakLength: 0.16,
  color: 0x91d6ff,
  opacity: 0.45,
};

// 05. Circulación del agua por las tuberías

export const WATER_FLOW_CONFIG = {
  speed: 0.65, // Vueltas por segundo de las gotas dentro de cada tubería.
  beadsPerPipe: 12,
  beadRadius: 0.026,
  beadColor: 0x51caff,
};

// 06. Tiempos de actualización (segundos)

export const MAX_FRAME_TIME = 0.05; // Evita saltos grandes si la pestaña se pausa.
export const LCD_UPDATE_INTERVAL = 0.35;
export const TERMINAL_UPDATE_INTERVAL = 1;

// 07. Monitor serial simulado

export const SERIAL_HISTORY_LINES = 100; // Líneas guardadas en el monitor serial.
export const SCREEN_VISIBLE_LINES = 10; // Líneas mostradas en la pantalla 3D de la laptop.
