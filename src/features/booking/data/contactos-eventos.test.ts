import { describe, it, expect } from 'vitest';
import {
  eventosPromotoras,
  filtrarEventos,
  BADGE_EVENTO,
  PLACEHOLDER_EVENTOS,
} from './contactos-eventos';

describe('eventos y promotoras de /contactos', () => {
  it('son las 23 fichas del live, en su orden', () => {
    expect(eventosPromotoras).toHaveLength(23);
    expect(eventosPromotoras[0].nombre).toBe('After Brunch');
    expect(eventosPromotoras[eventosPromotoras.length - 1].nombre).toBe('Zona Groove');
  });

  it('hoy son todas de tipo Evento: ni una promotora, aunque la pestaña las nombre', () => {
    expect(new Set(eventosPromotoras.map((e) => e.tipo))).toEqual(new Set(['Evento']));
  });

  it('trae el badge y el placeholder del live', () => {
    expect(BADGE_EVENTO).toBe('bg-indigo-100 text-indigo-700');
    expect(PLACEHOLDER_EVENTOS).toBe('Buscar evento o promotora…');
  });
});

describe('filtrarEventos', () => {
  it('sin texto los devuelve todos', () => {
    expect(filtrarEventos(eventosPromotoras, '')).toHaveLength(23);
    expect(filtrarEventos(eventosPromotoras, '   ')).toHaveLength(23);
  });

  it('busca por trozo, sin distinguir mayúsculas', () => {
    expect(filtrarEventos(eventosPromotoras, 'BOILER').map((e) => e.nombre)).toEqual(['Boiler']);
    expect(filtrarEventos(eventosPromotoras, 'brunch').map((e) => e.nombre)).toEqual([
      'After Brunch',
    ]);
  });

  it('devuelve vacío si no hay nadie', () => {
    expect(filtrarEventos(eventosPromotoras, 'zzzz')).toEqual([]);
  });
});
