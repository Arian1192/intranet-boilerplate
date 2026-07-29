import type { Novedad, TipoNovedad } from '../data/novedades';

/** El segmentado del live: «Todo» más los tres tipos. */
export type FiltroTipo = 'Todo' | TipoNovedad;

export interface FiltroNovedades {
  texto: string;
  tipo: FiltroTipo;
  /** Chips de módulo activos. Vacío = todos. */
  modulos: string[];
  /** Chips de tag activos. Vacío = todos. */
  tags: string[];
}

export const FILTRO_VACIO: FiltroNovedades = { texto: '', tipo: 'Todo', modulos: [], tags: [] };

/** Normaliza para buscar sin acentos ni mayúsculas, como el buscador del live. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Aplica el buscador, el segmentado de tipo y los chips de módulo/tag.
 * Los chips acumulan en OR dentro de su grupo y en AND entre grupos.
 */
export function filtrarNovedades(items: Novedad[], filtro: FiltroNovedades): Novedad[] {
  const q = normalizar(filtro.texto.trim());

  return items.filter((n) => {
    if (filtro.tipo !== 'Todo' && n.tipo !== filtro.tipo) return false;
    if (filtro.modulos.length > 0 && !filtro.modulos.includes(n.modulo)) return false;
    if (filtro.tags.length > 0 && !filtro.tags.some((t) => n.tags.includes(t))) return false;
    if (!q) return true;

    const heno = normalizar(
      [n.titulo, n.resumen, n.modulo, n.tags.join(' '), n.detalle.cuerpo ?? '', n.detalle.porQue ?? '', n.detalle.paraQuien.join(' ')].join(' ')
    );
    return heno.includes(q);
  });
}

/** Alterna un valor dentro de una lista de chips activos. */
export function alternar(lista: string[], valor: string): string[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}
