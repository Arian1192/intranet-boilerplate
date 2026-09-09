/**
 * Roster de Management — calco de `/management/roster` del live, capturado el
 * 2026-09-09 entre las 09:20 y las 09:40 CEST
 * (`docs/references/conceptone-v3-2026-09-09/management--roster.main.html`).
 *
 * Los 41 artistas van en el orden exacto del live (alfabético, con las mayúsculas
 * tal cual: `ACA`, `ART NO LOGIA`, `LA CINTIA`, `SUMIA`). Los dos interruptores
 * salen de la clase del botón: `bg-brand-500` es encendido, `bg-slate-300`
 * apagado. Hoy coinciden los 17 en ambas columnas, y eso cuadra con los dos KPI
 * de la pantalla; no es una regla del dominio, es la foto.
 *
 * `nota` es el rótulo gris que el live pinta junto al nombre.
 */
export interface ArtistaRoster {
  nombre: string;
  /** Si la agencia le lleva el management. */
  management: boolean;
  /** Si trae datos de Songstats. Sólo estos hacen llamadas a la API (se paga por uso). */
  songstats: boolean;
  nota?: string;
}

export const ROSTER_MANAGEMENT: ArtistaRoster[] = [
  { nombre: 'Aaron Martin', management: true, songstats: true },
  { nombre: 'Abdon', management: true, songstats: true },
  { nombre: 'ACA', management: false, songstats: false },
  { nombre: 'Andrea Castells', management: false, songstats: false },
  { nombre: 'ART NO LOGIA', management: true, songstats: true },
  { nombre: 'Bassel Darwish', management: false, songstats: false },
  { nombre: 'Bizza', management: true, songstats: true },
  { nombre: 'Brenda Serna', management: false, songstats: false },
  { nombre: 'Claudia Tejeda', management: true, songstats: true },
  { nombre: 'DH Moon', management: true, songstats: true },
  { nombre: 'Dhuna', management: false, songstats: false },
  { nombre: 'Florentia', management: false, songstats: false },
  { nombre: 'Fran Hernandez', management: false, songstats: false },
  { nombre: 'Freddy Bello', management: true, songstats: true },
  { nombre: 'Gaston Zani', management: true, songstats: true },
  { nombre: 'Janse', management: true, songstats: true },
  { nombre: 'Jose Fajardo', management: false, songstats: false },
  { nombre: 'Koleto', management: false, songstats: false },
  { nombre: 'LA CINTIA', management: false, songstats: false },
  { nombre: 'Londonground', management: true, songstats: true },
  { nombre: 'Los Canarios', management: true, songstats: true },
  { nombre: 'Marcel BS', management: true, songstats: true },
  { nombre: 'Marian Ariss', management: false, songstats: false },
  { nombre: 'Milan Torne', management: true, songstats: true },
  { nombre: 'Nacho Scoppa', management: false, songstats: false },
  { nombre: 'Olivia Bass', management: false, songstats: false, nota: 'sin Spotify vinculado' },
  { nombre: 'Parsa Jafari', management: false, songstats: false, nota: 'sin Spotify vinculado' },
  { nombre: 'Pau Guilera', management: false, songstats: false },
  { nombre: 'Prophecy', management: false, songstats: false },
  { nombre: 'Rivellino', management: true, songstats: true },
  { nombre: 'Rubenus', management: false, songstats: false },
  { nombre: 'Sadkiel', management: false, songstats: false },
  { nombre: 'Saldivar', management: false, songstats: false, nota: 'sin Spotify vinculado' },
  { nombre: 'Sebastian Ledher', management: true, songstats: true },
  { nombre: 'Sera De Villalta', management: false, songstats: false },
  { nombre: 'Sergio Saffe', management: false, songstats: false },
  { nombre: 'SUMIA', management: false, songstats: false },
  { nombre: 'Test Artist', management: false, songstats: false, nota: 'sin Spotify vinculado' },
  { nombre: 'Tomi & Kesh', management: false, songstats: false },
  { nombre: 'Tony Guerra', management: true, songstats: true },
  { nombre: 'Vidaloca', management: true, songstats: true },
];

/**
 * Los artistas que llevan management, en el orden del roster.
 *
 * Es la lista que el live enseña en el filtro `Todos los artistas` de
 * `/management/{activaciones,campanas,content}`: medido con el menú abierto el
 * 2026-09-09 a las 11:24 CEST (`f2b-management--campanas-filtros.txt`), son
 * estos 17 y en este orden. La segunda medida es el `<select>` de artista de los
 * tres modales de edición (`f2-management--*-detalle.main.html`), que trae los
 * mismos 17.
 *
 * Se deriva del interruptor en vez de escribirse a mano: el filtro es
 * exactamente «quién está en management», y así no hay dos listas que puedan
 * separarse.
 */
export const ARTISTAS_MANAGEMENT: readonly string[] = ROSTER_MANAGEMENT.filter(
  (a) => a.management
).map((a) => a.nombre);
