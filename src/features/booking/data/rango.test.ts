import { describe, it, expect } from 'vitest';
import { dentroDeRango, type Rango } from './rango';

const porDefecto: Rango = { desde: 'ultima-semana', hasta: 'todo-futuro' };

describe('dentroDeRango (HOY = 2026-07-24)', () => {
  it('un show sin fecha (date null) siempre pasa', () => {
    expect(dentroDeRango(null, porDefecto)).toBe(true);
    expect(dentroDeRango(null, { desde: 'ultima-semana', hasta: 'hasta-hoy' })).toBe(true);
  });

  it('el rango por defecto (última semana → todo el futuro) admite todas las fechas de la lista', () => {
    expect(dentroDeRango('18 jul 2026', porDefecto)).toBe(true);
    expect(dentroDeRango('26 sept 2026', porDefecto)).toBe(true);
  });

  it('"hasta hoy" deja fuera lo posterior al 24 jul 2026 pero mantiene lo anterior', () => {
    const rango: Rango = { desde: 'ultima-semana', hasta: 'hasta-hoy' };
    expect(dentroDeRango('18 jul 2026', rango)).toBe(true); // dentro de la última semana
    expect(dentroDeRango('21 jul 2026', rango)).toBe(true);
    expect(dentroDeRango('25 jul 2026', rango)).toBe(false); // futuro
    expect(dentroDeRango('04 sept 2026', rango)).toBe(false);
  });

  it('"todo el pasado" no aplica límite inferior', () => {
    expect(dentroDeRango('01 ene 2020', { desde: 'todo-pasado', hasta: 'todo-futuro' })).toBe(true);
  });
});
