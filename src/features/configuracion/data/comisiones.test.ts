import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { commissionSettings, bookerCommissions, ledgerTotals } from './comisiones';

describe('comisiones data', () => {
  it('ajustes globales exactos del live', () => {
    expect(commissionSettings()).toEqual({
      globalPercent: 25, exclusivityWindowDays: 30, exclusivityRadiusKm: 100, logisticJumpKm: 600,
    });
  });

  it('15 bookers, todos al 25%', () => {
    const list = bookerCommissions();
    expect(list).toHaveLength(15);
    expect(list.every((b) => b.percent === 25)).toBe(true);
    expect(list[0].bookerName).toBe('Alba Gelabert');
  });

  it('ledgerTotals: los 3 en 0 (estado vacío real del live)', () => {
    expect(ledgerTotals()).toEqual({ devengadoTotal: 0, abonado: 0, pendienteDeAbonar: 0 });
  });
});
