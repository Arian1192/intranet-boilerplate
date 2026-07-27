import { ingresoTramo, calcularResultadoAcuerdo } from './calculos-acuerdo';
import { calcularBrutosEscenario, ticketingBrutoWaterfall, vipBruto } from './calculos-escenarios';
import type { Proyeccion, ViaBreakeven } from './types';

/**
 * "Es el % de la venta proyectada (solo de las vías que elijas) necesario para que el
 * beneficio sea 0" (¿Cómo se calcula? — PUNTO DE EQUILIBRIO). Se resuelve `N` (entradas,
 * continuo) tal que la suma de ingresoTramo de las vías marcadas iguale los gastos que
 * asumimos. Ver spec de Fase B §3.8.
 */
export interface ResultadoBreakeven {
  pctVentaProyectada: number;
  entradasNecesarias: number;
  asistenciaNecesaria: number;
}

function totalIngresoParaN(p: Proyeccion, n: number, vias: ViaBreakeven[]): number {
  const asistencia = n + p.eventoAforo.invitaciones;
  const { barras, comida, merch } = p.barrasComidaMerch;
  const ivaTicketing = p.eventoAforo.ivaTicketingPct;
  const ivaResto = p.eventoAforo.ivaBarrasComidaVipPct;
  let total = 0;
  if (vias.includes('ticketing')) {
    total += ingresoTramo(p.acuerdo.ticketing, ticketingBrutoWaterfall(p.ticketing, n), ivaTicketing);
  }
  if (vias.includes('mesas_vip')) {
    total += ingresoTramo(p.acuerdo.mesasVip, vipBruto(p.mesasVip), ivaResto);
  }
  if (vias.includes('barras')) {
    const bruto = barras.consumicionesHora * p.eventoAforo.duracionHoras * barras.precioMedio * asistencia;
    total += ingresoTramo(p.acuerdo.barras, bruto, ivaResto);
  }
  if (vias.includes('comida')) {
    const bruto = (comida.pctQueConsume / 100) * comida.ticketMedio * asistencia;
    total += ingresoTramo(p.acuerdo.comida, bruto, ivaResto);
  }
  if (vias.includes('merchandising')) {
    const bruto = (merch.pctConversion / 100) * merch.precioMedio * asistencia;
    total += ingresoTramo(p.acuerdo.merchandising, bruto, ivaResto);
  }
  return total;
}

export function calcularBreakeven(p: Proyeccion): ResultadoBreakeven | null {
  const vias = p.ajustesEscenarios.viasBreakeven;
  if (vias.length === 0) return null;

  const totalRawEntradas = p.ticketing.reduce((a, r) => a + r.entradas, 0);

  // Gastos como coste fijo del breakeven: se evalúan una sola vez, a brutos de escenario
  // Base (ver spec §3.8 — es la premisa estándar de un análisis de punto de equilibrio).
  const gastosQueAsumimos = calcularResultadoAcuerdo(
    p.acuerdo, calcularBrutosEscenario(p, 'base'), p.eventoAforo, p.gastos
  ).gastosQueAsumimos;
  const objetivo = -gastosQueAsumimos;

  if (objetivo <= 0) {
    return { pctVentaProyectada: 0, entradasNecesarias: 0, asistenciaNecesaria: p.eventoAforo.invitaciones };
  }

  if (totalRawEntradas <= 0) return null;

  const alcanzableAl100 = totalIngresoParaN(p, totalRawEntradas, vias);
  if (alcanzableAl100 < objetivo) return null;

  let lo = 0;
  let hi = totalRawEntradas;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (totalIngresoParaN(p, mid, vias) < objetivo) lo = mid;
    else hi = mid;
  }
  const n = (lo + hi) / 2;
  const entradasNecesarias = Math.round(n);
  return {
    pctVentaProyectada: Math.round((n / totalRawEntradas) * 100),
    entradasNecesarias,
    asistenciaNecesaria: entradasNecesarias + p.eventoAforo.invitaciones,
  };
}
