import { describe, it, expect } from 'vitest';
import {
  liquidaciones,
  liquidacionesKpis,
  agruparPorArtista,
  filtrarLiquidaciones,
  buscarLiquidaciones,
  formatImporteLiquidacion,
  formatFechaLiquidacion,
  formatPosicionNeta,
  badgeEstado,
  ESTADOS_LIQUIDACION,
  OPCIONES_ESTADO,
  DEUDA_VIVA,
} from './liquidaciones';

describe('liquidaciones — seed espejo del live (2026-09-09, 10:08-10:14 CEST)', () => {
  it('son los 243 shows que el live rotula «243 shows»', () => {
    expect(liquidaciones).toHaveLength(243);
  });

  it('la primera fila es la del live, celda a celda', () => {
    const primera = liquidaciones[0];
    expect(primera.artista).toBe('Olivia Bass');
    expect(primera.codigo).toBe('C1-2026-155');
    expect(primera.evento).toBe('OASIS · Oasis · Maspalomas');
    expect(formatFechaLiquidacion(primera.fecha)).toBe('24 dic 2026');
    expect(primera.cobrado).toBe(0);
    expect(primera.pendCobrar).toBe(960);
    expect(primera.aRecuperar).toBeNull();
    expect(primera.netoArtista).toBe(800);
    expect(primera.liquidado).toBeNull();
    expect(primera.pendLiquidar).toBe(800);
    expect(primera.estado).toBe('Sin liquidar');
  });

  it('el reparto por estado es el del live', () => {
    const cuenta = (estado: string) => liquidaciones.filter((l) => l.estado === estado).length;
    expect(cuenta('Sin liquidar')).toBe(197);
    expect(cuenta('Liquidado')).toBe(23);
    expect(cuenta('Pendiente liquidar')).toBe(20);
    expect(cuenta('Parcialmente liquidado')).toBe(3);
    // El live ofrece «Incidencia» en el filtro pero hoy no hay ninguna fila así.
    expect(cuenta('Incidencia')).toBe(0);
  });

  it('viene ordenado por fecha descendente, con el show sin fecha al final', () => {
    const conFecha = liquidaciones.filter((l) => l.fecha !== null).map((l) => l.fecha!);
    expect([...conFecha].sort().reverse()).toEqual(conFecha);
    expect(liquidaciones[liquidaciones.length - 1].fecha).toBeNull();
  });
});

describe('liquidacionesKpis — los tres KPI de cabecera', () => {
  it('reproduce al céntimo «PENDIENTE DE COBRAR» y «GASTOS POR RECUPERAR»', () => {
    const kpis = liquidacionesKpis(liquidaciones);
    expect(formatImporteLiquidacion(kpis.pendienteCobrar)).toBe('172.489,88 €');
    expect(formatImporteLiquidacion(kpis.gastosPorRecuperar)).toBe('1006,43 €');
  });

  it('«PENDIENTE DE LIQUIDAR» queda a un céntimo del live, que suma sin redondear', () => {
    // El live imprime 124.050,25 €: suma los valores exactos y redondea al final.
    // Nuestro seed sólo tiene los importes ya redondeados que el live enseña por
    // fila, así que la suma da un céntimo menos. Está medido, no es un desajuste
    // desconocido.
    const kpis = liquidacionesKpis(liquidaciones);
    expect(formatImporteLiquidacion(kpis.pendienteLiquidar)).toBe('124.050,24 €');
    expect(Math.abs(kpis.pendienteLiquidar - 124050.25)).toBeLessThanOrEqual(0.01);
  });
});

