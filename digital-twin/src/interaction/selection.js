// 01. Imports

import * as THREE from 'three';

// 02. Configuración

// Si el puntero se mueve menos que esto entre presionar y soltar, cuenta como clic
// (y no como arrastre para girar la cámara).
const CLICK_TOLERANCE_PX = 6;

// 03. Selección con el puntero

// Detecta clics sobre componentes: abre su tarjeta, o la terminal si es la laptop.
export function setupSelection({ renderer, camera, laptop, cards, terminal }) {
  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pressPosition = null;

  // Lanza un rayo desde la cámara y sube por la jerarquía hasta encontrar
  // la laptop o un componente registrado.
  function pick(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);

    for (const intersection of raycaster.intersectObjects([laptop, ...cards.objects()], true)) {
      let object = intersection.object;
      while (object) {
        if (object === laptop) return laptop;
        if (cards.has(object)) return object;
        object = object.parent;
      }
    }
    return null;
  }

  canvas.addEventListener('pointerdown', event => {
    pressPosition = [event.clientX, event.clientY];
  });

  canvas.addEventListener('pointerup', event => {
    const isClick = pressPosition
      && Math.hypot(event.clientX - pressPosition[0], event.clientY - pressPosition[1]) < CLICK_TOLERANCE_PX;

    if (isClick) {
      const object = pick(event);
      if (object === laptop) {
        cards.hide();
        terminal.open();
      } else if (object) {
        cards.show(object);
      } else {
        cards.hide();
      }
    }
    pressPosition = null;
  });

  // Cursor de mano sobre los objetos interactivos.
  canvas.addEventListener('pointermove', event => {
    canvas.style.cursor = pick(event) ? 'pointer' : 'grab';
  });
}
