import { describe, it, expect } from 'vitest';
import { filtrarNovedades, normalizar, alternar, FILTRO_VACIO } from './filtrar';
import { novedades } from '../data/novedades';

describe('normalizar', () => {
  it('quita acentos y mayúsculas', () => {
    expect(normalizar('Facturación')).toBe('facturacion');
    expect(normalizar('BÚSQUEDA')).toBe('busqueda');
  });
});

describe('alternar', () => {
  it('añade lo que no está y quita lo que sí', () => {
    expect(alternar([], 'CRM')).toEqual(['CRM']);
    expect(alternar(['CRM'], 'CRM')).toEqual([]);
    expect(alternar(['CRM'], 'UI')).toEqual(['CRM', 'UI']);
  });
});

describe('filtrarNovedades', () => {
  it('sin filtros devuelve las 36 entradas del live', () => {
    expect(filtrarNovedades(novedades, FILTRO_VACIO)).toHaveLength(36);
  });

  it('el segmentado filtra por tipo', () => {
    const mejoras = filtrarNovedades(novedades, { ...FILTRO_VACIO, tipo: 'Mejora' });
    expect(mejoras.length).toBeGreaterThan(0);
    expect(mejoras.every((n) => n.tipo === 'Mejora')).toBe(true);
  });

  it('los chips de módulo acumulan en OR', () => {
    const solo = filtrarNovedades(novedades, { ...FILTRO_VACIO, modulos: ['Euphoric'] });
    expect(solo.every((n) => n.modulo === 'Euphoric')).toBe(true);

    const dos = filtrarNovedades(novedades, { ...FILTRO_VACIO, modulos: ['Euphoric', 'Inicio'] });
    expect(dos.length).toBeGreaterThan(solo.length);
    expect(dos.every((n) => n.modulo === 'Euphoric' || n.modulo === 'Inicio')).toBe(true);
  });

  it('los chips de tag acumulan en OR', () => {
    const res = filtrarNovedades(novedades, { ...FILTRO_VACIO, tags: ['Spotify'] });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((n) => n.tags.includes('Spotify'))).toBe(true);
  });

  it('módulo y tipo se combinan en AND', () => {
    const res = filtrarNovedades(novedades, { ...FILTRO_VACIO, tipo: 'Nuevo', modulos: ['Euphoric'] });
    expect(res.every((n) => n.tipo === 'Nuevo' && n.modulo === 'Euphoric')).toBe(true);
  });

  it('el buscador ignora acentos y busca también en el detalle', () => {
    const porTitulo = filtrarNovedades(novedades, { ...FILTRO_VACIO, texto: 'factura' });
    expect(porTitulo.length).toBeGreaterThan(0);
    // «Facturación» se encuentra escribiendo sin tilde
    expect(filtrarNovedades(novedades, { ...FILTRO_VACIO, texto: 'facturacion' }).length).toBeGreaterThan(0);
  });

  it('un texto que no existe deja la lista vacía', () => {
    expect(filtrarNovedades(novedades, { ...FILTRO_VACIO, texto: 'zzzznoexiste' })).toEqual([]);
  });
});

describe('dataset de novedades', () => {
  it('trae las 36 entradas del live con sus campos', () => {
    expect(novedades).toHaveLength(36);
    for (const n of novedades) {
      expect(n.titulo).toBeTruthy();
      expect(n.resumen).toBeTruthy();
      expect(n.fecha).toMatch(/^\d{1,2} de \w+ de 2026$/);
      expect(n.tags.length).toBeGreaterThan(0);
      expect(n.detalle.paraQuien.length).toBeGreaterThan(0);
    }
  });

  it('16 de las 36 vienen sin leer, como en el live', () => {
    expect(novedades.filter((n) => n.noLeida)).toHaveLength(16);
  });

  it('la primera entrada es la del 29 de julio sobre facturas compartidas', () => {
    expect(novedades[0].titulo).toBe('Una factura puede cubrir varios shows');
    expect(novedades[0].tipo).toBe('Nuevo');
    expect(novedades[0].modulo).toBe('ConceptOne');
    expect(novedades[0].fecha).toBe('29 de julio de 2026');
  });
});
