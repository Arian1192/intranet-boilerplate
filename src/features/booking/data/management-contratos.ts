/**
 * Contratos de Management — calco de `/management/contratos` del live, capturado
 * el 2026-09-09 entre las 09:20 y las 09:40 CEST
 * (`docs/references/conceptone-v3-2026-09-09/management--contratos.main.html`).
 *
 * **La pantalla está vacía en el live**: los tres KPI valen `0` y la tabla pinta
 * su fila de vacío, «Sin contratos. Crea el primero.». El calco va contra ese
 * vacío, no contra datos inventados: es la misma regla que se aplicó a las dos
 * tablas de coste de `/management/incidentes/analitica`.
 *
 * La lista se deja vacía **y con su forma declarada**, para que la pantalla
 * derive los KPI de los datos —como hacen sus hermanas— en vez de escribir tres
 * ceros a mano. El día que el live tenga contratos, se rellena aquí y la página
 * no se toca.
 *
 * La forma sale de las seis columnas de la tabla (`ARTISTA`, `ESTADO`, `FIN`,
 * `PREAVISO ANTES DE`, `ALCANCE`, `LIVE %`) y de la bajada de la pantalla
 * («término, preaviso, alcance y comisión»). Los estados son los tres que
 * nombran los KPI; no se han podido medir en el live porque no hay ni una fila,
 * así que van declarados como unión y sin colorear a ojo: el color de cada
 * estado lo fijará la fase que vea la primera fila real.
 */
export type EstadoContrato = 'Activo' | 'Preaviso próximo' | 'Vencido';

export interface ContratoManagement {
  artista: string;
  estado: EstadoContrato;
  /** Fin del término, tal como lo pinta el live. */
  fin: string;
  /** Fecha límite para dar el preaviso. */
  preavisoAntesDe: string;
  /** Alcance del mandato (management, booking, edición…). */
  alcance: string;
  /** Comisión sobre los directos, en porcentaje. */
  liveComision: number;
}

/** Vacía a propósito: es lo que hay en el live el 2026-09-09. */
export const CONTRATOS_MANAGEMENT: ContratoManagement[] = [];

/** El literal exacto del vacío de la tabla. */
export const VACIO_CONTRATOS = 'Sin contratos. Crea el primero.';
