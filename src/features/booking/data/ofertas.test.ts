import { describe, it, expect } from 'vitest';
import {
  OFERTA_FILTROS,
  OFERTA_FILTRO_INICIAL,
  ofertas,
  filterOfertas,
  contarOfertas,
  type Oferta,
} from './ofertas';

const fixture: Oferta[] = (
  [
    ['o1', 'Nueva'],
    ['o2', 'Nueva'],
    ['o3', 'Revisada'],
    ['o4', 'Convertida'],
    ['o5', 'Descartada'],
  ] as const
).map(([id, estado]) => ({
  id,
  artista: 'Bizza',
  promotor: 'Promotor',
  email: 'p@ejemplo.com',
  evento: 'Evento',
  ciudad: 'Ibiza',
  fecha: '2026-08-20',
  cache: 1000,
  estado,
  mensaje: 'Hola',
  recibida: '2026-07-01',
}));

describe('ofertas entrantes', () => {
  it('los filtros son los cinco del live y en orden', () => {
    expect(OFERTA_FILTROS).toEqual([
      'Todas',
      'Nuevas',
      'Revisadas',
      'Convertidas',
      'Descartadas',
    ]);
  });

  it('entra marcado el filtro Nuevas', () => {
    expect(OFERTA_FILTRO_INICIAL).toBe('Nuevas');
  });

  it('la bandeja del live está vacía: todos los contadores a 0', () => {
    expect(ofertas).toHaveLength(0);
    for (const filtro of OFERTA_FILTROS) {
      expect(contarOfertas(ofertas, filtro)).toBe(0);
    }
  });

  it('Todas no filtra y cada filtro cuenta su estado', () => {
    expect(filterOfertas(fixture, 'Todas')).toHaveLength(5);
    expect(contarOfertas(fixture, 'Nuevas')).toBe(2);
    expect(contarOfertas(fixture, 'Revisadas')).toBe(1);
    expect(contarOfertas(fixture, 'Convertidas')).toBe(1);
    expect(contarOfertas(fixture, 'Descartadas')).toBe(1);
  });
});
