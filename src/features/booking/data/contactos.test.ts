import { describe, it, expect } from 'vitest';
import { venues, empresas } from './contactos';

describe('contactos — venues (evidencia venues-full.json)', () => {
  it('18 venues con badges de evidencia', () => {
    expect(venues).toHaveLength(18);
    const casa = venues.find((v) => v.name === 'Casa del Mar')!;
    expect(casa).toMatchObject({ city: 'Isla Santa Catalina', country: 'USA', ubicado: false, aforo: 600 });
    const fab = venues.find((v) => v.name === 'La Fábrica')!;
    expect(fab).toMatchObject({ city: null, country: null, ubicado: false, aforo: null });
    const ku = venues.find((v) => v.name === 'Ku Barcelona')!;
    expect(ku).toMatchObject({ ubicado: true, aforo: 1500 });
  });
  it('conserva la dirección literal del recon', () => {
    const bassment = venues.find((v) => v.name === 'Bassment')!;
    expect(bassment.address).toBe('C. de Galileo, 26, Chamberí, 28015 Madrid, España');
  });
});

describe('contactos — empresas (evidencia empresas-full.json)', () => {
  it('117 empresas en orden alfabético con formato de contacto', () => {
    expect(empresas).toHaveLength(117);
    expect(empresas[0].name).toBe('1A PROJECTS 1802 SL');
    const ban = empresas.find((e) => e.name === 'BAN MUSIC WORLDWIDE SL')!;
    expect(ban).toMatchObject({ sinDatos: true, contactCount: 1 });
    const primera = empresas.find((e) => e.name === '1A PROJECTS 1802 SL')!;
    expect(primera).toMatchObject({ city: 'Barcelona', email: 'oneartbarcelona@gmail.com' });
  });
});
