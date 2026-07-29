import { formatImporte } from './cobros';

export interface MovimientoGasto {
  id: string;
  concepto: string;
  cuenta: string;
  fecha: string;
  importe: number;
  /** Show con el que está conciliado; null mientras está sin asignar. */
  showId: string | null;
}

export interface CuentaHolded {
  id: string;
  nombre: string;
}

/**
 * El live no llega a pintar movimientos: se queda en «Cargando movimientos de
 * Holded…» con los tres contadores a cero. Reproducimos ese estado.
 */
export const movimientos: MovimientoGasto[] = [];
export const cuentas: CuentaHolded[] = [];
export const CARGANDO_MOVIMIENTOS: boolean = true;
export const MENSAJE_CARGANDO = 'Cargando movimientos de Holded…';

export interface GastosKpis {
  sinAsignarImporte: number;
  sinAsignarMovimientos: number;
  movimientosTotal: number;
  cuentas: number;
}

export function gastosKpis(
  list: MovimientoGasto[] = movimientos,
  cuentasList: CuentaHolded[] = cuentas
): GastosKpis {
  const sinAsignar = list.filter((movimiento) => movimiento.showId === null);
  return {
    sinAsignarImporte: sinAsignar.reduce((acc, movimiento) => acc + movimiento.importe, 0),
    sinAsignarMovimientos: sinAsignar.length,
    movimientosTotal: list.length,
    cuentas: cuentasList.length,
  };
}

export { formatImporte };
