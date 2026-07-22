import { describe, it, expect } from 'vitest';
import { MIXMAG, TAGMAG } from './seed';

describe('seeds de redacción', () => {
  it('MIXMAG espeja el live', () => {
    expect(MIXMAG.name).toBe('Mixmag');
    expect(MIXMAG.spaceName).toBe('Mixmag Spain');
    expect(MIXMAG.accent).toBe('#E11D48');
    expect(MIXMAG.basePath).toBe('/mixmag');
    expect(MIXMAG.resumen.enCurso).toBe(4);
    expect(MIXMAG.resumen.revistaAbierta).toBe('Patrick Topping (Agosto 2026)');
    expect(MIXMAG.editions).toHaveLength(1);
    expect(MIXMAG.editions[0]).toMatchObject({
      number: 29, title: 'Patrick Topping', monthLabel: 'Agosto 2026',
      status: 'En preparación', readyCount: 0, totalCount: 1, percent: 0,
    });
  });

  it('TAGMAG es gemela con datos propios', () => {
    expect(TAGMAG.name).toBe('TAGMAG');
    expect(TAGMAG.spaceName).toBe('TAGMAG');
    expect(TAGMAG.accent).toBe('#0EA5E9');
    expect(TAGMAG.basePath).toBe('/tagmag');
    expect(TAGMAG.resumen.enCurso).toBe(0);
    expect(TAGMAG.resumen.revistaAbierta).toBeUndefined();
    expect(TAGMAG.editions).toHaveLength(0);
  });
});
