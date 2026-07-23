import { describe, it, expect } from 'vitest';
import { seedProyecciones } from './seed';

describe('seedProyecciones', () => {
  const p = seedProyecciones[0];

  it('tiene exactamente 1 proyección sembrada, fiel al live', () => {
    expect(seedProyecciones.length).toBe(1);
    expect(p.nombre).toBe('PQ @ SLS Barcelona');
    expect(p.estado).toBe('aprobada');
    expect(p.reunionFecha).toBe('2026-07-20');
  });

  it('tiene 2 responsables sembrados (Jack y Tony)', () => {
    expect(p.responsables.map((r) => r.nombre)).toEqual(['Jack', 'Tony']);
    expect(p.responsables.find((r) => r.nombre === 'Tony')?.iniciales).toBe('TC');
  });

  it('evento y aforo coincide con el live', () => {
    expect(p.eventoAforo).toEqual({
      nombre: 'PQ @ SLS Barcelona',
      fecha: '2026-07-18',
      venue: 'Cósmico @ SLS Barcelona',
      aforoMaximo: 600,
      duracionHoras: 6,
      invitaciones: 50,
      ivaTicketingPct: 10,
      ivaBarrasComidaVipPct: 10,
    });
  });

  it('el acuerdo tiene los 5 tramos fijos con los valores exactos del live', () => {
    expect(p.acuerdo.aplicarAcuerdo).toBe(true);
    expect(p.acuerdo.ticketing).toEqual({ nosLlevamosPct: 100, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 });
    expect(p.acuerdo.mesasVip).toEqual({ nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 18 });
    expect(p.acuerdo.barras).toEqual({ nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 18 });
    expect(p.acuerdo.comida).toEqual({ nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 25 });
    expect(p.acuerdo.merchandising).toEqual({ nosLlevamosPct: 100, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 });
  });

  it('ya no expone acuerdoBrutos (Fase B lo deriva de ticketing/mesasVip/barrasComidaMerch)', () => {
    expect((p as unknown as Record<string, unknown>).acuerdoBrutos).toBeUndefined();
  });

  it('los 7 gastos suman -5.470,00 € y son todos "nosotros"', () => {
    expect(p.gastos.length).toBe(7);
    expect(p.gastos.every((g) => g.paga === 'nosotros')).toBe(true);
    const total = p.gastos.reduce((a, g) => a + g.valor, 0);
    expect(total).toBe(5470);
  });

  it('gasto por categoría agrega correctamente (Artística 2400, Promoción 1500, Publicidad 1300, Staff 270)', () => {
    const porCategoria: Record<string, number> = {};
    p.gastos.forEach((g) => { porCategoria[g.categoria] = (porCategoria[g.categoria] ?? 0) + g.valor; });
    expect(porCategoria).toEqual({ Artística: 2400, Promoción: 1500, Publicidad: 1300, Staff: 270 });
  });

  it('resultadoReal guarda la cifra real observada del live (Fase C la recalculará)', () => {
    expect(p.resultadoReal).toEqual({ beneficioNeto: -4792.73 });
  });

  it('ticketing y mesasVip guardan las filas observadas (para Fase B)', () => {
    expect(p.ticketing.length).toBe(7);
    expect(p.ticketing[0]).toEqual({ id: 'tk-1', orden: 0, release: 'Early Access - acceso antes de las 7:30pm', entradas: 100, precio: 8 });
    expect(p.mesasVip.length).toBe(3);
    expect(p.mesasVip.map((v) => v.zona)).toEqual(['Zona 1', 'Zona 2', 'Zona 3']);
  });
});
