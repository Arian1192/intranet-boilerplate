import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { integrations, snapshotFor, totalsFor, usageBanners, usageFailures } from './uso';

describe('uso data', () => {
  it('7 integraciones en el orden del live', () => {
    const list = integrations();
    expect(list.map((i) => i.id)).toEqual([
      'precio-vuelos', 'perfiles-artista', 'ia', 'vat', 'firma-contratos', 'correo-saliente', 'horarios-vuelos',
    ]);
  });

  it('ia tiene 4 sub-funciones gemini-flash-latest', () => {
    const ia = integrations().find((i) => i.id === 'ia')!;
    expect(ia.subfunctions).toHaveLength(4);
    expect(ia.subfunctions!.every((s) => s.model === 'gemini-flash-latest')).toBe(true);
    expect(ia.subfunctions!.map((s) => s.label)).toEqual(['Triaje de incidencias', 'Chat de ayuda', 'copys', 'mejorar']);
  });

  it('snapshotFor(precio-vuelos, 30d) trae el importe incluido y por-uso', () => {
    const s = snapshotFor('precio-vuelos', '30d')!;
    expect(s.usos).toBe(5);
    expect(s.errors).toBe(3);
    expect(s.perUse).toBe(8.58);
    expect(s.includedNote).toBe('5 de 30.000 incluidas');
  });

  it('snapshotFor(perfiles-artista) refleja el uso live de Spotify/Deezer', () => {
    const s = snapshotFor('perfiles-artista', '30d')!;
    expect(s.usos).toBe(58);
    expect(s.perUse).toBe(0.19);
  });

  it('snapshotFor(vat) conserva los 4 errores live', () => {
    const s = snapshotFor('vat', '30d')!;
    expect(s.usos).toBe(4);
    expect(s.errors).toBe(4);
  });

  it('totalsFor(30d) coincide con el live', () => {
    const t = totalsFor('30d');
    expect(t.cuotaFijaMes).toBeCloseTo(53.89);
    expect(t.gastoTotalPeriodo).toBeCloseTo(53.92);
    expect(t.errores).toBe(7);
  });

  it('usageBanners: 2 banners, el primero con link Rellenar precios', () => {
    const banners = usageBanners();
    expect(banners).toHaveLength(2);
    expect(banners[0].linkLabel).toBe('Rellenar precios');
  });

  it('usageFailures lista los últimos 7 fallos live', () => {
    const failures = usageFailures();
    expect(failures).toHaveLength(7);
    expect(failures[0]).toMatchObject({ integration: 'vat', message: 'CONFIG_GB' });
  });
});
