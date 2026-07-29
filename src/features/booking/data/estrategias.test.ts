import { describe, it, expect } from 'vitest';
import {
  ARTISTAS_ESTRATEGIA,
  artistasEstrategia,
  FRENTES_ESTRATEGIA,
  VACIO_ESTRATEGIA,
} from './estrategias';

describe('estrategias de management', () => {
  it('son los 22 artistas del live, en el mismo orden', () => {
    expect(ARTISTAS_ESTRATEGIA).toEqual([
      'Aaron Martin',
      'Abdon',
      'ACA',
      'ART NO LOGIA',
      'Bizza',
      'Claudia Tejeda',
      'DH Moon',
      'Fran Hernandez',
      'Freddy Bello',
      'Gaston Zani',
      'Janse',
      'Londonground',
      'Los Canarios',
      'Marcel BS',
      'MI',
      'Milan Rivellino',
      'Sebastian Ledher',
      'SO',
      'SOVA',
      'Test Artist',
      'Tony Guerra',
      'Vidaloca',
    ]);
    expect(ARTISTAS_ESTRATEGIA).toHaveLength(22);
  });

  it('cada artista tiene un id único derivado del nombre', () => {
    expect(artistasEstrategia[0]).toEqual({ id: 'aaron-martin', nombre: 'Aaron Martin' });
    expect(artistasEstrategia.find((a) => a.nombre === 'ART NO LOGIA')?.id).toBe('art-no-logia');
    expect(new Set(artistasEstrategia.map((a) => a.id)).size).toBe(22);
  });

  it('los frentes son los que anuncia la bajada', () => {
    expect(FRENTES_ESTRATEGIA).toEqual(['Shows', 'Música', 'Patrocinios', 'Conexiones']);
  });

  it('el vacío es el texto del live', () => {
    expect(VACIO_ESTRATEGIA).toBe('Selecciona un artista para ver su estrategia.');
  });
});
