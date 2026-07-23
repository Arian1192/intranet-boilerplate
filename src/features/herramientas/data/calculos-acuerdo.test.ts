import { describe, it, expect } from 'vitest';
import { netoDeIva, ingresoTramo, calcularResultadoAcuerdo } from './calculos-acuerdo';
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
  const resultado = calcularResultadoAcuerdo(p.acuerdo, p.acuerdoBrutos, p.eventoAforo, p.gastos);

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
