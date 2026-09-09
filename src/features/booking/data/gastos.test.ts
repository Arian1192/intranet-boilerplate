import { describe, it, expect } from 'vitest';
import {
  movimientos,
  cuentas,
  gastosKpis,
  formatImporte,
  MENSAJE_CARGANDO,
  type MovimientoGasto,
} from './gastos';

describe('gastos — espejo del live', () => {
  it('no hay movimientos ni cuentas cargadas', () => {
    expect(movimientos).toHaveLength(0);
    expect(cuentas).toHaveLength(0);
  });

  it('los 3 KPIs salen a cero como en el live', () => {
    const kpis = gastosKpis();
    expect(formatImporte(kpis.sinAsignarImporte)).toBe('0,00 €');
    expect(kpis.sinAsignarMovimientos).toBe(0);
    expect(kpis.movimientosTotal).toBe(0);
    expect(kpis.cuentas).toBe(0);
  });

  it('el aviso de carga es el del live', () => {
    expect(MENSAJE_CARGANDO).toBe('Cargando movimientos de Holded…');
  });

  it('sólo cuenta como sin asignar lo que no está conciliado con un show', () => {
    const fixture: MovimientoGasto[] = [
      { id: 'm1', concepto: 'Vuelo', cuenta: 'Banco', fecha: '2026-07-01', importe: 120, showId: null },
      { id: 'm2', concepto: 'Hotel', cuenta: 'Banco', fecha: '2026-07-02', importe: 80, showId: 'load' },
      { id: 'm3', concepto: 'Taxi', cuenta: 'PayPal', fecha: '2026-07-03', importe: 30.5, showId: null },
    ];
    const kpis = gastosKpis(fixture, [
      { id: 'c1', nombre: 'Banco' },
      { id: 'c2', nombre: 'PayPal' },
    ]);
    expect(kpis.sinAsignarMovimientos).toBe(2);
    expect(formatImporte(kpis.sinAsignarImporte)).toBe('150,50 €');
    expect(kpis.movimientosTotal).toBe(3);
    expect(kpis.cuentas).toBe(2);
  });
});
