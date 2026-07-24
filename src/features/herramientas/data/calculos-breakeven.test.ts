import { describe, it, expect } from 'vitest';
import { calcularBreakeven } from './calculos-breakeven';
import { seedProyecciones } from './seed';
import type { Proyeccion } from './types';

const p = seedProyecciones[0];

describe('calcularBreakeven', () => {
  it('reproduce exactamente el breakeven del live con las vías del seed (ticketing+barras): 77% · 461 · 511', () => {
    const r = calcularBreakeven(p);
    expect(r).not.toBeNull();
    expect(r!.pctVentaProyectada).toBe(77);
    expect(r!.entradasNecesarias).toBe(461);
    expect(r!.asistenciaNecesaria).toBe(511);
  });

  it('devuelve null si no hay vías marcadas (nada que sumar, no se puede alcanzar el punto de equilibrio)', () => {
    const sinVias: Proyeccion = { ...p, ajustesEscenarios: { ...p.ajustesEscenarios, viasBreakeven: [] } };
    expect(calcularBreakeven(sinVias)).toBeNull();
  });

  it('devuelve null si los gastos superan lo alcanzable incluso al 100% de las vías marcadas', () => {
    const gastosEnormes: Proyeccion = {
      ...p,
      gastos: [{ id: 'g', categoria: 'Otros', concepto: 'x', base: 'importe_fijo', valor: 1_000_000, paga: 'nosotros' }],
    };
    expect(calcularBreakeven(gastosEnormes)).toBeNull();
  });

  it('si los gastos ya están cubiertos con 0 ventas (gastos=0), el breakeven es 0%', () => {
    const sinGastos: Proyeccion = { ...p, gastos: [] };
    const r = calcularBreakeven(sinGastos);
    expect(r).not.toBeNull();
    expect(r!.pctVentaProyectada).toBe(0);
    expect(r!.entradasNecesarias).toBe(0);
  });

  it('con otra combinación de vías (solo ticketing) da un resultado distinto', () => {
    const soloTicketing: Proyeccion = { ...p, ajustesEscenarios: { ...p.ajustesEscenarios, viasBreakeven: ['ticketing'] } };
    const r = calcularBreakeven(soloTicketing);
    expect(r).not.toBeNull();
    expect(r!.pctVentaProyectada).not.toBe(77);
  });
});
