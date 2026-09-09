import { describe, it, expect } from 'vitest';
import {
  artistasFicha,
  REDES_ROSTER,
  MOSTRAR_FOTOS,
  KPI_BOOKING,
  KPI_MANAGEMENT,
  ARCHIVADOS,
  BADGE_SIN_CONTRATO,
  VACIO_ARTISTAS,
  iniciales,
  filtrarArtistas,
} from './artistas-ficha';

describe('el roster de /artistas', () => {
  it('son los 41 del live, en orden alfabético', () => {
    expect(artistasFicha).toHaveLength(41);
    expect(artistasFicha[0].nombre).toBe('Aaron Martin');
    expect(artistasFicha[artistasFicha.length - 1].nombre).toBe('Vidaloca');
  });

  it('cuadra con los dos contadores de la cabecera', () => {
    expect(artistasFicha.filter((a) => a.booking)).toHaveLength(KPI_BOOKING);
    expect(artistasFicha.filter((a) => a.management)).toHaveLength(KPI_MANAGEMENT);
    expect(KPI_BOOKING).toBe(41);
    expect(KPI_MANAGEMENT).toBe(17);
  });

  it('todos tienen id único', () => {
    expect(new Set(artistasFicha.map((a) => a.id)).size).toBe(41);
  });

  it('todos están «Sin contrato», como en la foto', () => {
    expect(BADGE_SIN_CONTRATO).toBe('Sin contrato');
  });

  it('guarda el archivado que el live deja plegado', () => {
    expect(ARCHIVADOS).toBe(1);
  });

  it('trae el vacío literal del panel derecho', () => {
    expect(VACIO_ARTISTAS).toBe('Selecciona un artista o crea uno nuevo.');
  });
});

describe('las fotos', () => {
  it('están guardadas pero no se pintan', () => {
    expect(MOSTRAR_FOTOS).toBe(false);
  });

  it('los tres artistas sin foto del live son los que caen a iniciales', () => {
    expect(artistasFicha.filter((a) => a.fotoUrl === null).map((a) => a.nombre)).toEqual([
      'Olivia Bass',
      'Parsa Jafari',
      'Saldivar',
    ]);
  });
});

describe('iniciales', () => {
  it('son las dos primeras letras en mayúscula, como el fallback del live', () => {
    expect(iniciales('Olivia Bass')).toBe('OL');
    expect(iniciales('Parsa Jafari')).toBe('PA');
    expect(iniciales('Saldivar')).toBe('SA');
  });
});

describe('las redes del Roster', () => {
  it('son las nueve del live, en su orden', () => {
    expect(REDES_ROSTER).toEqual([
      'Instagram',
      'Facebook',
      'TikTok',
      'Spotify',
      'Resident Advisor',
      'Beatport',
      'SoundCloud',
      'YouTube',
      'Apple Music',
    ]);
  });

  it('suman los 192 enlaces reales de la foto', () => {
    const total = artistasFicha.reduce((t, a) => t + Object.keys(a.redes).length, 0);
    expect(total).toBe(192);
  });

  it('el primer artista tiene siete enlaces y le faltan Facebook y Apple Music', () => {
    const aaron = artistasFicha[0];
    expect(Object.keys(aaron.redes)).toHaveLength(7);
    expect(aaron.redes.Instagram).toBe('https://www.instagram.com/aaronmartin.ofc/');
    expect(aaron.redes.Facebook).toBeUndefined();
    expect(aaron.redes['Apple Music']).toBeUndefined();
  });

  it('ninguna red apunta fuera de las nueve conocidas', () => {
    for (const artista of artistasFicha) {
      for (const red of Object.keys(artista.redes)) {
        expect(REDES_ROSTER).toContain(red);
      }
    }
  });
});

describe('filtrarArtistas', () => {
  it('sin texto devuelve los 41', () => {
    expect(filtrarArtistas(artistasFicha, '')).toHaveLength(41);
  });

  it('busca sin distinguir mayúsculas ni acentos', () => {
    expect(filtrarArtistas(artistasFicha, 'BIZZA').map((a) => a.nombre)).toEqual(['Bizza']);
    expect(filtrarArtistas(artistasFicha, 'sebastian').map((a) => a.nombre)).toEqual([
      'Sebastian Ledher',
    ]);
  });

  it('busca por trozo, no sólo por el principio', () => {
    expect(filtrarArtistas(artistasFicha, 'canarios').map((a) => a.nombre)).toEqual([
      'Los Canarios',
    ]);
  });

  it('devuelve vacío si no hay nadie', () => {
    expect(filtrarArtistas(artistasFicha, 'zzzz')).toEqual([]);
  });
});
