import { calcularResultadoAcuerdo } from './calculos-acuerdo';
import type { AcuerdoBrutos, AjustesEscenarios, Gasto, MesaVip, Proyeccion, TicketingRelease } from './types';

/**
 * Motor real de escenarios (Fase B). Reproduce exactamente al céntimo las 3 filas de la
 * tabla "Escenarios" del live y el bruto de ticketing/barras/comida usados por "Resultado
 * por acuerdo" — ver `docs/superpowers/specs/2026-07-23-herramientas-fase-b-prevision-design.md`
 * §3 para la derivación completa y la tabla de verificación.
 */
export type Escenario = 'pesimista' | 'base' | 'optimista';
export const ESCENARIOS: Escenario[] = ['pesimista', 'base', 'optimista'];
const ESCENARIO_LABEL: Record<Escenario, string> = { pesimista: 'Pesimista', base: 'Base', optimista: 'Optimista' };

export function multiplicadorPct(ajustes: AjustesEscenarios, escenario: Escenario): number {
  return {
    pesimista: ajustes.multiplicadorPesimistaPct,
    base: ajustes.multiplicadorBasePct,
    optimista: ajustes.multiplicadorOptimistaPct,
  }[escenario];
}

/**
 * Entradas objetivo (agregadas, redondeadas UNA sola vez sobre el total configurado —
 * nunca fila a fila) que el escenario activo proyecta vender. Si hay una asistencia
 * forzada a mano, se deriva de ella en vez del multiplicador.
 */
export function entradasObjetivo(
  ticketing: TicketingRelease[],
  ajustes: AjustesEscenarios,
  escenario: Escenario,
  invitaciones: number,
  asistenciaForzada?: number
): number {
  if (asistenciaForzada !== undefined) return Math.max(0, asistenciaForzada - invitaciones);
  const totalRaw = ticketing.reduce((a, r) => a + r.entradas, 0);
  return Math.round((totalRaw * multiplicadorPct(ajustes, escenario)) / 100);
}

/**
 * Los releases se venden en cascada, en el orden configurado (`orden`), hasta cubrir
 * `objetivo` entradas; el resto de releases no llega a "activarse" en ese escenario. Esto
 * es lo que explica la discrepancia que Fase A no pudo reconciliar (ticketing bruto del
 * live 4.600€ vs Σ(entradas×precio)=6.125€ de las 7 filas): no es redondeo, es venta
 * secuencial por tramos de precio.
 */
export function ticketingBrutoWaterfall(ticketing: TicketingRelease[], objetivo: number): number {
  const ordenado = [...ticketing].sort((a, b) => a.orden - b.orden);
  let cum = 0;
  let bruto = 0;
  for (const r of ordenado) {
    if (cum >= objetivo) break;
    const tomadas = Math.min(r.entradas, objetivo - cum);
    bruto += tomadas * r.precio;
    cum += tomadas;
  }
  return bruto;
}

/**
 * Bruto VIP crudo (mesas × prob% × precio), constante sea cual sea el escenario activo.
 * El texto "¿Cómo se calcula?" del live sugiere que el escenario también tensiona la
 * probabilidad VIP, pero reproducir los 3 escenarios exactos SOLO cuadra manteniendo VIP
 * fijo — se documenta el matiz en la spec §3.3 (el copy de ayuda es una explicación
 * conceptual, no una spec literal del motor).
 */
export function vipBruto(mesasVip: MesaVip[]): number {
  return mesasVip.reduce((a, z) => a + z.mesas * (z.probabilidadPct / 100) * z.precio, 0);
}

export function calcularBrutosEscenario(p: Proyeccion, escenario: Escenario): AcuerdoBrutos {
  const objetivo = entradasObjetivo(
    p.ticketing, p.ajustesEscenarios, escenario, p.eventoAforo.invitaciones, p.eventoAforo.asistenciaForzada
  );
  const asistencia = objetivo + p.eventoAforo.invitaciones;
  const { barras, comida, merch } = p.barrasComidaMerch;
  return {
    ticketing: ticketingBrutoWaterfall(p.ticketing, objetivo),
    mesasVip: vipBruto(p.mesasVip),
    barras: barras.consumicionesHora * p.eventoAforo.duracionHoras * barras.precioMedio * asistencia,
    comida: (comida.pctQueConsume / 100) * comida.ticketMedio * asistencia,
    merchandising: (merch.pctConversion / 100) * merch.precioMedio * asistencia,
  };
}

export interface FilaEscenario {
  escenario: Escenario;
  label: string;
  beneficio: number;
  margen: number;
}

export function calcularEscenariosComparativa(p: Proyeccion): FilaEscenario[] {
  return ESCENARIOS.map((escenario) => {
    const brutos = calcularBrutosEscenario(p, escenario);
    const resultado = calcularResultadoAcuerdo(p.acuerdo, brutos, p.eventoAforo, p.gastos);
    return {
      escenario,
      label: ESCENARIO_LABEL[escenario],
      beneficio: resultado.beneficioPorAcuerdo,
      margen: resultado.margenSobreIngresos,
    };
  });
}

export interface FilaGastoCategoria {
  categoria: string;
  importe: number;
  pct: number;
}

export function calcularGastoPorCategoria(gastos: Gasto[]): FilaGastoCategoria[] {
  const totales = new Map<string, number>();
  gastos.forEach((g) => totales.set(g.categoria, (totales.get(g.categoria) ?? 0) + g.valor));
  const total = Array.from(totales.values()).reduce((a, v) => a + v, 0);
  return Array.from(totales.entries())
    .map(([categoria, importe]) => ({ categoria, importe, pct: total === 0 ? 0 : Math.round((importe / total) * 100) }))
    .sort((a, b) => b.importe - a.importe);
}
