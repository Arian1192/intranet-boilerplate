import { describe, it, expect } from 'vitest';
import { NOVEDADES, cuandoNovedad, textoNovedad, HOY_NOVEDADES } from './novedades';

describe('novedades — el feed del dashboard', () => {
  it('trae los 15 eventos de la captura, en el orden del live', () => {
    expect(NOVEDADES).toHaveLength(15);
    expect(NOVEDADES[0].artista).toBe('Bassel Darwish');
    expect(NOVEDADES[NOVEDADES.length - 1].referencia).toBe('C1-2026-138');
  });

  it('escribe la fecha con los tres formatos del live', () => {
    expect(cuandoNovedad('2026-09-09T04:02')).toBe('hoy a las 04:02');
    expect(cuandoNovedad('2026-09-08T22:44')).toBe('ayer a las 22:44');
    expect(cuandoNovedad('2026-09-07T20:54')).toBe('7/9 a las 20:54');
  });

  it('el «hoy» es el día de la captura, no el reloj real', () => {
    expect(HOY_NOVEDADES).toBe('2026-09-09');
    // Con otro anclaje, el mismo evento se escribe distinto: es lo que pasaría
    // si el feed mirase la fecha real y por lo que va congelado.
    expect(cuandoNovedad('2026-09-09T04:02', '2026-09-11')).toBe('9/9 a las 04:02');
  });

  it('compone «quien + hito» sólo cuando el live nombra a alguien', () => {
    expect(textoNovedad(NOVEDADES[0])).toBe('Francisco Guzman firmó su parte');
    expect(textoNovedad(NOVEDADES[1])).toBe('Contrato firmado por todas las partes');
  });

  it('los cinco hitos de la captura, y ninguno más', () => {
    expect([...new Set(NOVEDADES.map((n) => n.hito))].sort()).toEqual([
      'Contrato enviado a firmar',
      'Contrato firmado por todas las partes',
      'abrió el contrato',
      'empezó a firmar',
      'firmó su parte',
    ]);
  });

  it('las seis referencias de contrato del live', () => {
    expect([...new Set(NOVEDADES.map((n) => n.referencia))].sort()).toEqual([
      'C1-2026-138',
      'C1-2026-158',
      'C1-2026-162',
      'C1-2026-181',
      'C1-2026-220',
      'C1-2026-223',
    ]);
  });
});