describe('agruparPorArtista — la segunda tabla, «Por artista»', () => {
  it('son los 32 artistas del live, ordenados por lo pendiente de liquidar', () => {
    const filas = agruparPorArtista(liquidaciones);
    expect(filas).toHaveLength(32);
    expect(filas.map((f) => f.artista).slice(0, 5)).toEqual([
      'Bizza',
      'Aaron Martin',
      'ART NO LOGIA',
      'Los Canarios',
      'Brenda Serna',
    ]);
  });

  it('cada fila sale de agregar los shows de ese artista', () => {
    const filas = agruparPorArtista(liquidaciones);
    const bizza = filas.find((f) => f.artista === 'Bizza')!;
    expect(bizza.shows).toBe(60);
    expect(formatImporteLiquidacion(bizza.pendLiquidar)).toBe('29.245,97 €');
    expect(bizza.deudaViva).toBeNull();
    expect(formatPosicionNeta(bizza.posicionNeta)).toBe('+29.245,97 €');
  });

  it('la deuda viva se resta de la posición neta', () => {
    const filas = agruparPorArtista(liquidaciones);
    const brenda = filas.find((f) => f.artista === 'Brenda Serna')!;
    expect(brenda.shows).toBe(12);
    expect(formatImporteLiquidacion(brenda.pendLiquidar)).toBe('10.153,29 €');
    expect(brenda.deudaViva).toBe(750);
    expect(formatPosicionNeta(brenda.posicionNeta)).toBe('+9403,29 €');

    const gaston = filas.find((f) => f.artista === 'Gaston Zani')!;
    expect(gaston.deudaViva).toBe(200);
    expect(formatPosicionNeta(gaston.posicionNeta)).toBe('+1000,00 €');
  });

  it('sólo esos dos artistas arrastran deuda viva en el live de hoy', () => {
    expect(DEUDA_VIVA).toEqual({ 'Brenda Serna': 750, 'Gaston Zani': 200 });
  });
});

describe('filtros de la tabla', () => {
  it('el desplegable son las seis opciones del live', () => {
    expect(OPCIONES_ESTADO).toEqual([
      'Todos los estados',
      'Sin liquidar',
      'Parcialmente liquidado',
      'Pendiente liquidar',
      'Liquidado',
      'Incidencia',
    ]);
    expect(ESTADOS_LIQUIDACION).toHaveLength(5);
  });

  it('«Todos los estados» no filtra nada', () => {
    expect(filtrarLiquidaciones(liquidaciones, 'Todos los estados')).toHaveLength(243);
  });

  it('filtrar por un estado deja sólo sus filas', () => {
    const liquidadas = filtrarLiquidaciones(liquidaciones, 'Liquidado');
    expect(liquidadas).toHaveLength(23);
    expect(liquidadas.every((l) => l.estado === 'Liquidado')).toBe(true);
    expect(filtrarLiquidaciones(liquidaciones, 'Incidencia')).toHaveLength(0);
  });

  it('el buscador mira artista, evento y código, sin distinguir mayúsculas', () => {
    expect(buscarLiquidaciones(liquidaciones, 'C1-2026-155')[0].artista).toBe('Olivia Bass');
    expect(buscarLiquidaciones(liquidaciones, 'olivia bass').length).toBeGreaterThan(0);
    expect(
      buscarLiquidaciones(liquidaciones, 'oasis').every(
        (l) => /oasis/i.test(l.evento) || /oasis/i.test(l.artista)
      )
    ).toBe(true);
    expect(buscarLiquidaciones(liquidaciones, '')).toHaveLength(243);
    expect(buscarLiquidaciones(liquidaciones, 'no-existe-este-show')).toHaveLength(0);
  });
});

describe('formatos de la tabla', () => {
  it('los importes llevan el espacio duro del live, no uno normal', () => {
    // Medido dos veces en el live (regla de doble medida): el carácter antes del
    // símbolo es U+00A0 en `/liquidaciones`.
    expect(formatImporteLiquidacion(960)).toBe('960,00 €');
    expect(formatImporteLiquidacion(29245.97)).toBe('29.245,97 €');
    expect(formatImporteLiquidacion(5399.08)).toBe('5399,08 €');
  });

  it('la posición neta va con signo', () => {
    expect(formatPosicionNeta(29245.97)).toBe('+29.245,97 €');
    expect(formatPosicionNeta(-120)).toBe('−120,00 €');
    expect(formatPosicionNeta(0)).toBe('0,00 €');
  });

  it('la fecha vacía se pinta como raya, igual que en el live', () => {
    expect(formatFechaLiquidacion('2026-12-24')).toBe('24 dic 2026');
    expect(formatFechaLiquidacion('2026-09-05')).toBe('05 sept 2026');
    expect(formatFechaLiquidacion(null)).toBe('—');
  });

  it('cada estado lleva la pastilla de color del live', () => {
    expect(badgeEstado('Sin liquidar')).toBe('badge bg-slate-100 text-slate-600');
    expect(badgeEstado('Pendiente liquidar')).toBe('badge bg-blue-100 text-blue-700');
    expect(badgeEstado('Liquidado')).toBe('badge bg-emerald-100 text-emerald-700');
    expect(badgeEstado('Parcialmente liquidado')).toBe('badge bg-amber-100 text-amber-700');
  });
});
