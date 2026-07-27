import { describe, it, expect } from 'vitest';
import { artistasLibres, mensajeDisponibilidad, ESTILOS } from './disponibilidad';

describe('disponibilidad', () => {
  it('39 artistas libres (evidencia del textarea del live)', () => {
    expect(artistasLibres).toHaveLength(39);
    expect(artistasLibres[0]).toBe('Aaron Martin');
    expect(artistasLibres).toContain('Tomi & Kesh');
  });
  it('10 estilos', () => {
    expect(ESTILOS).toHaveLength(10);
    expect(ESTILOS).toEqual([
      'Tech House', 'House', 'Deep House', 'Afro House', 'Melodic House & Techno',
      'Techno', 'Hard Techno', 'Minimal / Deep Tech', 'Progressive House', 'Trance',
    ]);
  });
  it('el mensaje lleva el encabezado con la fecha y las viñetas', () => {
    const msg = mensajeDisponibilidad(new Date('2026-07-24T00:00:00'));
    expect(msg).toContain('Disponibilidad para el 24 de julio de 2026:');
    expect(msg).toContain('• Aaron Martin');
    expect(msg.trim().split('\n').filter((l) => l.startsWith('• '))).toHaveLength(39);
  });
});
