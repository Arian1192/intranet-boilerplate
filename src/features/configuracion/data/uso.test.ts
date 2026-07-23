import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { integrations, snapshotFor, totalsFor, usageBanners } from './uso';

describe('uso data', () => {
  it('6 integraciones en el orden del live', () => {
    const list = integrations();
    expect(list.map((i) => i.id)).toEqual([
      'precio-vuelos', 'ia', 'correo-saliente', 'firma-contratos', 'perfiles-artista', 'horarios-vuelos',
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
    expect(s.usos).toBe(1);
    expect(s.perUse).toBe(42.89);
    expect(s.includedNote).toBe('1 de 30.000 incluidas');
  });

  it('snapshotFor(perfiles-artista) perUse es null (nunca usado, sin cifra)', () => {
    const s = snapshotFor('perfiles-artista', '30d')!;
    expect(s.perUse).toBeNull();
  });

  it('snapshotFor(firma-contratos) no tiene fila de métricas en el live', () => {
    expect(snapshotFor('firma-contratos', '30d')).toBeUndefined();
  });

  it('totalsFor(30d) coincide con el live', () => {
    const t = totalsFor('30d');
    expect(t.cuotaFijaMes).toBeCloseTo(53.89);
    expect(t.gastoTotalPeriodo).toBeCloseTo(53.92);
    expect(t.errores).toBe(0);
  });

  it('usageBanners: 3 banners, el primero con link Rellenar precios', () => {
    const banners = usageBanners();
    expect(banners).toHaveLength(3);
    expect(banners[0].linkLabel).toBe('Rellenar precios');
  });
});
