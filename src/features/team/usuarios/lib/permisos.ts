import { BLOQUES_MATRIZ, PERMISOS_PLANTILLA, type Celda } from '../data/usuarios';

/** Clave de un permiso de la matriz: `${fila}|${columna}`. */
export type ClavePermiso = string;

export type Columna = 'ver' | 'editar';

export function clave(fila: string, columna: Columna): ClavePermiso {
  return `${fila}|${columna}`;
}

/** Todas las claves marcables de la matriz (las celdas «—» no cuentan). */
export function clavesMatriz(): ClavePermiso[] {
  const out: ClavePermiso[] = [];
  for (const bloque of BLOQUES_MATRIZ) {
    for (const fila of bloque.filas) {
      for (const col of ['ver', 'editar'] as const) {
        if ((fila[col] as Celda) === 'check') out.push(clave(fila.nombre, col));
      }
    }
  }
  return out;
}

export function alternar(activos: Set<ClavePermiso>, k: ClavePermiso): Set<ClavePermiso> {
  const siguiente = new Set(activos);
  if (siguiente.has(k)) siguiente.delete(k);
  else siguiente.add(k);
  return siguiente;
}

/**
 * Aplica una plantilla. El live avisa de que **reemplaza** lo que hubiera de
 * ConceptOne en vez de sumar: si sumara, un ex-booker se quedaría viendo los fees.
 * Los permisos de fuera de la matriz (las cajas por módulo) se conservan.
 */
export function aplicarPlantilla(activos: Set<ClavePermiso>, plantilla: string): Set<ClavePermiso> {
  const deLaMatriz = new Set(clavesMatriz());
  const fuera = [...activos].filter((k) => !deLaMatriz.has(k));
  return new Set([...fuera, ...(PERMISOS_PLANTILLA[plantilla] ?? [])]);
}

/** «Copiar permisos de…»: clona tal cual lo que tenga la otra cuenta. */
export function copiarDe(permisosDeOtro: Set<ClavePermiso>): Set<ClavePermiso> {
  return new Set(permisosDeOtro);
}
