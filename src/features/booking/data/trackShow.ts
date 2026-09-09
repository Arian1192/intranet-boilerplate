import type { ShowFase } from '@/types';

/**
 * Los seis segmentos de progreso que el live pinta en cada fila de `/shows`, en
 * su orden: `Confirm.`, `Contrato`, `Cobro`, `Itiner.`, `Gastos` y `Liquid.`.
 */
export const SEGMENTOS_TRACK = [
  'Confirm.',
  'Contrato',
  'Cobro',
  'Itiner.',
  'Gastos',
  'Liquid.',
] as const;

/** Los cuatro estados que explica la leyenda de la pantalla. */
export type EstadoSegmento = 'done' | 'prog' | 'alert' | 'none';

/**
 * ⚠️ **Esto es una DERIVACIÓN declarada, no un calco.**
 *
 * **Por qué no puede ser un calco.** En el live, cada uno de los seis segmentos
 * es un **sub-estado real de ese show concreto**, no una función de su fase.
 * Está medido sobre las **87 filas** de la captura del 2026-09-09: la misma fase
 * da patrones distintos —`Contrato` sale con **cuatro** combinaciones distintas
 * y `Tentative` con otras cuatro—, así que no hay fórmula que lo produzca. Es
 * dato. Y ese dato **no existe para nuestros 14 shows**, porque no son los 87
 * del live: no hay de dónde medirlo.
 *
 * **Qué se hace en su lugar.** En vez de inventar una fórmula, la tabla de abajo
 * guarda el **patrón medido dominante de cada fase** — el que más se repite en
 * las 87 filas, con su recuento anotado. Así la pantalla se lee como la del
 * live sin fingir una precisión que no tenemos: dentro de una misma fase el live
 * varía por show y nosotros pintamos siempre su moda.
 *
 * **Los dos anclajes que la atan.** Hay dos fases cuyo patrón es constante en el
 * live —`Sin gestión` con los seis en `none` (9 de 9 filas) y `Cerrado` con los
 * seis en `done` (1 de 1)— y esta tabla los reproduce **exactamente**. Una
 * derivación que contradijera una medida sería un fallo; ésta interpola entre
 * puntos conocidos y respeta los dos que son ciertos. Va atado con test.
 *
 * **Qué la sustituiría.** Un campo real por show con los seis sub-estados, el
 * día que el dato exista. Entonces esta tabla se borra y la fila lo lee.
 *
 * **No toca el modelo compartido.** Vive en la capa de esta pantalla y no añade
 * nada a `Show` ni a `ShowFase`: inventar en la vista es reversible, inventar en
 * el tipo se propaga a todo el que lo lea.
 */
type FaseDelLive = ShowFase | 'sin-gestion';

const N: EstadoSegmento = 'none';
const D: EstadoSegmento = 'done';
const P: EstadoSegmento = 'prog';
const A: EstadoSegmento = 'alert';

/** Patrón dominante de cada fase, con el recuento medido en las 87 filas del live. */
const TRACK_POR_FASE: Record<FaseDelLive, readonly EstadoSegmento[]> = {
  /** Anclaje medido: los 6 en `none` en las 9 filas de esta fase. */
  'sin-gestion': [N, N, N, N, N, N],
  /** 18 de 23 filas. */
  tentative: [P, A, A, P, N, N],
  /** 1 de 2 filas; la otra lleva `Gastos` en `prog`. Empate, se toma la primera. */
  confirmed: [D, A, A, P, N, N],
  /** 20 de 25 filas. */
  contract: [D, A, A, P, N, N],
  /** 14 de 20 filas. */
  pagos: [D, D, A, P, N, N],
  /** 4 de 5 filas. */
  liquidacion: [D, D, D, D, D, N],
  /** Anclaje medido: los 6 en `done` en la única fila de esta fase. */
  liquidado: [D, D, D, D, D, D],
  /** 2 de 2 filas. */
  cancelado: [P, P, N, P, N, N],
};

export function trackDeFase(fase: FaseDelLive): readonly EstadoSegmento[] {
  return TRACK_POR_FASE[fase];
}

/**
 * El borde izquierdo de la fila. En el live sale del propio track: si algún
 * segmento está en `alert`, la fila se marca en rosa; si están todos hechos, en
 * verde; si alguno va en curso, en violeta. `srow-mut` es aparte y lo llevan las
 * filas sin gestión.
 */
export function bordeDeTrack(track: readonly EstadoSegmento[]): string {
  if (track.includes('alert')) return 'h-alert';
  if (track.every((s) => s === 'done')) return 'h-ok';
  if (track.includes('prog')) return 'h-prog';
  return 'srow-mut';
}
