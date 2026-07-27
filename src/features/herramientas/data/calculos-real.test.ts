import { describe, it, expect } from 'vitest';
import { seedProyecciones } from './seed';
import { calcularBrutosReal, asistenciaReal, tieneDatosReal, calcularResultadoReal } from './calculos-real';

const p = seedProyecciones[0];

describe('calculos-real (evidencia del live PQ @ SLS Barcelona)', () => {
  it('ticketing bruto real = Σ entradasReal × precio = 745,00€', () => {
    expect(calcularBrutosReal(p).ticketing).toBeCloseTo(745, 2);
  });
  it('VIP real = 0 (mesasReal 0) y no usa probabilidad', () => {
    expect(calcularBrutosReal(p).mesasVip).toBe(0);
  });
  it('asistencia real = Σ entradasReal (82) + invitaciones (50) = 132', () => {
    expect(asistenciaReal(p)).toBe(132);
  });
  it('nuestros ingresos reales = 677,27€ (745/1,1, ticketing 100% neto)', () => {
    expect(calcularResultadoReal(p)!.nuestrosIngresos).toBeCloseTo(677.27, 2);
  });
  it('beneficio real = -4792,73€', () => {
    expect(calcularResultadoReal(p)!.beneficioPorAcuerdo).toBeCloseTo(-4792.73, 2);
  });
  it('margen real = -707.7% (toFixed 1)', () => {
    expect(calcularResultadoReal(p)!.margenSobreIngresos.toFixed(1)).toBe('-707.7');
  });
  it('evento completo real = -4792,73€ (-708% redondeado)', () => {
    const r = calcularResultadoReal(p)!;
    expect(r.eventoCompletoBeneficio).toBeCloseTo(-4792.73, 2);
    expect(Math.round(r.margenEventoCompleto)).toBe(-708);
  });
  it('tieneDatosReal true con entradasReal sembradas', () => {
    expect(tieneDatosReal(p)).toBe(true);
  });
  it('tieneDatosReal false sin ningún input real → resultado null', () => {
    const vacio = {
      ...p,
      ticketing: p.ticketing.map((r) => ({ ...r, entradasReal: undefined })),
      mesasVip: p.mesasVip.map((z) => ({ ...z, mesasReal: undefined })),
      cajaReal: [],
    };
    expect(tieneDatosReal(vacio)).toBe(false);
    expect(calcularResultadoReal(vacio)).toBeNull();
  });
  it('caja real suma al bucket barras (impacto nulo si vacío; no nulo si hay líneas)', () => {
    const conCaja = { ...p, cajaReal: [{ id: 'c1', fuente: 'Barra 1', importe: 100 }] };
    expect(calcularBrutosReal(conCaja).barras).toBe(100);
  });
});
