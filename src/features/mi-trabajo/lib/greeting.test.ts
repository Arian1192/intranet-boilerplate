import { describe, it, expect } from 'vitest';
import { saludo } from './greeting';

describe('saludo', () => {
  it('usa «Buenos días» por la mañana y hasta primera hora de la tarde', () => {
    // El live devolvía «Buenos días» a las 13:14 → el corte está en las 14:00.
    expect(saludo('Test', new Date(2026, 6, 29, 8, 0))).toBe('Buenos días, Test');
    expect(saludo('Test', new Date(2026, 6, 29, 13, 14))).toBe('Buenos días, Test');
  });

  it('usa «Buenas tardes» de 14:00 a 20:59', () => {
    expect(saludo('Test', new Date(2026, 6, 29, 14, 0))).toBe('Buenas tardes, Test');
    expect(saludo('Test', new Date(2026, 6, 29, 20, 59))).toBe('Buenas tardes, Test');
  });

  it('usa «Buenas noches» a partir de las 21:00', () => {
    expect(saludo('Test', new Date(2026, 6, 29, 21, 0))).toBe('Buenas noches, Test');
    expect(saludo('Test', new Date(2026, 6, 29, 3, 0))).toBe('Buenas noches, Test');
  });

  it('saluda solo con el nombre de pila', () => {
    expect(saludo('Test User', new Date(2026, 6, 29, 9, 0))).toBe('Buenos días, Test');
  });

  it('aguanta un nombre vacío sin dejar la coma colgando', () => {
    expect(saludo('  ', new Date(2026, 6, 29, 9, 0))).toBe('Buenos días');
  });
});
