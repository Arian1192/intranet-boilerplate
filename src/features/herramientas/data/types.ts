export type ProyeccionEstado = 'borrador' | 'en_junta' | 'aprobada' | 'rechazada';
export type BaseCalculoAcuerdo = 'bruto' | 'neto';
export type QuienPaga = 'nosotros' | 'venue';
export type CategoriaGasto =
  | 'Artística' | 'Publicidad' | 'Promoción' | 'Staff' | 'Alquileres'
  | 'Sonido' | 'Iluminación' | 'Efectos' | 'Producción' | 'Seguridad'
  | 'Barras' | 'Comida' | 'Ticketing' | 'Otros';
export type BaseGasto =
  | 'importe_fijo' | 'pct_facturacion_neta' | 'pct_ticketing_neto'
  | 'pct_vip_neto' | 'pct_barras_neto' | 'pct_comida_neta' | 'pct_merch_neto';
export type ViaBreakeven = 'ticketing' | 'mesas_vip' | 'barras' | 'comida' | 'merchandising';

export interface Responsable {
  id: string;
  nombre: string;
  iniciales: string;
}

export interface Comentario {
  id: string;
  autor: string;
  texto: string;
  fecha: string;
}

export interface TramoAcuerdoConfig {
  nosLlevamosPct: number;
  sobreBase: BaseCalculoAcuerdo;
  deduccionFijaEur: number;
  deduccionPct: number;
}

export interface AcuerdoConfig {
  aplicarAcuerdo: boolean;
  ticketing: TramoAcuerdoConfig;
  mesasVip: TramoAcuerdoConfig;
  barras: TramoAcuerdoConfig;
  comida: TramoAcuerdoConfig;
  merchandising: TramoAcuerdoConfig;
}

/**
 * Brutos por tramo usados por Acuerdo/Previsión para "NUESTRO INGRESO". Fase A trató esto
 * como constantes estáticas verificadas del live porque el bruto de ticketing no coincidía
 * con Σ(entradas×precio) de `ticketing[]`. Fase B resolvió la discrepancia (no era un
 * problema de redondeo: el live vende los releases en cascada — "waterfall" — hasta cubrir
 * las entradas que el escenario activo proyecta vender; ver `calcularBrutosEscenario` en
 * `calculos-escenarios.ts` y la spec de Fase B §3). Este tipo es ahora solo el shape de
 * retorno de ese cálculo derivado; ya no vive como campo estático en `Proyeccion`.
 */
export interface AcuerdoBrutos {
  ticketing: number;
  mesasVip: number;
  barras: number;
  comida: number;
  merchandising: number;
}

export interface Gasto {
  id: string;
  categoria: CategoriaGasto;
  concepto: string;
  base: BaseGasto;
  valor: number; // magnitud positiva; se muestra siempre con signo "-" delante
  paga: QuienPaga;
}

export interface TicketingRelease {
  id: string;
  orden: number;
  release: string;
  entradas: number;
  precio: number;
  entradasReal?: number;
  /** Desglose por ticketera (Fourvenues, RA, DICE…) — solo visible/editable si
   * `Proyeccion.desglosarPorTicketera` está activo. No afecta a ningún total
   * (confirmado contra el live, recon-notas.md gap #6). */
  canales?: string[];
}

export interface MesaVip {
  id: string;
  zona: string;
  mesas: number;
  probabilidadPct: number;
  precio: number;
  mesasReal?: number;
}

export interface CajaRealLinea {
  id: string;
  fuente: string;
  importe: number;
}

export interface BarrasComidaMerchConfig {
  barras: { consumicionesHora: number; precioMedio: number };
  comida: { pctQueConsume: number; ticketMedio: number };
  merch: { pctConversion: number; precioMedio: number };
}

export interface AjustesEscenarios {
  multiplicadorPesimistaPct: number;
  multiplicadorBasePct: number;
  multiplicadorOptimistaPct: number;
  viasBreakeven: ViaBreakeven[];
}

export interface EventoAforo {
  nombre: string;
  fecha: string;
  venue: string;
  aforoMaximo: number;
  duracionHoras: number;
  invitaciones: number;
  ivaTicketingPct: number;
  ivaBarrasComidaVipPct: number;
  asistenciaForzada?: number;
}

/** Resultado real de la tab Real. Fase A/B lo tratan como constante verificada del
 * live (mismo motivo que `acuerdoBrutos`); Fase C lo calculará de verdad a partir de
 * `cajaReal` + entradas/mesas reales. */
export interface ResultadoReal {
  beneficioNeto: number;
}

export interface Proyeccion {
  id: string;
  nombre: string;
  estado: ProyeccionEstado;
  reunionFecha: string;
  responsables: Responsable[];
  comentarios: Comentario[];
  eventoAforo: EventoAforo;
  acuerdo: AcuerdoConfig;
  ajustesEscenarios: AjustesEscenarios;
  ticketing: TicketingRelease[];
  desglosarPorTicketera: boolean;
  mesasVip: MesaVip[];
  barrasComidaMerch: BarrasComidaMerchConfig;
  cajaReal: CajaRealLinea[];
  gastos: Gasto[];
  resultadoReal: ResultadoReal | null;
  creadoEn: string;
  actualizadoEn?: string;
}
