import type { Proyeccion } from './types';

export const seedProyecciones: Proyeccion[] = [
  {
    id: 'pq-sls-barcelona',
    nombre: 'PQ @ SLS Barcelona',
    estado: 'aprobada',
    reunionFecha: '2026-07-20',
    responsables: [
      { id: 'resp-jack', nombre: 'Jack', iniciales: 'JH' },
      { id: 'resp-tony', nombre: 'Tony', iniciales: 'TC' },
    ],
    comentarios: [],
    eventoAforo: {
      nombre: 'PQ @ SLS Barcelona',
      fecha: '2026-07-18',
      venue: 'Cósmico @ SLS Barcelona',
      aforoMaximo: 600,
      duracionHoras: 6,
      invitaciones: 50,
      ivaTicketingPct: 10,
      ivaBarrasComidaVipPct: 10,
    },
    acuerdo: {
      aplicarAcuerdo: true,
      ticketing: { nosLlevamosPct: 100, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
      mesasVip: { nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 18 },
      barras: { nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 18 },
      comida: { nosLlevamosPct: 10, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 25 },
      merchandising: { nosLlevamosPct: 100, sobreBase: 'neto', deduccionFijaEur: 0, deduccionPct: 0 },
    },
    ajustesEscenarios: {
      multiplicadorPesimistaPct: 50,
      multiplicadorBasePct: 75,
      multiplicadorOptimistaPct: 100,
      viasBreakeven: ['ticketing', 'barras'],
    },
    // entradasReal / mesasReal = evidencia del live (re-captura read-only de la tab Real,
    // spec Fase C §3.2). Reproducen ticketing real 745,00€ → beneficio -4792,73€ y asistencia 132.
    ticketing: [
      { id: 'tk-1', orden: 0, release: 'Early Access - acceso antes de las 7:30pm', entradas: 100, precio: 8, entradasReal: 20 },
      { id: 'tk-2', orden: 1, release: 'Online · Release 1', entradas: 200, precio: 10, entradasReal: 20 },
      { id: 'tk-3', orden: 2, release: 'Online · Release 3', entradas: 150, precio: 12, entradasReal: 0 },
      { id: 'tk-4', orden: 3, release: 'Online · Release 2', entradas: 50, precio: 15, entradasReal: 9 },
      { id: 'tk-5', orden: 4, release: 'Pack 2 Entradas', entradas: 50, precio: 7.5, entradasReal: 28 },
      { id: 'tk-6', orden: 5, release: 'Pack 5 Entradas', entradas: 50, precio: 8, entradasReal: 5 },
      { id: 'tk-7', orden: 6, release: 'Taquilla', entradas: 0, precio: 0, entradasReal: 0 },
    ],
    desglosarPorTicketera: false,
    mesasVip: [
      { id: 'vip-1', zona: 'Zona 1', mesas: 5, probabilidadPct: 85, precio: 1200, mesasReal: 0 },
      { id: 'vip-2', zona: 'Zona 2', mesas: 6, probabilidadPct: 75, precio: 900, mesasReal: 0 },
      { id: 'vip-3', zona: 'Zona 3', mesas: 8, probabilidadPct: 65, precio: 700, mesasReal: 0 },
    ],
    barrasComidaMerch: {
      barras: { consumicionesHora: 0.5, precioMedio: 10 },
      comida: { pctQueConsume: 15, ticketMedio: 15 },
      merch: { pctConversion: 0, precioMedio: 0 },
    },
    cajaReal: [],
    gastos: [
      { id: 'gasto-1', categoria: 'Artística', concepto: 'US TWO - AF', base: 'importe_fijo', valor: 2000, paga: 'nosotros' },
      { id: 'gasto-2', categoria: 'Artística', concepto: 'US TWO - BF', base: 'importe_fijo', valor: 400, paga: 'nosotros' },
      { id: 'gasto-3', categoria: 'Promoción', concepto: 'PleaseQuiet', base: 'importe_fijo', valor: 1500, paga: 'nosotros' },
      { id: 'gasto-4', categoria: 'Staff', concepto: 'Fotografía / Vídeo', base: 'importe_fijo', valor: 150, paga: 'nosotros' },
      { id: 'gasto-5', categoria: 'Staff', concepto: 'Taquilla - Patricia', base: 'importe_fijo', valor: 120, paga: 'nosotros' },
      { id: 'gasto-6', categoria: 'Publicidad', concepto: 'Inversión Meta', base: 'importe_fijo', valor: 1000, paga: 'nosotros' },
      { id: 'gasto-7', categoria: 'Publicidad', concepto: 'Euphoric Media Fee', base: 'importe_fijo', valor: 300, paga: 'nosotros' },
    ],
    // Ver nota de fidelidad: cifra real observada, Fase C la calculará de verdad.
    resultadoReal: { beneficioNeto: -4792.73 },
    creadoEn: '2026-06-01T00:00:00.000Z',
  },
];
