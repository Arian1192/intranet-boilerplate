/**
 * Feed `Novedades` del dashboard de ConceptOne — calco del live del 2026-09-09,
 * capturado entre las 09:20 y las 09:40 CEST
 * (`docs/references/conceptone-v3-2026-09-09/conceptone.main.html`).
 *
 * Es lo que la bajada del live llama «Lo que hacen los promotores con sus
 * correos y contratos»: la traza de firma de cada contrato, con su referencia
 * `C1-2026-NNN`.
 *
 * **Los 15 eventos son los de esa foto** y el live los mueve a diario.
 *
 * Los `hito` son los cinco que aparecen en la captura. Tres llevan el nombre de
 * quien firma y dos no; se guardan por separado —`hito` y `quien`— en vez de
 * como una frase hecha, porque el live compone «Nombre + acción» y así el calco
 * no depende de haber visto todas las combinaciones:
 *
 * - `abrió el contrato`, `empezó a firmar` y `firmó su parte` llevan `quien`.
 * - `Contrato firmado por todas las partes` y `Contrato enviado a firmar` no.
 *
 * La fecha se guarda en ISO con hora y la pantalla la escribe como el live:
 * `hoy a las 04:02`, `ayer a las 22:44`, `7/9 a las 20:54`. El «hoy» es
 * `HOY_NOVEDADES`, el día de la captura, no el reloj real: si fuera el reloj,
 * los quince eventos se irían convirtiendo en fechas sueltas y el calco dejaría
 * de parecerse a la foto en cuanto pasara un día.
 */
export type HitoNovedad =
  | 'abrió el contrato'
  | 'empezó a firmar'
  | 'firmó su parte'
  | 'Contrato firmado por todas las partes'
  | 'Contrato enviado a firmar';

export interface Novedad {
  artista: string;
  /** Quien ejecuta el hito, cuando el live lo nombra. */
  quien?: string;
  hito: HitoNovedad;
  /** ISO con hora local, tal como lo pinta el live. */
  cuando: string;
  /** La referencia del contrato: `C1-2026-158`. */
  referencia: string;
}

/** El día de la captura. El feed escribe «hoy» y «ayer» contra esta fecha. */
export const HOY_NOVEDADES = '2026-09-09';

export const NOVEDADES: Novedad[] = [
  { artista: 'Bassel Darwish', quien: 'Francisco Guzman', hito: 'firmó su parte', cuando: '2026-09-09T04:02', referencia: 'C1-2026-158' },
  { artista: 'Bassel Darwish', hito: 'Contrato firmado por todas las partes', cuando: '2026-09-09T04:02', referencia: 'C1-2026-158' },
  { artista: 'Bassel Darwish', quien: 'Francisco Guzman', hito: 'empezó a firmar', cuando: '2026-09-09T04:02', referencia: 'C1-2026-158' },
  { artista: 'Bassel Darwish', quien: 'Francisco Guzman', hito: 'abrió el contrato', cuando: '2026-09-09T04:02', referencia: 'C1-2026-158' },
  { artista: 'Sera De Villalta', quien: 'Christin Exantus', hito: 'abrió el contrato', cuando: '2026-09-08T22:44', referencia: 'C1-2026-181' },
  { artista: 'ART NO LOGIA', quien: 'Victor Hugo Montero Gadea', hito: 'abrió el contrato', cuando: '2026-09-08T17:48', referencia: 'C1-2026-162' },
  { artista: 'Olivia Bass', quien: 'Ruben Gomez Segura', hito: 'firmó su parte', cuando: '2026-09-08T14:18', referencia: 'C1-2026-220' },
  { artista: 'Olivia Bass', hito: 'Contrato firmado por todas las partes', cuando: '2026-09-08T14:18', referencia: 'C1-2026-220' },
  { artista: 'Olivia Bass', quien: 'Ruben Gomez Segura', hito: 'empezó a firmar', cuando: '2026-09-08T14:18', referencia: 'C1-2026-220' },
  { artista: 'Olivia Bass', quien: 'Ruben Gomez Segura', hito: 'abrió el contrato', cuando: '2026-09-08T14:18', referencia: 'C1-2026-220' },
  { artista: 'Sera De Villalta', hito: 'Contrato enviado a firmar', cuando: '2026-09-08T11:16', referencia: 'C1-2026-181' },
  { artista: 'Olivia Bass', hito: 'Contrato enviado a firmar', cuando: '2026-09-08T10:57', referencia: 'C1-2026-220' },
  { artista: 'Sera De Villalta', hito: 'Contrato enviado a firmar', cuando: '2026-09-08T10:46', referencia: 'C1-2026-223' },
  { artista: 'Sera De Villalta', quien: 'Randy anael mundaca Valera', hito: 'firmó su parte', cuando: '2026-09-07T20:54', referencia: 'C1-2026-138' },
  { artista: 'Sera De Villalta', hito: 'Contrato firmado por todas las partes', cuando: '2026-09-07T20:54', referencia: 'C1-2026-138' },
];

/** «Francisco Guzman firmó su parte» · «Contrato enviado a firmar». */
export function textoNovedad(novedad: Novedad): string {
  return novedad.quien ? `${novedad.quien} ${novedad.hito}` : novedad.hito;
}

/** «hoy a las 04:02» · «ayer a las 22:44» · «7/9 a las 20:54». */
export function cuandoNovedad(cuando: string, hoy = HOY_NOVEDADES): string {
  const [fecha, hora] = cuando.split('T');
  const dia = (iso: string) => new Date(`${iso}T12:00:00Z`).getTime();
  const diferencia = Math.round((dia(hoy) - dia(fecha)) / 86_400_000);
  if (diferencia === 0) return `hoy a las ${hora}`;
  if (diferencia === 1) return `ayer a las ${hora}`;
  return `${Number(fecha.slice(8, 10))}/${Number(fecha.slice(5, 7))} a las ${hora}`;
}
