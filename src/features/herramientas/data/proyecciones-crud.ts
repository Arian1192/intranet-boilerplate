import type { Proyeccion } from './types';

export function createBlankProyeccion(): Proyeccion {
  return {
    id: crypto.randomUUID(),
    nombre: 'Nuevo evento',
    estado: 'borrador',
    reunionFecha: '',
    responsables: [],
    comentarios: [],
    eventoAforo: {
      nombre: 'Nuevo evento',
      fecha: '',
      venue: '',
      aforoMaximo: 0,
      duracionHoras: 6,
      invitaciones: 0,
      ivaTicketingPct: 10,
      ivaBarrasComidaVipPct: 10,
    },
    acuerdo: {
      aplicarAcuerdo: true,
      ticketing: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      mesasVip: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      barras: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      comida: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      merchandising: { nosLlevamosPct: 0, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
    },
    ajustesEscenarios: {
      multiplicadorPesimistaPct: 75,
      multiplicadorBasePct: 100,
      multiplicadorOptimistaPct: 115,
      viasBreakeven: [],
    },
    ticketing: [],
    desglosarPorTicketera: false,
    mesasVip: [],
    barrasComidaMerch: {
      barras: { consumicionesHora: 0, precioMedio: 0 },
      comida: { pctQueConsume: 0, ticketMedio: 0 },
      merch: { pctConversion: 0, precioMedio: 0 },
    },
    cajaReal: [],
    gastos: [],
    creadoEn: new Date().toISOString(),
  };
}

export function duplicateProyeccion(p: Proyeccion): Proyeccion {
  return {
    ...p,
    id: crypto.randomUUID(),
    nombre: `${p.nombre} (copia)`,
    estado: 'borrador',
    creadoEn: new Date().toISOString(),
    actualizadoEn: undefined,
  };
}

export function removeProyeccion(list: Proyeccion[], id: string): Proyeccion[] {
  return list.filter((p) => p.id !== id);
}

export function updateProyeccion(list: Proyeccion[], id: string, patch: Partial<Proyeccion>): Proyeccion[] {
  return list.map((p) => (p.id === id ? { ...p, ...patch, actualizadoEn: new Date().toISOString() } : p));
}
