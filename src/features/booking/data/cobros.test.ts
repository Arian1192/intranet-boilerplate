import { describe, it, expect } from 'vitest';
import {
  cobros,
  cobrosKpis,
  filterCobros,
  formatFechaCorta,
  formatImporte,
  diaRelativo,
  pendiente,
  estaVencido,
  agruparPorFactura,
} from './cobros';

describe('cobros — seed espejo del live', () => {
  it('son los 7 shows por cobrar del live, en orden', () => {
    expect(cobros.map((c) => c.show)).toEqual([
      'The Next',
      'Solart Fest',
      'LOAD',
      'More Amor',
      'Homies',
      'SANITY',
      'Summer Opening Festival',
    ]);
  });

  it('cada fila lleva los importes y el cliente exactos del live', () => {
    const fila = (show: string) => cobros.find((c) => c.show === show)!;
    expect(formatImporte(fila('The Next').total)).toBe('1016,40 €');
    expect(formatImporte(fila('Solart Fest').total)).toBe('2904,00 €');
    expect(formatImporte(fila('LOAD').total)).toBe('484,00 €');
    expect(formatImporte(fila('More Amor').total)).toBe('1161,60 €');
    expect(formatImporte(fila('Homies').total)).toBe('1161,60 €');
    expect(formatImporte(fila('SANITY').total)).toBe('1452,00 €');
    expect(formatImporte(fila('Summer Opening Festival').total)).toBe('1452,00 €');
    expect(cobros.every((c) => c.pagado === 0)).toBe(true);
    expect(fila('The Next').cliente).toBe('Recaba Inversiones Turisticas, S.L.');
    expect(fila('LOAD').cliente).toBe('LIMBER 1968 SL');
    expect(fila('More Amor').cliente).toBe('STRATENEX, S.L.');
    expect(fila('Homies').cliente).toBe('MAXIMILIANO REGALDO');
    expect(fila('Solart Fest').cliente).toBeNull();
    expect(fila('SANITY').cliente).toBeNull();
    expect(fila('Summer Opening Festival').cliente).toBeNull();
  });

  it('las etiquetas D±n salen de la fecha del show contra el día del barrido', () => {
    expect(cobros.map((c) => diaRelativo(c.fechaShow))).toEqual([
      'D+3',
      'D-3',
      'D-3',
      'D+11',
      'D-9',
      'D-66',
      'D+4',
    ]);
  });

  it('los vencimientos se muestran como en el live', () => {
    const vencimientos = cobros.map((c) => (c.vencimiento ? formatFechaCorta(c.vencimiento) : '—'));
    expect(vencimientos).toEqual([
      '06 jul 2026',
      '12 jul 2026',
      '12 jul 2026',
      '18 jul 2026',
      '18 jul 2026',
      '13 sept 2026',
      '—',
    ]);
  });

  it('están vencidos los 5 primeros y sólo esos', () => {
    expect(cobros.filter((c) => estaVencido(c)).map((c) => c.show)).toEqual([
      'The Next',
      'Solart Fest',
      'LOAD',
      'More Amor',
      'Homies',
    ]);
  });

  it('los 4 KPIs cuadran con el live al céntimo', () => {
    const kpis = cobrosKpis(cobros);
    expect(kpis.showsPorCobrar).toBe(7);
    expect(formatImporte(kpis.pendienteTotal)).toBe('9631,60 €');
    expect(formatImporte(kpis.fueraDePlazoImporte)).toBe('6727,60 €');
    expect(kpis.fueraDePlazoShows).toBe(5);
    expect(formatImporte(kpis.venceSemanaImporte)).toBe('0,00 €');
    expect(kpis.venceSemanaShows).toBe(0);
  });

  it('el pendiente de cada fila es total menos pagado', () => {
    expect(cobros.map((c) => pendiente(c))).toEqual([
      1016.4, 2904, 484, 1161.6, 1161.6, 1452, 1452,
    ]);
  });

  it('los filtros dan Todos 7 y Vencidos 5', () => {
    expect(filterCobros(cobros, 'Todos')).toHaveLength(7);
    expect(filterCobros(cobros, 'Vencidos')).toHaveLength(5);
  });

  it('hay 1 factura emitida', () => {
    expect(agruparPorFactura(cobros)).toHaveLength(1);
  });

  it('formatImporte escribe los euros como el live', () => {
    // es-ES no agrupa los millares de 4 dígitos, y el live usa espacio normal.
    expect(formatImporte(9631.6)).toBe('9631,60 €');
    expect(formatImporte(0)).toBe('0,00 €');
    expect(formatImporte(11433.78)).toBe('11.433,78 €');
    expect(formatImporte(1016.4)).not.toContain(' ');
  });
});
