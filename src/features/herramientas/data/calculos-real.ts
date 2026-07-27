import { calcularResultadoAcuerdo, type ResultadoAcuerdo } from './calculos-acuerdo';
import type { AcuerdoBrutos, Proyeccion } from './types';

/**
 * Motor de la tab Real (Fase C). A diferencia de Previsión (que proyecta ventas en cascada
 * según el escenario activo), aquí los brutos salen de datos EJECUTADOS: entradas y mesas
 * realmente vendidas y la caja real. Reusa `calcularResultadoAcuerdo` (Fase A) — cero
 * duplicación de la lógica de acuerdo/IVA/gastos. Reproduce al céntimo el seed del live
 * (spec `2026-07-24-herramientas-fase-c-cierre-design.md` §3).
 */
export function calcularBrutosReal(p: Proyeccion): AcuerdoBrutos {
  const ticketing = p.ticketing.reduce((a, r) => a + (r.entradasReal ?? 0) * r.precio, 0);
  const mesasVip = p.mesasVip.reduce((a, z) => a + (z.mesasReal ?? 0) * z.precio, 0);
  // "Caja real" es una tabla libre indiferenciada (barras/comida/extras); se pliega en el
  // bucket `barras` (mismo IVA que comida/VIP). Impacto nulo en el seed (cajaReal vacío).
  const barras = p.cajaReal.reduce((a, l) => a + l.importe, 0);
  return { ticketing, mesasVip, barras, comida: 0, merchandising: 0 };
}

export function asistenciaReal(p: Proyeccion): number {
  const entradas = p.ticketing.reduce((a, r) => a + (r.entradasReal ?? 0), 0);
  return entradas + p.eventoAforo.invitaciones;
}

export function tieneDatosReal(p: Proyeccion): boolean {
  return (
    p.ticketing.some((r) => r.entradasReal !== undefined && r.entradasReal !== 0) ||
    p.mesasVip.some((z) => z.mesasReal !== undefined && z.mesasReal !== 0) ||
    p.cajaReal.length > 0
  );
}

export function calcularResultadoReal(p: Proyeccion): ResultadoAcuerdo | null {
  if (!tieneDatosReal(p)) return null;
  return calcularResultadoAcuerdo(p.acuerdo, calcularBrutosReal(p), p.eventoAforo, p.gastos);
}
