import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { categories, recipientsFor, personalTypes } from './notificaciones';

describe('notificaciones data', () => {
  it('4 categorías; solo "Solicitudes de vacaciones" sin toggle de email', () => {
    const cats = categories();
    expect(cats).toHaveLength(4);
    const vacaciones = cats.find((c) => c.id === 'vacaciones')!;
    expect(vacaciones.hasEmailToggle).toBe(false);
    expect(cats.filter((c) => c.id !== 'vacaciones').every((c) => c.hasEmailToggle)).toBe(true);
  });

  it('cada categoría tiene 15 destinatarios', () => {
    for (const c of categories()) {
      expect(recipientsFor(c.id)).toHaveLength(15);
    }
  });

  it('Carlos Pego y test marcados en las 4 categorías, con email en las 3 con toggle', () => {
    for (const c of categories()) {
      const recs = recipientsFor(c.id);
      const carlos = recs.find((r) => r.userName === 'Carlos Pego')!;
      const test = recs.find((r) => r.userName === 'test')!;
      expect(carlos.checked).toBe(true);
      expect(test.checked).toBe(true);
      if (c.hasEmailToggle) {
        expect(carlos.alsoEmail).toBe(true);
        expect(test.alsoEmail).toBe(true);
      }
    }
  });

  it('Israel Cuenca solo marcado (con email) en pedidos_reposicion', () => {
    const pedidos = recipientsFor('pedidos_reposicion').find((r) => r.userName === 'Israel Cuenca')!;
    expect(pedidos.checked).toBe(true);
    expect(pedidos.alsoEmail).toBe(true);
    const vacaciones = recipientsFor('vacaciones').find((r) => r.userName === 'Israel Cuenca')!;
    expect(vacaciones.checked).toBe(false);
  });

  it('11 tipos de notificación personal', () => {
    expect(personalTypes()).toHaveLength(11);
    expect(personalTypes().map((t) => t.label)[0]).toBe('Tus vacaciones resueltas');
  });
});
