import type { AcuerdoConfig, AcuerdoBrutos, BaseGasto, EventoAforo, Gasto, TramoAcuerdoConfig } from './types';

export function netoDeIva(bruto: number, ivaPct: number): number {
  return bruto / (1 + ivaPct / 100);
}

export function baseParaTramo(cfg: TramoAcuerdoConfig, bruto: number, ivaPct: number): number {
  return cfg.sobreBase === 'neto' ? netoDeIva(bruto, ivaPct) : bruto;
}

export function ingresoTramo(cfg: TramoAcuerdoConfig, bruto: number, ivaPct: number): number {
  const base = baseParaTramo(cfg, bruto, ivaPct);
  return (base - cfg.deduccionFijaEur) * (1 - cfg.deduccionPct / 100) * (cfg.nosLlevamosPct / 100);
}

/**
 * Importe (negativo) de un gasto según su `base` de cálculo (Fase B — Gastos-CRUD).
 * `importe_fijo` usa `valor` tal cual; el resto son % sobre el NETO de IVA del bruto del
 * tramo correspondiente (o de la suma de todos, para "% facturación neta").
 */
export function calcularImporteGasto(g: Gasto, brutos: AcuerdoBrutos, eventoAforo: EventoAforo): number {
  const netoTicketing = netoDeIva(brutos.ticketing, eventoAforo.ivaTicketingPct);
  const netoVip = netoDeIva(brutos.mesasVip, eventoAforo.ivaBarrasComidaVipPct);
  const netoBarras = netoDeIva(brutos.barras, eventoAforo.ivaBarrasComidaVipPct);
  const netoComida = netoDeIva(brutos.comida, eventoAforo.ivaBarrasComidaVipPct);
  const netoMerch = netoDeIva(brutos.merchandising, eventoAforo.ivaBarrasComidaVipPct);
  const netoFacturacion = netoTicketing + netoVip + netoBarras + netoComida + netoMerch;

  const baseMap: Record<BaseGasto, number> = {
    importe_fijo: g.valor,
    pct_facturacion_neta: (g.valor / 100) * netoFacturacion,
    pct_ticketing_neto: (g.valor / 100) * netoTicketing,
    pct_vip_neto: (g.valor / 100) * netoVip,
    pct_barras_neto: (g.valor / 100) * netoBarras,
    pct_comida_neta: (g.valor / 100) * netoComida,
    pct_merch_neto: (g.valor / 100) * netoMerch,
  };
  return -baseMap[g.base];
}

export interface ResultadoAcuerdo {
  nuestrosIngresos: number;
  gastosQueAsumimos: number;
  beneficioPorAcuerdo: number;
  margenSobreIngresos: number;
  eventoCompletoBeneficio: number;
  margenEventoCompleto: number;
}

export function calcularResultadoAcuerdo(
  acuerdo: AcuerdoConfig,
  brutos: AcuerdoBrutos,
  eventoAforo: EventoAforo,
  gastos: Gasto[]
): ResultadoAcuerdo {
  const ivaTicketing = eventoAforo.ivaTicketingPct;
  const ivaResto = eventoAforo.ivaBarrasComidaVipPct;

  const nuestrosIngresos =
    ingresoTramo(acuerdo.ticketing, brutos.ticketing, ivaTicketing) +
    ingresoTramo(acuerdo.mesasVip, brutos.mesasVip, ivaResto) +
    ingresoTramo(acuerdo.barras, brutos.barras, ivaResto) +
    ingresoTramo(acuerdo.comida, brutos.comida, ivaResto) +
    ingresoTramo(acuerdo.merchandising, brutos.merchandising, ivaResto);

  const gastosQueAsumimos = gastos
    .filter((g) => g.paga === 'nosotros')
    .reduce((a, g) => a + calcularImporteGasto(g, brutos, eventoAforo), 0);

  const beneficioPorAcuerdo = nuestrosIngresos + gastosQueAsumimos;
  const margenSobreIngresos = nuestrosIngresos === 0 ? 0 : (beneficioPorAcuerdo / nuestrosIngresos) * 100;

  const totalNetoEvento =
    netoDeIva(brutos.ticketing, ivaTicketing) +
    netoDeIva(brutos.mesasVip, ivaResto) +
    netoDeIva(brutos.barras, ivaResto) +
    netoDeIva(brutos.comida, ivaResto) +
    netoDeIva(brutos.merchandising, ivaResto);

  const eventoCompletoBeneficio = totalNetoEvento + gastosQueAsumimos;
  const margenEventoCompleto = totalNetoEvento === 0 ? 0 : (eventoCompletoBeneficio / totalNetoEvento) * 100;

  return {
    nuestrosIngresos,
    gastosQueAsumimos,
    beneficioPorAcuerdo,
    margenSobreIngresos,
    eventoCompletoBeneficio,
    margenEventoCompleto,
  };
}
