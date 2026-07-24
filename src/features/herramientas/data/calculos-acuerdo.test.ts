import { describe, it, expect } from 'vitest';
import { netoDeIva, ingresoTramo, calcularResultadoAcuerdo, calcularImporteGasto } from './calculos-acuerdo';
import { calcularBrutosEscenario } from './calculos-escenarios';
import { seedProyecciones } from './seed';

describe('netoDeIva', () => {
  it('divide el bruto por (1 + iva/100)', () => {
    expect(netoDeIva(4600, 10)).toBeCloseTo(4181.818, 2);
    expect(netoDeIva(100, 0)).toBe(100);
  });
});

describe('ingresoTramo', () => {
  it('calcula el ingreso de Mesas VIP del seed exacto (10%/neto/0/18, iva 10%): 953,44€', () => {
    const cfg = { nosLlevamosPct: 10, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 18 };
    expect(ingresoTramo(cfg, 12790, 10)).toBeCloseTo(953.44, 1);
  });

  it('calcula el ingreso de Barras del seed exacto (10%/neto/0/18, iva 10%): 1.118,18€', () => {
    const cfg = { nosLlevamosPct: 10, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 18 };
    expect(ingresoTramo(cfg, 15000, 10)).toBeCloseTo(1118.18, 1);
  });

  it('calcula el ingreso de Comida del seed exacto (10%/neto/0/25, iva 10%): 76,70€', () => {
    const cfg = { nosLlevamosPct: 10, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 25 };
    expect(ingresoTramo(cfg, 1125, 10)).toBeCloseTo(76.70, 1);
  });

  it('con bruto 0 el ingreso es 0 (Merchandising del seed)', () => {
    const cfg = { nosLlevamosPct: 100, sobreBase: 'neto' as const, deduccionFijaEur: 0, deduccionPct: 0 };
    expect(ingresoTramo(cfg, 0, 10)).toBe(0);
  });
});

describe('calcularResultadoAcuerdo — reproduce exactamente el "Resultado por acuerdo" del live', () => {
  const p = seedProyecciones[0];
  const resultado = calcularResultadoAcuerdo(p.acuerdo, calcularBrutosEscenario(p, 'base'), p.eventoAforo, p.gastos);

  it('NUESTROS INGRESOS = 6.330,14€', () => {
    expect(resultado.nuestrosIngresos).toBeCloseTo(6330.14, 1);
  });
  it('GASTOS QUE ASUMIMOS = -5.470,00€', () => {
    expect(resultado.gastosQueAsumimos).toBe(-5470);
  });
  it('BENEFICIO POR ACUERDO = 860,14€', () => {
    expect(resultado.beneficioPorAcuerdo).toBeCloseTo(860.14, 1);
  });
  it('MARGEN S/INGRESOS = 13.6%', () => {
    expect(resultado.margenSobreIngresos).toBeCloseTo(13.6, 1);
  });
  it('Evento completo: 24.998,18€ (82%)', () => {
    expect(resultado.eventoCompletoBeneficio).toBeCloseTo(24998.18, 1);
    expect(Math.round(resultado.margenEventoCompleto)).toBe(82);
  });
});

describe('calcularImporteGasto', () => {
  const brutos = { ticketing: 4600, mesasVip: 12790, barras: 15000, comida: 1125, merchandising: 0 };
  const eventoAforo = seedProyecciones[0].eventoAforo;

  it('importe_fijo: usa el valor tal cual, en negativo', () => {
    const g = { id: '1', categoria: 'Otros' as const, concepto: 'x', base: 'importe_fijo' as const, valor: 200, paga: 'nosotros' as const };
    expect(calcularImporteGasto(g, brutos, eventoAforo)).toBe(-200);
  });

  it('pct_ticketing_neto: % sobre el neto de IVA del bruto de ticketing', () => {
    const g = { id: '2', categoria: 'Otros' as const, concepto: 'x', base: 'pct_ticketing_neto' as const, valor: 10, paga: 'nosotros' as const };
    // neto ticketing = 4600/1.1 = 4181.818...; 10% = 418.1818
    expect(calcularImporteGasto(g, brutos, eventoAforo)).toBeCloseTo(-418.18, 1);
  });

  it('pct_vip_neto: % sobre el neto de IVA del bruto VIP', () => {
    const g = { id: '3', categoria: 'Otros' as const, concepto: 'x', base: 'pct_vip_neto' as const, valor: 10, paga: 'nosotros' as const };
    // neto vip = 12790/1.1 = 11627.27; 10% = 1162.73
    expect(calcularImporteGasto(g, brutos, eventoAforo)).toBeCloseTo(-1162.73, 1);
  });

  it('pct_facturacion_neta: % sobre la suma de todos los netos', () => {
    const g = { id: '4', categoria: 'Otros' as const, concepto: 'x', base: 'pct_facturacion_neta' as const, valor: 10, paga: 'nosotros' as const };
    // suma netos = 4181.818+11627.273+13636.364+1022.727+0 = 30468.182; 10% = 3046.82
    expect(calcularImporteGasto(g, brutos, eventoAforo)).toBeCloseTo(-3046.82, 1);
  });

  it('bases barras/comida/merch neto se calculan igual sobre su propio bruto', () => {
    const gBarras = { id: '5', categoria: 'Otros' as const, concepto: 'x', base: 'pct_barras_neto' as const, valor: 10, paga: 'nosotros' as const };
    const gComida = { id: '6', categoria: 'Otros' as const, concepto: 'x', base: 'pct_comida_neta' as const, valor: 10, paga: 'nosotros' as const };
    const gMerch = { id: '7', categoria: 'Otros' as const, concepto: 'x', base: 'pct_merch_neto' as const, valor: 10, paga: 'nosotros' as const };
    expect(calcularImporteGasto(gBarras, brutos, eventoAforo)).toBeCloseTo(-1363.64, 1);
    expect(calcularImporteGasto(gComida, brutos, eventoAforo)).toBeCloseTo(-102.27, 1);
    expect(calcularImporteGasto(gMerch, brutos, eventoAforo)).toBeCloseTo(0, 5);
  });
});
