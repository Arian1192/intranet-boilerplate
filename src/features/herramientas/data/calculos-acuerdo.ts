import type { AcuerdoConfig, AcuerdoBrutos, EventoAforo, Gasto, TramoAcuerdoConfig } from './types';

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

  const gastosQueAsumimos = -gastos
    .filter((g) => g.paga === 'nosotros')
    .reduce((a, g) => a + g.valor, 0);

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
