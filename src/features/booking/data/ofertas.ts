export type OfertaEstado = 'Nueva' | 'Revisada' | 'Convertida' | 'Descartada';

export interface Oferta {
  id: string;
  artista: string;
  promotor: string;
  email: string;
  evento: string;
  ciudad: string;
  fecha: string;
  cache: number;
  estado: OfertaEstado;
  mensaje: string;
  recibida: string;
}

export const OFERTA_FILTROS = [
  'Todas',
  'Nuevas',
  'Revisadas',
  'Convertidas',
  'Descartadas',
] as const;

export type OfertaFiltro = (typeof OFERTA_FILTROS)[number];

/** El filtro que viene marcado al entrar en la pantalla (como el live). */
export const OFERTA_FILTRO_INICIAL: OfertaFiltro = 'Nuevas';

const ESTADO_POR_FILTRO: Record<Exclude<OfertaFiltro, 'Todas'>, OfertaEstado> = {
  Nuevas: 'Nueva',
  Revisadas: 'Revisada',
  Convertidas: 'Convertida',
  Descartadas: 'Descartada',
};

/**
 * El formulario público todavía no ha traído ninguna propuesta: el live muestra
 * los cinco filtros a cero y el aviso de bandeja vacía.
 */
export const ofertas: Oferta[] = [];

export function filterOfertas(list: Oferta[], filtro: OfertaFiltro): Oferta[] {
  if (filtro === 'Todas') return list;
  return list.filter((oferta) => oferta.estado === ESTADO_POR_FILTRO[filtro]);
}

export function contarOfertas(list: Oferta[], filtro: OfertaFiltro): number {
  return filterOfertas(list, filtro).length;
}
