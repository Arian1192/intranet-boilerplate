/**
 * La ficha de artista de Insights — `/management/insights/:artistaId`.
 *
 * Calco de la pantalla más grande del módulo, capturada del live el
 * **2026-09-09 entre las 12:16 y las 12:24 CEST** en una única pasada por
 * artista, para que todas las cifras de una ficha sean del mismo instante.
 * Evidencia en `docs/references/conceptone-v3-2026-09-09/` con prefijo `f3-`.
 *
 * **Las cifras están fijadas a esa foto.** El live las mueve en horas: durante
 * el propio recon vimos el oyentes-mensuales de Janse pasar de `136K` a
 * `126.7K` en 23 minutos. Ningún test debe depender de una cifra concreta que
 * pueda moverse; los tests de aquí comprueban forma, reglas y literales.
 *
 * ## Cómo se leyó la pantalla
 *
 * Toda la ficha la alimenta **una sola lectura** del live
 * (`artist_songstats?select=*&artista_id=eq.<uuid>`), que devuelve el volcado de
 * Songstats. El modelo de abajo se derivó de ese origen y **se contrastó contra
 * el DOM** capturado en el mismo instante: 634 comparaciones de literal
 * (títulos, artistas, cifras ya formateadas, fechas) sin una sola discrepancia.
 *
 * ## Lo que se midió, y corrige al spec
 *
 * - **No son 12 pestañas.** Son **hasta 14**, y el conjunto depende del artista.
 *   Los 17 artistas del roster son subsecuencias de `PLATAFORMAS`. Medido:
 *   Londonground 14, Janse 12, DH Moon 12, Marcel BS 6, Sebastian Ledher 1. El
 *   «12» del spec era el dato de Janse, no una constante.
 * - **La regla de qué pestaña existe.** Una de plataforma aparece **si y sólo si
 *   alguno de los KPI que ella misma pinta vale distinto de cero**. No es «si
 *   esa fuente tiene histórico», que es lo primero que parece: Marcel BS tiene
 *   731 puntos de Beatport y **no** trae la pestaña, porque los dos KPI que
 *   Beatport enseña (`charts_total` y `charted_tracks_total`) están a cero; y DH
 *   Moon tiene 230 puntos de Amazon y tampoco la trae, por lo mismo. Verificado
 *   en los **48 pares artista-plataforma** de los cuatro artistas con datos.
 * - **`Overview` tiene tres bloques**, no uno: `TOP TRACKS`, `HITOS RECIENTES`
 *   y `RELEASES`. Los dos últimos no estaban en el spec.
 * - **Las tres ordenaciones de `TOP TRACKS` cambian el conjunto**, no el orden:
 *   Janse da 8 pistas por `Streams`, 12 por `Popularidad` y 14 por
 *   `Playlist reach`. No es un `sort`.
 * - **Sin serie no hay gráfico.** Cuando la plataforma no tiene histórico de su
 *   métrica, la tarjeta del gráfico **desaparece entera** y queda sólo la
 *   rejilla de KPI. `Traxsource` no era un caso especial: es esta misma regla.
 * - **Los 9 KPI de `Overview` sí son fijos**: mismas etiquetas y mismo orden en
 *   los 17 artistas del roster.
 *
 * ## Recortes de lista, medidos en el live
 *
 * `TOP TRACKS` 15 · `HITOS RECIENTES` 18 · `RELEASES` 24 ·
 * `TOP PLAYLISTS` 14 · tabla de ciudades 25 · barras de país 12.
 *
 * ## El sexto estado es un fallo, no un estado
 *
 * Sebastian Ledher no es «un artista sin datos»: su sincronización con Songstats
 * **falló con `HTTP 429`**, y el live pinta ese fallo como `—` en los nueve KPI
 * y «Sin datos.» en los bloques, con una sola pestaña. Eso explica el sexto chip
 * que la Faena 2 vio en el listado y que no está entre los cinco filtros.
 *
 * ## Alcance, y por qué
 *
 * El listado tiene 17 artistas y las 17 filas navegan aquí, pero el origen real
 * pesa entre 0,7 y 2,9 MB **por artista** (hasta 12.420 puntos de serie): los 17
 * no caben. Se modelan **cinco fichas completas**, una por cada chip que un
 * revisor puede encontrar —`En declive`, `Estable`, `Escalando`, `Creciendo` y
 * el estado de fallo— y **el resto usa la plantilla de fallo real del live**.
 * Decisión del coordinador, 2026-09-09: mejor un estado real poco
 * representativo que uno inventado verosímil.
 *
 * ## Límites declarados
 *
 * - **`Inactivo` no se pudo medir**: hoy no hay ningún artista en ese estado en
 *   el roster del live. El chip está en el tipo, sin paleta medida.
 * - Cuatro KPI salen `—` en los cinco artistas porque **el origen no trae el
 *   campo**: `Releases charteados` (Beatport), `Playlist reach` (Apple Music) y
 *   `Followers` y `Views` (YouTube). Se modelan ausentes, no a cero.
 * - La segunda línea de cada `RELEASES` es `—` en los cinco artistas y el origen
 *   no trae ningún campo de sello. No se ha deducido qué es; va opcional.
 * - `Charts` de Amazon y Tidal y `Followers` de TikTok valen cero en los cinco,
 *   así que su campo de origen no se pudo aislar por valor. Se usa el mismo que
 *   sus hermanas inequívocas (`charts_current`, `followers_total`).
 * - La **proyección de las burbujas del mapa es nuestra**, declarada como tal
 *   igual que hizo `EsquemaRuta` en `TourDetallePage`. Los trazados de país sí
 *   son literales: ver [`mapamundi.ts`](./mapamundi.ts).
 *
 * Los `id` son los del listado (slug del nombre), no los UUID del live, por
 * coherencia con `management-insights.ts`.
 */

/** Los cinco chips del listado más el sexto que produce un fallo de sincronización. */
export type EstadoFicha =
  | 'Escalando'
  | 'Creciendo'
  | 'Estable'
  | 'En declive'
  | 'Inactivo'
  | 'Sin datos';

/**
 * Paleta de cada chip, medida en el live sobre los cinco artistas capturados.
 *
 * **`Creciendo` es la excepción y está calcada a propósito:** usa el violeta de
 * Tailwind (`violet-50` / `violet-700` / `violet-200`), y esas tres clases **no
 * están en `apx.css`**, así que **no siguen el acento violeta de la carcasa**.
 * El live hace exactamente esto y nuestro `apx.css` es copia literal suya. Si
 * algún día se toca la rampa violeta de `apx`, **este chip no la va a seguir**:
 * es Tailwind puro. No lo "arregles" cambiándolo a `brand-*` sin volver a medir
 * el live, porque dejaría de ser un calco.
 *
 * Los otros cuatro sí van con las rampas que `apx.css` remapea dentro de `.apx`.
 */
export const CHIP_ESTADO: Record<EstadoFicha, string> = {
  Escalando: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  // La excepción: violeta de Tailwind, no el acento apx. Ver el comentario de arriba.
  Creciendo: 'bg-violet-50 text-violet-700 ring-violet-200',
  Estable: 'bg-amber-50 text-amber-700 ring-amber-200',
  'En declive': 'bg-rose-50 text-rose-700 ring-rose-200',
  // Sin medir: hoy no hay ningún artista `Inactivo` en el roster del live.
  Inactivo: 'bg-slate-50 text-slate-400 ring-slate-200',
  'Sin datos': 'bg-slate-50 text-slate-400 ring-slate-200',
};

/** El punto del chip va aparte: no es el mismo tono que el texto. */
export const PUNTO_ESTADO: Record<EstadoFicha, string> = {
  Escalando: 'bg-emerald-500',
  Creciendo: 'bg-violet-500',
  Estable: 'bg-amber-500',
  'En declive': 'bg-rose-500',
  Inactivo: 'bg-slate-300',
  'Sin datos': 'bg-slate-300',
};

/** Las nueve etiquetas de KPI de `Overview`, en el orden del live. */
export const KPIS_OVERVIEW = [
  'Oyentes Spotify',
  'Followers Spotify',
  'Streams',
  'Popularidad',
  'Playlist reach',
  'Charts',
  'YouTube subs',
  'Instagram',
  'TikTok',
] as const;

/** Las tres ordenaciones de `TOP TRACKS`. Cambian el conjunto, no el orden. */
export const ORDENES_TOP_TRACKS = ['Streams', 'Popularidad', 'Playlist reach'] as const;
export type OrdenTopTracks = (typeof ORDENES_TOP_TRACKS)[number];

/** Los cinco rangos del gráfico, con sus días. `Todo` es el activo por defecto. */
export const RANGOS = [
  { etiqueta: '1M', dias: 30 },
  { etiqueta: '3M', dias: 90 },
  { etiqueta: '6M', dias: 182 },
  { etiqueta: '1A', dias: 364 },
  { etiqueta: 'Todo', dias: null },
] as const;
export type RangoGrafico = (typeof RANGOS)[number]['etiqueta'];

export type ClavePlataforma =
  | 'spotify' | 'beatport' | 'shazam' | 'youtube' | 'tiktok' | 'instagram'
  | 'soundcloud' | 'apple_music' | 'amazon' | 'deezer' | 'tidal' | 'traxsource';

/**
 * El orden canónico de las pestañas de plataforma, con el color de su gráfico.
 * Verificado: las pestañas de los 17 artistas son subsecuencias de esta lista.
 */
export const PLATAFORMAS: ReadonlyArray<{
  clave: ClavePlataforma;
  nombre: string;
  color: string;
}> = [
  { clave: 'spotify', nombre: 'Spotify', color: '#1DB954' },
  { clave: 'beatport', nombre: 'Beatport', color: '#01FF95' },
  { clave: 'shazam', nombre: 'Shazam', color: '#0088FF' },
  { clave: 'youtube', nombre: 'YouTube', color: '#FF0000' },
  { clave: 'tiktok', nombre: 'TikTok', color: '#000000' },
  { clave: 'instagram', nombre: 'Instagram', color: '#E1306C' },
  { clave: 'soundcloud', nombre: 'SoundCloud', color: '#FF5500' },
  { clave: 'apple_music', nombre: 'Apple Music', color: '#FA243C' },
  { clave: 'amazon', nombre: 'Amazon', color: '#FF9900' },
  { clave: 'deezer', nombre: 'Deezer', color: '#A238FF' },
  { clave: 'tidal', nombre: 'Tidal', color: '#00FFFF' },
  { clave: 'traxsource', nombre: 'Traxsource', color: '#000000' },
];

/** El punto de color de un hito va por fuente: sólo `radio` se sale del gris. */
export const COLOR_HITO: Record<string, string> = { radio: '#7D818C' };
export const COLOR_HITO_POR_DEFECTO = '#94A3B8';

/** El vacío que pinta el live cuando un bloque no tiene nada. */
export const VACIO = 'Sin datos.';

export interface PuntoSerie {
  fecha: string;
  valor: number;
}

/**
 * Las series vienen codificadas como fecha base y pares `[díasDesdeLaBase, valor]`
 * aplanados. No es capricho: **las series del live tienen huecos** (16 de 50
 * tienen saltos de 2 a 44 días), así que no basta con una fecha inicial y una
 * lista de valores. Guardarlas como pares `['2024-09-02', 6061117]` costaba
 * 285 KB; así son 137 KB **sin perder un solo punto**.
 */
export function serie(base: string, pares: readonly number[]): PuntoSerie[] {
  const cero = Date.parse(base + 'T00:00:00Z');
  const puntos: PuntoSerie[] = [];
  for (let i = 0; i < pares.length; i += 2) {
    const dia = new Date(cero + pares[i] * 86_400_000);
    puntos.push({ fecha: dia.toISOString().slice(0, 10), valor: pares[i + 1] });
  }
  return puntos;
}

export interface KpiFicha {
  label: string;
  /** Ya formateado como lo pinta el live; `—` cuando el origen no trae el campo. */
  valor: string;
}

export interface Pista {
  pos: number;
  titulo: string;
  artistas: string;
  valor: string;
  url: string;
  portada: string;
}

export interface Hito {
  texto: string;
  pista: string;
  fecha: string;
  url: string;
  portada: string;
  fuente: string;
}

export interface Release {
  titulo: string;
  /** El live pinta `—`: el origen no trae sello. Ausente en los cinco medidos. */
  sello?: string;
  /** Vacío —no `—`— cuando el origen no trae fecha. Medido en Londonground. */
  fecha: string;
}

export interface Playlist {
  nombre: string;
  /** Llega ya formateado del origen (`735K`). */
  seguidores: string;
  url: string;
  portada: string;
}

export interface CiudadOyentes {
  nombre: string;
  pais: string;
  actual: number;
  pico: number;
  fechaPico?: string;
  lat: number;
  lng: number;
}

export interface PestanaPlataforma {
  clave: ClavePlataforma;
  nombre: string;
  color: string;
  /** Ausente cuando no hay serie: entonces el live no pinta la tarjeta del gráfico. */
  metrica?: string;
  serie: PuntoSerie[];
  kpis: KpiFicha[];
}

export interface FichaArtista {
  id: string;
  nombre: string;
  estado: EstadoFicha;
  /** El literal del live: `Songstats · actualizado <esto>`. */
  actualizado: string;
  /** `true` cuando la sincronización con Songstats falló (el caso `HTTP 429`). */
  fallo: boolean;
  kpis: string[];
  topTracks: Record<OrdenTopTracks, Pista[]>;
  hitos: Hito[];
  releases: Release[];
  topPlaylists: Playlist[];
  beatportTracks: Pista[];
  beatportCharts: Hito[];
  ciudades: CiudadOyentes[];
  plataformas: PestanaPlataforma[];
}


const FICHA_VACIA = {
  kpis: Array.from({ length: 9 }, () => '—'),
  topTracks: { Streams: [], Popularidad: [], 'Playlist reach': [] },
  hitos: [], releases: [], topPlaylists: [], beatportTracks: [],
  beatportCharts: [], ciudades: [], plataformas: [],
} satisfies Omit<FichaArtista, 'id' | 'nombre' | 'estado' | 'actualizado' | 'fallo'>;


export const FICHAS: FichaArtista[] = [
  {
    id: 'janse',
    nombre: 'Janse',
    estado: 'En declive',
    actualizado: '9/9/2026',
    fallo: false,
    kpis: ['128.1K', '291', '9.8M', '41', '2M', '0', '3', '4K', '0'],
    topTracks: {
      'Streams': [
        { pos: 1, titulo: 'Get Down Saturday Night', artistas: 'Leclaire., Janse', valor: '5.5M', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea' },
        { pos: 2, titulo: 'Let It Go', artistas: 'Leclaire., Janse', valor: '4.1M', url: 'https://songstats.com/track/14vnz6qc/let-it-go', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7' },
        { pos: 3, titulo: 'Come With Me', artistas: 'Janse', valor: '79.2K', url: 'https://songstats.com/track/snkd56lv/come-with-me', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 4, titulo: 'Your Love', artistas: 'Janse', valor: '30.7K', url: 'https://songstats.com/track/vfjd8qt4/your-love', portada: 'https://i.scdn.co/image/ab67616d00001e023571efec2c16bf458c8a60ae' },
        { pos: 5, titulo: 'Could Be Me', artistas: 'Janse', valor: '26.7K', url: 'https://songstats.com/track/leaqwurn/could-be-me', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 6, titulo: 'Endless Story', artistas: 'Janse', valor: '24.8K', url: 'https://songstats.com/track/zmintfp7/endless-story', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 7, titulo: 'The Key Jam', artistas: 'Janse, Mood Child', valor: '13.7K', url: 'https://songstats.com/track/09ny5mjq/the-key-jam', portada: 'https://i.scdn.co/image/ab67616d00001e028ee95ca6d232447f45ee0142' },
        { pos: 8, titulo: 'Wait a Minute', artistas: 'Janse', valor: '1.5K', url: 'https://songstats.com/track/j4dq8mwo/wait-a-minute', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
      ],
      'Popularidad': [
        { pos: 1, titulo: 'Get Down Saturday Night', artistas: 'Leclaire., Janse', valor: '58', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea' },
        { pos: 2, titulo: 'Let It Go', artistas: 'Leclaire., Janse', valor: '53', url: 'https://songstats.com/track/14vnz6qc/let-it-go', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7' },
        { pos: 3, titulo: 'Come With Me', artistas: 'Janse', valor: '24', url: 'https://songstats.com/track/snkd56lv/come-with-me', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 4, titulo: 'Your Love', artistas: 'Janse', valor: '22', url: 'https://songstats.com/track/vfjd8qt4/your-love', portada: 'https://i.scdn.co/image/ab67616d00001e023571efec2c16bf458c8a60ae' },
        { pos: 5, titulo: 'Endless Story', artistas: 'Janse', valor: '21', url: 'https://songstats.com/track/zmintfp7/endless-story', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 6, titulo: 'Could Be Me', artistas: 'Janse', valor: '21', url: 'https://songstats.com/track/leaqwurn/could-be-me', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 7, titulo: 'The Key Jam', artistas: 'Janse, Mood Child', valor: '9', url: 'https://songstats.com/track/09ny5mjq/the-key-jam', portada: 'https://i.scdn.co/image/ab67616d00001e028ee95ca6d232447f45ee0142' },
        { pos: 8, titulo: 'Wait a Minute', artistas: 'Janse', valor: '5', url: 'https://songstats.com/track/j4dq8mwo/wait-a-minute', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
        { pos: 9, titulo: 'Back At It', artistas: 'Janse', valor: '3', url: 'https://songstats.com/track/8oxk1jqr/back-at-it', portada: 'https://i.scdn.co/image/ab67616d00001e02c77d7375f02bc26fd2837c35' },
        { pos: 10, titulo: 'Busy', artistas: 'Janse', valor: '2', url: 'https://songstats.com/track/qto912ec/busy', portada: 'https://i.scdn.co/image/ab67616d00001e02c77d7375f02bc26fd2837c35' },
        { pos: 11, titulo: 'Just Once', artistas: 'Janse', valor: '1', url: 'https://songstats.com/track/5lu2gdvq/just-once', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
        { pos: 12, titulo: 'All I Do', artistas: 'Janse', valor: '1', url: 'https://songstats.com/track/jdy6fpug/all-i-do', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
      ],
      'Playlist reach': [
        { pos: 1, titulo: 'Get Down Saturday Night', artistas: 'Leclaire., Janse', valor: '3.7M', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea' },
        { pos: 2, titulo: 'Let It Go', artistas: 'Leclaire., Janse', valor: '3M', url: 'https://songstats.com/track/14vnz6qc/let-it-go', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7' },
        { pos: 3, titulo: 'The Key Jam', artistas: 'Janse, Mood Child', valor: '371K', url: 'https://songstats.com/track/09ny5mjq/the-key-jam', portada: 'https://i.scdn.co/image/ab67616d00001e028ee95ca6d232447f45ee0142' },
        { pos: 4, titulo: 'Could Be Me', artistas: 'Janse', valor: '91.7K', url: 'https://songstats.com/track/leaqwurn/could-be-me', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 5, titulo: 'Come With Me', artistas: 'Janse', valor: '90.9K', url: 'https://songstats.com/track/snkd56lv/come-with-me', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 6, titulo: 'Endless Story', artistas: 'Janse', valor: '90.2K', url: 'https://songstats.com/track/zmintfp7/endless-story', portada: 'https://i.scdn.co/image/ab67616d00001e0207aeb99a3fac0a2792944f75' },
        { pos: 7, titulo: 'Your Love', artistas: 'Janse', valor: '89.9K', url: 'https://songstats.com/track/vfjd8qt4/your-love', portada: 'https://i.scdn.co/image/ab67616d00001e023571efec2c16bf458c8a60ae' },
        { pos: 8, titulo: 'Wait a Minute', artistas: 'Janse', valor: '6.2K', url: 'https://songstats.com/track/j4dq8mwo/wait-a-minute', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
        { pos: 9, titulo: 'Just Once', artistas: 'Janse', valor: '1.6K', url: 'https://songstats.com/track/5lu2gdvq/just-once', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
        { pos: 10, titulo: 'All I Do', artistas: 'Janse', valor: '707', url: 'https://songstats.com/track/jdy6fpug/all-i-do', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
        { pos: 11, titulo: 'Busy', artistas: 'Janse', valor: '651', url: 'https://songstats.com/track/qto912ec/busy', portada: 'https://i.scdn.co/image/ab67616d00001e02c77d7375f02bc26fd2837c35' },
        { pos: 12, titulo: 'Can\'t Explain', artistas: 'Janse', valor: '418', url: 'https://songstats.com/track/i7j6uyfr/can-t-explain', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
        { pos: 13, titulo: 'On The Way', artistas: 'Janse', valor: '418', url: 'https://songstats.com/track/etwkydhf/on-the-way', portada: 'https://i.scdn.co/image/ab67616d00001e023571efec2c16bf458c8a60ae' },
        { pos: 14, titulo: 'I Want You', artistas: 'Janse', valor: '418', url: 'https://songstats.com/track/45zxulse/i-want-you', portada: 'https://i.scdn.co/image/ab67616d00001e023571efec2c16bf458c8a60ae' },
      ],
    },
    hitos: [
      { texto: 'Just reached 3 Million Playlist Listeners', pista: 'Let It Go', fecha: '09 sept', url: 'https://songstats.com/track/14vnz6qc/let-it-go', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7', fuente: 'spotify' },
      { texto: 'Just reached 500 Radio Plays', pista: 'Get Down Saturday Night', fecha: '22 ago', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'radio' },
      { texto: 'Playlisted by Paraiso Music on Matin Relax  ☕️ Réveil En Douceur (252 Followers)', pista: 'Get Down Saturday Night', fecha: '21 ago', url: 'https://www.deezer.com/us/playlist/9036064402', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'deezer' },
      { texto: 'Playlisted by Paraiso Music on Réveil en Douceur ☕ Matin Relax (319 Followers)', pista: 'Let It Go', fecha: '21 ago', url: 'https://www.deezer.com/us/playlist/9824908102', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7', fuente: 'deezer' },
      { texto: 'Playlisted by Paraiso Music on Réveil en Douceur ☕ Matin Relax (319 Followers)', pista: 'Get Down Saturday Night', fecha: '21 ago', url: 'https://www.deezer.com/us/playlist/9824908102', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'deezer' },
      { texto: 'Charted #78 on Dance: Norway', pista: 'Let It Go', fecha: '20 ago', url: 'https://songstats.com/track/14vnz6qc/let-it-go', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7', fuente: 'itunes' },
      { texto: 'Played on Dance UK Radio in Birmingham, UK', pista: 'Get Down Saturday Night', fecha: '15 ago', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'radio' },
      { texto: 'Played on Dance UK Radio in UK', pista: 'Get Down Saturday Night', fecha: '15 ago', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'radio' },
      { texto: 'Playlisted by Mood Child on Mood Child: The Full Journey (826 Followers)', pista: 'The Key Jam', fecha: '01 ago', url: 'http://open.spotify.com/playlist/6siQI4KMZlxytDYa7zmhPE', portada: 'https://i.scdn.co/image/ab67616d00001e028ee95ca6d232447f45ee0142', fuente: 'spotify' },
      { texto: 'Played on Pure Ibiza Radio in Valencia, Spain', pista: 'Get Down Saturday Night', fecha: '27 jul', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'radio' },
      { texto: 'Played on Pure Ibiza Radio in Spain', pista: 'Get Down Saturday Night', fecha: '27 jul', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'radio' },
      { texto: 'Just reached 5 Million Streams', pista: 'Get Down Saturday Night', fecha: '23 jul', url: 'https://songstats.com/track/smogxd2i/get-down-saturday-night', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'spotify' },
      { texto: 'Playlisted by Léonie on 🌞 Dolce vita💛🛵 (233 Followers)', pista: 'Let It Go', fecha: '22 jul', url: 'http://open.spotify.com/playlist/03UDDaPMQH66i50mEyn8cv', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7', fuente: 'spotify' },
      { texto: 'Played by Jamie Jones on Hot Robot Radio 227', pista: 'Wait a Minute', fecha: '05 jul', url: 'https://songstats.com/track/j4dq8mwo/wait-a-minute', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251', fuente: 'tracklist' },
      { texto: 'Played by Bob Sinclar on The Bob Sinclar Show', pista: 'Wait a Minute', fecha: '05 jul', url: 'https://songstats.com/track/j4dq8mwo/wait-a-minute', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251', fuente: 'tracklist' },
      { texto: 'Charted #62 on Minimal / Deep Tech', pista: 'Wait a Minute', fecha: '02 jul', url: 'https://songstats.com/track/j4dq8mwo/wait-a-minute', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251', fuente: 'traxsource' },
      { texto: 'Playlisted by Nádia Silva on Paraíso Selects 🌞 (993 Followers)', pista: 'Get Down Saturday Night', fecha: '01 jul', url: 'http://open.spotify.com/playlist/02IPq1Lro76lDwPvhEadPl', portada: 'https://i.scdn.co/image/ab67616d00001e02da47d7caef25054b2e12feea', fuente: 'spotify' },
      { texto: 'Playlisted by Nádia Silva on Paraíso Selects 🌞 (993 Followers)', pista: 'Let It Go', fecha: '01 jul', url: 'http://open.spotify.com/playlist/02IPq1Lro76lDwPvhEadPl', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7', fuente: 'spotify' },
    ],
    releases: [
      { titulo: 'Busy', fecha: 'may 2026' },
      { titulo: 'Back At It', fecha: 'may 2026' },
      { titulo: 'Can\'t Explain', fecha: 'feb 2026' },
      { titulo: 'All I Do', fecha: 'feb 2026' },
      { titulo: 'Just Once', fecha: 'feb 2026' },
      { titulo: 'Wait a Minute', fecha: 'feb 2026' },
      { titulo: 'Your Love', fecha: 'dic 2025' },
      { titulo: 'On The Way', fecha: 'dic 2025' },
      { titulo: 'I Want You', fecha: 'dic 2025' },
      { titulo: 'Come With Me', fecha: 'nov 2025' },
      { titulo: 'Endless Story', fecha: 'nov 2025' },
      { titulo: 'Could Be Me', fecha: 'nov 2025' },
      { titulo: 'Get Down Saturday Night', fecha: 'nov 2025' },
      { titulo: 'Keep Movin\'', fecha: 'sept 2025' },
      { titulo: 'The Key Jam', fecha: 'ago 2025' },
      { titulo: 'Let It Go', fecha: 'jul 2025' },
    ],
    topPlaylists: [
      { nombre: 'Restaurant Lounge Music 2026 🍸 Background Music 🍸 Dinner Chill', seguidores: '735K', url: 'https://open.spotify.com/playlist/345eEKyGNyluygzMsS1n1H', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c000097ac393b4ea4e7611b24ca783db6' },
      { nombre: 'Morning Chill 2026 ☕️ Wake Up Relax', seguidores: '112K', url: 'https://open.spotify.com/playlist/5UjL3otSbXqrm8Ezholgje', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84c1fb0dc9878f55cacd1fdc3f' },
      { nombre: 'Summer Chill 2026 🌴 Deep house 🌴 Tropical 🌴 Lounge', seguidores: '92.9K', url: 'https://open.spotify.com/playlist/44GC9JPeKOCLwaUx7LsaIs', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8419bffdd7b4080202f66ee912' },
      { nombre: 'Bar Chill Lounge Music 2026 🍷 Background Music', seguidores: '90.9K', url: 'https://open.spotify.com/playlist/3FC307HaeiUpZ2w2s4rBcW', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8401bce68876d6be714382da90' },
      { nombre: 'Deep House 2026 🌴   Deep House Café  ☀️', seguidores: '89.5K', url: 'https://open.spotify.com/playlist/7dp9YF44Lcuf5EpuFubFbx', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84aa641e7ddeebfc1bfd7b761b' },
      { nombre: 'Coffee Lounge 2026 ☕  Café Music ☕ Koffie Chill ☕ Kaffee Musik', seguidores: '59.4K', url: 'https://open.spotify.com/playlist/0MmJin2lNE7CAUE8UAQSnM', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da848d946167deb6d9474ec3f278' },
      { nombre: 'House Music - Ibiza 2026', seguidores: '56.8K', url: 'https://open.spotify.com/playlist/2HY8bBDndLGDvZcDMtoqrl', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84729f00a007c2efa2287cbd8a' },
      { nombre: 'Office Chill 💻  ☕ Lounge Music For Work • Work Playlist', seguidores: '53.6K', url: 'https://open.spotify.com/playlist/4Ha75mQ1WO9x3v7mmlWWcA', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84e2012e69ada1cc4ac381ee02' },
      { nombre: 'Covers & Chill 2026  ☀️ 🌴 Lounge Covers To Relax', seguidores: '51.5K', url: 'https://open.spotify.com/playlist/5ODAwlEw1xuk2k1fpvsTAY', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da847ed158f703ce32ea5a96962c' },
      { nombre: 'Salon Music 2026 🌸 Chill Hits', seguidores: '51.2K', url: 'https://open.spotify.com/playlist/2wL3L0LtLOt64Et7FrDV98', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c000097ac7cb56d782a0092c44d470e2d' },
      { nombre: 'Playa Lounge  2026 🌴☀️🏖️ Verano', seguidores: '37.5K', url: 'https://open.spotify.com/playlist/2hoZMcdIE7GHuPPMjadhSN', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c000097acce052f2e54e60c9e1261f5f6' },
      { nombre: 'Restaurant Lounge Music 2026 🍸Background Music', seguidores: '31.5K', url: 'https://open.spotify.com/playlist/3RIw9H4J6unRNB0OTg4HgN', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84230e9914ecee298fc9ac294e' },
      { nombre: 'FUNKY HOUSE', seguidores: '28.3K', url: 'https://open.spotify.com/playlist/1Yt2Eb6s3yxZiJABZVMzXy', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da840275ad5d46b57f371d02a352' },
      { nombre: 'SUNSET Chillout 2026 🏝️  Ricklux', seguidores: '25K', url: 'https://open.spotify.com/playlist/7F5Hg65DzMRU3qnnnZ1pDR', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8432800f20fa529b33acef4452' },
    ],
    beatportTracks: [
      { pos: 1, titulo: 'Wait a Minute', artistas: 'Janse', valor: '5', url: 'https://songstats.com/track/j4dq8mwo/wait-a-minute', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
      { pos: 2, titulo: 'Let It Go', artistas: 'Leclaire., Janse', valor: '1', url: 'https://songstats.com/track/14vnz6qc/let-it-go', portada: 'https://i.scdn.co/image/ab67616d00001e0200317e62345b9a42b85d42b7' },
      { pos: 3, titulo: 'All I Do', artistas: 'Janse', valor: '1', url: 'https://songstats.com/track/jdy6fpug/all-i-do', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
      { pos: 4, titulo: 'Just Once', artistas: 'Janse', valor: '1', url: 'https://songstats.com/track/5lu2gdvq/just-once', portada: 'https://i.scdn.co/image/ab67616d00001e02b703083690a5324e8f1df251' },
    ],
    beatportCharts: [
    ],
    ciudades: [
      { nombre: 'São Paulo', pais: 'BR', actual: 1304, pico: 2787, fechaPico: '21 ene 26', lat: -23.5558, lng: -46.6396 },
      { nombre: 'Madrid', pais: 'ES', actual: 1257, pico: 2469, fechaPico: '03 dic 25', lat: 40.4167, lng: -3.7033 },
      { nombre: 'Mexico City', pais: 'MX', actual: 1243, pico: 3990, fechaPico: '18 dic 25', lat: 19.4326, lng: -99.1332 },
      { nombre: 'Bogotá', pais: 'CO', actual: 1031, pico: 1659, fechaPico: '11 feb 26', lat: 4.711, lng: -74.0721 },
      { nombre: 'Sydney', pais: 'AU', actual: 993, pico: 2577, fechaPico: '14 ene 26', lat: -33.8727, lng: 151.2057 },
      { nombre: 'Berlin', pais: 'DE', actual: 939, pico: 4380, fechaPico: '03 dic 25', lat: 52.52, lng: 13.405 },
      { nombre: 'Barcelona', pais: 'ES', actual: 933, pico: 2137, fechaPico: '03 dic 25', lat: 41.3874, lng: 2.1686 },
      { nombre: 'London', pais: 'GB', actual: 929, pico: 2214, fechaPico: '03 dic 25', lat: 51.5072, lng: -0.1276 },
      { nombre: 'Warsaw', pais: 'PL', actual: 886, pico: 4907, fechaPico: '03 dic 25', lat: 52.2297, lng: 21.0122 },
      { nombre: 'Athens', pais: 'GR', actual: 884, pico: 1773, fechaPico: '11 feb 26', lat: 37.9838, lng: 23.7275 },
      { nombre: 'Hamburg', pais: 'DE', actual: 855, pico: 3725, fechaPico: '03 dic 25', lat: 53.5488, lng: 9.9872 },
      { nombre: 'Melbourne', pais: 'AU', actual: 822, pico: 1933, fechaPico: '29 ene 26', lat: -37.8136, lng: 144.9631 },
      { nombre: 'Buenos Aires', pais: 'AR', actual: 756, pico: 2017, fechaPico: '29 ene 26', lat: -34.6143, lng: -58.4402 },
      { nombre: 'Frankfurt', pais: 'DE', actual: 755, pico: 3167, fechaPico: '03 dic 25', lat: 50.1109, lng: 8.6821 },
      { nombre: 'Brisbane', pais: 'AU', actual: 744, pico: 1737, fechaPico: '14 ene 26', lat: -27.4705, lng: 153.026 },
      { nombre: 'Montréal', pais: 'CA', actual: 743, pico: 1809, fechaPico: '03 dic 25', lat: 45.5019, lng: -73.5674 },
      { nombre: 'Paris', pais: 'FR', actual: 727, pico: 2679, fechaPico: '11 dic 25', lat: 48.8575, lng: 2.3514 },
      { nombre: 'Munich', pais: 'DE', actual: 722, pico: 3744, fechaPico: '03 dic 25', lat: 48.1351, lng: 11.582 },
      { nombre: 'Santiago', pais: 'CL', actual: 695, pico: 2679, fechaPico: '21 ene 26', lat: -33.4489, lng: -70.6693 },
      { nombre: 'Vienna', pais: 'AT', actual: 596, pico: 2789, fechaPico: '03 dic 25', lat: 48.2081, lng: 16.3713 },
      { nombre: 'Rome', pais: 'IT', actual: 576, pico: 1392, fechaPico: '06 ago 25', lat: 41.8967, lng: 12.4822 },
      { nombre: 'Budapest', pais: 'HU', actual: 554, pico: 2347, fechaPico: '03 dic 25', lat: 47.4979, lng: 19.0402 },
      { nombre: 'Zürich', pais: 'CH', actual: 545, pico: 3151, fechaPico: '03 dic 25', lat: 47.3769, lng: 8.5417 },
      { nombre: 'Milan', pais: 'IT', actual: 512, pico: 2189, fechaPico: '03 dic 25', lat: 45.4685, lng: 9.1824 },
      { nombre: 'Stuttgart', pais: 'DE', actual: 506, pico: 2402, fechaPico: '03 dic 25', lat: 48.7758, lng: 9.1829 },
      { nombre: 'Prague', pais: 'CZ', actual: 464, pico: 2490, fechaPico: '03 dic 25', lat: 50.0755, lng: 14.4378 },
      { nombre: 'Auckland', pais: 'NZ', actual: 460, pico: 1075, fechaPico: '08 ene 26', lat: -36.8509, lng: 174.7645 },
      { nombre: 'Brussels', pais: 'BE', actual: 448, pico: 4105, fechaPico: '03 dic 25', lat: 50.8477, lng: 4.3572 },
      { nombre: 'Perth', pais: 'AU', actual: 445, pico: 1157, fechaPico: '14 ene 26', lat: -31.9514, lng: 115.8617 },
      { nombre: 'Guadalajara', pais: 'MX', actual: 442, pico: 1332, fechaPico: '18 dic 25', lat: 20.6752, lng: -103.3473 },
      { nombre: 'Rio de Janeiro', pais: 'BR', actual: 433, pico: 1165, fechaPico: '21 ene 26', lat: -22.9068, lng: -43.1729 },
      { nombre: 'Stockholm', pais: 'SE', actual: 427, pico: 1880, fechaPico: '03 dic 25', lat: 59.3327, lng: 18.0656 },
      { nombre: 'Curitiba', pais: 'BR', actual: 421, pico: 928, fechaPico: '21 ene 26', lat: -25.4269, lng: -49.2652 },
      { nombre: 'San José', pais: 'CR', actual: 421, pico: 924, fechaPico: '18 dic 25', lat: 9.9281, lng: -84.0907 },
      { nombre: 'Oslo', pais: 'NO', actual: 409, pico: 1343, fechaPico: '03 dic 25', lat: 59.9139, lng: 10.7522 },
      { nombre: 'Belo Horizonte', pais: 'BR', actual: 402, pico: 998, fechaPico: '21 ene 26', lat: -19.9191, lng: -43.9387 },
      { nombre: 'Brasília', pais: 'BR', actual: 376, pico: 414, fechaPico: '19 ago 26', lat: -15.7975, lng: -47.8919 },
      { nombre: 'Valencia', pais: 'ES', actual: 374, pico: 561, fechaPico: '06 ago 25', lat: 39.4738, lng: -0.3756 },
      { nombre: 'Porto Alegre', pais: 'BR', actual: 367, pico: 939, fechaPico: '21 ene 26', lat: -30.0368, lng: -51.209 },
      { nombre: 'Toronto', pais: 'CA', actual: 366, pico: 855, fechaPico: '11 feb 26', lat: 43.6532, lng: -79.3832 },
      { nombre: 'Antwerp', pais: 'BE', actual: 352, pico: 1612, fechaPico: '03 dic 25', lat: 51.2199, lng: 4.415 },
      { nombre: 'Poznań', pais: 'PL', actual: 341, pico: 2215, fechaPico: '11 dic 25', lat: 52.4057, lng: 16.9313 },
      { nombre: 'Düsseldorf', pais: 'DE', actual: 334, pico: 1963, fechaPico: '03 dic 25', lat: 51.223, lng: 6.7825 },
      { nombre: 'Hanover', pais: 'DE', actual: 325, pico: 1058, fechaPico: '03 dic 25', lat: 52.3759, lng: 9.732 },
      { nombre: 'Campinas', pais: 'BR', actual: 325, pico: 342, fechaPico: '31 ago 26', lat: -22.9051, lng: -47.0613 },
      { nombre: 'Amsterdam', pais: 'NL', actual: 0, pico: 5014, fechaPico: '03 dic 25', lat: 52.3676, lng: 4.9041 },
      { nombre: 'Rotterdam', pais: 'NL', actual: 0, pico: 3372, fechaPico: '03 dic 25', lat: 51.9244, lng: 4.4777 },
      { nombre: 'Cologne', pais: 'DE', actual: 0, pico: 2314, fechaPico: '03 dic 25', lat: 50.9375, lng: 6.9603 },
      { nombre: 'Wrocław', pais: 'PL', actual: 0, pico: 1955, fechaPico: '11 dic 25', lat: 51.1093, lng: 17.0386 },
      { nombre: 'Utrecht', pais: 'NL', actual: 0, pico: 1849, fechaPico: '03 dic 25', lat: 52.0919, lng: 5.123 },
      { nombre: 'Gdańsk', pais: 'PL', actual: 0, pico: 1732, fechaPico: '11 dic 25', lat: 54.352, lng: 18.6466 },
      { nombre: 'Kraków', pais: 'PL', actual: 0, pico: 1609, fechaPico: '03 dic 25', lat: 50.0647, lng: 19.945 },
      { nombre: 'Łódź', pais: 'PL', actual: 0, pico: 1392, fechaPico: '03 dic 25', lat: 51.7593, lng: 19.4559 },
      { nombre: 'Katowice', pais: 'PL', actual: 0, pico: 1296, fechaPico: '11 dic 25', lat: 50.2649, lng: 19.0238 },
      { nombre: 'Lisbon', pais: 'PT', actual: 0, pico: 1254, fechaPico: '03 dic 25', lat: 38.7223, lng: -9.1393 },
      { nombre: 'Nuremberg', pais: 'DE', actual: 0, pico: 1157, fechaPico: '23 abr 26', lat: 49.4543, lng: 11.0746 },
      { nombre: 'Dortmund', pais: 'DE', actual: 0, pico: 1146, fechaPico: '07 may 26', lat: 51.5136, lng: 7.4653 },
      { nombre: 'Medellín', pais: 'CO', actual: 0, pico: 1135, fechaPico: '19 mar 26', lat: 6.2476, lng: -75.5658 },
      { nombre: 'Lyon', pais: 'FR', actual: 0, pico: 1131, fechaPico: '03 dic 25', lat: 45.764, lng: 4.8357 },
      { nombre: 'The Hague', pais: 'NL', actual: 0, pico: 1122, fechaPico: '03 dic 25', lat: 52.0705, lng: 4.3007 },
      { nombre: 'Leipzig', pais: 'DE', actual: 0, pico: 1067, fechaPico: '11 dic 25', lat: 51.3397, lng: 12.3731 },
      { nombre: 'Gothenburg', pais: 'SE', actual: 0, pico: 975, fechaPico: '03 dic 25', lat: 57.7089, lng: 11.9746 },
      { nombre: 'Istanboel', pais: 'TR', actual: 0, pico: 873, fechaPico: '26 feb 26', lat: 41.1634, lng: 28.7664 },
      { nombre: 'Mérida', pais: 'MX', actual: 0, pico: 855, fechaPico: '25 dic 25', lat: 20.9674, lng: -89.5926 },
      { nombre: 'Porto', pais: 'PT', actual: 0, pico: 798, fechaPico: '23 abr 26', lat: 41.1462, lng: -8.6122 },
      { nombre: 'Marseille', pais: 'FR', actual: 0, pico: 589, fechaPico: '06 ago 25', lat: 43.3026, lng: 5.3691 },
      { nombre: 'Buenos Aires', pais: 'AR', actual: 0, pico: 559, fechaPico: '31 jul 25', lat: -34.6037, lng: -58.3821 },
      { nombre: 'Dublin', pais: 'IE', actual: 0, pico: 486, fechaPico: '25 jul 25', lat: 53.3498, lng: -6.2603 },
      { nombre: 'Vilnius', pais: 'LT', actual: 0, pico: 467, fechaPico: '25 jul 25', lat: 54.6872, lng: 25.2797 },
      { nombre: 'Miami', pais: 'US', actual: 0, pico: 380, fechaPico: '18 ago 26', lat: 25.7617, lng: -80.1918 },
      { nombre: 'Ghent', pais: 'BE', actual: 0, pico: 355, fechaPico: '30 oct 25', lat: 51.05, lng: 3.7304 },
    ],
    plataformas: [
      {
        clave: 'spotify', nombre: 'Spotify', color: '#1DB954',
        metrica: 'Oyentes mensuales',
        kpis: [{ label: 'Oyentes', valor: '128.1K' }, { label: 'Followers', valor: '291' }, { label: 'Streams', valor: '9.8M' }, { label: 'Popularidad', valor: '41' }, { label: 'Playlists', valor: '146' }, { label: 'Playlist reach', valor: '2M' }],
        serie: serie('2025-07-10', [0, 70668, 1, 70668, 2, 70668, 3, 70668, 4, 70668, 5, 70668, 6, 173155, 7, 173155, 8, 173155, 9, 173155, 10, 173155, 11, 173155, 12, 173155, 13, 173155, 14, 173155, 15, 173155, 16, 173155, 17, 173155, 18, 173155, 19, 173155, 20, 206680, 21, 206680, 22, 206680, 23, 206680, 24, 206680, 25, 206680, 26, 206680, 27, 212994, 28, 212994, 29, 212994, 30, 212994, 31, 212994, 32, 212994, 33, 212994, 34, 207986, 35, 207986, 36, 207986, 37, 207986, 38, 207986, 39, 207986, 40, 207986, 41, 205015, 42, 205015, 43, 205015, 44, 205015, 45, 205015, 46, 205015, 47, 205015, 48, 201363, 49, 201363, 50, 201363, 51, 201363, 52, 201363, 53, 201363, 54, 201363, 55, 196388, 56, 196388, 57, 196388, 58, 196388, 59, 196388, 60, 196388, 61, 196388, 62, 196388, 63, 196388, 64, 196388, 65, 196388, 66, 196388, 67, 196388, 68, 196388, 69, 176708, 70, 176708, 71, 176708, 72, 176708, 73, 176708, 74, 176708, 75, 176708, 76, 167436, 77, 167436, 78, 167436, 79, 167436, 80, 167436, 81, 167436, 82, 167436, 83, 160594, 84, 160594, 85, 160594, 86, 160594, 87, 160594, 88, 160594, 89, 160594, 90, 152508, 91, 152508, 92, 152508, 93, 152508, 94, 152508, 95, 152508, 96, 152508, 97, 146551, 98, 146551, 99, 146551, 100, 146551, 101, 146551, 102, 146551, 103, 146551, 104, 141645, 105, 141645, 106, 141645, 107, 141645, 108, 141645, 109, 141645, 110, 141645, 111, 137944, 112, 137944, 113, 137944, 114, 137944, 115, 137944, 116, 137944, 117, 137944, 118, 134636, 119, 134636, 120, 134636, 121, 134636, 122, 134636, 123, 134636, 124, 134636, 125, 134636, 126, 134636, 127, 134636, 128, 134636, 129, 134636, 130, 134636, 131, 134636, 132, 252475, 133, 252475, 134, 252475, 135, 252475, 136, 252475, 137, 252475, 138, 252475, 139, 304805, 140, 304805, 141, 304805, 142, 304805, 143, 304805, 144, 304805, 145, 304805, 146, 349515, 147, 349515, 148, 349515, 149, 349515, 150, 349515, 151, 349515, 152, 349515, 153, 349177, 154, 349177, 155, 349177, 156, 349177, 157, 349177, 158, 349177, 159, 349177, 160, 326017, 161, 326017, 162, 326017, 163, 326017, 164, 326017, 165, 326017, 166, 326017, 167, 303026, 168, 303026, 169, 303026, 170, 303026, 171, 303026, 172, 303026, 173, 303026, 174, 292125, 175, 292125, 176, 292125, 177, 292125, 178, 292125, 179, 292125, 180, 292125, 181, 304332, 182, 304332, 183, 304332, 184, 304332, 185, 304332, 186, 304332, 187, 304332, 188, 317038, 189, 317038, 190, 317038, 191, 317038, 192, 317038, 193, 317038, 194, 317038, 195, 329735, 196, 329735, 197, 329735, 198, 329735, 199, 329735, 200, 329735, 201, 329735, 202, 337780, 203, 337780, 204, 337780, 205, 337780, 206, 337780, 207, 337780, 208, 337780, 209, 337780, 210, 337780, 211, 337780, 212, 337780, 213, 337780, 214, 337780, 215, 337780, 216, 322538, 217, 322538, 218, 322538, 219, 322538, 220, 322538, 221, 322538, 222, 322538, 223, 322538, 224, 322538, 225, 322538, 226, 322538, 227, 322538, 228, 322538, 229, 322538, 230, 309710, 231, 309710, 232, 309710, 233, 309710, 234, 309710, 235, 309710, 236, 309710, 237, 309710, 238, 306350, 239, 306350, 240, 306350, 241, 306350, 242, 306350, 243, 306350, 244, 306350, 245, 306350, 246, 306350, 247, 306350, 248, 306350, 249, 306350, 250, 306350, 251, 302498, 252, 302498, 253, 302498, 254, 302498, 255, 302498, 256, 302498, 257, 302498, 258, 299227, 259, 299227, 260, 299227, 261, 299227, 262, 299227, 263, 299227, 264, 299227, 265, 293859, 266, 293859, 267, 293859, 268, 293859, 269, 293859, 270, 293859, 271, 293859, 272, 293859, 273, 293859, 274, 293859, 275, 293859, 276, 293859, 277, 293859, 278, 293859, 279, 292647, 280, 292647, 281, 292647, 282, 292647, 283, 292647, 284, 292647, 285, 292647, 286, 289934, 287, 289934, 288, 289934, 289, 289934, 290, 289934, 291, 289934, 292, 289934, 293, 280403, 294, 280403, 295, 280403, 296, 280403, 297, 280403, 298, 280403, 299, 280403, 300, 259249, 301, 259249, 302, 259249, 303, 259249, 304, 259249, 305, 259249, 306, 259249, 307, 238369, 308, 238369, 309, 238369, 310, 238369, 311, 238369, 312, 238369, 313, 238369, 314, 214647, 315, 214647, 316, 214647, 317, 214647, 318, 214647, 319, 214647, 320, 214647, 321, 191143, 322, 191143, 323, 191143, 324, 191143, 325, 191143, 326, 191143, 327, 191143, 328, 177306, 329, 177306, 330, 177306, 331, 177306, 332, 177306, 333, 177306, 334, 177306, 335, 173978, 336, 173978, 337, 173978, 338, 173978, 339, 173978, 340, 173978, 341, 173978, 342, 165519, 343, 165519, 344, 165519, 345, 165519, 346, 165519, 347, 165519, 348, 165519, 349, 160514, 350, 160514, 351, 160514, 352, 160514, 353, 160514, 354, 160514, 355, 160514, 356, 156917, 357, 156917, 358, 156917, 359, 156917, 360, 156917, 361, 156917, 362, 156917, 363, 153497, 364, 153497, 365, 153497, 366, 153497, 367, 153497, 368, 153497, 369, 153497, 370, 153036, 371, 153036, 372, 153036, 373, 153036, 374, 153036, 375, 153036, 376, 153036, 377, 151345, 378, 151345, 379, 151345, 380, 151345, 381, 151345, 382, 151345, 383, 151345, 384, 153931, 385, 153931, 386, 153931, 387, 153931, 388, 153931, 389, 153931, 390, 153931, 391, 152915, 392, 152915, 393, 152915, 394, 152915, 395, 152915, 396, 152915, 397, 152915, 398, 151764, 399, 151764, 400, 151764, 401, 151764, 402, 151982, 403, 151412, 404, 151304, 405, 150879, 406, 150560, 407, 149457, 408, 148020, 409, 147088, 410, 145993, 411, 144472, 412, 142965, 413, 142125, 414, 141489, 415, 140514, 416, 139563, 417, 138120, 418, 137082, 419, 136011, 420, 135103, 421, 134280, 422, 134280, 423, 131654, 424, 129858, 425, 128062, 426, 126652]),
      },
      {
        clave: 'beatport', nombre: 'Beatport', color: '#01FF95',
        metrica: 'DJ charts (acumulado)',
        kpis: [{ label: 'DJ charts', valor: '2' }, { label: 'Tracks charteados', valor: '3' }, { label: 'Releases charteados', valor: '—' }],
        serie: serie('2025-08-15', [0, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 20, 1, 21, 1, 22, 1, 23, 1, 24, 1, 25, 1, 26, 1, 27, 1, 28, 1, 29, 1, 30, 1, 31, 1, 32, 1, 33, 1, 34, 1, 35, 1, 36, 1, 37, 1, 38, 1, 39, 1, 40, 1, 41, 1, 42, 1, 43, 1, 44, 1, 45, 1, 46, 1, 47, 1, 48, 1, 49, 1, 50, 1, 51, 1, 52, 1, 53, 1, 54, 1, 55, 1, 56, 1, 57, 1, 58, 1, 59, 1, 60, 1, 61, 1, 62, 1, 63, 1, 64, 1, 65, 1, 66, 1, 67, 1, 68, 1, 69, 1, 70, 1, 71, 1, 72, 1, 73, 1, 74, 1, 75, 1, 76, 1, 77, 1, 78, 1, 79, 1, 80, 1, 81, 1, 82, 1, 83, 1, 84, 1, 85, 1, 86, 1, 87, 1, 88, 1, 89, 1, 90, 1, 91, 1, 92, 1, 93, 1, 94, 1, 95, 1, 96, 1, 97, 1, 98, 1, 99, 1, 100, 1, 101, 1, 102, 1, 103, 1, 104, 1, 105, 1, 106, 1, 107, 1, 108, 1, 109, 1, 110, 1, 111, 1, 112, 1, 113, 1, 114, 1, 115, 1, 116, 1, 117, 1, 118, 1, 119, 1, 120, 1, 121, 1, 122, 1, 123, 1, 124, 1, 125, 1, 126, 1, 127, 1, 128, 1, 129, 1, 130, 1, 131, 1, 132, 1, 133, 1, 134, 1, 135, 1, 136, 1, 137, 1, 138, 1, 139, 1, 140, 1, 141, 1, 142, 1, 143, 1, 144, 1, 145, 1, 146, 1, 147, 1, 148, 1, 149, 1, 150, 1, 151, 1, 152, 1, 153, 1, 154, 1, 155, 1, 156, 1, 157, 1, 158, 1, 159, 1, 160, 1, 161, 1, 162, 1, 163, 1, 164, 1, 165, 1, 166, 1, 167, 1, 168, 2, 169, 2, 170, 2, 171, 2, 172, 2, 173, 2, 174, 2, 175, 2, 176, 2, 177, 2, 178, 2, 179, 2, 180, 2, 181, 2, 182, 2, 183, 2, 184, 2, 185, 2, 186, 2, 187, 2, 188, 3, 189, 3, 190, 3, 191, 3, 192, 3, 193, 3, 194, 5, 195, 5, 196, 5, 197, 5, 198, 5, 199, 5, 200, 5, 201, 5, 202, 5, 203, 5, 204, 5, 205, 5, 206, 5, 207, 5, 208, 5, 209, 5, 210, 5, 211, 5, 212, 5, 213, 5, 214, 6, 215, 6, 216, 6, 217, 6, 218, 6, 219, 6, 220, 7, 221, 7, 222, 7, 223, 7, 224, 7, 225, 7, 226, 7, 227, 7, 228, 7, 229, 7, 230, 7, 231, 7, 232, 7, 233, 7, 234, 7, 235, 7, 236, 7, 237, 7, 238, 7, 239, 7, 240, 7, 241, 7, 242, 7, 243, 7, 244, 7, 245, 7, 246, 7, 247, 7, 248, 7, 249, 7, 250, 7, 251, 7, 252, 7, 253, 7, 254, 7, 255, 7, 256, 7, 257, 7, 258, 7, 259, 7, 260, 7, 261, 7, 262, 7, 263, 7, 264, 7, 265, 7, 266, 7, 267, 7, 268, 7, 269, 7, 270, 7, 271, 7, 272, 7, 273, 7, 274, 7, 275, 7, 276, 7, 277, 7, 278, 7, 279, 7, 280, 7, 281, 7, 282, 7, 283, 7, 284, 7, 285, 7, 286, 7, 287, 7, 288, 7, 289, 7, 290, 7, 291, 7, 292, 7, 293, 7, 294, 7, 295, 7, 296, 7, 297, 7, 298, 7, 299, 7, 300, 7, 301, 7, 302, 7, 303, 7, 304, 7, 305, 7, 306, 7, 307, 7, 308, 7, 309, 7, 310, 7, 311, 7, 312, 7, 313, 7, 314, 7, 315, 7, 316, 7, 317, 7, 318, 7, 319, 7, 320, 7, 321, 7, 322, 7, 323, 7, 324, 7, 325, 7, 326, 7, 327, 7, 328, 7, 329, 7, 330, 7, 331, 7, 332, 7, 333, 7, 334, 7, 335, 7, 336, 7, 337, 7, 338, 7, 339, 7, 340, 7, 341, 7, 342, 7, 343, 7, 344, 7, 345, 7, 346, 7, 347, 7, 348, 7, 349, 7, 350, 7, 351, 7, 352, 7, 353, 7, 354, 7, 355, 7, 356, 7, 357, 7, 358, 7, 359, 7, 360, 7, 361, 7, 362, 7, 363, 7, 364, 7, 365, 7, 366, 7, 367, 7, 368, 7, 369, 7, 370, 7, 371, 7, 372, 7, 373, 7, 374, 7, 375, 7, 376, 7, 377, 7, 378, 7, 379, 7, 380, 7, 381, 7, 382, 7, 383, 7, 384, 7, 385, 7, 386, 7, 387, 7, 388, 7, 389, 7, 390, 7]),
      },
      {
        clave: 'shazam', nombre: 'Shazam', color: '#0088FF',
        metrica: 'Shazams',
        kpis: [{ label: 'Shazams', valor: '4.8K' }, { label: 'Charts', valor: '0' }],
        serie: serie('2025-07-05', [0, 15, 1, 22, 2, 33, 3, 39, 4, 48, 5, 56, 6, 56, 7, 68, 14, 105, 21, 174, 28, 237, 35, 303, 42, 371, 49, 433, 56, 490, 63, 598, 70, 655, 77, 706, 84, 761, 91, 807, 98, 857, 105, 893, 112, 931, 119, 963, 126, 1018, 133, 1197, 140, 1339, 147, 1462, 154, 1566, 161, 1647, 168, 1731, 175, 1815, 189, 2018, 196, 2099, 203, 2195, 210, 2283, 217, 2364, 224, 2463, 231, 2544, 238, 2618, 245, 2711, 252, 2835, 259, 2937, 267, 3038, 273, 3116, 287, 3302, 295, 3410, 301, 3481, 309, 3588, 322, 3748, 330, 3849, 336, 3893, 343, 3966, 350, 4033, 357, 4100, 371, 4220, 378, 4297, 385, 4370, 392, 4432, 399, 4492, 406, 4617, 407, 4629, 408, 4634, 409, 4643, 410, 4654, 411, 4654, 412, 4654, 413, 4654, 414, 4654, 415, 4654, 416, 4654, 417, 4654, 418, 4654, 419, 4654, 420, 4654, 421, 4735, 422, 4741, 423, 4744, 424, 4752, 425, 4756, 426, 4762, 427, 4766, 428, 4771, 429, 4780, 430, 4786, 431, 4791]),
      },
      {
        clave: 'youtube', nombre: 'YouTube', color: '#FF0000',
        metrica: 'Suscriptores',
        kpis: [{ label: 'Suscriptores', valor: '3' }, { label: 'Followers', valor: '—' }, { label: 'Views', valor: '—' }, { label: 'Vídeos', valor: '32' }],
        serie: serie('2026-08-16', [0, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 13, 3, 14, 3, 15, 3, 16, 3, 17, 3, 18, 3, 19, 3, 20, 3, 21, 3, 22, 3, 23, 3, 24, 3]),
      },
      {
        clave: 'tiktok', nombre: 'TikTok', color: '#000000',
        metrica: 'Likes',
        kpis: [{ label: 'Followers', valor: '0' }, { label: 'Likes', valor: '72' }, { label: 'Vídeos', valor: '9' }],
        serie: serie('2025-08-23', [0, 9, 7, 12, 14, 12, 21, 18, 28, 18, 35, 18, 42, 18, 49, 18, 56, 18, 63, 18, 70, 18, 77, 18, 84, 25, 91, 27, 98, 27, 105, 27, 112, 27, 119, 27, 126, 27, 140, 27, 147, 27, 154, 27, 161, 27, 168, 27, 175, 27, 182, 27, 189, 27, 196, 27, 203, 27, 210, 27, 218, 27, 224, 27, 238, 69, 246, 72, 252, 72, 260, 72, 273, 72, 281, 72, 287, 72, 294, 72, 301, 72, 308, 72, 322, 72, 329, 72, 336, 72, 343, 72, 350, 72, 357, 71, 358, 71, 359, 72, 360, 72, 361, 72, 362, 72, 363, 72, 364, 72, 365, 72, 366, 72, 367, 72, 368, 72, 369, 72, 370, 72, 371, 72, 372, 72, 373, 72, 374, 72, 375, 72, 376, 72, 377, 72, 378, 72, 379, 72, 380, 72, 381, 72, 382, 72]),
      },
      {
        clave: 'instagram', nombre: 'Instagram', color: '#E1306C',
        metrica: 'Followers',
        kpis: [{ label: 'Followers', valor: '4K' }],
        serie: serie('2025-07-11', [0, 3383, 1, 3383, 2, 3383, 3, 3380, 4, 3380, 5, 3380, 6, 3380, 7, 3380, 8, 3380, 9, 3380, 10, 3384, 11, 3384, 12, 3384, 13, 3384, 14, 3384, 15, 3384, 16, 3389, 17, 3389, 18, 3389, 19, 3389, 20, 3389, 21, 3389, 22, 3389, 23, 3408, 24, 3408, 25, 3408, 26, 3408, 27, 3408, 28, 3408, 29, 3408, 30, 3425, 31, 3425, 32, 3425, 33, 3425, 34, 3425, 35, 3425, 36, 3425, 37, 3474, 38, 3474, 39, 3474, 40, 3474, 41, 3474, 42, 3474, 43, 3474, 44, 3471, 45, 3471, 46, 3471, 47, 3471, 48, 3471, 49, 3471, 50, 3471, 51, 3470, 52, 3470, 53, 3470, 54, 3468, 55, 3468, 56, 3468, 57, 3468, 58, 3471, 59, 3471, 60, 3471, 61, 3471, 62, 3471, 63, 3471, 64, 3471, 65, 3470, 66, 3470, 67, 3470, 68, 3470, 69, 3470, 70, 3470, 71, 3470, 72, 3472, 73, 3472, 74, 3472, 75, 3472, 76, 3472, 77, 3472, 78, 3472, 79, 3466, 80, 3466, 81, 3466, 82, 3466, 83, 3466, 84, 3466, 85, 3466, 86, 3478, 87, 3478, 88, 3478, 89, 3478, 90, 3478, 91, 3478, 92, 3478, 93, 3487, 94, 3487, 95, 3487, 96, 3487, 97, 3487, 98, 3487, 99, 3487, 100, 3489, 101, 3489, 102, 3489, 103, 3489, 104, 3489, 105, 3489, 106, 3489, 107, 3489, 108, 3496, 109, 3496, 110, 3496, 111, 3496, 112, 3496, 113, 3496, 114, 3500, 115, 3500, 116, 3500, 117, 3500, 118, 3500, 119, 3500, 120, 3500, 121, 3500, 122, 3514, 123, 3514, 124, 3514, 125, 3514, 126, 3514, 127, 3514, 128, 3521, 129, 3521, 130, 3521, 131, 3521, 132, 3521, 133, 3521, 134, 3521, 135, 3523, 136, 3523, 137, 3523, 138, 3523, 139, 3523, 140, 3523, 141, 3523, 142, 3527, 143, 3527, 144, 3527, 145, 3527, 146, 3527, 147, 3527, 148, 3527, 149, 3525, 150, 3525, 151, 3525, 152, 3525, 153, 3525, 154, 3525, 155, 3525, 156, 3522, 157, 3522, 158, 3522, 159, 3522, 160, 3522, 161, 3522, 162, 3522, 163, 3528, 164, 3528, 165, 3528, 166, 3528, 167, 3528, 168, 3528, 169, 3528, 170, 3529, 171, 3529, 172, 3529, 173, 3529, 174, 3529, 175, 3529, 176, 3529, 177, 3535, 178, 3535, 179, 3535, 180, 3535, 181, 3535, 182, 3535, 183, 3535, 184, 3535, 185, 3535, 186, 3535, 187, 3535, 188, 3535, 189, 3535, 190, 3535, 191, 3535, 192, 3535, 193, 3535, 194, 3535, 195, 3535, 196, 3535, 197, 3535, 198, 3535, 199, 3535, 200, 3535, 201, 3535, 202, 3535, 203, 3535, 204, 3535, 205, 3535, 206, 3535, 207, 3535, 208, 3535, 209, 3535, 210, 3535, 211, 3535, 212, 3535, 213, 3535, 214, 3535, 215, 3535, 216, 3535, 217, 3535, 218, 3535, 219, 3535, 220, 3535, 221, 3535, 222, 3535, 223, 3535, 224, 3535, 225, 3535, 226, 3535, 227, 3535, 228, 3535, 229, 3535, 230, 3535, 231, 3535, 232, 3535, 233, 3535, 234, 3535, 235, 3535, 236, 3535, 237, 3535, 238, 3535, 239, 3535, 240, 3535, 241, 3535, 242, 3535, 243, 3535, 244, 3535, 245, 3535, 246, 3535, 247, 3535, 248, 3535, 249, 3535, 250, 3535, 251, 3535, 252, 3535, 253, 3535, 254, 3535, 255, 3535, 256, 3535, 257, 3535, 258, 3535, 259, 3535, 260, 3535, 261, 3535, 262, 3535, 263, 3535, 264, 3535, 265, 3535, 266, 3535, 267, 3535, 268, 3535, 269, 3535, 270, 3535, 271, 3535, 272, 3535, 273, 3535, 274, 3535, 275, 3535, 276, 3535, 277, 3535, 278, 3535, 279, 3535, 280, 3535, 281, 3535, 282, 3764, 283, 3764, 284, 3764, 285, 3764, 286, 3764, 287, 3764, 288, 3764, 289, 3764, 290, 3764, 291, 3764, 292, 3764, 293, 3764, 294, 3764, 295, 3764, 296, 3764, 297, 3764, 298, 3764, 299, 3764, 300, 3764, 301, 3764, 302, 3764, 303, 3764, 304, 3764, 305, 3764, 306, 3764, 307, 3764, 308, 3764, 309, 3764, 310, 3813, 311, 3813, 312, 3813, 313, 3813, 314, 3813, 315, 3813, 316, 3813, 317, 3816, 318, 3816, 319, 3816, 320, 3816, 321, 3816, 322, 3816, 323, 3816, 324, 3810, 325, 3810, 326, 3810, 327, 3810, 328, 3810, 329, 3810, 330, 3810, 331, 3815, 332, 3815, 333, 3815, 334, 3815, 335, 3815, 336, 3815, 337, 3815, 338, 3819, 339, 3819, 340, 3819, 341, 3819, 342, 3819, 343, 3819, 344, 3819, 345, 3825, 346, 3825, 347, 3825, 348, 3825, 349, 3825, 350, 3825, 351, 3825, 352, 3825, 353, 3819, 354, 3819, 355, 3819, 356, 3819, 357, 3819, 358, 3819, 359, 3823, 360, 3823, 361, 3823, 362, 3823, 363, 3823, 364, 3823, 365, 3823, 366, 3825, 367, 3825, 368, 3825, 369, 3825, 370, 3825, 371, 3825, 372, 3825, 373, 3825, 374, 3825, 375, 3825, 376, 3825, 377, 3825, 378, 3825, 379, 3825, 380, 3917, 381, 3917, 382, 3917, 383, 3917, 384, 3917, 385, 3917, 386, 3917, 387, 3935, 388, 3935, 389, 3935, 390, 3935, 391, 3935, 392, 3935, 393, 3935, 394, 3962, 395, 3962, 396, 3962, 397, 3962, 398, 3962, 399, 3962, 400, 3971, 401, 3971, 402, 3971, 403, 3975, 404, 3975, 405, 3970, 406, 3972, 407, 3976, 408, 3976, 409, 3984, 410, 3993, 411, 3995, 412, 4005, 413, 4007, 414, 4006, 415, 4005, 416, 4004, 417, 4008, 418, 4004, 419, 4006, 420, 4004, 421, 4004, 422, 4006, 423, 4006, 424, 4004, 425, 4004]),
      },
      {
        clave: 'soundcloud', nombre: 'SoundCloud', color: '#FF5500',
        metrica: 'Plays',
        kpis: [{ label: 'Followers', valor: '4' }, { label: 'Plays', valor: '2.2K' }],
        serie: serie('2025-07-04', [0, 0, 1, 1, 2, 1, 3, 3, 4, 7, 5, 9, 6, 9, 8, 10, 15, 15, 22, 45, 29, 62, 36, 74, 43, 88, 50, 100, 57, 108, 64, 135, 71, 172, 78, 188, 85, 210, 92, 224, 99, 227, 106, 238, 113, 242, 120, 248, 127, 253, 134, 263, 141, 273, 148, 277, 155, 289, 162, 295, 169, 301, 176, 320, 190, 388, 197, 417, 204, 457, 211, 486, 218, 528, 225, 555, 232, 569, 239, 594, 246, 623, 253, 694, 260, 783, 268, 836, 274, 894, 288, 984, 296, 1030, 302, 1038, 310, 1091, 323, 1144, 331, 1210, 337, 1250, 344, 1280, 351, 1324, 358, 1368, 372, 1449, 379, 1487, 386, 1539, 393, 1577, 400, 1593, 407, 2076, 408, 2079, 409, 2087, 410, 2092, 411, 2095, 412, 2098, 413, 2129, 414, 2138, 415, 2142, 416, 2150, 417, 2162, 418, 2169, 419, 2175, 420, 2177, 421, 2193, 422, 2197, 423, 2205, 424, 2206, 425, 2218, 426, 2222, 427, 2228, 428, 2235, 429, 2241, 430, 2244, 431, 2246, 432, 2248]),
      },
      {
        clave: 'deezer', nombre: 'Deezer', color: '#A238FF',
        metrica: 'Playlists',
        kpis: [{ label: 'Followers', valor: '0' }, { label: 'Playlists', valor: '3' }],
        serie: serie('2026-08-15', [0, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 13, 3, 14, 3, 15, 3, 16, 3, 17, 3, 18, 3, 19, 3, 20, 3, 21, 3, 22, 3, 23, 3, 24, 3, 25, 3]),
      },
      {
        clave: 'tidal', nombre: 'Tidal', color: '#00FFFF',
        metrica: 'Playlists',
        kpis: [{ label: 'Playlists', valor: '1' }, { label: 'Charts', valor: '0' }],
        serie: serie('2026-08-16', [0, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 20, 1, 21, 1, 22, 1, 23, 1, 24, 1]),
      },
      {
        clave: 'traxsource', nombre: 'Traxsource', color: '#000000',
        kpis: [{ label: 'Charts', valor: '1' }, { label: 'Tracks', valor: '3' }],
        serie: [],
      },
    ],
  },
  {
    id: 'londonground',
    nombre: 'Londonground',
    estado: 'Estable',
    actualizado: '2/9/2026',
    fallo: false,
    kpis: ['132.5K', '10.8K', '12.9M', '39', '1.3M', '0', '1.4K', '17.9K', '0'],
    topTracks: {
      'Streams': [
        { pos: 1, titulo: 'La Farsa', artistas: 'LondonGround', valor: '5.8M', url: 'https://songstats.com/track/rt63xa0j/la-farsa', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 2, titulo: 'Circuito', artistas: 'LondonGround', valor: '924.7K', url: 'https://songstats.com/track/9iv6zl2q/circuito', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 3, titulo: 'Franklin', artistas: 'LondonGround', valor: '847.6K', url: 'https://songstats.com/track/13gxc7v5/franklin', portada: 'https://i.scdn.co/image/bfb6d28746ea5bf1ee16968fe201e0bc63f2ba63' },
        { pos: 4, titulo: 'No Return - De La Swing Remix', artistas: 'LondonGround, Manu Desrets, De La Swing', valor: '751.4K', url: 'https://songstats.com/track/7piethfy/no-return-de-la-swing-remix', portada: 'https://i.scdn.co/image/ab67616d00001e0273027cedd28d42373aff5745' },
        { pos: 5, titulo: 'Breath', artistas: 'LondonGround', valor: '565.6K', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185' },
        { pos: 6, titulo: 'Mahaus', artistas: 'LondonGround', valor: '435.1K', url: 'https://songstats.com/track/4ohdbavi/mahaus', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 7, titulo: 'Something', artistas: 'James Dexter, LondonGround', valor: '332.6K', url: 'https://songstats.com/track/47j3zvxe/something', portada: 'https://i.scdn.co/image/ab67616d00001e025fa191ffad51e9009095a40b' },
        { pos: 8, titulo: 'Tempo', artistas: 'LondonGround', valor: '215.7K', url: 'https://songstats.com/track/r6si9evu/tempo', portada: 'https://i.scdn.co/image/ab67616d00001e02941b41da7a3ae36a8c03dc9e' },
        { pos: 9, titulo: 'The Beat', artistas: 'LondonGround', valor: '181.2K', url: 'https://songstats.com/track/kfg36bnl/the-beat', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 10, titulo: 'Sun Dance', artistas: 'LondonGround', valor: '169K', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185' },
        { pos: 11, titulo: 'Late Call', artistas: 'LondonGround', valor: '166.2K', url: 'https://songstats.com/track/9qai4yos/late-call', portada: 'https://i.scdn.co/image/ab67616d00001e0278066996ea63b6013771c198' },
        { pos: 12, titulo: 'C-Floor', artistas: 'Manu Desrets, LondonGround', valor: '162.1K', url: 'https://songstats.com/track/zcqg6tjw/c-floor', portada: 'https://i.scdn.co/image/ab67616d00001e02e5a22e42020ab5915e6be558' },
        { pos: 13, titulo: 'Watch The Time - LondonGround Remix', artistas: 'Cristina Lazic, LondonGround', valor: '140.4K', url: 'https://songstats.com/track/qmz0x3tw/watch-the-time-londonground-remix', portada: 'https://i.scdn.co/image/ab67616d00001e02f3fbc0982e7bd174754033cc' },
        { pos: 14, titulo: 'Daddy\'s A Hustler - LondonGround Remix Edit', artistas: 'Ken Kelly, LondonGround', valor: '137K', url: 'https://songstats.com/track/f63452y0/daddy-s-a-hustler-londonground-remix-edit', portada: 'https://i.scdn.co/image/ab67616d00001e02a4171bc733b0038f2be2a931' },
        { pos: 15, titulo: 'Inside', artistas: 'James Dexter, LondonGround', valor: '87.6K', url: 'https://songstats.com/track/agq2m10e/inside', portada: 'https://i.scdn.co/image/ab67616d00001e025fa191ffad51e9009095a40b' },
      ],
      'Popularidad': [
        { pos: 1, titulo: 'La Farsa', artistas: 'LondonGround', valor: '50', url: 'https://songstats.com/track/rt63xa0j/la-farsa', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 2, titulo: 'Breath', artistas: 'LondonGround', valor: '46', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185' },
        { pos: 3, titulo: 'Franklin', artistas: 'LondonGround', valor: '39', url: 'https://songstats.com/track/13gxc7v5/franklin', portada: 'https://i.scdn.co/image/bfb6d28746ea5bf1ee16968fe201e0bc63f2ba63' },
        { pos: 4, titulo: 'Circuito', artistas: 'LondonGround', valor: '37', url: 'https://songstats.com/track/9iv6zl2q/circuito', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 5, titulo: 'Sun Dance', artistas: 'LondonGround', valor: '35', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185' },
        { pos: 6, titulo: 'No Return - De La Swing Remix', artistas: 'LondonGround, Manu Desrets, De La Swing', valor: '35', url: 'https://songstats.com/track/7piethfy/no-return-de-la-swing-remix', portada: 'https://i.scdn.co/image/ab67616d00001e0273027cedd28d42373aff5745' },
        { pos: 7, titulo: 'Escuchalo', artistas: 'Bizza, LondonGround', valor: '34', url: 'https://songstats.com/track/vuiwbxh0/escuchalo', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915' },
        { pos: 8, titulo: 'Watch The Time - LondonGround Remix', artistas: 'Cristina Lazic, LondonGround', valor: '32', url: 'https://songstats.com/track/qmz0x3tw/watch-the-time-londonground-remix', portada: 'https://i.scdn.co/image/ab67616d00001e02f3fbc0982e7bd174754033cc' },
        { pos: 9, titulo: 'Mahaus', artistas: 'LondonGround', valor: '32', url: 'https://songstats.com/track/4ohdbavi/mahaus', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 10, titulo: 'Rocket', artistas: 'Bizza, LondonGround', valor: '31', url: 'https://songstats.com/track/n0vi7acm/rocket', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915' },
        { pos: 11, titulo: 'Even You', artistas: 'Bizza, LondonGround', valor: '30', url: 'https://songstats.com/track/met8ouqn/even-you', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915' },
        { pos: 12, titulo: 'Golden Party', artistas: 'Bizza, LondonGround', valor: '30', url: 'https://songstats.com/track/sfoa2q08/golden-party', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915' },
        { pos: 13, titulo: 'Final Move', artistas: 'LondonGround', valor: '29', url: 'https://songstats.com/track/b8rhiwf4/final-move', portada: 'https://i.scdn.co/image/ab67616d00001e02396f579156c88fb7e8fee1ff' },
        { pos: 14, titulo: 'Power8', artistas: 'LondonGround', valor: '27', url: 'https://songstats.com/track/fagzqo03/power8', portada: 'https://i.scdn.co/image/ab67616d00001e02d1688d4348764c55452f36d1' },
        { pos: 15, titulo: 'Late Call', artistas: 'LondonGround', valor: '26', url: 'https://songstats.com/track/9qai4yos/late-call', portada: 'https://i.scdn.co/image/ab67616d00001e0278066996ea63b6013771c198' },
      ],
      'Playlist reach': [
        { pos: 1, titulo: 'Breath', artistas: 'LondonGround', valor: '1.6M', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185' },
        { pos: 2, titulo: 'La Farsa', artistas: 'LondonGround', valor: '1.4M', url: 'https://songstats.com/track/rt63xa0j/la-farsa', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 3, titulo: 'Something', artistas: 'James Dexter, LondonGround', valor: '380K', url: 'https://songstats.com/track/47j3zvxe/something', portada: 'https://i.scdn.co/image/ab67616d00001e025fa191ffad51e9009095a40b' },
        { pos: 4, titulo: 'Digital Dopamine', artistas: 'LondonGround', valor: '258K', url: 'https://songstats.com/track/wuokd8i1/digital-dopamine', portada: 'https://i.scdn.co/image/ab67616d00001e024e23e6c28a771fdafbc65c79' },
        { pos: 5, titulo: 'Franklin', artistas: 'LondonGround', valor: '250K', url: 'https://songstats.com/track/13gxc7v5/franklin', portada: 'https://i.scdn.co/image/bfb6d28746ea5bf1ee16968fe201e0bc63f2ba63' },
        { pos: 6, titulo: 'Watch The Time - LondonGround Remix', artistas: 'Cristina Lazic, LondonGround', valor: '168K', url: 'https://songstats.com/track/qmz0x3tw/watch-the-time-londonground-remix', portada: 'https://i.scdn.co/image/ab67616d00001e02f3fbc0982e7bd174754033cc' },
        { pos: 7, titulo: 'Final Move', artistas: 'LondonGround', valor: '156K', url: 'https://songstats.com/track/b8rhiwf4/final-move', portada: 'https://i.scdn.co/image/ab67616d00001e02396f579156c88fb7e8fee1ff' },
        { pos: 8, titulo: 'Samba', artistas: 'LondonGround', valor: '156K', url: 'https://songstats.com/track/o03tr8yc/samba', portada: 'https://i.scdn.co/image/ab67616d00001e02ffdbea7380ac5c5231f1192b' },
        { pos: 9, titulo: 'Circuito', artistas: 'LondonGround', valor: '129K', url: 'https://songstats.com/track/9iv6zl2q/circuito', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
        { pos: 10, titulo: 'Rising Dawn', artistas: 'LondonGround', valor: '119K', url: 'https://songstats.com/track/z8eafuqd/rising-dawn', portada: 'https://i.scdn.co/image/ab67616d00001e02008f06faf1e269e2ff5156ee' },
        { pos: 11, titulo: 'Daddy\'s A Hustler - LondonGround Remix Edit', artistas: 'Ken Kelly, LondonGround', valor: '116K', url: 'https://songstats.com/track/f63452y0/daddy-s-a-hustler-londonground-remix-edit', portada: 'https://i.scdn.co/image/ab67616d00001e02a4171bc733b0038f2be2a931' },
        { pos: 12, titulo: 'Inside', artistas: 'James Dexter, LondonGround', valor: '91.3K', url: 'https://songstats.com/track/agq2m10e/inside', portada: 'https://i.scdn.co/image/ab67616d00001e025fa191ffad51e9009095a40b' },
        { pos: 13, titulo: 'Between The Lines', artistas: 'LondonGround', valor: '90.8K', url: 'https://songstats.com/track/85ifnsqp/between-the-lines', portada: 'https://i.scdn.co/image/ab67616d00001e024384c1645e70a257d89136ff' },
        { pos: 14, titulo: 'No Return - De La Swing Remix', artistas: 'LondonGround, Manu Desrets, De La Swing', valor: '90.6K', url: 'https://songstats.com/track/7piethfy/no-return-de-la-swing-remix', portada: 'https://i.scdn.co/image/ab67616d00001e0273027cedd28d42373aff5745' },
        { pos: 15, titulo: 'Tempo', artistas: 'LondonGround', valor: '88.9K', url: 'https://songstats.com/track/r6si9evu/tempo', portada: 'https://i.scdn.co/image/ab67616d00001e02941b41da7a3ae36a8c03dc9e' },
      ],
    },
    hitos: [
      { texto: 'Charted #8 on Minimal / Deep Tech', pista: 'Breath', fecha: '02 sept', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
      { texto: 'Charted #39 on Hype: Overall Top 100', pista: 'Breath', fecha: '02 sept', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
      { texto: 'Charted #11 on Minimal / Deep Tech Releases', pista: 'Breath EP', fecha: '02 sept', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://geo-media.beatport.com/image_size/300x300/eee7bc2c-e54c-4edc-b76b-82279d366c68.jpg', fuente: 'beatport' },
      { texto: 'Charted #81 on Jackin House Releases', pista: 'Even You EP', fecha: '02 sept', url: 'https://songstats.com/track/n0vi7acm/rocket', portada: 'https://geo-media.beatport.com/image_size/300x300/44442de1-3202-4bb4-9005-58751d5677a4.jpg', fuente: 'beatport' },
      { texto: 'Charted #41 on Jackin House', pista: 'Escuchalo', fecha: '02 sept', url: 'https://songstats.com/track/vuiwbxh0/escuchalo', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915', fuente: 'beatport' },
      { texto: 'Charted #22 on Hype: Minimal / Deep Tech', pista: 'Sun Dance', fecha: '02 sept', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
      { texto: 'Charted #44 on Dance: Türkiye', pista: 'Rocket', fecha: '02 sept', url: 'https://songstats.com/track/n0vi7acm/rocket', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915', fuente: 'itunes' },
      { texto: 'Just reached 20,000 Playlist Listeners', pista: 'Escuchalo', fecha: '02 sept', url: 'https://songstats.com/track/vuiwbxh0/escuchalo', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915', fuente: 'spotify' },
      { texto: 'Playlisted by 313cablepark on Aistė Regina |  313 cable park x Jägermeister Music (200 Followers)', pista: 'La Farsa', fecha: '01 sept', url: 'http://open.spotify.com/playlist/2Cx7yOQYVTafwbYQcnanuU', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df', fuente: 'spotify' },
      { texto: 'Playlisted by enricopizzoli on Jackin House all Night Long (396 Followers)', pista: 'Escuchalo', fecha: '01 sept', url: 'http://open.spotify.com/playlist/3yp9s4DY6kHJKdqVIfUkKk', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915', fuente: 'spotify' },
      { texto: 'Playlisted by JaviGalle on  Tech house 👑🕺🏽el Row 2026❤️🔥 (238 Followers)', pista: 'Breath', fecha: '01 sept', url: 'http://open.spotify.com/playlist/0JCiSxTwoBqTNt64Wcofdk', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'spotify' },
      { texto: 'Playlisted by Lil Tato on Tato’s Prime Selection (3915 Followers)', pista: 'Rut', fecha: '01 sept', url: 'http://open.spotify.com/playlist/4zXp1hkAvZOreypeSWIbuj', portada: 'https://i.scdn.co/image/ab67616d00001e02b30487968322aed65fb3793d', fuente: 'spotify' },
      { texto: 'Playlisted by robertobaldo on Get Minimal (403 Followers)', pista: 'Breath', fecha: '01 sept', url: 'http://open.spotify.com/playlist/3UaK3YHfsgOKiRsMC5323E', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'spotify' },
      { texto: 'Charted #28 on Jackin House', pista: 'Escuchalo', fecha: '01 sept', url: 'https://songstats.com/track/vuiwbxh0/escuchalo', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915', fuente: 'beatport' },
      { texto: 'Charted #45 on Hype: Overall Top 100', pista: 'Breath', fecha: '01 sept', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
      { texto: 'Charted #13 on Minimal / Deep Tech Releases', pista: 'Breath EP', fecha: '01 sept', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://geo-media.beatport.com/image_size/300x300/eee7bc2c-e54c-4edc-b76b-82279d366c68.jpg', fuente: 'beatport' },
      { texto: 'Charted #32 on Jackin House Releases', pista: 'Even You EP', fecha: '01 sept', url: 'https://songstats.com/track/n0vi7acm/rocket', portada: 'https://geo-media.beatport.com/image_size/300x300/44442de1-3202-4bb4-9005-58751d5677a4.jpg', fuente: 'beatport' },
      { texto: 'Charted #34 on Hype: Minimal / Deep Tech', pista: 'Sun Dance', fecha: '01 sept', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
    ],
    releases: [
      { titulo: 'Answer Me', fecha: '' },
      { titulo: 'Timeless', fecha: '' },
      { titulo: 'Destiny', fecha: '' },
      { titulo: 'The Light', fecha: '' },
      { titulo: 'Fireline', fecha: 'may 2026' },
      { titulo: 'Escuchalo', fecha: 'may 2026' },
      { titulo: 'Golden Party', fecha: 'may 2026' },
      { titulo: 'Even You', fecha: 'may 2026' },
      { titulo: 'Rocket', fecha: 'may 2026' },
      { titulo: 'Final Move', fecha: 'abr 2026' },
      { titulo: 'Analog Dreams', fecha: 'abr 2026' },
      { titulo: 'Rockin\'', fecha: 'abr 2026' },
      { titulo: 'Power8', fecha: 'mar 2026' },
      { titulo: 'Saved', fecha: 'feb 2026' },
      { titulo: 'Fire', fecha: 'feb 2026' },
      { titulo: 'Samba', fecha: 'feb 2026' },
      { titulo: 'Breath', fecha: 'oct 2025' },
      { titulo: 'Sun Dance', fecha: 'oct 2025' },
      { titulo: 'Rising Dawn', fecha: 'ago 2025' },
      { titulo: 'I See You', fecha: 'ago 2025' },
      { titulo: 'Watch The Time - LondonGround Remix', fecha: 'jul 2025' },
      { titulo: 'Rut', fecha: 'may 2025' },
      { titulo: 'Cokito', fecha: 'may 2025' },
      { titulo: 'Superstar', fecha: 'may 2025' },
    ],
    topPlaylists: [
      { nombre: 'Techno & Tech House 2026 💣 Rave & Festival', seguidores: '187K', url: 'https://open.spotify.com/playlist/3QEYvCsVXZj8KuzE0bDmcI', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8467cdeff3ac55c6d8ddce66ae' },
      { nombre: 'MINIMAL TECHNO', seguidores: '111K', url: 'https://open.spotify.com/playlist/59KuQSm27IfRylpXxz9KrM', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c000097ac40fcd87234ad8b339c9e2323' },
      { nombre: 'Très Mortimer Official Playlist', seguidores: '110K', url: 'https://open.spotify.com/playlist/7yedU72KyH7C3u5Py92zzB', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84cfc0aa24b4affbd9d56e818b' },
      { nombre: '(AR)', seguidores: '32.6K', url: 'https://open.spotify.com/playlist/37i9dQZF1DXdM3ZcJzlarB', portada: 'https://i.scdn.co/image/ab67706f000000024ebe14a8efc5a08fcdd5103d' },
      { nombre: 'House Music Ibiza 2026', seguidores: '27.7K', url: 'https://open.spotify.com/playlist/6icpIpmnAFVmYTtBJqmWY2', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84b7e248f35d1a6e9a5a83cdad' },
      { nombre: 'Sam‘s (Tech) House Selection', seguidores: '25.7K', url: 'https://open.spotify.com/playlist/59UznYMFQ5YKjJlLHi4hj6', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da847316b506ff32a4cab6ab5fe6' },
      { nombre: 'SPACE IBIZA 2026', seguidores: '25.2K', url: 'https://open.spotify.com/playlist/6CgEoizWUQlhFOKKi0N6fz', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da840df25fc25655805ddff6562b' },
      { nombre: 'Disco House Funky Shit', seguidores: '21.8K', url: 'https://open.spotify.com/playlist/16W9KULJsOKVZu6wZbaqEU', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84786a115b458b4a15b59d6dfa' },
      { nombre: 'Hot Since 82 - Selection!', seguidores: '21.3K', url: 'https://open.spotify.com/playlist/6IyNrD5Dz1EfHPgYlBJjMG', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8483f26e38b89575d6281b8bb0' },
      { nombre: 'MÚSICA ELECTRÓNICA 2024', seguidores: '20.6K', url: 'https://open.spotify.com/playlist/5DrWFoNYrCdIGtaaHSoeGK', portada: 'https://mosaic.scdn.co/1280/ab67616d0000b2736003512e5db7d11a891cfa4eab67616d0000b2739367c1ee2eec0bf3a04b4868ab67616d0000b2739a705e4f82c98dc73812ed6efcfe6087e2f67937a0c2e5471e6e95c55fbe77ef' },
      { nombre: 'ELECTRO TECH HOUSE 💿', seguidores: '17.3K', url: 'https://open.spotify.com/playlist/0AFYmoSuoMQiGGjzvBwr6u', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84d90b72eb3fdaf481eea05050' },
      { nombre: 'OT ENTERTAINMENT', seguidores: '15.5K', url: 'https://open.spotify.com/playlist/5dwOyNzVWyfvR82TpPDJ9X', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da841f568ab2d63477f0c98257e8' },
      { nombre: 'Rave It Up ', seguidores: '13.1K', url: 'https://open.spotify.com/playlist/2XFv70QUhtWbD2e1iyQc04', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da840bf48eab2cf453abf22cc33c' },
      { nombre: 'Best Tech House', seguidores: '12.2K', url: 'https://open.spotify.com/playlist/48cE3B9k3B64cfHAIXSouV', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da840c039d3cbaef2e45f0c0f9b4' },
    ],
    beatportTracks: [
      { pos: 1, titulo: 'La Farsa', artistas: 'LondonGround', valor: '71', url: 'https://songstats.com/track/rt63xa0j/la-farsa', portada: 'https://i.scdn.co/image/ab67616d00001e020cd9ccfc62d717e0db9ad4df' },
      { pos: 2, titulo: 'Breath', artistas: 'LondonGround', valor: '67', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185' },
      { pos: 3, titulo: '001', artistas: 'LondonGround', valor: '41', url: 'https://songstats.com/track/q0ed29ti/001', portada: 'https://i.scdn.co/image/ab67616d00001e0249655452ea7a83d643af5e62' },
      { pos: 4, titulo: 'Rocket', artistas: 'Bizza, LondonGround', valor: '35', url: 'https://songstats.com/track/n0vi7acm/rocket', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915' },
      { pos: 5, titulo: 'Watch The Time - LondonGround Remix', artistas: 'Cristina Lazic, LondonGround', valor: '34', url: 'https://songstats.com/track/qmz0x3tw/watch-the-time-londonground-remix', portada: 'https://i.scdn.co/image/ab67616d00001e02f3fbc0982e7bd174754033cc' },
      { pos: 6, titulo: 'Neon', artistas: 'LondonGround', valor: '31', url: 'https://songstats.com/track/tkl6h9ir/neon', portada: 'https://i.scdn.co/image/ab67616d00001e02837121765f3e17f65508d0c1' },
      { pos: 7, titulo: 'Samba', artistas: 'LondonGround', valor: '24', url: 'https://songstats.com/track/o03tr8yc/samba', portada: 'https://i.scdn.co/image/ab67616d00001e02ffdbea7380ac5c5231f1192b' },
      { pos: 8, titulo: 'I\'m Searching For - LondonGround Remix', artistas: 'Lorenzo De Blanck, LondonGround', valor: '24', url: 'https://songstats.com/track/wgasqocn/i-m-searching-for-londonground-remix', portada: 'https://i.scdn.co/image/ab67616d00001e02768f0984098d0ad9d9e14593' },
      { pos: 9, titulo: 'Heaven and Clouds', artistas: 'LondonGround', valor: '22', url: 'https://songstats.com/track/ci7hydu3/heaven-and-clouds', portada: 'https://i.scdn.co/image/ab67616d00001e026e1e7bd864e53bb566733443' },
      { pos: 10, titulo: 'Tempo', artistas: 'LondonGround', valor: '21', url: 'https://songstats.com/track/r6si9evu/tempo', portada: 'https://i.scdn.co/image/ab67616d00001e02941b41da7a3ae36a8c03dc9e' },
      { pos: 11, titulo: 'Fondo', artistas: 'LondonGround', valor: '21', url: 'https://songstats.com/track/mojuxeq0/fondo', portada: 'https://i.scdn.co/image/ab67616d00001e024384c1645e70a257d89136ff' },
      { pos: 12, titulo: 'Franklin', artistas: 'LondonGround', valor: '20', url: 'https://songstats.com/track/13gxc7v5/franklin', portada: 'https://i.scdn.co/image/bfb6d28746ea5bf1ee16968fe201e0bc63f2ba63' },
      { pos: 13, titulo: 'Something', artistas: 'James Dexter, LondonGround', valor: '20', url: 'https://songstats.com/track/47j3zvxe/something', portada: 'https://i.scdn.co/image/ab67616d00001e025fa191ffad51e9009095a40b' },
      { pos: 14, titulo: 'Pianeat', artistas: 'Manu Desrets, LondonGround', valor: '19', url: 'https://songstats.com/track/xaiqkvw9/pianeat', portada: 'https://i.scdn.co/image/ab67616d00001e02f2a960869c9daf5fb5479fa2' },
      { pos: 15, titulo: 'Inside', artistas: 'James Dexter, LondonGround', valor: '19', url: 'https://songstats.com/track/agq2m10e/inside', portada: 'https://i.scdn.co/image/ab67616d00001e025fa191ffad51e9009095a40b' },
    ],
    beatportCharts: [
      { texto: 'Charted #8 on Minimal / Deep Tech', pista: 'Breath', fecha: '02 sept', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
      { texto: 'Charted #39 on Hype: Overall Top 100', pista: 'Breath', fecha: '02 sept', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
      { texto: 'Charted #11 on Minimal / Deep Tech Releases', pista: 'Breath EP', fecha: '02 sept', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://geo-media.beatport.com/image_size/300x300/eee7bc2c-e54c-4edc-b76b-82279d366c68.jpg', fuente: 'beatport' },
      { texto: 'Charted #81 on Jackin House Releases', pista: 'Even You EP', fecha: '02 sept', url: 'https://songstats.com/track/n0vi7acm/rocket', portada: 'https://geo-media.beatport.com/image_size/300x300/44442de1-3202-4bb4-9005-58751d5677a4.jpg', fuente: 'beatport' },
      { texto: 'Charted #41 on Jackin House', pista: 'Escuchalo', fecha: '02 sept', url: 'https://songstats.com/track/vuiwbxh0/escuchalo', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915', fuente: 'beatport' },
      { texto: 'Charted #22 on Hype: Minimal / Deep Tech', pista: 'Sun Dance', fecha: '02 sept', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
      { texto: 'Charted #28 on Jackin House', pista: 'Escuchalo', fecha: '01 sept', url: 'https://songstats.com/track/vuiwbxh0/escuchalo', portada: 'https://i.scdn.co/image/ab67616d00001e02b61b7bccbbfa3149329db915', fuente: 'beatport' },
      { texto: 'Charted #45 on Hype: Overall Top 100', pista: 'Breath', fecha: '01 sept', url: 'https://songstats.com/track/coevh945/breath', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
      { texto: 'Charted #13 on Minimal / Deep Tech Releases', pista: 'Breath EP', fecha: '01 sept', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://geo-media.beatport.com/image_size/300x300/eee7bc2c-e54c-4edc-b76b-82279d366c68.jpg', fuente: 'beatport' },
      { texto: 'Charted #32 on Jackin House Releases', pista: 'Even You EP', fecha: '01 sept', url: 'https://songstats.com/track/n0vi7acm/rocket', portada: 'https://geo-media.beatport.com/image_size/300x300/44442de1-3202-4bb4-9005-58751d5677a4.jpg', fuente: 'beatport' },
      { texto: 'Charted #34 on Hype: Minimal / Deep Tech', pista: 'Sun Dance', fecha: '01 sept', url: 'https://songstats.com/track/8iu4wcdo/sun-dance', portada: 'https://i.scdn.co/image/ab67616d00001e0259a9f4db361ed6de412ca185', fuente: 'beatport' },
    ],
    ciudades: [
      { nombre: 'London', pais: 'GB', actual: 3043, pico: 3107, fechaPico: '18 jun 26', lat: 51.5072, lng: -0.1276 },
      { nombre: 'Buenos Aires', pais: 'AR', actual: 2594, pico: 3544, fechaPico: '30 jul 25', lat: -34.6143, lng: -58.4402 },
      { nombre: 'Lima', pais: 'PE', actual: 2275, pico: 3045, fechaPico: '18 feb 26', lat: -12.0467, lng: -77.0431 },
      { nombre: 'São Paulo', pais: 'BR', actual: 1847, pico: 2002, fechaPico: '11 may 26', lat: -23.5558, lng: -46.6396 },
      { nombre: 'Mexico City', pais: 'MX', actual: 1843, pico: 3944, fechaPico: '10 mar 26', lat: 19.4326, lng: -99.1332 },
      { nombre: 'Madrid', pais: 'ES', actual: 1639, pico: 1989, fechaPico: '24 jul 25', lat: 40.4167, lng: -3.7033 },
      { nombre: 'Barcelona', pais: 'ES', actual: 1605, pico: 1833, fechaPico: '11 jul 25', lat: 41.3874, lng: 2.1686 },
      { nombre: 'Amsterdam', pais: 'NL', actual: 1431, pico: 3076, fechaPico: '28 may 25', lat: 52.3676, lng: 4.9041 },
      { nombre: 'Sydney', pais: 'AU', actual: 1236, pico: 1583, fechaPico: '18 feb 26', lat: -33.8727, lng: 151.2057 },
      { nombre: 'Berlin', pais: 'DE', actual: 1122, pico: 1259, fechaPico: '10 may 26', lat: 52.52, lng: 13.405 },
      { nombre: 'New York', pais: 'US', actual: 1121, pico: 1121, fechaPico: '02 sept 26', lat: 40.7128, lng: -74.006 },
      { nombre: 'Los Angeles', pais: 'US', actual: 1087, pico: 1197, fechaPico: '11 may 26', lat: 34.0549, lng: -118.2426 },
      { nombre: 'Miami', pais: 'US', actual: 1048, pico: 1066, fechaPico: '02 abr 26', lat: 25.7617, lng: -80.1918 },
      { nombre: 'Frankfurt', pais: 'DE', actual: 1018, pico: 1117, fechaPico: '13 may 26', lat: 50.1109, lng: 8.6821 },
      { nombre: 'Melbourne', pais: 'AU', actual: 984, pico: 1267, fechaPico: '18 feb 26', lat: -37.8136, lng: 144.9631 },
      { nombre: 'Curitiba', pais: 'BR', actual: 983, pico: 1106, fechaPico: '13 may 26', lat: -25.4269, lng: -49.2652 },
      { nombre: 'Manchester', pais: 'GB', actual: 982, pico: 1011, fechaPico: '18 jun 26', lat: 53.4808, lng: -2.2426 },
      { nombre: 'Zürich', pais: 'CH', actual: 981, pico: 1168, fechaPico: '11 jul 25', lat: 47.3769, lng: 8.5417 },
      { nombre: 'Medellín', pais: 'CO', actual: 977, pico: 1553, fechaPico: '09 mar 26', lat: 6.2476, lng: -75.5658 },
      { nombre: 'Bogotá', pais: 'CO', actual: 911, pico: 1236, fechaPico: '25 feb 26', lat: 4.711, lng: -74.0721 },
      { nombre: 'San José', pais: 'CR', actual: 839, pico: 1110, fechaPico: '18 feb 26', lat: 9.9281, lng: -84.0907 },
      { nombre: 'Rome', pais: 'IT', actual: 787, pico: 2226, fechaPico: '29 may 25', lat: 41.8967, lng: 12.4822 },
      { nombre: 'Munich', pais: 'DE', actual: 722, pico: 763, fechaPico: '24 jul 25', lat: 48.1351, lng: 11.582 },
      { nombre: 'Guayaquil', pais: 'EC', actual: 681, pico: 845, fechaPico: '23 abr 26', lat: -2.1891, lng: -79.8899 },
      { nombre: 'Palma', pais: 'ES', actual: 661, pico: 661, fechaPico: '02 sept 26', lat: 39.5727, lng: 2.6569 },
      { nombre: 'Toronto', pais: 'CA', actual: 660, pico: 660, fechaPico: '02 sept 26', lat: 43.6532, lng: -79.3832 },
      { nombre: 'Stuttgart', pais: 'DE', actual: 654, pico: 847, fechaPico: '14 may 26', lat: 48.7758, lng: 9.1829 },
      { nombre: 'Campinas', pais: 'BR', actual: 637, pico: 673, fechaPico: '11 may 26', lat: -22.9051, lng: -47.0613 },
      { nombre: 'Milan', pais: 'IT', actual: 631, pico: 4496, fechaPico: '29 may 25', lat: 45.4685, lng: 9.1824 },
      { nombre: 'Brisbane', pais: 'AU', actual: 630, pico: 742, fechaPico: '18 feb 26', lat: -27.4705, lng: 153.026 },
      { nombre: 'Birmingham', pais: 'GB', actual: 611, pico: 635, fechaPico: '29 ago 26', lat: 52.4823, lng: -1.89 },
      { nombre: 'Brooklyn', pais: 'US', actual: 602, pico: 700, fechaPico: '03 may 26', lat: 40.6782, lng: -73.9442 },
      { nombre: 'Rosario', pais: 'AR', actual: 597, pico: 1031, fechaPico: '02 jul 25', lat: -32.9587, lng: -60.693 },
      { nombre: 'Hamburg', pais: 'DE', actual: 592, pico: 757, fechaPico: '24 jul 25', lat: 53.5488, lng: 9.9872 },
      { nombre: 'Chicago', pais: 'US', actual: 579, pico: 606, fechaPico: '11 may 26', lat: 41.8832, lng: -87.6324 },
      { nombre: 'Montréal', pais: 'CA', actual: 547, pico: 569, fechaPico: '29 ago 26', lat: 45.5019, lng: -73.5674 },
      { nombre: 'Córdoba', pais: 'AR', actual: 544, pico: 1075, fechaPico: '21 ene 26', lat: -31.4201, lng: -64.1888 },
      { nombre: 'Quito', pais: 'EC', actual: 501, pico: 694, fechaPico: '11 feb 26', lat: -0.2233, lng: -78.5141 },
      { nombre: 'Dublin', pais: 'IE', actual: 499, pico: 634, fechaPico: '18 feb 26', lat: 53.3498, lng: -6.2603 },
      { nombre: 'Budapest', pais: 'HU', actual: 475, pico: 642, fechaPico: '30 jul 25', lat: 47.4979, lng: 19.0402 },
      { nombre: 'Athens', pais: 'GR', actual: 475, pico: 491, fechaPico: '27 ago 26', lat: 37.9838, lng: 23.7275 },
      { nombre: 'Valencia', pais: 'ES', actual: 473, pico: 634, fechaPico: '11 jul 25', lat: 39.4738, lng: -0.3756 },
      { nombre: 'Concepción', pais: 'CL', actual: 430, pico: 572, fechaPico: '13 mar 26', lat: -36.8201, lng: -73.0444 },
      { nombre: 'Paris', pais: 'FR', actual: 429, pico: 632, fechaPico: '11 jul 25', lat: 48.8575, lng: 2.3514 },
      { nombre: 'Santiago', pais: 'CL', actual: 0, pico: 5021, fechaPico: '18 feb 26', lat: -33.4489, lng: -70.6693 },
      { nombre: 'Rotterdam', pais: 'NL', actual: 0, pico: 2315, fechaPico: '11 jul 25', lat: 51.9244, lng: 4.4777 },
      { nombre: 'Buenos Aires', pais: 'AR', actual: 0, pico: 1561, fechaPico: '30 jul 25', lat: -34.6037, lng: -58.3821 },
      { nombre: 'Bonn', pais: 'DE', actual: 0, pico: 1258, fechaPico: '18 jul 26', lat: 50.7374, lng: 7.0982 },
      { nombre: 'Montevideo', pais: 'UY', actual: 0, pico: 1077, fechaPico: '18 feb 26', lat: -34.9055, lng: -56.1851 },
      { nombre: 'Brussels', pais: 'BE', actual: 0, pico: 966, fechaPico: '11 jul 25', lat: 50.8477, lng: 4.3572 },
      { nombre: 'Utrecht', pais: 'NL', actual: 0, pico: 936, fechaPico: '11 jul 25', lat: 52.0919, lng: 5.123 },
      { nombre: 'Lisbon', pais: 'PT', actual: 0, pico: 897, fechaPico: '30 jul 25', lat: 38.7223, lng: -9.1393 },
      { nombre: 'Colonia Cuauhtémoc', pais: 'MX', actual: 0, pico: 851, fechaPico: '24 jul 25', lat: 19.4301, lng: -99.1691 },
      { nombre: 'Naples', pais: 'IT', actual: 0, pico: 827, fechaPico: '28 may 25', lat: 40.8657, lng: 14.2644 },
      { nombre: 'Turin', pais: 'IT', actual: 0, pico: 775, fechaPico: '24 jul 25', lat: 45.0656, lng: 7.6827 },
      { nombre: 'City of Westminster', pais: 'GB', actual: 0, pico: 742, fechaPico: '31 may 23', lat: 51.5072, lng: -0.1277 },
      { nombre: 'Porto', pais: 'PT', actual: 0, pico: 713, fechaPico: '02 may 26', lat: 41.1462, lng: -8.6122 },
      { nombre: 'Bologna', pais: 'IT', actual: 0, pico: 690, fechaPico: '18 jun 25', lat: 44.3693, lng: 11.2524 },
      { nombre: 'Perth', pais: 'AU', actual: 0, pico: 558, fechaPico: '18 feb 26', lat: -31.9514, lng: 115.8617 },
      { nombre: 'Düsseldorf', pais: 'DE', actual: 0, pico: 551, fechaPico: '05 may 26', lat: 51.223, lng: 6.7825 },
      { nombre: 'Florence', pais: 'IT', actual: 0, pico: 550, fechaPico: '11 jun 25', lat: 43.77, lng: 11.2577 },
      { nombre: 'Cali', pais: 'CO', actual: 0, pico: 550, fechaPico: '25 feb 26', lat: 3.4516, lng: -76.532 },
      { nombre: 'Gustavo A. Madero', pais: 'MX', actual: 0, pico: 546, fechaPico: '30 jul 25', lat: 19.4873, lng: -99.1236 },
      { nombre: 'Asunción', pais: 'PY', actual: 0, pico: 544, fechaPico: '04 feb 26', lat: -25.2637, lng: -57.5759 },
      { nombre: 'Trujillo', pais: 'PE', actual: 0, pico: 543, fechaPico: '25 feb 26', lat: -8.1158, lng: -79.0257 },
      { nombre: 'Vienna', pais: 'AT', actual: 0, pico: 535, fechaPico: '24 jul 25', lat: 48.2081, lng: 16.3713 },
      { nombre: 'Florianópolis', pais: 'BR', actual: 0, pico: 533, fechaPico: '18 feb 26', lat: -27.5969, lng: -48.5468 },
      { nombre: 'Iztapalapa', pais: 'MX', actual: 0, pico: 524, fechaPico: '18 jun 25', lat: 19.3421, lng: -99.0532 },
      { nombre: 'Cologne', pais: 'DE', actual: 0, pico: 523, fechaPico: '11 jul 25', lat: 50.9375, lng: 6.9603 },
      { nombre: 'Bucharest', pais: 'RO', actual: 0, pico: 523, fechaPico: '28 ago 26', lat: 44.4268, lng: 26.1025 },
      { nombre: 'Guadalajara', pais: 'MX', actual: 0, pico: 506, fechaPico: '30 jul 25', lat: 20.6752, lng: -103.3473 },
      { nombre: 'The Hague', pais: 'NL', actual: 0, pico: 499, fechaPico: '21 may 25', lat: 52.0705, lng: 4.3007 },
      { nombre: 'Benito Juarez', pais: 'MX', actual: 0, pico: 494, fechaPico: '06 ago 25', lat: 19.3794, lng: -99.1591 },
      { nombre: 'Southwark', pais: 'GB', actual: 0, pico: 493, fechaPico: '24 may 23', lat: 51.5028, lng: -0.0877 },
      { nombre: 'Mar del Plata', pais: 'AR', actual: 0, pico: 478, fechaPico: '28 ene 26', lat: -38.0055, lng: -57.5426 },
      { nombre: 'Padua', pais: 'IT', actual: 0, pico: 477, fechaPico: '26 jun 25', lat: 45.4105, lng: 11.8782 },
      { nombre: 'Rio de Janeiro', pais: 'BR', actual: 0, pico: 467, fechaPico: '09 mar 26', lat: -22.9068, lng: -43.1729 },
      { nombre: 'Edinburgh', pais: 'GB', actual: 0, pico: 453, fechaPico: '08 jun 23', lat: 55.9533, lng: -3.1883 },
      { nombre: 'Vilnius', pais: 'LT', actual: 0, pico: 450, fechaPico: '28 ago 26', lat: 54.6872, lng: 25.2797 },
      { nombre: 'City of London', pais: 'GB', actual: 0, pico: 445, fechaPico: '08 jun 23', lat: 51.5134, lng: -0.089 },
      { nombre: 'Málaga', pais: 'ES', actual: 0, pico: 409, fechaPico: '14 jun 26', lat: 36.7178, lng: -4.4256 },
      { nombre: 'Leeds', pais: 'GB', actual: 0, pico: 396, fechaPico: '08 jun 23', lat: 53.8008, lng: -1.5491 },
      { nombre: 'Istanboel', pais: 'TR', actual: 0, pico: 396, fechaPico: '03 sept 25', lat: 41.1634, lng: 28.7664 },
      { nombre: 'Helsinki', pais: 'FI', actual: 0, pico: 376, fechaPico: '18 dic 24', lat: 60.1699, lng: 24.9384 },
      { nombre: 'Guatemala City', pais: 'GT', actual: 0, pico: 372, fechaPico: '15 may 25', lat: 14.6349, lng: -90.5069 },
      { nombre: 'Tower Hamlets', pais: 'GB', actual: 0, pico: 327, fechaPico: '22 may 24', lat: 51.5251, lng: -0.0347 },
      { nombre: 'Blackheath', pais: 'GB', actual: 0, pico: 311, fechaPico: '02 ago 23', lat: 51.4658, lng: 0.009 },
      { nombre: 'Stockholm', pais: 'SE', actual: 0, pico: 306, fechaPico: '18 sept 24', lat: 59.3327, lng: 18.0656 },
      { nombre: 'Mendoza', pais: 'AR', actual: 0, pico: 294, fechaPico: '31 ago 22', lat: -32.8895, lng: -68.8458 },
      { nombre: 'Bahía Blanca', pais: 'AR', actual: 0, pico: 268, fechaPico: '04 dic 24', lat: -38.7183, lng: -62.2663 },
      { nombre: 'Warsaw', pais: 'PL', actual: 0, pico: 262, fechaPico: '18 sept 24', lat: 52.2297, lng: 21.0122 },
      { nombre: 'Maldonado', pais: 'UY', actual: 0, pico: 253, fechaPico: '22 ene 25', lat: -34.9019, lng: -54.9634 },
      { nombre: 'Neuquén', pais: 'AR', actual: 0, pico: 232, fechaPico: '13 nov 24', lat: -38.9517, lng: -68.0592 },
      { nombre: 'London Borough of Newham', pais: 'GB', actual: 0, pico: 227, fechaPico: '06 nov 24', lat: 51.5259, lng: 0.0294 },
      { nombre: 'Auckland', pais: 'NZ', actual: 0, pico: 213, fechaPico: '12 ene 23', lat: -36.8509, lng: 174.7645 },
      { nombre: 'Gouda', pais: 'NL', actual: 0, pico: 194, fechaPico: '29 ago 21', lat: 52.0115, lng: 4.7105 },
      { nombre: 'Bern', pais: 'CH', actual: 0, pico: 180, fechaPico: '18 sept 24', lat: 46.948, lng: 7.4474 },
      { nombre: 'San Juan Province', pais: 'AR', actual: 0, pico: 165, fechaPico: '19 oct 22', lat: -30.8725, lng: -68.5247 },
      { nombre: 'Antwerp', pais: 'BE', actual: 0, pico: 156, fechaPico: '30 ago 21', lat: 51.2199, lng: 4.415 },
      { nombre: 'Hilversum', pais: 'NL', actual: 0, pico: 128, fechaPico: '29 ago 21', lat: 52.2292, lng: 5.1669 },
      { nombre: 'Amersfoort', pais: 'NL', actual: 0, pico: 122, fechaPico: '30 ago 21', lat: 52.1561, lng: 5.3878 },
      { nombre: 'Nieuwegein', pais: 'NL', actual: 0, pico: 117, fechaPico: '30 ago 21', lat: 52.0248, lng: 5.0918 },
      { nombre: 'Bristol', pais: 'GB', actual: 0, pico: 115, fechaPico: '24 may 21', lat: 51.4545, lng: -2.5879 },
      { nombre: 'Breda', pais: 'NL', actual: 0, pico: 113, fechaPico: '28 ago 21', lat: 51.5719, lng: 4.7683 },
      { nombre: 'Oslo', pais: 'NO', actual: 0, pico: 111, fechaPico: '02 jul 22', lat: 59.9139, lng: 10.7522 },
      { nombre: 'Posadas', pais: 'AR', actual: 0, pico: 105, fechaPico: '21 dic 21', lat: -27.3621, lng: -55.9009 },
      { nombre: 'Dordrecht', pais: 'NL', actual: 0, pico: 104, fechaPico: '28 ago 21', lat: 51.8133, lng: 4.6901 },
      { nombre: 'Corrientes Province', pais: 'AR', actual: 0, pico: 104, fechaPico: '09 jul 22', lat: -28.5842, lng: -58.0072 },
      { nombre: 'Paraná', pais: 'AR', actual: 0, pico: 103, fechaPico: '22 mar 22', lat: -31.7413, lng: -60.5115 },
      { nombre: 'Tilburg', pais: 'NL', actual: 0, pico: 103, fechaPico: '04 jun 22', lat: 51.5606, lng: 5.0919 },
      { nombre: 'Las Condes', pais: 'CL', actual: 0, pico: 91, fechaPico: '16 ene 22', lat: -33.4161, lng: -70.5341 },
      { nombre: 'Houten', pais: 'NL', actual: 0, pico: 89, fechaPico: '05 sept 21', lat: 52.0278, lng: 5.163 },
      { nombre: 'Amstelveen', pais: 'NL', actual: 0, pico: 86, fechaPico: '16 abr 22', lat: 52.3114, lng: 4.8701 },
      { nombre: 'Groningen', pais: 'NL', actual: 0, pico: 85, fechaPico: '30 nov 21', lat: 53.2194, lng: 6.5665 },
      { nombre: 'Almere', pais: 'NL', actual: 0, pico: 83, fechaPico: '29 ago 21', lat: 52.3508, lng: 5.2647 },
      { nombre: 'Schaerbeek', pais: 'BE', actual: 0, pico: 82, fechaPico: '29 ago 21', lat: 50.8643, lng: 4.3735 },
      { nombre: 'Riga', pais: 'LV', actual: 0, pico: 80, fechaPico: '16 jul 21', lat: 56.9677, lng: 24.1056 },
      { nombre: 'Leiden', pais: 'NL', actual: 0, pico: 80, fechaPico: '02 sept 21', lat: 52.1636, lng: 4.4802 },
      { nombre: 'La Plata', pais: 'AR', actual: 0, pico: 78, fechaPico: '27 oct 21', lat: -34.9205, lng: -57.9536 },
      { nombre: 'Salta', pais: 'AR', actual: 0, pico: 78, fechaPico: '25 nov 21', lat: -24.7821, lng: -65.4232 },
      { nombre: 'Sheffield', pais: 'GB', actual: 0, pico: 77, fechaPico: '21 mar 21', lat: 53.3811, lng: -1.4701 },
      { nombre: 'Moscow', pais: 'RU', actual: 0, pico: 76, fechaPico: '27 feb 22', lat: 55.7569, lng: 37.6151 },
      { nombre: 'Ixelles', pais: 'BE', actual: 0, pico: 70, fechaPico: '19 ago 21', lat: 50.8279, lng: 4.3714 },
      { nombre: 'Formosa Province', pais: 'AR', actual: 0, pico: 64, fechaPico: '28 dic 21', lat: -25.3946, lng: -58.7374 },
      { nombre: 'Liverpool', pais: 'GB', actual: 0, pico: 63, fechaPico: '20 may 21', lat: 53.4084, lng: -2.9916 },
      { nombre: 'Barnsley', pais: 'GB', actual: 0, pico: 62, fechaPico: '12 feb 21', lat: 53.5526, lng: -1.4797 },
      { nombre: 'Gothenburg', pais: 'SE', actual: 0, pico: 61, fechaPico: '02 jun 21', lat: 57.7089, lng: 11.9746 },
      { nombre: 'Nottingham', pais: 'GB', actual: 0, pico: 59, fechaPico: '21 mar 21', lat: 52.954, lng: -1.155 },
      { nombre: 'Saint Petersburg', pais: 'RU', actual: 0, pico: 59, fechaPico: '24 ene 21', lat: 59.9311, lng: 30.3609 },
      { nombre: 'Eindhoven', pais: 'NL', actual: 0, pico: 57, fechaPico: '30 ene 21', lat: 51.4231, lng: 5.4623 },
    ],
    plataformas: [
      {
        clave: 'spotify', nombre: 'Spotify', color: '#1DB954',
        metrica: 'Oyentes mensuales',
        kpis: [{ label: 'Oyentes', valor: '132.5K' }, { label: 'Followers', valor: '10.8K' }, { label: 'Streams', valor: '12.9M' }, { label: 'Popularidad', valor: '39' }, { label: 'Playlists', valor: '546' }, { label: 'Playlist reach', valor: '1.3M' }],
        serie: serie('2024-09-04', [0, 46482, 1, 46482, 2, 46482, 3, 46482, 4, 46482, 5, 46482, 6, 46482, 7, 46553, 8, 46553, 9, 46553, 10, 46553, 11, 46553, 12, 46553, 13, 46553, 14, 45688, 15, 45475, 16, 45475, 17, 45475, 18, 45475, 19, 45475, 20, 45475, 21, 44305, 22, 44305, 23, 44305, 24, 44305, 25, 44305, 26, 44305, 27, 44305, 28, 45374, 29, 45374, 30, 45374, 31, 45374, 32, 45374, 33, 45374, 34, 45374, 35, 47881, 36, 47881, 37, 47881, 38, 47881, 39, 47881, 40, 47881, 41, 47881, 42, 51826, 43, 51826, 44, 51826, 45, 51826, 46, 51826, 47, 51826, 48, 51826, 49, 57749, 50, 57749, 51, 57749, 52, 57749, 53, 57749, 54, 57749, 55, 57749, 56, 61971, 57, 61971, 58, 61971, 59, 61971, 60, 61971, 61, 61971, 62, 61971, 63, 64826, 64, 64826, 65, 64826, 66, 64826, 67, 64826, 68, 64826, 69, 64826, 70, 66657, 71, 66657, 72, 66657, 73, 66657, 74, 66657, 75, 66657, 76, 66657, 77, 67164, 78, 67164, 79, 67164, 80, 67164, 81, 67164, 82, 67164, 83, 67164, 84, 69201, 85, 69201, 86, 69201, 87, 69201, 88, 69201, 89, 69201, 90, 69201, 91, 69509, 92, 69509, 93, 69509, 94, 69509, 95, 69509, 96, 69509, 97, 69509, 98, 71500, 99, 71500, 100, 71500, 101, 71500, 102, 71500, 103, 71500, 104, 71500, 105, 70261, 106, 70261, 107, 70261, 108, 70261, 109, 70261, 110, 70261, 111, 70261, 112, 67484, 113, 67484, 114, 67484, 115, 67484, 116, 67484, 117, 67484, 118, 67484, 119, 68580, 120, 68580, 121, 68580, 122, 68580, 123, 68580, 124, 68580, 125, 68580, 126, 68464, 127, 68464, 128, 68464, 129, 68464, 130, 68464, 131, 68464, 132, 68464, 133, 70659, 134, 70659, 135, 70659, 136, 70659, 137, 70659, 138, 70659, 139, 70659, 140, 70822, 141, 70822, 142, 70822, 143, 70822, 144, 70822, 145, 70822, 146, 70822, 147, 73949, 148, 73949, 149, 73949, 150, 73949, 151, 73949, 152, 73949, 153, 73949, 154, 73988, 155, 73988, 156, 73988, 157, 73988, 158, 73988, 159, 73988, 160, 73988, 161, 74777, 162, 74777, 163, 74777, 164, 74777, 165, 74777, 166, 74777, 167, 74777, 168, 79292, 169, 79292, 170, 79292, 171, 79292, 172, 79292, 173, 79292, 174, 79292, 175, 79059, 176, 79059, 177, 79059, 178, 79059, 179, 79059, 180, 79059, 181, 79059, 182, 79834, 183, 79834, 184, 79834, 185, 79834, 186, 79834, 187, 79834, 188, 79834, 189, 81380, 190, 81380, 191, 81380, 192, 81380, 193, 81380, 194, 81380, 195, 81380, 196, 82425, 197, 82425, 198, 82425, 199, 82425, 200, 82425, 201, 82425, 202, 82425, 203, 80100, 204, 80100, 205, 80100, 206, 80100, 207, 80100, 208, 80100, 209, 80100, 210, 79958, 211, 79958, 212, 79958, 213, 79958, 214, 79958, 215, 79958, 216, 79958, 217, 81339, 218, 81339, 219, 81339, 220, 81339, 221, 81339, 222, 81339, 223, 81339, 224, 83105, 225, 83105, 226, 83363, 227, 83446, 228, 83392, 229, 83771, 230, 83762, 231, 84623, 232, 83974, 233, 83974, 234, 83718, 235, 84244, 236, 83153, 237, 83439, 238, 84573, 239, 87874, 240, 87874, 241, 90438, 242, 90955, 243, 90647, 244, 91684, 245, 93157, 246, 95085, 247, 96183, 248, 97981, 249, 98612, 250, 101257, 251, 102546, 252, 103588, 253, 104501, 254, 104501, 255, 104501, 256, 104501, 257, 104501, 258, 104501, 259, 113209, 260, 113209, 261, 113209, 262, 113209, 263, 113209, 264, 113209, 265, 113209, 266, 123709, 267, 123709, 268, 123709, 269, 123709, 270, 123709, 271, 123709, 272, 123709, 273, 118137, 274, 118137, 275, 118137, 276, 118137, 277, 118137, 278, 118137, 279, 118137, 280, 114483, 281, 114483, 282, 114483, 283, 114483, 284, 114483, 285, 114483, 286, 114483, 287, 113608, 288, 113608, 289, 113608, 290, 113608, 291, 113608, 292, 113608, 293, 113608, 294, 118444, 295, 118444, 296, 118444, 297, 118444, 298, 118444, 299, 118444, 300, 118444, 301, 119867, 302, 119867, 303, 119867, 304, 119867, 305, 119867, 306, 119867, 307, 119867, 308, 131859, 309, 131859, 310, 131859, 311, 131859, 312, 131859, 313, 131859, 314, 131859, 315, 131859, 316, 132862, 317, 132862, 318, 132862, 319, 132862, 320, 132862, 321, 132862, 322, 132862, 323, 132862, 324, 132862, 325, 132862, 326, 132862, 327, 132862, 328, 132862, 329, 131501, 330, 131501, 331, 131501, 332, 131501, 333, 131501, 334, 131501, 335, 131501, 336, 120537, 337, 120537, 338, 120537, 339, 120537, 340, 120537, 341, 120537, 342, 120537, 343, 112240, 344, 112240, 345, 112240, 346, 112240, 347, 112240, 348, 112240, 349, 112240, 350, 105952, 351, 105952, 352, 105952, 353, 105952, 354, 105952, 355, 105952, 356, 105952, 357, 101796, 358, 101796, 359, 101796, 360, 101796, 361, 101796, 362, 101796, 363, 101796, 364, 103157, 365, 103157, 366, 103157, 367, 103157, 368, 103157, 369, 103157, 370, 103157, 371, 99390, 372, 99390, 373, 99390, 374, 99390, 375, 99390, 376, 99390, 377, 99390, 378, 95052, 379, 95052, 380, 95052, 381, 95052, 382, 95052, 383, 95052, 384, 95052, 385, 97321, 386, 97321, 387, 97321, 388, 97321, 389, 97321, 390, 97321, 391, 97321, 392, 100122, 393, 100122, 394, 100122, 395, 100122, 396, 100122, 397, 100122, 398, 100122, 399, 99061, 400, 99061, 401, 99061, 402, 99061, 403, 99061, 404, 99061, 405, 99061, 406, 97394, 407, 97394, 408, 97394, 409, 97394, 410, 97394, 411, 97394, 412, 97394, 413, 94679, 414, 94679, 415, 94679, 416, 94679, 417, 94679, 418, 94679, 419, 94679, 420, 93617, 421, 93617, 422, 93617, 423, 93617, 424, 93617, 425, 93617, 426, 93617, 427, 98493, 428, 98493, 429, 98493, 430, 98493, 431, 98493, 432, 98493, 433, 98493, 434, 100615, 435, 100615, 436, 100615, 437, 100615, 438, 100615, 439, 100615, 440, 100615, 441, 102769, 442, 102769, 443, 102769, 444, 102769, 445, 102769, 446, 102769, 447, 102769, 448, 99696, 449, 99696, 450, 99696, 451, 99696, 452, 99696, 453, 99696, 454, 99696, 455, 93698, 456, 93698, 457, 93698, 458, 93698, 459, 93698, 460, 93698, 461, 93698, 462, 89434, 463, 89434, 464, 89434, 465, 89434, 466, 89434, 467, 89434, 468, 89434, 469, 86700, 470, 86700, 471, 86700, 472, 86700, 473, 86700, 474, 86700, 475, 86700, 476, 90838, 477, 90838, 478, 90838, 479, 90838, 480, 90838, 481, 90838, 482, 90838, 483, 91436, 484, 91436, 485, 91436, 486, 91436, 487, 91436, 488, 91436, 489, 91436, 490, 93544, 491, 93544, 492, 93544, 493, 93544, 494, 93544, 495, 93544, 496, 93544, 497, 101027, 498, 101027, 499, 101027, 500, 101027, 501, 101027, 502, 101027, 503, 101027, 504, 104718, 505, 104718, 506, 104718, 507, 104718, 508, 104718, 509, 104718, 510, 104718, 511, 113311, 512, 113311, 513, 113311, 514, 113311, 515, 113311, 516, 113311, 517, 113311, 518, 124736, 519, 124736, 520, 124736, 521, 124736, 522, 124736, 523, 124736, 524, 124736, 525, 131072, 526, 131072, 527, 131072, 528, 131072, 529, 131072, 530, 131072, 531, 131072, 532, 139916, 533, 139916, 534, 139916, 535, 139916, 536, 139916, 537, 139916, 538, 139916, 539, 138578, 540, 138578, 541, 138578, 542, 138578, 543, 138578, 544, 138578, 545, 131421, 546, 131519, 547, 130691, 548, 130759, 549, 131136, 550, 133645, 551, 141904, 552, 142594, 553, 142555, 554, 141833, 555, 140070, 556, 140070, 557, 138650, 558, 137150, 559, 136831, 560, 135501, 561, 134975, 562, 134543, 563, 132902, 564, 132233, 565, 133301, 566, 134309, 567, 135623, 568, 136892, 569, 138363, 570, 139848, 571, 140186, 572, 140699, 573, 140968, 574, 141442, 575, 141890, 576, 141478, 577, 142598, 578, 140157, 579, 131777, 580, 131467, 581, 133121, 582, 132574, 583, 132803, 584, 132249, 585, 131667, 586, 132238, 587, 132238, 588, 133800, 589, 134573, 590, 135920, 591, 137135, 592, 138675, 593, 138874, 594, 139133, 595, 139100, 596, 139573, 597, 139573, 598, 142049, 599, 141965, 600, 142512, 601, 143101, 602, 144366, 603, 145332, 604, 145957, 605, 145369, 606, 145899, 607, 145477, 608, 143821, 609, 142283, 610, 143401, 611, 144548, 612, 145347, 613, 146683, 614, 146848, 615, 145887, 616, 145783, 617, 145461, 618, 143829, 619, 142587, 620, 141013, 621, 140162, 622, 139272, 623, 138566, 624, 138566, 625, 136575, 626, 135829, 627, 137065, 628, 137265, 629, 137173, 630, 136091, 631, 135123, 632, 134698, 633, 133636, 634, 132311, 635, 131706, 636, 131722, 637, 131537, 638, 131537, 639, 131537, 640, 130838, 641, 129823, 642, 129823, 643, 129899, 644, 130133, 645, 129640, 646, 129936, 647, 130144, 648, 129846, 649, 129285, 650, 129378, 651, 129329, 652, 129337, 653, 128466, 654, 126794, 655, 124845, 656, 120977, 657, 120977, 658, 120587, 659, 120245, 660, 120385, 661, 121205, 662, 121205, 663, 122001, 664, 122648, 665, 122800, 666, 122919, 667, 122919, 668, 122027, 669, 122027, 670, 121739, 671, 120985, 672, 120086, 673, 120207, 674, 120207, 675, 120207, 676, 120207, 677, 120207, 678, 120207, 679, 120207, 680, 120532, 681, 120025, 682, 119696, 683, 119298, 684, 119298, 685, 119298, 686, 118221, 687, 117628, 688, 116585, 689, 115465, 690, 114218, 691, 113165, 692, 113165, 693, 112182, 694, 111541, 695, 111421, 696, 110959, 697, 110959, 698, 109931, 699, 109895, 700, 110515, 701, 110456, 702, 109884, 703, 109884, 704, 108612, 705, 108352, 706, 107993, 707, 107349, 708, 106931, 709, 107502, 710, 108687, 711, 111072, 712, 113167, 713, 113833, 714, 114947, 715, 116550, 716, 118509, 717, 120294, 718, 122426, 719, 125130, 720, 127065, 721, 129580, 722, 131660, 723, 133019, 724, 132978, 725, 133214, 726, 132859, 727, 132510, 728, 132563]),
      },
      {
        clave: 'beatport', nombre: 'Beatport', color: '#01FF95',
        metrica: 'DJ charts (acumulado)',
        kpis: [{ label: 'DJ charts', valor: '11' }, { label: 'Tracks charteados', valor: '73' }, { label: 'Releases charteados', valor: '—' }],
        serie: serie('2024-09-02', [0, 976, 1, 976, 2, 976, 3, 976, 4, 977, 5, 977, 6, 977, 7, 978, 8, 978, 9, 978, 10, 978, 11, 979, 12, 980, 13, 980, 14, 980, 15, 980, 16, 980, 17, 981, 18, 981, 19, 981, 20, 983, 21, 984, 22, 984, 23, 984, 24, 984, 25, 984, 26, 984, 27, 985, 28, 987, 29, 987, 30, 987, 31, 988, 32, 989, 33, 990, 34, 990, 35, 991, 36, 992, 37, 992, 38, 992, 39, 994, 40, 995, 41, 995, 42, 995, 43, 995, 44, 995, 45, 996, 46, 997, 47, 997, 48, 997, 49, 997, 50, 998, 51, 998, 52, 998, 53, 998, 54, 998, 55, 998, 56, 998, 57, 998, 58, 999, 59, 999, 60, 999, 61, 999, 62, 999, 63, 999, 64, 999, 65, 999, 66, 999, 67, 999, 68, 1000, 69, 1000, 70, 1001, 71, 1001, 72, 1001, 73, 1001, 74, 1001, 75, 1001, 76, 1001, 77, 1001, 78, 1003, 79, 1003, 80, 1004, 81, 1004, 82, 1004, 83, 1004, 84, 1005, 85, 1005, 86, 1005, 87, 1005, 88, 1006, 89, 1006, 90, 1006, 91, 1006, 92, 1008, 93, 1010, 94, 1010, 95, 1010, 96, 1010, 97, 1010, 98, 1010, 99, 1012, 100, 1012, 101, 1012, 102, 1012, 103, 1012, 104, 1012, 105, 1012, 106, 1012, 107, 1012, 108, 1012, 109, 1013, 110, 1014, 111, 1014, 112, 1015, 113, 1015, 114, 1015, 115, 1016, 116, 1017, 117, 1017, 118, 1017, 119, 1017, 120, 1017, 121, 1017, 122, 1017, 123, 1019, 124, 1019, 125, 1019, 126, 1019, 127, 1020, 128, 1021, 129, 1022, 130, 1024, 131, 1024, 132, 1025, 133, 1025, 134, 1025, 135, 1025, 136, 1026, 137, 1026, 138, 1026, 139, 1026, 140, 1028, 141, 1028, 142, 1028, 143, 1028, 144, 1028, 145, 1028, 146, 1028, 147, 1028, 148, 1028, 149, 1028, 150, 1028, 151, 1028, 152, 1028, 153, 1029, 154, 1029, 155, 1029, 156, 1029, 157, 1029, 158, 1029, 159, 1029, 160, 1029, 161, 1029, 162, 1029, 163, 1029, 164, 1029, 165, 1029, 166, 1029, 167, 1029, 168, 1029, 169, 1029, 170, 1029, 171, 1029, 172, 1029, 173, 1029, 174, 1029, 175, 1029, 176, 1029, 177, 1030, 178, 1030, 179, 1030, 180, 1030, 181, 1030, 182, 1030, 183, 1031, 184, 1031, 185, 1031, 186, 1031, 187, 1031, 188, 1031, 189, 1032, 190, 1032, 191, 1032, 192, 1032, 193, 1032, 194, 1032, 195, 1032, 196, 1033, 197, 1033, 198, 1033, 199, 1033, 200, 1034, 201, 1034, 202, 1034, 203, 1034, 204, 1034, 205, 1034, 206, 1034, 207, 1034, 208, 1034, 209, 1034, 210, 1034, 211, 1034, 212, 1034, 213, 1035, 214, 1035, 215, 1035, 216, 1035, 217, 1035, 218, 1035, 219, 1035, 220, 1035, 221, 1035, 222, 1035, 223, 1035, 224, 1035, 225, 1035, 226, 1035, 227, 1035, 228, 1035, 229, 1035, 230, 1035, 231, 1035, 232, 1035, 233, 1035, 234, 1036, 235, 1037, 236, 1037, 237, 1037, 238, 1037, 239, 1037, 240, 1037, 241, 1037, 242, 1039, 243, 1039, 244, 1039, 245, 1039, 246, 1039, 247, 1039, 248, 1040, 249, 1042, 250, 1042, 251, 1042, 252, 1044, 253, 1046, 254, 1046, 255, 1047, 256, 1047, 257, 1047, 258, 1047, 259, 1047, 260, 1047, 261, 1047, 262, 1047, 263, 1049, 264, 1049, 265, 1050, 266, 1050, 267, 1050, 268, 1050, 269, 1050, 270, 1053, 271, 1053, 272, 1053, 273, 1054, 274, 1054, 275, 1054, 276, 1054, 277, 1054, 278, 1054, 279, 1054, 280, 1055, 281, 1056, 282, 1056, 283, 1056, 284, 1056, 285, 1056, 286, 1056, 287, 1056, 288, 1057, 289, 1057, 290, 1057, 291, 1057, 292, 1057, 293, 1057, 294, 1057, 295, 1059, 296, 1060, 297, 1060, 298, 1060, 299, 1060, 300, 1060, 301, 1061, 302, 1062, 303, 1063, 304, 1063, 305, 1064, 306, 1064, 307, 1066, 308, 1066, 309, 1066, 310, 1067, 311, 1068, 312, 1068, 313, 1068, 314, 1068, 315, 1068, 316, 1070, 317, 1070, 318, 1070, 319, 1071, 320, 1071, 321, 1071, 322, 1071, 323, 1071, 324, 1072, 325, 1072, 326, 1073, 327, 1073, 328, 1073, 329, 1073, 330, 1074, 331, 1074, 332, 1074, 333, 1075, 334, 1075, 335, 1075, 336, 1075, 337, 1075, 338, 1076, 339, 1076, 340, 1079, 341, 1079, 342, 1080, 343, 1081, 344, 1081, 345, 1081, 346, 1083, 347, 1083, 348, 1083, 349, 1083, 350, 1083, 351, 1084, 352, 1084, 353, 1085, 354, 1085, 355, 1085, 356, 1085, 357, 1086, 358, 1086, 359, 1086, 360, 1086, 361, 1087, 362, 1087, 363, 1087, 364, 1087, 365, 1087, 366, 1087, 367, 1087, 368, 1087, 369, 1087, 370, 1087, 371, 1087, 372, 1087, 373, 1088, 374, 1088, 375, 1089, 376, 1089, 377, 1089, 378, 1089, 379, 1091, 380, 1092, 381, 1093, 382, 1093, 383, 1093, 384, 1093, 385, 1093, 386, 1093, 387, 1093, 388, 1093, 389, 1093, 390, 1093, 391, 1093, 392, 1095, 393, 1095, 394, 1095, 395, 1095, 396, 1095, 397, 1095, 398, 1095, 399, 1096, 400, 1097, 401, 1097, 402, 1098, 403, 1098, 404, 1098, 405, 1098, 406, 1098, 407, 1098, 408, 1098, 409, 1098, 410, 1098, 411, 1098, 412, 1098, 413, 1099, 414, 1099, 415, 1099, 416, 1100, 417, 1100, 418, 1100, 419, 1100, 420, 1100, 421, 1101, 422, 1101, 423, 1101, 424, 1102, 425, 1102, 426, 1102, 427, 1102, 428, 1102, 429, 1105, 430, 1105, 431, 1105, 432, 1105, 433, 1105, 434, 1105, 435, 1106, 436, 1107, 437, 1107, 438, 1107, 439, 1107, 440, 1107, 441, 1107, 442, 1107, 443, 1108, 444, 1109, 445, 1109, 446, 1109, 447, 1109, 448, 1109, 449, 1109, 450, 1109, 451, 1109, 452, 1109, 453, 1109, 454, 1109, 455, 1109, 456, 1110, 457, 1110, 458, 1110, 459, 1110, 460, 1110, 461, 1110, 462, 1110, 463, 1110, 464, 1110, 465, 1110, 466, 1110, 467, 1110, 468, 1110, 469, 1111, 470, 1111, 471, 1111, 472, 1111, 473, 1111, 474, 1112, 475, 1112, 476, 1112, 477, 1112, 478, 1112, 479, 1112, 480, 1113, 481, 1113, 482, 1113, 483, 1113, 484, 1114, 485, 1114, 486, 1115, 487, 1115, 488, 1115, 489, 1115, 490, 1115, 491, 1115, 492, 1115, 493, 1115, 494, 1115, 495, 1115, 496, 1115, 497, 1115, 498, 1115, 499, 1115, 500, 1115, 501, 1115, 502, 1115, 503, 1116, 504, 1116, 505, 1116, 506, 1116, 507, 1116, 508, 1116, 509, 1116, 510, 1116, 511, 1119, 512, 1119, 513, 1119, 514, 1120, 515, 1122, 516, 1122, 517, 1122, 518, 1122, 519, 1122, 520, 1123, 521, 1124, 522, 1125, 523, 1125, 524, 1125, 525, 1125, 526, 1127, 527, 1130, 528, 1130, 529, 1130, 530, 1130, 531, 1130, 532, 1130, 533, 1131, 534, 1132, 535, 1133, 536, 1134, 537, 1134, 538, 1134, 539, 1136, 540, 1137, 541, 1137, 542, 1140, 543, 1143, 544, 1144, 545, 1144, 546, 1144, 547, 1144, 548, 1145, 549, 1146, 550, 1146, 551, 1146, 552, 1146, 553, 1146, 554, 1147, 555, 1147, 556, 1147, 557, 1149, 558, 1149, 559, 1149, 560, 1149, 561, 1150, 562, 1150, 563, 1150, 564, 1150, 565, 1150, 566, 1150, 567, 1150, 568, 1151, 569, 1152, 570, 1152, 571, 1154, 572, 1154, 573, 1154, 574, 1155, 575, 1155, 576, 1155, 577, 1156, 578, 1158, 579, 1158, 580, 1158, 581, 1158, 582, 1158, 583, 1160, 584, 1160, 585, 1160, 586, 1160, 587, 1160, 588, 1160, 589, 1161, 590, 1161, 591, 1162, 592, 1166, 593, 1167, 594, 1169, 595, 1169, 596, 1170, 597, 1171, 598, 1171, 599, 1173, 600, 1173, 601, 1173, 602, 1174, 603, 1175, 604, 1176, 605, 1178, 606, 1186, 607, 1186, 608, 1187, 609, 1191, 610, 1193, 611, 1193, 612, 1196, 613, 1199, 614, 1200, 615, 1201, 616, 1201, 617, 1201, 618, 1202, 619, 1204, 620, 1208, 621, 1210, 622, 1211, 623, 1213, 624, 1213, 625, 1214, 626, 1216, 627, 1217, 628, 1218, 629, 1221, 630, 1222, 631, 1223, 632, 1223, 633, 1224, 634, 1225, 635, 1225, 636, 1225, 637, 1226, 638, 1227, 639, 1228, 640, 1232, 641, 1232, 642, 1233, 643, 1233, 644, 1233, 645, 1235, 646, 1238, 647, 1239, 648, 1240, 649, 1240, 650, 1240, 651, 1241, 652, 1241, 653, 1243, 654, 1243, 655, 1244, 656, 1245, 657, 1246, 658, 1247, 659, 1248, 660, 1252, 661, 1252, 662, 1252, 663, 1252, 664, 1253, 665, 1253, 666, 1255, 667, 1257, 668, 1257, 669, 1259, 670, 1260, 671, 1260, 672, 1260, 673, 1260, 674, 1262, 675, 1262, 676, 1262, 677, 1262, 678, 1262, 679, 1263, 680, 1263, 681, 1263, 682, 1263, 683, 1265, 684, 1265, 685, 1265, 686, 1265, 687, 1266, 688, 1266, 689, 1267, 690, 1267, 691, 1269, 692, 1269, 693, 1269, 694, 1269, 695, 1272, 696, 1272, 697, 1272, 698, 1273, 699, 1275, 700, 1275, 701, 1275, 702, 1277, 703, 1279, 704, 1281, 705, 1281, 706, 1281, 707, 1281, 708, 1281, 709, 1281, 710, 1281, 711, 1282, 712, 1282, 713, 1282, 714, 1284, 715, 1284, 716, 1285, 717, 1286, 718, 1287, 719, 1287, 720, 1287, 721, 1287, 722, 1288, 723, 1288, 724, 1288, 725, 1288, 726, 1288, 727, 1290, 728, 1290, 729, 1290, 730, 1290]),
      },
      {
        clave: 'shazam', nombre: 'Shazam', color: '#0088FF',
        metrica: 'Shazams',
        kpis: [{ label: 'Shazams', valor: '128.4K' }, { label: 'Charts', valor: '0' }],
        serie: serie('2024-09-02', [0, 70144, 1, 70156, 2, 70174, 3, 70174, 4, 70175, 5, 70199, 6, 70208, 7, 70443, 8, 70465, 9, 70472, 10, 70478, 11, 70501, 12, 70507, 13, 70513, 14, 70518, 15, 70526, 16, 70557, 17, 70559, 18, 70579, 19, 70587, 20, 70602, 21, 70605, 22, 70615, 23, 70619, 24, 70625, 25, 70637, 26, 70644, 27, 70647, 28, 70653, 29, 70838, 30, 70846, 31, 70851, 32, 70861, 33, 70873, 34, 70878, 35, 70883, 36, 70897, 37, 70904, 38, 71054, 39, 71216, 40, 71228, 41, 71238, 42, 71243, 43, 71265, 44, 71308, 45, 71312, 46, 71314, 47, 71325, 48, 71334, 49, 71339, 50, 71352, 51, 71361, 52, 71365, 53, 71375, 54, 71384, 55, 71386, 56, 71390, 57, 71420, 58, 71426, 59, 71437, 60, 71448, 61, 71448, 62, 71449, 63, 71463, 64, 71463, 65, 71468, 66, 71474, 67, 71477, 68, 72241, 69, 72249, 70, 72252, 71, 72268, 72, 72272, 73, 72282, 74, 72289, 75, 72297, 76, 72304, 77, 72313, 78, 72319, 79, 72342, 80, 72350, 81, 72356, 82, 72366, 83, 72378, 84, 72386, 85, 72393, 86, 72398, 87, 72404, 88, 72412, 89, 72420, 90, 72427, 91, 72433, 92, 72443, 93, 72448, 94, 72455, 95, 72462, 96, 72476, 97, 72486, 98, 72970, 99, 72981, 100, 72983, 101, 72987, 102, 72990, 103, 75232, 104, 75241, 105, 75243, 106, 75274, 107, 75485, 108, 75490, 109, 75598, 110, 75607, 111, 75616, 112, 75622, 113, 75627, 114, 75631, 115, 75634, 116, 75952, 117, 75955, 118, 75958, 119, 75960, 120, 75983, 121, 75987, 122, 75996, 123, 76271, 124, 76275, 125, 76278, 126, 76282, 127, 76293, 128, 76299, 129, 76724, 130, 76954, 131, 76969, 132, 76975, 133, 76980, 134, 77012, 135, 77013, 136, 77022, 137, 77215, 138, 77226, 139, 77232, 140, 77237, 141, 77244, 142, 77248, 143, 77254, 144, 77255, 145, 77475, 146, 77482, 147, 77505, 148, 77532, 149, 77537, 150, 77540, 151, 77674, 152, 77679, 153, 77690, 154, 77696, 155, 77702, 156, 77707, 157, 77710, 158, 77847, 159, 77852, 160, 78126, 161, 78146, 162, 78175, 163, 78181, 164, 78183, 165, 78348, 166, 78357, 167, 78365, 168, 78371, 169, 78390, 170, 78408, 171, 78414, 172, 78559, 173, 78568, 174, 78572, 175, 78572, 176, 78580, 177, 78581, 178, 78586, 179, 78588, 180, 78767, 181, 78772, 182, 78772, 183, 78790, 184, 78794, 185, 78807, 186, 78807, 187, 78811, 188, 78824, 189, 78884, 190, 78892, 191, 79351, 192, 79559, 193, 79590, 194, 79681, 195, 79688, 196, 79689, 197, 79697, 198, 79702, 199, 79715, 200, 79715, 201, 79856, 202, 79867, 203, 79868, 204, 79875, 205, 79876, 206, 79885, 207, 79885, 208, 80058, 209, 80067, 210, 80068, 211, 80075, 212, 80092, 213, 80096, 214, 80097, 215, 80251, 216, 80266, 217, 80267, 218, 80283, 219, 80284, 220, 80568, 221, 80573, 222, 80619, 223, 80630, 224, 80634, 225, 80651, 226, 81185, 227, 81200, 228, 81201, 229, 81219, 230, 81225, 231, 81402, 232, 81413, 233, 81414, 234, 81429, 235, 81430, 236, 81444, 237, 81454, 238, 81454, 239, 81462, 240, 81462, 241, 81783, 242, 81791, 243, 81798, 244, 81806, 245, 81811, 246, 81823, 247, 81828, 248, 81836, 249, 82448, 250, 82464, 251, 82470, 252, 82471, 253, 82477, 254, 82478, 255, 82484, 256, 82644, 257, 82656, 258, 82665, 259, 82666, 260, 82674, 261, 82675, 262, 82676, 263, 82839, 264, 82863, 265, 82871, 266, 82873, 267, 82882, 268, 82887, 269, 82975, 270, 83122, 271, 83155, 272, 83170, 273, 83191, 274, 83203, 275, 83216, 276, 83228, 277, 83401, 278, 83428, 279, 83445, 280, 84128, 281, 84211, 282, 84219, 283, 84237, 284, 84441, 285, 84452, 286, 84481, 287, 84493, 288, 84516, 289, 84542, 290, 84563, 291, 84713, 292, 84745, 293, 84772, 294, 84777, 295, 84798, 296, 84806, 297, 84821, 298, 85020, 299, 85044, 300, 85070, 301, 85085, 302, 85103, 303, 85117, 304, 85132, 305, 85289, 306, 85315, 307, 85334, 308, 85349, 309, 85362, 310, 85800, 311, 85851, 312, 86047, 313, 86102, 314, 86123, 315, 86146, 316, 86167, 317, 86197, 318, 86203, 319, 86215, 320, 86605, 321, 86632, 322, 86641, 323, 86643, 324, 86662, 325, 86678, 326, 86926, 327, 86981, 328, 87038, 329, 87077, 330, 87095, 331, 87096, 332, 87099, 333, 87314, 334, 87326, 335, 87331, 336, 87331, 337, 87348, 338, 87348, 339, 87358, 340, 87929, 341, 88596, 342, 88630, 343, 88630, 344, 88648, 345, 88648, 346, 88657, 347, 89011, 348, 89015, 349, 89020, 350, 89045, 351, 89066, 352, 89066, 353, 89068, 354, 89369, 355, 89383, 356, 89385, 357, 89386, 358, 89396, 359, 89397, 360, 89404, 361, 89679, 362, 89684, 363, 89688, 364, 89690, 365, 89700, 366, 89701, 367, 89703, 368, 89955, 369, 89962, 370, 89965, 371, 89966, 372, 90372, 373, 90419, 374, 90423, 375, 90709, 376, 90713, 377, 90715, 378, 90717, 379, 90727, 380, 90732, 381, 90735, 382, 91115, 383, 91119, 384, 91121, 385, 91121, 386, 91133, 387, 91133, 388, 91140, 389, 91399, 390, 91408, 391, 91412, 392, 91412, 393, 91431, 394, 91493, 395, 91496, 396, 91571, 397, 91577, 398, 91582, 399, 91582, 400, 91591, 401, 91591, 402, 92061, 403, 92148, 404, 92153, 405, 92154, 406, 92155, 407, 92457, 408, 92462, 409, 92463, 410, 92545, 411, 92549, 412, 92552, 413, 92553, 414, 92558, 415, 92559, 416, 92561, 417, 92616, 418, 92623, 419, 92625, 420, 92626, 421, 92631, 422, 92904, 423, 92907, 424, 92963, 425, 92968, 426, 92969, 427, 92970, 428, 93133, 429, 93134, 430, 93139, 431, 93186, 432, 93189, 433, 93628, 434, 93629, 435, 93638, 436, 93639, 437, 93643, 438, 93701, 439, 93721, 440, 93726, 441, 93726, 442, 94122, 443, 94123, 444, 94131, 445, 94208, 446, 94211, 447, 94216, 448, 94216, 449, 94225, 450, 94225, 451, 94231, 452, 94283, 453, 94286, 454, 94289, 455, 94290, 456, 94565, 457, 94566, 458, 94569, 459, 94641, 460, 94645, 461, 94646, 462, 94647, 463, 95112, 464, 95113, 465, 95120, 466, 95219, 467, 95223, 468, 95230, 469, 95231, 470, 95559, 471, 95560, 472, 95563, 473, 95673, 474, 95674, 475, 95680, 476, 95681, 477, 95689, 478, 95690, 479, 95695, 480, 95735, 481, 95740, 482, 95742, 483, 95742, 484, 96030, 485, 96031, 486, 96037, 487, 96107, 488, 96108, 489, 96112, 490, 96112, 491, 96272, 492, 96272, 493, 96278, 494, 97010, 495, 97013, 496, 97018, 497, 97018, 498, 97031, 499, 97031, 500, 97032, 501, 97090, 502, 97095, 503, 97098, 504, 97098, 505, 97562, 506, 97562, 507, 97568, 508, 97618, 509, 97620, 510, 97621, 511, 97622, 512, 97631, 513, 97631, 514, 97635, 515, 97704, 516, 97712, 517, 97712, 518, 97713, 519, 98116, 520, 98118, 521, 98120, 522, 98181, 523, 98195, 524, 98216, 525, 99021, 526, 99050, 527, 99064, 528, 99092, 529, 99093, 530, 99130, 531, 99164, 532, 99179, 533, 99514, 534, 99519, 535, 99531, 536, 99783, 537, 99806, 538, 99827, 539, 99881, 540, 99992, 541, 100017, 542, 100044, 543, 100120, 544, 100152, 545, 100198, 546, 100232, 547, 100302, 548, 100322, 549, 100811, 550, 100833, 551, 100919, 552, 101085, 553, 101100, 554, 101628, 555, 101638, 556, 101697, 557, 101719, 558, 101824, 559, 101885, 560, 101898, 561, 102063, 562, 102072, 563, 102131, 564, 102149, 565, 102244, 566, 102300, 567, 102341, 568, 102578, 569, 102607, 570, 102696, 571, 102738, 572, 102834, 573, 102901, 574, 102936, 575, 102996, 576, 103015, 577, 103032, 578, 103072, 579, 103100, 580, 103130, 581, 103146, 582, 103167, 583, 103176, 584, 103457, 585, 103540, 586, 103540, 587, 103601, 588, 103620, 589, 103874, 590, 103881, 591, 103895, 592, 103951, 593, 103970, 594, 103986, 595, 103989, 596, 104111, 597, 104115, 598, 104133, 599, 104237, 600, 104282, 601, 104309, 602, 104315, 603, 104589, 604, 104595, 605, 104608, 606, 104729, 607, 104730, 608, 104880, 609, 104916, 610, 105118, 611, 105147, 612, 105380, 613, 105513, 614, 106049, 615, 106208, 616, 111847, 617, 111897, 618, 111897, 619, 111957, 620, 112645, 621, 112707, 622, 112786, 623, 112815, 624, 112815, 625, 112874, 626, 112910, 627, 113327, 628, 113369, 629, 113570, 630, 113609, 631, 113657, 632, 113677, 633, 113698, 634, 114025, 635, 114070, 636, 114126, 637, 114146, 638, 114254, 639, 114274, 640, 114296, 641, 114668, 642, 114714, 643, 114767, 644, 114808, 645, 115088, 646, 115269, 647, 115293, 648, 115808, 649, 115910, 650, 115974, 651, 116029, 652, 116143, 653, 116180, 654, 116181, 655, 116829, 656, 116889, 657, 116950, 658, 116992, 659, 117027, 660, 117056, 661, 117097, 662, 117557, 663, 117600, 664, 117647, 665, 117680, 666, 117706, 667, 117801, 668, 117837, 669, 118244, 670, 118288, 671, 118316, 672, 118332, 673, 118344, 674, 118374, 675, 118375, 676, 118661, 677, 118727, 678, 118767, 679, 118806, 680, 119036, 681, 119049, 682, 119079, 683, 119402, 684, 119450, 685, 119662, 686, 119728, 687, 120514, 688, 120550, 689, 120657, 690, 120732, 691, 120842, 692, 121022, 693, 121107, 694, 121403, 695, 121651, 696, 121833, 697, 122064, 698, 122366, 699, 122624, 700, 122787, 701, 122979, 702, 123174, 703, 124450, 704, 124595, 705, 124777, 706, 125017, 707, 125159, 708, 125324, 709, 125422, 710, 125600, 711, 125723, 712, 125869, 713, 126078, 714, 126155, 715, 126380, 716, 126462, 717, 126462, 718, 126462, 719, 126462, 720, 126462, 721, 126462, 722, 126462, 723, 126462, 724, 126337, 725, 126337, 726, 126337, 727, 128164, 728, 128323, 729, 128408, 730, 128664]),
      },
      {
        clave: 'youtube', nombre: 'YouTube', color: '#FF0000',
        metrica: 'Suscriptores',
        kpis: [{ label: 'Suscriptores', valor: '1.4K' }, { label: 'Followers', valor: '—' }, { label: 'Views', valor: '—' }, { label: 'Vídeos', valor: '339' }],
        serie: serie('2024-09-02', [0, 1076, 1, 1076, 2, 1076, 3, 1076, 4, 1076, 5, 1076, 6, 1076, 7, 1076, 8, 1076, 9, 1076, 10, 1076, 11, 1076, 12, 1076, 13, 1076, 14, 1076, 15, 1076, 16, 1076, 17, 1076, 18, 1076, 19, 1076, 20, 1076, 21, 1076, 22, 1076, 23, 1076, 24, 1076, 25, 1076, 26, 1087, 27, 1087, 28, 1087, 29, 1087, 30, 1087, 31, 1087, 32, 1087, 33, 1087, 34, 1087, 35, 1087, 36, 1087, 37, 1087, 38, 1087, 39, 1087, 40, 1087, 41, 1087, 42, 1087, 43, 1089, 44, 1089, 45, 1089, 46, 1090, 47, 1091, 48, 1091, 49, 1091, 50, 1092, 51, 1093, 52, 1094, 53, 1094, 54, 1094, 55, 1094, 56, 1094, 57, 1094, 58, 1094, 59, 1094, 60, 1094, 61, 1094, 62, 1094, 63, 1094, 64, 1094, 65, 1094, 66, 1094, 67, 1094, 68, 1094, 69, 1094, 70, 1094, 71, 1094, 72, 1094, 73, 1094, 74, 1094, 75, 1094, 76, 1094, 77, 1104, 78, 1104, 79, 1104, 80, 1104, 81, 1104, 82, 1104, 83, 1104, 84, 1104, 85, 1104, 86, 1104, 87, 1104, 88, 1104, 89, 1104, 90, 1104, 91, 1104, 92, 1104, 93, 1104, 94, 1104, 95, 1104, 96, 1104, 97, 1104, 98, 1104, 99, 1104, 100, 1104, 101, 1104, 102, 1104, 103, 1105, 104, 1105, 105, 1106, 106, 1116, 107, 1116, 108, 1116, 109, 1116, 110, 1116, 111, 1116, 112, 1116, 113, 1117, 114, 1116, 115, 1116, 116, 1117, 117, 1118, 118, 1118, 119, 1119, 120, 1119, 121, 1119, 122, 1119, 123, 1119, 124, 1119, 125, 1119, 126, 1119, 127, 1119, 128, 1119, 129, 1119, 130, 1119, 131, 1119, 132, 1119, 133, 1119, 134, 1119, 135, 1119, 136, 1120, 137, 1120, 138, 1120, 139, 1120, 140, 1130, 141, 1130, 142, 1130, 143, 1131, 144, 1131, 145, 1131, 146, 1131, 147, 1131, 148, 1132, 149, 1132, 150, 1132, 151, 1132, 152, 1132, 153, 1133, 154, 1133, 155, 1133, 156, 1133, 157, 1133, 158, 1134, 159, 1134, 160, 1134, 161, 1134, 162, 1134, 163, 1134, 164, 1134, 165, 1134, 166, 1135, 167, 1135, 168, 1135, 169, 1135, 170, 1145, 171, 1145, 172, 1135, 173, 1135, 174, 1135, 175, 1135, 176, 1135, 177, 1135, 178, 1135, 179, 1135, 180, 1136, 181, 1136, 182, 1136, 183, 1146, 184, 1146, 185, 1146, 186, 1148, 187, 1149, 188, 1149, 189, 1150, 190, 1150, 191, 1150, 192, 1150, 193, 1151, 194, 1151, 195, 1151, 196, 1151, 197, 1151, 198, 1151, 199, 1151, 200, 1151, 201, 1151, 202, 1151, 203, 1151, 204, 1151, 205, 1151, 206, 1151, 207, 1151, 208, 1151, 209, 1152, 210, 1152, 211, 1152, 212, 1152, 213, 1152, 214, 1152, 215, 1152, 216, 1152, 217, 1152, 218, 1153, 219, 1153, 220, 1164, 221, 1164, 222, 1165, 223, 1165, 224, 1165, 225, 1166, 226, 1166, 227, 1168, 228, 1168, 229, 1168, 230, 1168, 231, 1168, 232, 1169, 233, 1170, 234, 1170, 235, 1170, 236, 1170, 237, 1170, 238, 1170, 239, 1170, 240, 1170, 241, 1170, 242, 1170, 243, 1171, 244, 1171, 245, 1171, 246, 1173, 247, 1174, 248, 1175, 249, 1175, 250, 1175, 251, 1175, 252, 1175, 253, 1175, 254, 1175, 255, 1175, 256, 1175, 257, 1175, 258, 1176, 259, 1177, 260, 1177, 261, 1177, 262, 1177, 263, 1178, 264, 1189, 265, 1189, 266, 1189, 267, 1189, 268, 1189, 269, 1189, 270, 1189, 271, 1190, 272, 1190, 273, 1190, 274, 1190, 275, 1190, 276, 1190, 277, 1190, 278, 1190, 279, 1190, 280, 1190, 281, 1190, 282, 1190, 283, 1191, 284, 1192, 285, 1192, 286, 1192, 287, 1192, 288, 1192, 289, 1192, 290, 1194, 291, 1194, 292, 1194, 293, 1194, 294, 1194, 295, 1194, 296, 1194, 297, 1194, 298, 1204, 299, 1204, 300, 1204, 301, 1204, 302, 1204, 303, 1204, 304, 1204, 305, 1204, 306, 1204, 307, 1205, 308, 1205, 309, 1205, 310, 1206, 311, 1206, 312, 1207, 313, 1208, 314, 1208, 315, 1211, 316, 1212, 317, 1212, 318, 1212, 319, 1212, 320, 1212, 321, 1212, 322, 1212, 323, 1212, 324, 1212, 325, 1212, 326, 1212, 327, 1213, 328, 1213, 329, 1213, 330, 1213, 331, 1213, 332, 1213, 333, 1213, 334, 1215, 335, 1215, 336, 1215, 337, 1215, 338, 1215, 339, 1215, 340, 1215, 341, 1224, 342, 1224, 343, 1224, 344, 1224, 345, 1224, 346, 1224, 347, 1224, 348, 1224, 349, 1224, 350, 1224, 351, 1224, 352, 1234, 353, 1234, 354, 1234, 355, 1234, 356, 1234, 357, 1234, 358, 1234, 359, 1234, 360, 1234, 361, 1234, 362, 1234, 363, 1234, 364, 1234, 365, 1234, 366, 1234, 367, 1234, 368, 1234, 369, 1234, 370, 1244, 371, 1245, 372, 1246, 373, 1246, 374, 1246, 375, 1246, 376, 1246, 377, 1246, 378, 1246, 379, 1246, 380, 1246, 381, 1246, 382, 1246, 383, 1246, 384, 1246, 385, 1246, 386, 1246, 387, 1246, 388, 1246, 389, 1246, 390, 1256, 391, 1246, 392, 1246, 393, 1256, 394, 1256, 395, 1256, 396, 1256, 397, 1256, 398, 1256, 399, 1256, 400, 1257, 401, 1257, 402, 1247, 403, 1257, 404, 1258, 405, 1258, 406, 1258, 407, 1258, 408, 1258, 409, 1258, 410, 1258, 411, 1258, 412, 1258, 413, 1258, 414, 1258, 415, 1258, 416, 1258, 417, 1258, 418, 1258, 419, 1258, 420, 1258, 421, 1259, 422, 1259, 423, 1259, 424, 1259, 425, 1269, 426, 1269, 427, 1269, 428, 1269, 429, 1269, 430, 1269, 431, 1269, 432, 1269, 433, 1269, 434, 1269, 435, 1269, 436, 1269, 437, 1269, 438, 1279, 439, 1279, 440, 1269, 441, 1279, 442, 1279, 443, 1279, 444, 1279, 445, 1279, 446, 1279, 447, 1279, 448, 1279, 449, 1279, 450, 1279, 451, 1279, 452, 1279, 453, 1279, 454, 1279, 455, 1279, 456, 1279, 457, 1279, 458, 1279, 459, 1279, 460, 1279, 461, 1279, 462, 1279, 463, 1279, 464, 1279, 465, 1279, 466, 1279, 467, 1279, 468, 1281, 469, 1291, 470, 1291, 471, 1291, 472, 1291, 473, 1291, 474, 1291, 475, 1291, 476, 1291, 477, 1291, 478, 1291, 479, 1291, 480, 1291, 481, 1291, 482, 1291, 483, 1291, 484, 1291, 485, 1291, 486, 1291, 487, 1291, 488, 1291, 489, 1291, 490, 1291, 491, 1291, 492, 1301, 493, 1301, 494, 1301, 495, 1301, 496, 1301, 497, 1301, 498, 1301, 499, 1301, 500, 1301, 501, 1301, 502, 1301, 503, 1301, 504, 1301, 505, 1301, 506, 1301, 507, 1301, 508, 1301, 509, 1301, 510, 1301, 511, 1301, 512, 1301, 513, 1301, 514, 1301, 515, 1301, 516, 1301, 517, 1301, 518, 1301, 519, 1301, 520, 1301, 521, 1301, 522, 1301, 523, 1301, 524, 1301, 525, 1301, 526, 1301, 527, 1301, 528, 1301, 529, 1301, 530, 1311, 531, 1311, 532, 1311, 533, 1311, 534, 1311, 535, 1311, 536, 1311, 537, 1311, 538, 1311, 539, 1311, 540, 1311, 541, 1311, 542, 1311, 543, 1311, 544, 1322, 545, 1322, 546, 1322, 547, 1322, 548, 1322, 549, 1322, 550, 1322, 551, 1322, 552, 1322, 553, 1322, 554, 1322, 555, 1322, 556, 1322, 557, 1322, 558, 1322, 559, 1322, 560, 1332, 561, 1332, 562, 1332, 563, 1332, 564, 1332, 565, 1333, 566, 1333, 567, 1333, 568, 1333, 569, 1334, 570, 1334, 571, 1334, 572, 1334, 573, 1334, 574, 1334, 575, 1334, 576, 1334, 577, 1335, 578, 1335, 579, 1336, 580, 1336, 581, 1336, 582, 1336, 583, 1336, 584, 1336, 585, 1336, 586, 1336, 587, 1336, 588, 1346, 589, 1346, 590, 1346, 591, 1346, 592, 1347, 593, 1347, 594, 1347, 595, 1347, 596, 1347, 597, 1347, 598, 1347, 599, 1347, 600, 1347, 601, 1347, 602, 1347, 603, 1348, 604, 1348, 605, 1348, 606, 1348, 607, 1358, 608, 1358, 609, 1358, 610, 1358, 611, 1358, 612, 1358, 613, 1358, 614, 1358, 615, 1358, 616, 1359, 617, 1359, 618, 1359, 619, 1369, 620, 1369, 621, 1369, 622, 1369, 623, 1369, 624, 1369, 625, 1369, 626, 1369, 627, 1369, 628, 1369, 629, 1369, 630, 1369, 631, 1369, 632, 1369, 633, 1369, 634, 1379, 635, 1379, 636, 1379, 637, 1379, 638, 1379, 639, 1379, 640, 1379, 641, 1379, 642, 1379, 643, 1379, 644, 1379, 645, 1379, 646, 1379, 647, 1379, 648, 1389, 649, 1389, 650, 1389, 651, 1389, 652, 1389, 653, 1389, 654, 1389, 655, 1389, 656, 1389, 657, 1390, 658, 1390, 659, 1390, 660, 1390, 661, 1390, 662, 1400, 663, 1400, 664, 1400, 665, 1400, 666, 1400, 667, 1400, 668, 1400, 669, 1400, 670, 1400, 671, 1400, 672, 1400, 673, 1400, 674, 1400, 675, 1400, 676, 1400, 677, 1400, 678, 1400, 679, 1400, 680, 1400, 681, 1400, 682, 1390, 683, 1390, 684, 1400, 685, 1400, 686, 1400, 687, 1400, 688, 1400, 689, 1400, 690, 1400, 691, 1400, 692, 1400, 693, 1400, 694, 1400, 695, 1400, 696, 1400, 697, 1400, 698, 1400, 699, 1400, 700, 1400, 701, 1400, 702, 1400, 703, 1400, 704, 1400, 705, 1400, 706, 1400, 707, 1400, 708, 1410, 709, 1410, 710, 1410, 711, 1410, 712, 1410, 713, 1410, 714, 1410, 715, 1410, 716, 1410, 717, 1410, 718, 1420, 719, 1420, 720, 1420, 721, 1420, 722, 1420, 723, 1420, 724, 1420, 725, 1420, 726, 1420, 727, 1420, 728, 1420, 729, 1420, 730, 1420]),
      },
      {
        clave: 'tiktok', nombre: 'TikTok', color: '#000000',
        metrica: 'Likes',
        kpis: [{ label: 'Followers', valor: '0' }, { label: 'Likes', valor: '24.8K' }, { label: 'Vídeos', valor: '234' }],
        serie: serie('2024-09-02', [0, 4829, 1, 4832, 2, 4836, 3, 4839, 4, 4847, 5, 4852, 6, 4856, 7, 4860, 8, 4865, 9, 4868, 10, 4873, 11, 4879, 12, 4883, 13, 4888, 14, 4891, 15, 4893, 16, 4899, 17, 4904, 18, 4909, 19, 4913, 20, 4916, 21, 4922, 22, 4929, 23, 4935, 24, 4939, 25, 4943, 26, 4946, 27, 4951, 28, 4958, 29, 4964, 30, 4969, 31, 4975, 32, 4982, 33, 4985, 34, 4990, 35, 4995, 36, 4999, 37, 5005, 38, 5009, 39, 5012, 40, 5016, 41, 5021, 42, 5028, 43, 5030, 44, 5036, 45, 5038, 46, 5045, 47, 5050, 48, 5053, 49, 5057, 50, 5061, 51, 5067, 52, 5074, 53, 5080, 54, 5085, 55, 5089, 56, 5093, 57, 5097, 58, 5102, 59, 5105, 60, 5110, 61, 5115, 62, 5120, 63, 5122, 64, 5127, 65, 5130, 66, 5134, 67, 5139, 68, 5142, 69, 5146, 70, 5150, 71, 5155, 72, 5158, 73, 5166, 74, 5172, 75, 5177, 76, 5181, 77, 5184, 78, 5188, 79, 5193, 80, 5199, 81, 5203, 82, 5210, 83, 5212, 84, 5217, 85, 5224, 86, 5227, 87, 5230, 88, 5232, 89, 5236, 90, 5243, 91, 5246, 92, 5251, 93, 5253, 94, 5258, 95, 5265, 96, 5268, 97, 5276, 98, 5280, 99, 5287, 100, 5294, 101, 5296, 102, 5301, 103, 5304, 104, 5307, 105, 5314, 106, 5316, 107, 5319, 108, 5325, 109, 5330, 110, 5335, 111, 5341, 112, 5344, 113, 5346, 114, 5350, 115, 5355, 116, 5358, 117, 5366, 118, 5369, 119, 5377, 120, 5383, 121, 5393, 122, 5400, 123, 5406, 124, 5418, 125, 5425, 126, 5433, 127, 5439, 128, 5448, 129, 5457, 130, 5468, 131, 5475, 132, 5481, 133, 5490, 134, 5496, 135, 5508, 136, 5515, 137, 5525, 138, 5533, 139, 5540, 140, 5546, 141, 5555, 142, 5564, 143, 5574, 144, 5580, 145, 5586, 146, 5592, 147, 5602, 148, 5611, 149, 5621, 150, 5630, 151, 5636, 152, 5646, 153, 5657, 154, 5662, 155, 5671, 156, 5680, 157, 5689, 158, 5697, 159, 5702, 160, 5711, 161, 5717, 162, 5727, 163, 5737, 164, 5743, 165, 5750, 166, 5757, 167, 5765, 168, 5775, 169, 5784, 170, 5795, 171, 5804, 172, 5812, 173, 5818, 174, 5828, 175, 5835, 176, 5844, 177, 5856, 178, 5863, 179, 5871, 180, 5879, 181, 5887, 182, 5897, 183, 5907, 184, 5913, 185, 5925, 186, 5932, 187, 5944, 188, 5954, 189, 5964, 190, 5972, 191, 5980, 192, 5988, 193, 5997, 194, 6006, 195, 6015, 196, 6024, 197, 6033, 198, 6042, 199, 6051, 200, 6061, 201, 6067, 202, 6078, 203, 6085, 204, 6094, 205, 6104, 206, 6113, 207, 6123, 208, 6132, 209, 6141, 210, 6151, 211, 6161, 212, 6168, 213, 6177, 214, 6184, 215, 6197, 216, 6208, 217, 6217, 218, 6229, 219, 6245, 220, 6263, 221, 6281, 222, 6298, 223, 6315, 224, 6332, 225, 6351, 226, 6371, 227, 6387, 228, 6404, 229, 6421, 230, 6440, 231, 6456, 232, 6474, 233, 6492, 234, 6511, 235, 6531, 236, 6548, 237, 6568, 238, 6586, 239, 6602, 240, 6619, 241, 6638, 242, 6656, 243, 6676, 244, 6697, 245, 6716, 246, 6738, 247, 6755, 248, 6777, 249, 6822, 250, 6869, 251, 6910, 252, 6955, 253, 7000, 254, 7043, 255, 7089, 256, 7133, 257, 7155, 258, 7179, 259, 7203, 260, 7228, 261, 7251, 262, 7272, 263, 7298, 264, 7318, 265, 7341, 266, 7363, 267, 7387, 268, 7413, 269, 7440, 270, 7466, 271, 7495, 272, 7519, 273, 7547, 274, 7573, 275, 7601, 276, 7630, 277, 7656, 278, 7682, 279, 7709, 280, 7734, 281, 7760, 282, 7788, 283, 7815, 284, 7842, 285, 7869, 286, 7896, 287, 7921, 288, 7945, 289, 7973, 290, 7999, 291, 8024, 292, 8049, 293, 8078, 294, 8102, 295, 8130, 296, 8158, 297, 8187, 298, 8216, 299, 8243, 300, 8271, 301, 8300, 302, 8329, 303, 8358, 304, 8384, 305, 8410, 306, 8435, 307, 8460, 308, 8486, 309, 8514, 310, 8541, 311, 8569, 312, 8595, 313, 8618, 314, 8644, 315, 8674, 316, 8700, 317, 8727, 318, 8755, 319, 8782, 320, 8808, 321, 8837, 322, 8863, 323, 8892, 324, 8919, 325, 8946, 326, 8975, 327, 8998, 328, 9026, 329, 9054, 330, 9079, 331, 9107, 332, 9133, 333, 9162, 334, 9193, 335, 9218, 336, 9249, 337, 9273, 338, 9302, 339, 9327, 340, 9357, 341, 9383, 342, 9408, 343, 9439, 344, 9462, 345, 9491, 346, 9515, 347, 9547, 348, 9573, 349, 9599, 350, 9624, 351, 9653, 352, 9679, 353, 9706, 354, 9730, 355, 9756, 356, 9782, 357, 9812, 358, 9844, 359, 9870, 360, 9898, 361, 9922, 362, 9949, 363, 9974, 364, 10004, 365, 10031, 366, 10058, 367, 10085, 368, 10113, 369, 10142, 370, 10166, 371, 10195, 372, 10224, 373, 10249, 374, 10277, 375, 10303, 376, 10333, 377, 10363, 378, 10390, 379, 10416, 380, 10441, 381, 10467, 382, 10493, 383, 10520, 384, 10553, 385, 10577, 386, 10603, 387, 10629, 388, 10653, 389, 10680, 390, 10712, 391, 10738, 392, 10769, 393, 10794, 394, 10819, 395, 10845, 396, 10871, 397, 10905, 398, 10929, 399, 10954, 400, 10981, 401, 11007, 402, 11035, 403, 11065, 404, 11095, 405, 11125, 406, 11151, 407, 11176, 408, 11206, 409, 11237, 410, 11261, 411, 11286, 412, 11315, 413, 11341, 414, 11368, 415, 11399, 416, 11427, 417, 11455, 418, 11480, 419, 11506, 420, 11532, 421, 11562, 422, 11592, 423, 11620, 424, 11650, 425, 11676, 426, 11707, 427, 11736, 428, 11762, 429, 11787, 430, 11814, 431, 11844, 432, 11871, 433, 11899, 434, 11930, 435, 11956, 436, 11986, 437, 12018, 438, 12044, 439, 12069, 440, 12098, 441, 12128, 442, 12155, 443, 12182, 444, 12215, 445, 12241, 446, 12272, 447, 12302, 448, 12327, 449, 12354, 450, 12385, 451, 12413, 452, 12444, 453, 12476, 454, 12501, 455, 12531, 456, 12559, 457, 12586, 458, 12613, 459, 12643, 460, 12668, 461, 12695, 462, 12730, 463, 12759, 464, 12787, 465, 12819, 466, 12848, 467, 12874, 468, 12899, 469, 12927, 470, 12955, 471, 12986, 472, 13016, 473, 13043, 474, 13070, 475, 13103, 476, 13125, 477, 13155, 478, 13185, 479, 13218, 480, 13248, 481, 13277, 482, 13306, 483, 13337, 484, 13367, 485, 13395, 486, 13421, 487, 13453, 488, 13481, 489, 13509, 490, 13541, 491, 13570, 492, 13600, 493, 13624, 494, 13655, 495, 13685, 496, 13712, 497, 13747, 498, 13778, 499, 13807, 500, 13832, 501, 13857, 502, 13887, 503, 13917, 504, 13950, 505, 13978, 506, 14007, 507, 14034, 508, 14061, 509, 14099, 510, 14133, 511, 14157, 512, 14182, 513, 14210, 514, 14238, 515, 14266, 516, 14297, 517, 14322, 518, 14352, 519, 14382, 520, 14412, 521, 14443, 522, 14478, 523, 14504, 524, 14537, 525, 14565, 526, 14596, 527, 14625, 528, 14658, 529, 14690, 530, 14719, 531, 14746, 532, 14780, 533, 14807, 534, 14837, 535, 14870, 536, 14894, 537, 14926, 538, 14956, 539, 14987, 540, 15016, 541, 15049, 542, 15081, 543, 15106, 544, 15136, 545, 15166, 546, 15196, 547, 15227, 548, 15254, 549, 15286, 550, 15318, 551, 15346, 552, 15382, 553, 15415, 554, 15450, 555, 15483, 556, 15516, 557, 15551, 558, 15585, 559, 15616, 560, 15648, 561, 15680, 562, 15715, 563, 15748, 564, 15778, 565, 15809, 566, 15841, 567, 15876, 568, 15912, 569, 15945, 570, 15984, 571, 16020, 572, 16058, 573, 16091, 574, 16121, 575, 16155, 576, 16190, 577, 16225, 578, 16258, 579, 16291, 580, 16322, 581, 16358, 582, 16393, 583, 16428, 584, 16459, 585, 16495, 586, 16530, 587, 16563, 588, 16595, 589, 16628, 590, 16658, 591, 16693, 592, 16730, 593, 16759, 594, 16794, 595, 16828, 596, 16861, 597, 16899, 598, 16934, 599, 16965, 600, 17002, 601, 17033, 602, 17062, 603, 17095, 604, 17131, 605, 17167, 606, 17197, 607, 17229, 608, 17267, 609, 17298, 610, 17336, 611, 17370, 612, 17401, 613, 17436, 614, 17465, 615, 17500, 616, 17537, 617, 17572, 618, 17603, 619, 17640, 620, 17670, 621, 17704, 622, 17741, 623, 17773, 624, 17810, 625, 17847, 626, 17878, 627, 17912, 628, 17945, 629, 17984, 630, 18015, 631, 18049, 632, 18086, 633, 18118, 634, 18159, 635, 18198, 636, 18237, 637, 18271, 638, 18311, 639, 18350, 640, 18385, 641, 18421, 642, 18459, 643, 18492, 644, 18533, 645, 18570, 646, 18603, 647, 18638, 648, 18676, 649, 18712, 650, 18750, 651, 18786, 652, 18823, 653, 18863, 654, 18897, 655, 18934, 656, 18970, 657, 19004, 658, 19042, 659, 19079, 660, 19117, 661, 19152, 662, 19194, 663, 19234, 664, 19267, 665, 19306, 666, 19344, 667, 19387, 668, 19427, 669, 19464, 670, 19503, 671, 19543, 672, 19577, 673, 19617, 674, 19656, 675, 19695, 676, 19732, 677, 19771, 678, 19807, 679, 19846, 680, 19882, 681, 19920, 682, 19964, 683, 19999, 684, 20042, 685, 20080, 686, 20126, 687, 20169, 688, 20208, 689, 20249, 690, 20289, 691, 20333, 692, 20381, 693, 20435, 694, 20482, 695, 20609, 696, 20739, 697, 20865, 698, 20997, 699, 21128, 700, 21257, 701, 21386, 702, 21512, 703, 21639, 704, 21768, 705, 21897, 706, 22027, 707, 22156, 708, 22282, 709, 22412, 710, 22544, 711, 22680, 712, 22808, 713, 22939, 714, 23076, 715, 23206, 716, 23340, 717, 23472, 718, 23615, 719, 23755, 720, 23899, 721, 24041, 722, 24183, 723, 24302, 724, 24427, 725, 24535, 726, 24644, 727, 24748, 728, 24771, 729, 24779, 730, 24789]),
      },
      {
        clave: 'instagram', nombre: 'Instagram', color: '#E1306C',
        metrica: 'Followers',
        kpis: [{ label: 'Followers', valor: '17.9K' }],
        serie: serie('2024-09-08', [0, 14809, 1, 14809, 2, 14809, 3, 14809, 4, 14809, 5, 14809, 6, 14809, 7, 14817, 8, 14817, 9, 14817, 10, 14817, 11, 14817, 12, 14817, 13, 14817, 14, 14860, 15, 14860, 16, 14860, 17, 14860, 18, 14860, 19, 14860, 20, 14860, 21, 14881, 22, 14881, 23, 14881, 24, 14881, 25, 14881, 26, 14881, 27, 14881, 28, 14920, 29, 14920, 30, 14920, 31, 14920, 32, 14920, 33, 14920, 34, 14920, 35, 14948, 36, 14948, 37, 14948, 38, 14948, 39, 14948, 40, 14948, 41, 14948, 42, 15005, 43, 15005, 44, 15005, 45, 15005, 46, 15005, 47, 15005, 48, 15005, 49, 15025, 50, 15025, 51, 15025, 52, 15025, 53, 15025, 54, 15025, 55, 15025, 56, 15059, 57, 15059, 58, 15059, 59, 15059, 60, 15059, 61, 15059, 62, 15059, 63, 15092, 64, 15092, 65, 15092, 66, 15092, 67, 15092, 68, 15092, 69, 15092, 70, 15201, 71, 15201, 72, 15201, 73, 15201, 74, 15201, 75, 15201, 76, 15201, 77, 15331, 78, 15331, 79, 15331, 80, 15331, 81, 15331, 82, 15331, 83, 15331, 84, 15367, 85, 15367, 86, 15367, 87, 15367, 88, 15367, 89, 15367, 90, 15367, 91, 15395, 92, 15395, 93, 15395, 94, 15395, 95, 15395, 96, 15395, 97, 15395, 98, 15411, 99, 15411, 100, 15411, 101, 15411, 102, 15411, 103, 15411, 104, 15411, 105, 15421, 106, 15421, 107, 15421, 108, 15421, 109, 15421, 110, 15421, 111, 15421, 112, 15424, 113, 15424, 114, 15424, 115, 15424, 116, 15424, 117, 15424, 118, 15424, 119, 15425, 120, 15425, 121, 15425, 122, 15425, 123, 15425, 124, 15425, 125, 15425, 126, 15418, 127, 15418, 128, 15418, 129, 15418, 130, 15418, 131, 15418, 132, 15418, 133, 15434, 134, 15434, 135, 15434, 136, 15434, 137, 15434, 138, 15434, 139, 15434, 140, 15422, 141, 15422, 142, 15422, 143, 15422, 144, 15422, 145, 15422, 146, 15422, 147, 15430, 148, 15430, 149, 15430, 150, 15430, 151, 15430, 152, 15430, 153, 15430, 154, 15432, 155, 15432, 156, 15432, 157, 15432, 158, 15432, 159, 15432, 160, 15432, 161, 15434, 162, 15434, 163, 15434, 164, 15434, 165, 15434, 166, 15434, 167, 15434, 168, 15435, 169, 15435, 170, 15435, 171, 15435, 172, 15435, 173, 15435, 174, 15435, 175, 15422, 176, 15422, 177, 15422, 178, 15422, 179, 15422, 180, 15422, 181, 15422, 182, 15419, 183, 15419, 184, 15419, 185, 15419, 186, 15419, 187, 15419, 188, 15419, 189, 15425, 190, 15425, 191, 15425, 192, 15425, 193, 15425, 194, 15425, 195, 15425, 196, 15443, 197, 15443, 198, 15443, 199, 15443, 200, 15443, 201, 15443, 202, 15443, 203, 15427, 204, 15427, 205, 15427, 206, 15427, 207, 15427, 208, 15427, 209, 15427, 210, 15431, 211, 15431, 212, 15431, 213, 15431, 214, 15431, 215, 15431, 216, 15431, 217, 15435, 218, 15435, 219, 15435, 220, 15435, 221, 15450, 222, 15450, 223, 15450, 224, 15451, 225, 15458, 226, 15459, 227, 15456, 228, 15458, 229, 15461, 230, 15468, 231, 15469, 232, 15467, 233, 15474, 234, 15467, 235, 15462, 236, 15461, 237, 15465, 238, 15467, 239, 15470, 240, 15473, 241, 15474, 242, 15474, 243, 15485, 244, 15502, 245, 15536, 246, 15536, 247, 15536, 248, 15536, 249, 15537, 250, 15537, 251, 15537, 252, 15546, 253, 15546, 254, 15546, 255, 15546, 256, 15546, 257, 15546, 258, 15546, 259, 15577, 260, 15577, 261, 15577, 262, 15577, 263, 15577, 264, 15590, 265, 15590, 266, 15596, 267, 15596, 268, 15596, 269, 15596, 270, 15596, 271, 15596, 272, 15596, 273, 15596, 274, 15641, 275, 15641, 276, 15641, 277, 15641, 278, 15641, 279, 15641, 280, 15748, 281, 15748, 282, 15748, 283, 15748, 284, 15748, 285, 15748, 286, 15748, 287, 15873, 288, 15873, 289, 15873, 290, 15873, 291, 15873, 292, 15873, 293, 15873, 294, 15873, 295, 15922, 296, 15922, 297, 15922, 298, 15922, 299, 15922, 300, 15922, 301, 15922, 302, 15922, 303, 15922, 304, 15922, 305, 15922, 306, 15922, 307, 15922, 308, 15922, 309, 15954, 310, 15954, 311, 15954, 312, 15954, 313, 15954, 314, 15954, 315, 15948, 316, 15948, 317, 15948, 318, 15948, 319, 15948, 320, 15948, 321, 15948, 322, 15954, 323, 15954, 324, 15954, 325, 15954, 326, 15954, 327, 15954, 328, 15954, 329, 15958, 330, 15958, 331, 15958, 332, 15958, 333, 15958, 334, 15958, 335, 15958, 336, 15969, 337, 15969, 338, 15969, 339, 15969, 340, 15969, 341, 15969, 342, 15969, 343, 15990, 344, 15990, 345, 15990, 346, 15990, 347, 15990, 348, 15990, 349, 16002, 350, 16002, 351, 16002, 352, 16002, 353, 16002, 354, 16002, 355, 16002, 356, 16002, 357, 16011, 358, 16011, 359, 16011, 360, 16011, 361, 16011, 362, 16011, 363, 16011, 364, 16018, 365, 16018, 366, 16018, 367, 16018, 368, 16018, 369, 16018, 370, 16018, 371, 16028, 372, 16028, 373, 16028, 374, 16028, 375, 16028, 376, 16028, 377, 16027, 378, 16027, 379, 16027, 380, 16027, 381, 16027, 382, 16027, 383, 16027, 384, 16027, 385, 16025, 386, 16025, 387, 16025, 388, 16025, 389, 16025, 390, 16025, 391, 16025, 392, 16029, 393, 16029, 394, 16029, 395, 16029, 396, 16029, 397, 16029, 398, 16029, 399, 16025, 400, 16025, 401, 16025, 402, 16025, 403, 16025, 404, 16025, 405, 16025, 406, 16017, 407, 16017, 408, 16017, 409, 16017, 410, 16017, 411, 16017, 412, 16017, 413, 16019, 414, 16019, 415, 16019, 416, 16019, 417, 16019, 418, 16019, 419, 16019, 420, 16020, 421, 16020, 422, 16020, 423, 16020, 424, 16020, 425, 16020, 426, 16020, 427, 16031, 428, 16031, 429, 16031, 430, 16031, 431, 16031, 432, 16031, 433, 16031, 434, 16047, 435, 16047, 436, 16047, 437, 16047, 438, 16047, 439, 16047, 440, 16047, 441, 16058, 442, 16058, 443, 16058, 444, 16058, 445, 16058, 446, 16058, 447, 16058, 448, 16056, 449, 16056, 450, 16056, 451, 16056, 452, 16056, 453, 16056, 454, 16056, 455, 16050, 456, 16050, 457, 16050, 458, 16050, 459, 16050, 460, 16050, 461, 16050, 462, 16057, 463, 16057, 464, 16057, 465, 16057, 466, 16057, 467, 16057, 468, 16057, 469, 16061, 470, 16061, 471, 16061, 472, 16061, 473, 16061, 474, 16061, 475, 16061, 476, 16082, 477, 16082, 478, 16082, 479, 16082, 480, 16082, 481, 16082, 482, 16082, 483, 16097, 484, 16097, 485, 16097, 486, 16097, 487, 16097, 488, 16097, 489, 16097, 490, 16103, 491, 16103, 492, 16103, 493, 16103, 494, 16103, 495, 16103, 496, 16103, 497, 16123, 498, 16123, 499, 16123, 500, 16123, 501, 16123, 502, 16123, 503, 16123, 504, 16179, 505, 16179, 506, 16179, 507, 16179, 508, 16179, 509, 16179, 510, 16179, 511, 16203, 512, 16203, 513, 16203, 514, 16203, 515, 16203, 516, 16203, 517, 16203, 518, 16243, 519, 16243, 520, 16243, 521, 16243, 522, 16243, 523, 16243, 524, 16243, 525, 16266, 526, 16268, 527, 16268, 528, 16268, 529, 16268, 530, 16268, 531, 16268, 532, 16268, 533, 16268, 534, 16268, 535, 16268, 536, 16268, 537, 16268, 538, 16268, 539, 16333, 540, 16336, 541, 16345, 542, 16357, 543, 16362, 544, 16365, 545, 16369, 546, 16387, 547, 16395, 548, 16392, 549, 16391, 550, 16408, 551, 16422, 552, 16426, 553, 16425, 554, 16428, 555, 16441, 556, 16435, 557, 16451, 558, 16451, 559, 16460, 560, 16481, 561, 16509, 562, 16509, 563, 16528, 564, 16546, 565, 16566, 566, 16660, 567, 16683, 568, 16695, 569, 16695, 570, 16721, 571, 16728, 572, 16736, 573, 16738, 574, 16739, 575, 16739, 576, 16739, 577, 16741, 578, 16734, 579, 16752, 580, 16786, 581, 16806, 582, 16813, 583, 16823, 584, 16831, 585, 16832, 586, 16851, 587, 16854, 588, 16876, 589, 16876, 590, 16886, 591, 16886, 592, 16894, 593, 16907, 594, 16911, 595, 16916, 596, 16921, 597, 16942, 598, 16958, 599, 16983, 600, 17032, 601, 17063, 602, 17075, 603, 17095, 604, 17106, 605, 17023, 606, 17032, 607, 17021, 608, 17035, 609, 17035, 610, 17044, 611, 17063, 612, 17062, 613, 17064, 614, 17064, 615, 17067, 616, 17067, 617, 17085, 618, 17093, 619, 17093, 620, 17114, 621, 17119, 622, 17118, 623, 17118, 624, 17131, 625, 17141, 626, 17136, 627, 17138, 628, 17147, 629, 17153, 630, 17153, 631, 17155, 632, 17154, 633, 17154, 634, 17154, 635, 17153, 636, 17163, 637, 17165, 638, 17165, 639, 17195, 640, 17221, 641, 17220, 642, 17222, 643, 17222, 644, 17232, 645, 17229, 646, 17236, 647, 17274, 648, 17274, 649, 17299, 650, 17297, 651, 17297, 652, 17302, 653, 17309, 654, 17314, 655, 17318, 656, 17323, 657, 17328, 658, 17327, 659, 17326, 660, 17330, 661, 17325, 662, 17329, 663, 17337, 664, 17339, 665, 17350, 666, 17346, 667, 17347, 668, 17340, 669, 17361, 670, 17372, 671, 17372, 672, 17383, 673, 17383, 674, 17383, 675, 17383, 676, 17385, 677, 17389, 678, 17397, 679, 17396, 680, 17393, 681, 17396, 682, 17401, 683, 17401, 684, 17401, 685, 17398, 686, 17424, 687, 17428, 688, 17429, 689, 17429, 690, 17435, 691, 17440, 692, 17440, 693, 17446, 694, 17450, 695, 17446, 696, 17448, 697, 17457, 698, 17462, 699, 17488, 700, 17586, 701, 17616, 702, 17655, 703, 17667, 704, 17676, 705, 17698, 706, 17713, 707, 17717, 708, 17717, 709, 17733, 710, 17747, 711, 17749, 712, 17765, 713, 17771, 714, 17776, 715, 17775, 716, 17783, 717, 17788, 718, 17787, 719, 17854, 720, 17872, 721, 17876, 722, 17885, 723, 17889, 724, 17889]),
      },
      {
        clave: 'soundcloud', nombre: 'SoundCloud', color: '#FF5500',
        metrica: 'Plays',
        kpis: [{ label: 'Followers', valor: '8.1K' }, { label: 'Plays', valor: '693.3K' }],
        serie: serie('2024-09-02', [0, 389191, 1, 389258, 2, 389356, 3, 389427, 4, 389472, 5, 389584, 6, 389670, 7, 389758, 8, 393067, 9, 393142, 10, 393237, 11, 393370, 12, 393470, 13, 393554, 14, 393635, 15, 393728, 16, 393839, 17, 393915, 18, 394010, 19, 394134, 20, 394226, 21, 394310, 22, 394376, 23, 394491, 24, 394563, 25, 394641, 26, 394925, 27, 395179, 28, 395438, 29, 395698, 30, 395975, 31, 396231, 32, 396494, 33, 396806, 34, 397066, 35, 397328, 36, 397593, 37, 397878, 38, 401651, 39, 401922, 40, 402189, 41, 402462, 42, 402719, 43, 403021, 44, 403294, 45, 403544, 46, 403816, 47, 404140, 48, 404391, 49, 404658, 50, 404910, 51, 405207, 52, 405462, 53, 405730, 54, 406010, 55, 406293, 56, 406540, 57, 406803, 58, 407064, 59, 407320, 60, 407578, 61, 407804, 62, 408062, 63, 408290, 64, 408559, 65, 408862, 66, 409131, 67, 409423, 68, 409716, 69, 412387, 70, 414097, 71, 414350, 72, 414611, 73, 414907, 74, 415176, 75, 415444, 76, 415737, 77, 416021, 78, 416270, 79, 416543, 80, 416808, 81, 417083, 82, 417350, 83, 417612, 84, 417877, 85, 418139, 86, 418432, 87, 418698, 88, 418952, 89, 419226, 90, 419472, 91, 419777, 92, 420033, 93, 420311, 94, 420565, 95, 420824, 96, 421105, 97, 421356, 98, 421601, 99, 425102, 100, 425374, 101, 425638, 102, 425907, 103, 426170, 104, 426301, 105, 426391, 106, 426477, 107, 426608, 108, 426699, 109, 426811, 110, 427617, 111, 427706, 112, 427791, 113, 427872, 114, 427973, 115, 428043, 116, 428130, 117, 429025, 118, 429118, 119, 429220, 120, 429318, 121, 429454, 122, 429535, 123, 429643, 124, 429762, 125, 430668, 126, 430756, 127, 430844, 128, 430971, 129, 431084, 130, 433044, 131, 434098, 132, 434199, 133, 434283, 134, 434430, 135, 434933, 136, 436193, 137, 436288, 138, 437118, 139, 437196, 140, 437290, 141, 437374, 142, 437488, 143, 437578, 144, 437683, 145, 437777, 146, 438562, 147, 438654, 148, 438749, 149, 438863, 150, 438964, 151, 439059, 152, 439756, 153, 439842, 154, 439935, 155, 440019, 156, 440148, 157, 440239, 158, 440330, 159, 441086, 160, 441172, 161, 441282, 162, 441401, 163, 443163, 164, 443246, 165, 443460, 166, 444104, 167, 444192, 168, 444287, 169, 444375, 170, 444475, 171, 444581, 172, 444668, 173, 444751, 174, 444819, 175, 444937, 176, 445003, 177, 445110, 178, 445181, 179, 445306, 180, 445394, 181, 445463, 182, 445597, 183, 445665, 184, 445778, 185, 445846, 186, 445913, 187, 445978, 188, 446044, 189, 446218, 190, 446286, 191, 448656, 192, 448741, 193, 448917, 194, 449351, 195, 449416, 196, 449551, 197, 449620, 198, 449733, 199, 449798, 200, 449912, 201, 450907, 202, 450976, 203, 451115, 204, 451183, 205, 451325, 206, 451391, 207, 451492, 208, 452264, 209, 452330, 210, 452446, 211, 452513, 212, 452628, 213, 452701, 214, 452804, 215, 452883, 216, 452949, 217, 453104, 218, 453169, 219, 453239, 220, 453306, 221, 456708, 222, 456774, 223, 456841, 224, 459056, 225, 459123, 226, 459720, 227, 459802, 228, 459901, 229, 459969, 230, 460563, 231, 460712, 232, 460782, 233, 460896, 234, 464943, 235, 465049, 236, 465114, 237, 465182, 238, 465257, 239, 465352, 240, 465513, 241, 466846, 242, 466939, 243, 467004, 244, 467075, 245, 467798, 246, 467871, 247, 467985, 248, 468051, 249, 468152, 250, 471349, 251, 471416, 252, 471538, 253, 471602, 254, 471731, 255, 471799, 256, 471903, 257, 473143, 258, 473227, 259, 473373, 260, 473457, 261, 473633, 262, 473719, 263, 473850, 264, 474841, 265, 474924, 266, 475060, 267, 475142, 268, 475258, 269, 475343, 270, 475455, 271, 476527, 272, 476599, 273, 476745, 274, 476825, 275, 476976, 276, 477066, 277, 477198, 278, 478493, 279, 478574, 280, 478715, 281, 482343, 282, 482525, 283, 482628, 284, 482764, 285, 483896, 286, 483986, 287, 484110, 288, 484211, 289, 484387, 290, 484468, 291, 484582, 292, 485854, 293, 485933, 294, 486069, 295, 486142, 296, 486292, 297, 486381, 298, 486503, 299, 487919, 300, 487999, 301, 488140, 302, 488227, 303, 488388, 304, 488478, 305, 488587, 306, 490003, 307, 490110, 308, 490266, 309, 490377, 310, 490550, 311, 494124, 312, 494282, 313, 495655, 314, 495767, 315, 495933, 316, 496049, 317, 496228, 318, 496352, 319, 496508, 320, 497910, 321, 498041, 322, 498218, 323, 498337, 324, 499338, 325, 499476, 326, 499621, 327, 499763, 328, 499884, 329, 500037, 330, 500166, 331, 500331, 332, 500433, 333, 500555, 334, 500742, 335, 500840, 336, 500987, 337, 501089, 338, 501260, 339, 501362, 340, 501519, 341, 502107, 342, 506057, 343, 506270, 344, 506444, 345, 508210, 346, 508380, 347, 508618, 348, 509595, 349, 509769, 350, 510012, 351, 510113, 352, 510296, 353, 510394, 354, 510543, 355, 511402, 356, 511504, 357, 511661, 358, 511764, 359, 512821, 360, 512921, 361, 513070, 362, 513562, 363, 513666, 364, 513823, 365, 513921, 366, 514084, 367, 514185, 368, 514334, 369, 514833, 370, 514936, 371, 515066, 372, 515166, 373, 520023, 374, 520127, 375, 520269, 376, 520676, 377, 520777, 378, 520924, 379, 521026, 380, 521174, 381, 521277, 382, 521405, 383, 521864, 384, 521964, 385, 522099, 386, 522202, 387, 523709, 388, 523808, 389, 523936, 390, 524370, 391, 524473, 392, 524608, 393, 524707, 394, 524867, 395, 524968, 396, 525099, 397, 525443, 398, 525543, 399, 525681, 400, 525782, 401, 527586, 402, 527687, 403, 531395, 404, 531704, 405, 531805, 406, 531937, 407, 532037, 408, 532193, 409, 532293, 410, 532457, 411, 532809, 412, 532908, 413, 533050, 414, 533150, 415, 535044, 416, 535146, 417, 535281, 418, 535647, 419, 535744, 420, 535887, 421, 535991, 422, 536153, 423, 536253, 424, 536375, 425, 536724, 426, 536826, 427, 536979, 428, 537081, 429, 537209, 430, 537309, 431, 537420, 432, 537851, 433, 537934, 434, 541363, 435, 541442, 436, 545981, 437, 546060, 438, 546176, 439, 546576, 440, 546656, 441, 546774, 442, 546855, 443, 546993, 444, 547073, 445, 547186, 446, 547658, 447, 547738, 448, 547858, 449, 547937, 450, 550563, 451, 550643, 452, 550744, 453, 551168, 454, 551244, 455, 551355, 456, 551436, 457, 551571, 458, 551649, 459, 551744, 460, 552164, 461, 552244, 462, 552346, 463, 552428, 464, 557962, 465, 558043, 466, 558139, 467, 558217, 468, 558298, 469, 558410, 470, 558489, 471, 558654, 472, 558736, 473, 558846, 474, 559569, 475, 559651, 476, 559777, 477, 559857, 478, 562283, 479, 562361, 480, 562455, 481, 562796, 482, 562876, 483, 562977, 484, 563059, 485, 563202, 486, 563282, 487, 563382, 488, 563704, 489, 563783, 490, 563885, 491, 563963, 492, 566338, 493, 566417, 494, 566529, 495, 570156, 496, 570238, 497, 570379, 498, 570459, 499, 570622, 500, 570701, 501, 570794, 502, 571084, 503, 571162, 504, 571268, 505, 571348, 506, 574630, 507, 574789, 508, 574890, 509, 575220, 510, 575303, 511, 575425, 512, 575501, 513, 575637, 514, 575717, 515, 575836, 516, 576232, 517, 576310, 518, 576472, 519, 576554, 520, 576743, 521, 576824, 522, 576935, 523, 577293, 524, 577399, 525, 577554, 526, 581257, 527, 585873, 528, 585990, 529, 586148, 530, 586523, 531, 586659, 532, 586800, 533, 586907, 534, 587145, 535, 587246, 536, 587388, 537, 587719, 538, 587836, 539, 587953, 540, 588053, 541, 592035, 542, 592125, 543, 592274, 544, 592561, 545, 592676, 546, 592814, 547, 592982, 548, 596887, 549, 597001, 550, 597561, 551, 597694, 552, 597777, 553, 598527, 554, 598646, 555, 600024, 556, 600133, 557, 600618, 558, 600753, 559, 600867, 560, 601613, 561, 601721, 562, 603107, 563, 603242, 564, 603822, 565, 603976, 566, 604112, 567, 604893, 568, 605037, 569, 606448, 570, 606627, 571, 607227, 572, 607424, 573, 607570, 574, 608353, 575, 608460, 576, 608650, 577, 608767, 578, 608905, 579, 609273, 580, 609377, 581, 609524, 582, 609627, 583, 611583, 584, 611679, 585, 611773, 586, 612258, 587, 612411, 588, 612629, 589, 612774, 590, 613011, 591, 613170, 592, 613354, 593, 613721, 594, 613883, 595, 614080, 596, 614238, 597, 614374, 598, 614532, 599, 614801, 600, 615207, 601, 615348, 602, 615536, 603, 615679, 604, 615926, 605, 616076, 606, 616210, 607, 616661, 608, 616806, 609, 617021, 610, 617168, 611, 617384, 612, 617532, 613, 617659, 614, 618186, 615, 618267, 616, 618441, 617, 618495, 618, 626513, 619, 626583, 620, 626679, 621, 629601, 622, 629666, 623, 629749, 624, 629811, 625, 629951, 626, 629997, 627, 630144, 628, 631453, 629, 631505, 630, 631598, 631, 631653, 632, 634773, 633, 634825, 634, 634922, 635, 635968, 636, 636022, 637, 636092, 638, 636141, 639, 636188, 640, 636251, 641, 636345, 642, 637409, 643, 637460, 644, 637520, 645, 637566, 646, 637614, 647, 637659, 648, 637779, 649, 638944, 650, 638990, 651, 639073, 652, 639122, 653, 639483, 654, 639538, 655, 639620, 656, 640437, 657, 640484, 658, 640532, 659, 640628, 660, 646167, 661, 646219, 662, 646297, 663, 647326, 664, 647392, 665, 647471, 666, 647526, 667, 647640, 668, 647705, 669, 647781, 670, 647829, 671, 647930, 672, 648018, 673, 648076, 674, 648120, 675, 648188, 676, 648237, 677, 649361, 678, 649427, 679, 649568, 680, 649625, 681, 649757, 682, 649811, 683, 649885, 684, 650359, 685, 650473, 686, 655312, 687, 655400, 688, 669210, 689, 669301, 690, 669754, 691, 669839, 692, 669914, 693, 670615, 694, 670700, 695, 672052, 696, 672142, 697, 672600, 698, 672694, 699, 672789, 700, 673415, 701, 673508, 702, 674770, 703, 674874, 704, 675968, 705, 676077, 706, 676151, 707, 676794, 708, 676858, 709, 681799, 710, 681895, 711, 682213, 712, 682323, 713, 682696, 714, 683679, 715, 684091, 716, 685829, 717, 686219, 718, 686948, 719, 687287, 720, 687665, 721, 688433, 722, 688826, 723, 690566, 724, 690974, 725, 691673, 726, 692027, 727, 692352, 728, 693029, 729, 693323, 730, 743339]),
      },
      {
        clave: 'apple_music', nombre: 'Apple Music', color: '#FA243C',
        metrica: 'Playlists',
        kpis: [{ label: 'Playlists', valor: '2' }, { label: 'Playlist reach', valor: '—' }, { label: 'Charts', valor: '1' }],
        serie: serie('2024-09-02', [0, 2, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 16, 2, 17, 2, 18, 2, 19, 2, 20, 2, 21, 2, 22, 2, 23, 2, 24, 2, 25, 2, 26, 2, 27, 2, 28, 2, 29, 2, 30, 2, 31, 3, 32, 3, 33, 3, 34, 3, 35, 3, 36, 3, 37, 3, 38, 3, 39, 3, 40, 3, 41, 3, 42, 3, 43, 3, 44, 3, 45, 3, 46, 3, 47, 3, 48, 3, 49, 3, 50, 3, 51, 3, 52, 3, 53, 3, 54, 3, 55, 3, 56, 3, 57, 3, 58, 3, 59, 3, 60, 3, 61, 3, 62, 3, 63, 3, 64, 3, 65, 3, 66, 3, 67, 3, 68, 3, 69, 3, 70, 3, 71, 3, 72, 3, 73, 3, 74, 3, 75, 3, 76, 3, 77, 3, 78, 3, 79, 3, 80, 3, 81, 3, 82, 3, 83, 3, 84, 3, 85, 3, 86, 3, 87, 3, 88, 3, 89, 3, 90, 3, 91, 3, 92, 3, 93, 3, 94, 3, 95, 3, 96, 3, 97, 3, 98, 3, 99, 3, 100, 3, 101, 2, 102, 2, 103, 2, 104, 2, 105, 2, 106, 2, 107, 2, 108, 2, 109, 2, 110, 2, 111, 2, 112, 2, 113, 2, 114, 2, 115, 2, 116, 2, 117, 2, 118, 2, 119, 2, 120, 2, 121, 2, 122, 2, 123, 2, 124, 2, 125, 2, 126, 2, 127, 2, 128, 2, 129, 2, 130, 2, 131, 2, 132, 2, 133, 2, 134, 2, 135, 2, 136, 2, 137, 2, 138, 2, 139, 2, 140, 2, 141, 2, 142, 2, 143, 2, 144, 2, 145, 2, 146, 2, 147, 2, 148, 2, 149, 2, 150, 2, 151, 2, 152, 2, 153, 2, 154, 2, 155, 2, 156, 2, 157, 2, 158, 2, 159, 2, 160, 2, 161, 2, 162, 2, 163, 2, 164, 2, 165, 2, 166, 2, 167, 2, 168, 2, 169, 2, 170, 2, 171, 2, 172, 2, 173, 2, 174, 2, 175, 2, 176, 2, 177, 2, 178, 2, 179, 2, 180, 2, 181, 2, 182, 2, 183, 2, 184, 2, 185, 2, 186, 2, 187, 2, 188, 2, 189, 2, 190, 2, 191, 2, 192, 2, 193, 2, 194, 2, 195, 2, 196, 2, 197, 2, 198, 2, 199, 2, 200, 2, 201, 2, 202, 2, 203, 2, 204, 2, 205, 2, 206, 2, 207, 2, 208, 2, 209, 2, 210, 2, 211, 2, 212, 2, 213, 2, 214, 2, 215, 2, 216, 2, 217, 2, 218, 2, 219, 2, 220, 2, 221, 2, 222, 2, 223, 2, 224, 2, 225, 2, 226, 2, 227, 2, 228, 2, 229, 2, 230, 2, 231, 2, 232, 2, 233, 2, 234, 2, 235, 2, 236, 2, 237, 2, 238, 2, 239, 2, 240, 2, 241, 2, 242, 2, 243, 2, 244, 2, 245, 2, 246, 2, 247, 2, 248, 2, 249, 2, 250, 2, 251, 2, 252, 2, 253, 2, 254, 2, 255, 2, 256, 2, 257, 2, 258, 2, 259, 2, 260, 2, 261, 2, 262, 2, 263, 2, 264, 2, 265, 2, 266, 2, 267, 2, 268, 2, 269, 2, 270, 2, 271, 2, 272, 2, 273, 2, 274, 2, 275, 2, 276, 2, 277, 2, 278, 2, 279, 2, 280, 2, 281, 2, 282, 2, 283, 2, 284, 2, 285, 2, 286, 2, 287, 2, 288, 2, 289, 2, 290, 2, 291, 2, 292, 2, 293, 2, 294, 2, 295, 2, 296, 2, 297, 2, 298, 2, 299, 2, 300, 2, 301, 2, 302, 2, 303, 2, 304, 2, 305, 2, 306, 2, 307, 2, 308, 2, 309, 2, 310, 2, 311, 2, 312, 2, 313, 2, 314, 2, 315, 2, 316, 2, 317, 2, 318, 2, 319, 2, 320, 2, 321, 2, 322, 2, 323, 2, 324, 2, 325, 2, 326, 2, 327, 2, 328, 2, 329, 2, 330, 2, 331, 2, 332, 2, 333, 2, 334, 2, 335, 2, 336, 2, 337, 2, 338, 2, 339, 2, 340, 2, 341, 2, 342, 2, 343, 2, 344, 2, 345, 2, 346, 2, 347, 2, 348, 2, 349, 2, 350, 2, 351, 2, 352, 2, 353, 2, 354, 2, 355, 2, 356, 2, 357, 2, 358, 2, 359, 2, 360, 2, 361, 2, 362, 2, 363, 2, 364, 2, 365, 2, 366, 2, 367, 2, 368, 2, 369, 2, 370, 2, 371, 2, 372, 2, 373, 2, 374, 2, 375, 2, 376, 2, 377, 2, 378, 2, 379, 2, 380, 2, 381, 2, 382, 2, 383, 2, 384, 2, 385, 2, 386, 2, 387, 2, 388, 2, 389, 2, 390, 2, 391, 2, 392, 2, 393, 2, 394, 2, 395, 2, 396, 2, 397, 2, 398, 2, 399, 2, 400, 2, 401, 2, 402, 2, 403, 2, 404, 2, 405, 2, 406, 2, 407, 2, 408, 2, 409, 2, 410, 2, 411, 2, 412, 2, 413, 2, 414, 2, 415, 2, 416, 2, 417, 2, 418, 2, 419, 2, 420, 2, 421, 2, 422, 2, 423, 2, 424, 2, 425, 2, 426, 2, 427, 2, 428, 2, 429, 2, 430, 2, 431, 2, 432, 2, 433, 2, 434, 2, 435, 2, 436, 2, 437, 2, 438, 2, 439, 2, 440, 2, 441, 2, 442, 2, 443, 2, 444, 2, 445, 2, 446, 2, 447, 2, 448, 2, 449, 2, 450, 2, 451, 2, 452, 2, 453, 2, 454, 2, 455, 2, 456, 2, 457, 2, 458, 2, 459, 2, 460, 2, 461, 2, 462, 2, 463, 2, 464, 2, 465, 2, 466, 2, 467, 2, 468, 2, 469, 2, 470, 2, 471, 2, 472, 2, 473, 2, 474, 2, 475, 2, 476, 2, 477, 2, 478, 2, 479, 2, 480, 2, 481, 2, 482, 2, 483, 2, 484, 2, 485, 2, 486, 2, 487, 2, 488, 2, 489, 2, 490, 2, 491, 2, 492, 2, 493, 2, 494, 2, 495, 2, 496, 2, 497, 2, 498, 2, 499, 2, 500, 2, 501, 2, 502, 2, 503, 2, 504, 2, 505, 2, 506, 2, 507, 2, 508, 2, 509, 2, 510, 2, 511, 2, 512, 2, 513, 2, 514, 2, 515, 2, 516, 2, 517, 2, 518, 2, 519, 2, 520, 2, 521, 2, 522, 4, 523, 4, 524, 4, 525, 4, 526, 4, 527, 4, 528, 4, 529, 4, 530, 3, 531, 3, 532, 3, 533, 3, 534, 3, 535, 3, 536, 3, 537, 3, 538, 3, 539, 3, 540, 3, 541, 3, 542, 3, 543, 3, 544, 3, 545, 3, 546, 3, 547, 3, 548, 3, 549, 3, 550, 3, 551, 3, 552, 3, 553, 3, 554, 3, 555, 3, 556, 3, 557, 3, 558, 3, 559, 3, 560, 3, 561, 3, 562, 3, 563, 3, 564, 3, 565, 3, 566, 3, 567, 3, 568, 3, 569, 3, 570, 3, 571, 3, 572, 3, 573, 3, 574, 3, 575, 3, 576, 3, 577, 3, 578, 3, 579, 3, 580, 3, 581, 3, 582, 3, 583, 3, 584, 3, 585, 3, 586, 3, 587, 3, 588, 3, 589, 3, 590, 3, 591, 3, 592, 3, 593, 3, 594, 3, 595, 3, 596, 3, 597, 3, 598, 3, 599, 3, 600, 3, 601, 3, 602, 3, 603, 3, 604, 3, 605, 3, 606, 3, 607, 3, 608, 3, 609, 3, 610, 3, 611, 3, 612, 3, 613, 3, 614, 3, 615, 3, 616, 3, 617, 3, 618, 3, 619, 3, 620, 3, 621, 3, 622, 3, 623, 3, 624, 3, 625, 3, 626, 3, 627, 3, 628, 3, 629, 3, 630, 3, 631, 3, 632, 3, 633, 3, 634, 3, 635, 3, 636, 3, 637, 3, 638, 3, 639, 3, 640, 3, 641, 3, 642, 3, 643, 3, 644, 3, 645, 3, 646, 3, 647, 3, 648, 3, 649, 3, 650, 3, 651, 3, 652, 3, 653, 3, 654, 3, 655, 3, 656, 3, 657, 3, 658, 3, 659, 3, 660, 3, 661, 3, 662, 3, 663, 3, 664, 3, 665, 3, 666, 3, 667, 3, 668, 3, 669, 3, 670, 3, 671, 3, 672, 3, 673, 3, 674, 3, 675, 3, 676, 3, 677, 3, 678, 3, 679, 3, 680, 3, 681, 3, 682, 3, 683, 3, 684, 3, 685, 3, 686, 3, 687, 3, 688, 3, 689, 3, 690, 3, 691, 3, 692, 3, 693, 3, 694, 3, 695, 3, 696, 3, 697, 3, 698, 3, 699, 3, 700, 3, 701, 3, 702, 3, 703, 3, 704, 3, 705, 3, 706, 3, 707, 3, 708, 3, 709, 3, 710, 3, 711, 2, 712, 2, 713, 2, 714, 2, 715, 2, 716, 2, 717, 2, 718, 2, 719, 2, 720, 2, 721, 2, 722, 2, 723, 2, 724, 2, 725, 2, 726, 2, 727, 2, 728, 2, 729, 2, 730, 2]),
      },
      {
        clave: 'amazon', nombre: 'Amazon', color: '#FF9900',
        metrica: 'Playlists',
        kpis: [{ label: 'Playlists', valor: '4' }, { label: 'Charts', valor: '0' }],
        serie: serie('2024-09-02', [0, 14, 1, 14, 2, 14, 3, 13, 677, 1, 678, 1, 679, 1, 680, 2, 681, 2, 682, 2, 683, 2, 684, 2, 685, 2, 686, 2, 687, 2, 688, 2, 689, 2, 690, 2, 691, 2, 692, 2, 693, 2, 694, 2, 695, 2, 696, 3, 697, 3, 698, 3, 699, 3, 700, 3, 701, 3, 702, 3, 703, 3, 704, 3, 705, 3, 706, 3, 707, 3, 708, 3, 709, 3, 710, 3, 711, 3, 712, 3, 713, 3, 714, 3, 715, 3, 716, 3, 717, 3, 718, 3, 719, 3, 720, 3, 721, 3, 722, 3, 723, 3, 724, 3, 725, 3, 726, 3, 727, 4, 728, 4, 729, 4, 730, 4]),
      },
      {
        clave: 'deezer', nombre: 'Deezer', color: '#A238FF',
        metrica: 'Followers',
        kpis: [{ label: 'Followers', valor: '678' }, { label: 'Playlists', valor: '1' }],
        serie: serie('2024-09-04', [0, 619, 1, 619, 2, 619, 3, 619, 4, 619, 5, 619, 6, 619, 7, 619, 8, 619, 9, 619, 10, 619, 11, 619, 12, 619, 13, 619, 14, 619, 15, 619, 16, 619, 17, 619, 18, 619, 19, 619, 20, 619, 21, 619, 22, 619, 23, 619, 24, 619, 25, 619, 26, 619, 27, 619, 28, 619, 29, 619, 30, 619, 31, 619, 32, 619, 33, 619, 34, 619, 35, 619, 36, 619, 37, 619, 38, 619, 39, 619, 40, 619, 41, 619, 42, 620, 43, 620, 44, 620, 45, 620, 46, 620, 47, 620, 48, 620, 49, 620, 50, 620, 51, 620, 52, 620, 53, 620, 54, 620, 55, 620, 56, 620, 57, 620, 58, 620, 59, 620, 60, 620, 61, 620, 62, 620, 63, 620, 64, 620, 65, 620, 66, 620, 67, 620, 68, 620, 69, 620, 70, 620, 71, 620, 72, 620, 73, 620, 74, 620, 75, 620, 76, 620, 77, 620, 78, 620, 79, 620, 80, 620, 81, 620, 82, 620, 83, 620, 84, 621, 85, 621, 86, 621, 87, 621, 88, 621, 89, 621, 90, 621, 91, 621, 92, 621, 93, 621, 94, 621, 95, 621, 96, 621, 97, 621, 98, 621, 99, 621, 100, 621, 101, 621, 102, 621, 103, 621, 104, 621, 105, 621, 106, 622, 107, 622, 108, 622, 109, 622, 110, 622, 111, 622, 112, 622, 113, 622, 114, 622, 115, 622, 116, 622, 117, 622, 118, 622, 119, 623, 120, 623, 121, 623, 122, 623, 123, 623, 124, 623, 125, 623, 126, 624, 127, 624, 128, 624, 129, 624, 130, 624, 131, 624, 132, 624, 133, 624, 134, 624, 135, 624, 136, 624, 137, 624, 138, 624, 139, 624, 140, 624, 141, 624, 142, 624, 143, 624, 144, 624, 145, 624, 146, 624, 147, 624, 148, 624, 149, 624, 150, 624, 151, 624, 152, 624, 153, 624, 154, 624, 155, 624, 156, 624, 157, 624, 158, 624, 159, 624, 160, 624, 161, 624, 162, 624, 163, 624, 164, 624, 165, 624, 166, 624, 167, 624, 168, 624, 169, 624, 170, 624, 171, 624, 172, 624, 173, 624, 174, 624, 175, 624, 176, 624, 177, 624, 178, 624, 179, 624, 180, 624, 181, 624, 182, 625, 183, 625, 184, 625, 185, 625, 186, 625, 187, 625, 188, 625, 189, 627, 190, 627, 191, 627, 192, 627, 193, 627, 194, 627, 195, 627, 196, 627, 197, 627, 198, 627, 199, 627, 200, 627, 201, 627, 202, 627, 203, 627, 204, 627, 205, 627, 206, 627, 207, 627, 208, 627, 209, 627, 210, 627, 211, 628, 212, 628, 213, 628, 214, 628, 215, 628, 216, 628, 217, 628, 218, 628, 219, 628, 220, 628, 221, 628, 222, 628, 223, 628, 224, 628, 225, 628, 226, 628, 227, 628, 228, 628, 229, 628, 230, 628, 231, 628, 232, 628, 233, 628, 234, 628, 235, 628, 236, 628, 237, 628, 238, 628, 239, 628, 240, 628, 241, 628, 242, 628, 243, 628, 244, 628, 245, 628, 246, 628, 247, 629, 248, 629, 249, 629, 250, 629, 251, 629, 252, 629, 253, 630, 254, 630, 255, 630, 256, 630, 257, 630, 258, 630, 259, 631, 260, 631, 261, 631, 262, 631, 263, 631, 264, 631, 265, 631, 266, 632, 267, 632, 268, 632, 269, 632, 270, 632, 271, 632, 272, 632, 273, 633, 274, 633, 275, 633, 276, 633, 277, 633, 278, 633, 279, 633, 280, 633, 281, 633, 282, 633, 283, 633, 284, 633, 285, 633, 286, 633, 287, 633, 288, 633, 289, 633, 290, 633, 291, 633, 292, 633, 293, 633, 294, 633, 295, 633, 296, 633, 297, 633, 298, 633, 299, 633, 300, 633, 301, 633, 302, 633, 303, 633, 304, 633, 305, 633, 306, 633, 307, 633, 308, 633, 309, 633, 310, 633, 311, 633, 312, 633, 313, 633, 314, 633, 315, 633, 316, 633, 317, 634, 318, 634, 319, 634, 320, 634, 321, 634, 322, 634, 323, 634, 324, 635, 325, 635, 326, 635, 327, 635, 328, 635, 329, 635, 330, 635, 331, 635, 332, 635, 333, 635, 334, 635, 335, 635, 336, 636, 337, 636, 338, 636, 339, 636, 340, 636, 341, 636, 342, 636, 343, 636, 344, 636, 345, 636, 346, 636, 347, 636, 348, 636, 349, 636, 350, 636, 351, 636, 352, 636, 353, 636, 354, 636, 355, 636, 356, 636, 357, 636, 358, 637, 359, 637, 360, 637, 361, 637, 362, 637, 363, 637, 364, 638, 365, 638, 366, 638, 367, 638, 368, 638, 369, 638, 370, 638, 371, 638, 372, 638, 373, 638, 374, 638, 375, 638, 376, 638, 377, 638, 378, 638, 379, 639, 380, 639, 381, 639, 382, 639, 383, 639, 384, 639, 385, 639, 386, 639, 387, 639, 388, 639, 389, 639, 390, 639, 391, 639, 392, 640, 393, 640, 394, 640, 395, 640, 396, 640, 397, 640, 398, 640, 399, 642, 400, 642, 401, 642, 402, 642, 403, 642, 404, 642, 405, 642, 406, 642, 407, 642, 408, 642, 409, 642, 410, 642, 411, 642, 412, 642, 413, 642, 414, 643, 415, 643, 416, 643, 417, 643, 418, 643, 419, 643, 420, 643, 421, 645, 422, 645, 423, 645, 424, 645, 425, 645, 426, 645, 427, 646, 428, 646, 429, 646, 430, 646, 431, 646, 432, 646, 433, 646, 434, 646, 435, 646, 436, 646, 437, 646, 438, 646, 439, 646, 440, 646, 441, 646, 442, 646, 443, 646, 444, 646, 445, 646, 446, 646, 447, 646, 448, 646, 449, 647, 450, 647, 451, 647, 452, 647, 453, 647, 454, 647, 455, 647, 456, 647, 457, 647, 458, 647, 459, 647, 460, 647, 461, 647, 462, 647, 463, 647, 464, 647, 465, 647, 466, 647, 467, 647, 468, 647, 469, 647, 470, 647, 471, 647, 472, 647, 473, 647, 474, 647, 475, 647, 476, 647, 477, 647, 478, 647, 479, 647, 480, 647, 481, 647, 482, 647, 483, 649, 484, 649, 485, 649, 486, 649, 487, 649, 488, 649, 489, 649, 490, 649, 491, 649, 492, 649, 493, 649, 494, 649, 495, 649, 496, 649, 497, 649, 498, 649, 499, 649, 500, 649, 501, 649, 502, 649, 503, 649, 504, 649, 505, 649, 506, 649, 507, 649, 508, 649, 509, 649, 510, 649, 511, 649, 512, 649, 513, 649, 514, 649, 515, 649, 516, 649, 517, 649, 518, 649, 519, 649, 520, 649, 521, 649, 522, 649, 523, 649, 524, 649, 525, 649, 526, 651, 527, 651, 528, 651, 529, 651, 530, 651, 531, 651, 532, 651, 533, 651, 534, 651, 535, 651, 536, 651, 537, 651, 538, 651, 539, 651, 540, 651, 541, 651, 542, 651, 543, 651, 544, 651, 545, 651, 546, 651, 547, 652, 548, 652, 549, 652, 550, 652, 551, 652, 552, 652, 553, 652, 554, 652, 555, 652, 556, 652, 557, 652, 558, 652, 559, 652, 560, 652, 561, 652, 562, 652, 563, 652, 564, 652, 565, 652, 566, 652, 567, 652, 568, 653, 569, 653, 570, 653, 571, 653, 572, 653, 573, 653, 574, 653, 575, 653, 576, 653, 577, 653, 578, 653, 579, 654, 580, 654, 581, 654, 582, 654, 583, 655, 584, 655, 585, 655, 586, 655, 587, 655, 588, 655, 589, 656, 590, 656, 591, 657, 592, 657, 593, 657, 594, 657, 595, 657, 596, 657, 597, 657, 598, 657, 599, 657, 600, 657, 601, 657, 602, 657, 603, 657, 604, 658, 605, 658, 606, 658, 607, 658, 608, 659, 609, 659, 610, 659, 611, 659, 612, 660, 613, 661, 614, 661, 615, 664, 616, 664, 617, 664, 618, 664, 619, 665, 620, 665, 621, 665, 622, 665, 623, 665, 624, 665, 625, 665, 626, 665, 627, 665, 628, 665, 629, 665, 630, 665, 631, 665, 632, 665, 633, 665, 634, 665, 635, 665, 636, 665, 637, 665, 638, 665, 639, 665, 640, 665, 641, 665, 642, 665, 643, 665, 644, 665, 645, 666, 646, 668, 647, 668, 648, 668, 649, 668, 650, 668, 651, 668, 652, 668, 653, 669, 654, 669, 655, 669, 656, 669, 657, 669, 658, 669, 659, 669, 660, 669, 661, 669, 662, 669, 663, 670, 664, 670, 665, 670, 666, 671, 667, 671, 668, 671, 669, 671, 670, 671, 671, 671, 672, 671, 673, 671, 674, 671, 675, 671, 676, 671, 677, 671, 678, 671, 679, 671, 680, 671, 681, 672, 682, 672, 683, 672, 684, 672, 685, 672, 686, 672, 687, 673, 688, 674, 689, 674, 690, 675, 691, 675, 692, 675, 693, 675, 694, 675, 695, 675, 696, 675, 697, 675, 698, 675, 699, 675, 700, 675, 701, 676, 702, 677, 703, 677, 704, 677, 705, 677, 706, 677, 707, 677, 708, 677, 709, 677, 710, 677, 711, 677, 712, 677, 713, 677, 714, 677, 715, 677, 716, 677, 717, 677, 718, 677, 719, 678, 720, 678, 721, 678, 722, 678, 723, 678, 724, 678, 725, 678, 726, 678, 727, 678, 728, 678]),
      },
      {
        clave: 'tidal', nombre: 'Tidal', color: '#00FFFF',
        metrica: 'Playlists',
        kpis: [{ label: 'Playlists', valor: '108' }, { label: 'Charts', valor: '0' }],
        serie: serie('2024-09-02', [0, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 13, 3, 14, 3, 15, 3, 16, 3, 17, 3, 18, 3, 19, 3, 20, 3, 21, 3, 22, 3, 23, 3, 24, 3, 25, 3, 26, 3, 27, 3, 28, 3, 29, 3, 30, 3, 31, 3, 32, 3, 33, 3, 34, 3, 35, 3, 36, 3, 37, 3, 38, 3, 39, 3, 40, 3, 41, 3, 42, 3, 43, 3, 44, 3, 45, 3, 46, 3, 47, 3, 48, 3, 49, 3, 50, 3, 51, 3, 52, 3, 53, 3, 54, 3, 55, 3, 56, 3, 57, 3, 58, 3, 59, 3, 60, 3, 61, 3, 62, 3, 63, 3, 64, 3, 65, 3, 66, 3, 67, 3, 68, 3, 69, 3, 70, 3, 71, 3, 72, 3, 73, 3, 74, 3, 75, 3, 76, 3, 77, 3, 78, 3, 79, 3, 80, 3, 81, 3, 82, 3, 83, 3, 84, 3, 85, 3, 86, 3, 87, 3, 88, 3, 89, 3, 90, 3, 91, 3, 92, 3, 93, 3, 94, 3, 95, 3, 96, 3, 97, 3, 98, 3, 99, 3, 100, 3, 101, 3, 102, 3, 103, 3, 104, 3, 105, 3, 106, 3, 107, 3, 108, 3, 109, 3, 110, 3, 111, 3, 112, 3, 113, 3, 114, 3, 115, 3, 116, 3, 117, 3, 118, 3, 119, 3, 120, 3, 121, 3, 122, 3, 123, 3, 124, 3, 125, 3, 126, 3, 127, 3, 128, 3, 129, 3, 130, 3, 131, 3, 132, 3, 133, 3, 134, 3, 135, 3, 136, 3, 137, 3, 138, 3, 139, 3, 140, 3, 141, 3, 142, 3, 143, 3, 144, 3, 145, 3, 146, 3, 147, 3, 148, 3, 149, 3, 150, 3, 151, 3, 152, 3, 153, 3, 154, 3, 155, 3, 156, 3, 157, 3, 158, 3, 159, 3, 160, 3, 161, 3, 162, 3, 163, 3, 164, 3, 165, 3, 166, 3, 167, 3, 168, 3, 169, 3, 170, 3, 171, 3, 172, 3, 173, 3, 174, 3, 175, 3, 176, 3, 177, 3, 178, 3, 179, 3, 180, 3, 181, 3, 182, 3, 183, 3, 184, 3, 185, 3, 186, 3, 187, 3, 188, 3, 189, 3, 190, 3, 191, 3, 192, 3, 193, 3, 194, 3, 195, 3, 196, 3, 197, 3, 198, 3, 199, 3, 200, 3, 201, 3, 202, 3, 203, 3, 204, 3, 205, 3, 206, 3, 207, 3, 208, 3, 209, 3, 210, 3, 211, 3, 212, 3, 213, 3, 214, 3, 215, 3, 216, 3, 217, 3, 218, 3, 219, 3, 220, 3, 221, 3, 222, 3, 223, 3, 224, 3, 225, 3, 226, 3, 227, 3, 228, 3, 229, 3, 230, 3, 231, 3, 232, 3, 233, 3, 234, 3, 235, 3, 236, 3, 237, 3, 238, 3, 239, 3, 240, 3, 241, 3, 242, 3, 243, 3, 244, 3, 245, 3, 246, 3, 247, 3, 248, 3, 249, 3, 250, 3, 251, 3, 252, 3, 253, 3, 254, 3, 255, 3, 256, 3, 257, 3, 258, 3, 259, 3, 260, 3, 261, 3, 262, 3, 263, 3, 264, 3, 265, 3, 266, 3, 267, 3, 268, 3, 269, 3, 270, 3, 271, 3, 272, 3, 273, 3, 274, 3, 275, 3, 276, 3, 277, 3, 278, 3, 279, 3, 280, 3, 281, 3, 282, 3, 283, 3, 284, 3, 285, 3, 286, 3, 287, 3, 288, 3, 289, 3, 290, 3, 291, 3, 292, 3, 293, 3, 294, 3, 295, 3, 296, 3, 297, 3, 298, 3, 299, 3, 300, 3, 301, 3, 302, 3, 303, 3, 304, 3, 305, 3, 306, 3, 307, 3, 308, 3, 309, 3, 310, 3, 311, 3, 312, 3, 313, 3, 314, 3, 315, 3, 316, 3, 317, 3, 318, 3, 319, 3, 320, 3, 321, 3, 322, 3, 323, 3, 324, 3, 325, 3, 326, 3, 327, 3, 328, 3, 329, 3, 330, 3, 331, 3, 332, 3, 333, 3, 334, 3, 335, 3, 336, 3, 337, 3, 338, 3, 339, 3, 340, 3, 341, 3, 342, 3, 343, 3, 344, 3, 345, 3, 346, 3, 347, 3, 348, 3, 349, 3, 350, 3, 351, 3, 352, 3, 353, 3, 354, 3, 355, 3, 356, 3, 357, 3, 358, 3, 359, 3, 360, 3, 361, 3, 362, 3, 363, 3, 364, 3, 365, 3, 366, 3, 367, 3, 368, 3, 369, 3, 370, 3, 371, 3, 372, 3, 373, 3, 374, 3, 375, 3, 376, 3, 377, 3, 378, 3, 379, 3, 380, 3, 381, 3, 382, 3, 383, 3, 384, 3, 385, 3, 386, 3, 387, 3, 388, 3, 389, 3, 390, 3, 391, 3, 392, 3, 393, 3, 394, 3, 395, 3, 396, 3, 397, 3, 398, 3, 399, 3, 400, 3, 401, 3, 402, 3, 403, 3, 404, 3, 405, 3, 406, 3, 407, 3, 408, 3, 409, 3, 410, 3, 411, 3, 412, 3, 413, 3, 414, 3, 415, 3, 416, 3, 417, 3, 418, 3, 419, 3, 420, 3, 421, 3, 422, 3, 423, 3, 424, 3, 425, 3, 426, 3, 427, 3, 428, 3, 429, 3, 430, 3, 431, 3, 432, 3, 433, 3, 434, 3, 435, 3, 436, 3, 437, 3, 438, 3, 439, 3, 440, 3, 441, 3, 442, 3, 443, 3, 444, 3, 445, 3, 446, 3, 447, 3, 448, 3, 449, 3, 450, 3, 451, 3, 452, 3, 453, 3, 454, 3, 455, 3, 456, 3, 457, 3, 458, 3, 459, 3, 460, 3, 461, 3, 462, 3, 463, 3, 464, 3, 465, 3, 466, 3, 467, 3, 468, 3, 469, 3, 470, 3, 471, 3, 472, 3, 473, 3, 474, 3, 475, 3, 476, 3, 477, 3, 478, 3, 479, 3, 480, 3, 481, 3, 482, 3, 483, 3, 484, 3, 485, 3, 486, 3, 487, 3, 488, 3, 489, 3, 490, 3, 491, 3, 492, 3, 493, 3, 494, 3, 495, 3, 496, 3, 497, 3, 498, 3, 499, 3, 500, 3, 501, 3, 502, 3, 503, 3, 504, 3, 505, 3, 506, 3, 507, 3, 508, 3, 509, 3, 510, 3, 511, 3, 512, 3, 513, 3, 514, 3, 515, 3, 516, 3, 517, 3, 518, 3, 519, 3, 520, 3, 521, 3, 522, 3, 523, 3, 524, 3, 525, 3, 526, 3, 527, 3, 528, 3, 529, 3, 530, 3, 531, 3, 532, 3, 533, 3, 534, 3, 535, 3, 536, 3, 537, 3, 538, 3, 539, 3, 540, 3, 541, 3, 542, 3, 543, 3, 544, 3, 545, 3, 546, 3, 547, 3, 548, 3, 549, 3, 550, 3, 551, 3, 552, 3, 553, 3, 554, 3, 555, 3, 556, 3, 557, 3, 558, 3, 559, 3, 560, 3, 561, 3, 562, 3, 563, 3, 564, 3, 565, 3, 566, 3, 567, 3, 568, 3, 569, 3, 570, 3, 571, 3, 572, 3, 573, 3, 574, 3, 575, 3, 576, 3, 577, 3, 578, 3, 579, 3, 580, 3, 581, 3, 582, 3, 583, 3, 584, 3, 585, 3, 586, 3, 587, 3, 588, 3, 589, 3, 590, 3, 591, 3, 592, 3, 593, 3, 594, 3, 595, 3, 596, 3, 597, 3, 598, 3, 599, 3, 600, 3, 601, 3, 602, 3, 603, 3, 604, 3, 605, 3, 606, 3, 607, 3, 608, 3, 609, 3, 610, 3, 611, 3, 612, 3, 613, 3, 614, 3, 615, 3, 616, 3, 617, 3, 618, 3, 619, 3, 620, 3, 621, 3, 622, 3, 623, 3, 624, 3, 625, 3, 626, 3, 627, 3, 628, 3, 629, 3, 630, 3, 631, 3, 632, 3, 633, 3, 634, 3, 635, 3, 636, 3, 637, 3, 638, 3, 639, 3, 640, 3, 641, 3, 642, 3, 643, 3, 644, 3, 645, 3, 646, 3, 647, 3, 648, 3, 649, 3, 650, 3, 651, 3, 652, 3, 653, 3, 654, 3, 655, 3, 656, 3, 657, 3, 658, 3, 659, 3, 660, 3, 661, 3, 662, 3, 663, 3, 664, 3, 665, 3, 666, 3, 667, 3, 668, 3, 669, 3, 670, 3, 671, 3, 672, 3, 673, 3, 674, 3, 675, 3, 676, 3, 677, 3, 678, 3, 679, 3, 680, 3, 681, 3, 682, 3, 683, 3, 684, 3, 685, 3, 686, 3, 687, 3, 690, 3, 691, 3, 692, 3, 693, 3, 694, 82, 695, 75, 696, 97, 697, 111, 698, 118, 699, 118, 700, 118, 701, 118, 702, 118, 703, 118, 704, 117, 705, 117, 706, 117, 707, 117, 708, 117, 709, 117, 710, 117, 711, 117, 712, 117, 713, 117, 714, 117, 715, 117, 716, 117, 717, 117, 718, 117, 719, 117, 720, 117, 721, 117, 722, 117, 723, 107, 724, 107, 725, 108, 726, 108, 727, 108, 728, 108, 729, 108, 730, 108]),
      },
      {
        clave: 'traxsource', nombre: 'Traxsource', color: '#000000',
        kpis: [{ label: 'Charts', valor: '17' }, { label: 'Tracks', valor: '72' }],
        serie: [],
      },
    ],
  },
  {
    id: 'dhmoon',
    nombre: 'DH Moon',
    estado: 'Escalando',
    actualizado: '2/9/2026',
    fallo: false,
    kpis: ['130.7K', '966', '1.7M', '37', '286.7K', '1', '246', '22.6K', '0'],
    topTracks: {
      'Streams': [
        { pos: 1, titulo: 'Mi Love', artistas: 'Gama, DH Moon, Moreno & Prieto', valor: '433.5K', url: 'https://songstats.com/track/tp9oa8sq/mi-love', portada: 'https://i.scdn.co/image/ab67616d00001e02cc2aa8c54d79266f01464a3d' },
        { pos: 2, titulo: 'Call Me Mor', artistas: 'Moreno & Prieto, DH Moon, Grood Taste', valor: '385.1K', url: 'https://songstats.com/track/mkqidga8/call-me-mor', portada: 'https://i.scdn.co/image/ab67616d00001e02aef502973f1c34785f950884' },
        { pos: 3, titulo: 'No Le Da', artistas: 'Moreno & Prieto, Sortech, Dany Gomez', valor: '323.2K', url: 'https://songstats.com/track/j25fsiqb/no-le-da', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0' },
        { pos: 4, titulo: 'Que Pasaría - Moreno & Prieto, DH Moon Remix', artistas: 'ART NO LOGIA, Dany Gomez, Moreno & Prieto', valor: '134.3K', url: 'https://songstats.com/track/soh49rg0/que-pasaria-moreno-prieto-dh-moon-remix', portada: 'https://i.scdn.co/image/ab67616d00001e0242e2bd3ae11437ca2f02c2ab' },
        { pos: 5, titulo: 'Sonido Estelar', artistas: 'Moreno & Prieto, Dem Boyz, DH Moon', valor: '58.7K', url: 'https://songstats.com/track/mv1nqzy2/sonido-estelar', portada: 'https://i.scdn.co/image/ab67616d00001e020f3a378589207ef43d3d4d14' },
        { pos: 6, titulo: 'Amo Tu Boca', artistas: 'Dier, Levy Sound, Nemque', valor: '55.4K', url: 'https://songstats.com/track/equr5ivx/amo-tu-boca', portada: 'https://i.scdn.co/image/ab67616d00001e0283e87cb79307a76bb1db93e0' },
        { pos: 7, titulo: 'I Don\'t Cook', artistas: 'Moreno & Prieto, DH Moon', valor: '52.6K', url: 'https://songstats.com/track/rkbxz36q/i-don-t-cook', portada: 'https://i.scdn.co/image/ab67616d00001e0202b05467004cd298034db6f1' },
        { pos: 8, titulo: 'Maybach', artistas: 'DH Moon, Wildchildz, JEREMI REID', valor: '52K', url: 'https://songstats.com/track/rgpl67fe/maybach', portada: 'https://i.scdn.co/image/ab67616d00001e025a58012fba4fa046d68eff85' },
        { pos: 9, titulo: 'Desacatá', artistas: 'Moreno & Prieto, DH Moon', valor: '43.2K', url: 'https://songstats.com/track/ezlbujck/desacata', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31' },
        { pos: 10, titulo: 'Bombo Clap', artistas: 'Moreno & Prieto, DH Moon', valor: '40K', url: 'https://songstats.com/track/hxg67wl0/bombo-clap', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31' },
        { pos: 11, titulo: 'Bum Bum Joga', artistas: 'DH Moon, Moreno & Prieto, Sortech', valor: '31.5K', url: 'https://songstats.com/track/imt6jg49/bum-bum-joga', portada: 'https://i.scdn.co/image/ab67616d00001e029b7f8d6ff124bbf592cd78e9' },
        { pos: 12, titulo: 'Who Made This', artistas: 'Moreno & Prieto, DH Moon', valor: '23.2K', url: 'https://songstats.com/track/rvqwy4uk/who-made-this', portada: 'https://i.scdn.co/image/ab67616d00001e02f74db99cca240031d45434c4' },
        { pos: 13, titulo: 'El Mañanero', artistas: 'DH Moon, PepeGoitia, JEREMI REID', valor: '20.4K', url: 'https://songstats.com/track/wl1a2yg5/el-mananero', portada: 'https://i.scdn.co/image/ab67616d00001e0276636c75fffe1337f71a3724' },
        { pos: 14, titulo: 'Hule hule', artistas: 'DH Moon, Dem Boyz, Calao Sense', valor: '11.6K', url: 'https://songstats.com/track/5396zbjc/hule-hule', portada: 'https://i.scdn.co/image/ab67616d00001e02c8fa42150b87a87d2b714f8f' },
        { pos: 15, titulo: 'Le Go', artistas: 'Moreno & Prieto, DH Moon', valor: '10.2K', url: 'https://songstats.com/track/0gqjnmri/le-go', portada: 'https://i.scdn.co/image/ab67616d00001e02a563e2c2c29c0be072a3ef36' },
      ],
      'Popularidad': [
        { pos: 1, titulo: 'No Le Da', artistas: 'Moreno & Prieto, Sortech, Dany Gomez', valor: '53', url: 'https://songstats.com/track/j25fsiqb/no-le-da', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0' },
        { pos: 2, titulo: 'Mi Love', artistas: 'Gama, DH Moon, Moreno & Prieto', valor: '40', url: 'https://songstats.com/track/tp9oa8sq/mi-love', portada: 'https://i.scdn.co/image/ab67616d00001e02cc2aa8c54d79266f01464a3d' },
        { pos: 3, titulo: 'Call Me Mor', artistas: 'Moreno & Prieto, DH Moon, Grood Taste', valor: '38', url: 'https://songstats.com/track/mkqidga8/call-me-mor', portada: 'https://i.scdn.co/image/ab67616d00001e02aef502973f1c34785f950884' },
        { pos: 4, titulo: 'Que Pasaría - Moreno & Prieto, DH Moon Remix', artistas: 'ART NO LOGIA, Dany Gomez, Moreno & Prieto', valor: '37', url: 'https://songstats.com/track/soh49rg0/que-pasaria-moreno-prieto-dh-moon-remix', portada: 'https://i.scdn.co/image/ab67616d00001e0242e2bd3ae11437ca2f02c2ab' },
        { pos: 5, titulo: 'Maybach', artistas: 'DH Moon, Wildchildz, JEREMI REID', valor: '36', url: 'https://songstats.com/track/rgpl67fe/maybach', portada: 'https://i.scdn.co/image/ab67616d00001e025a58012fba4fa046d68eff85' },
        { pos: 6, titulo: 'El Mañanero', artistas: 'DH Moon, PepeGoitia, JEREMI REID', valor: '32', url: 'https://songstats.com/track/wl1a2yg5/el-mananero', portada: 'https://i.scdn.co/image/ab67616d00001e0276636c75fffe1337f71a3724' },
        { pos: 7, titulo: 'Sonido Estelar', artistas: 'Moreno & Prieto, Dem Boyz, DH Moon', valor: '30', url: 'https://songstats.com/track/mv1nqzy2/sonido-estelar', portada: 'https://i.scdn.co/image/ab67616d00001e020f3a378589207ef43d3d4d14' },
        { pos: 8, titulo: 'Hey Mami', artistas: 'Sebastian Ledher, DH Moon, Sirolf (NL)', valor: '26', url: 'https://songstats.com/track/3y16f8ad/hey-mami', portada: 'https://i.scdn.co/image/ab67616d00001e02f56c7660e7dcdb5b5f97d410' },
        { pos: 9, titulo: 'Bum Bum Joga', artistas: 'DH Moon, Moreno & Prieto, Sortech', valor: '23', url: 'https://songstats.com/track/imt6jg49/bum-bum-joga', portada: 'https://i.scdn.co/image/ab67616d00001e029b7f8d6ff124bbf592cd78e9' },
        { pos: 10, titulo: 'Amo Tu Boca', artistas: 'Dier, Levy Sound, Nemque', valor: '23', url: 'https://songstats.com/track/equr5ivx/amo-tu-boca', portada: 'https://i.scdn.co/image/ab67616d00001e0283e87cb79307a76bb1db93e0' },
        { pos: 11, titulo: 'Hule hule', artistas: 'DH Moon, Dem Boyz, Calao Sense', valor: '20', url: 'https://songstats.com/track/5396zbjc/hule-hule', portada: 'https://i.scdn.co/image/ab67616d00001e02c8fa42150b87a87d2b714f8f' },
        { pos: 12, titulo: 'Desacatá', artistas: 'Moreno & Prieto, DH Moon', valor: '20', url: 'https://songstats.com/track/ezlbujck/desacata', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31' },
        { pos: 13, titulo: 'I Don\'t Cook', artistas: 'Moreno & Prieto, DH Moon', valor: '18', url: 'https://songstats.com/track/rkbxz36q/i-don-t-cook', portada: 'https://i.scdn.co/image/ab67616d00001e0202b05467004cd298034db6f1' },
        { pos: 14, titulo: 'Bombo Clap', artistas: 'Moreno & Prieto, DH Moon', valor: '17', url: 'https://songstats.com/track/hxg67wl0/bombo-clap', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31' },
        { pos: 15, titulo: 'Not Your Suggar', artistas: 'Moreno & Prieto, DH Moon', valor: '11', url: 'https://songstats.com/track/12bkvspr/not-your-suggar', portada: 'https://i.scdn.co/image/ab67616d00001e02dd0c67f616b97f60e6a78eba' },
      ],
      'Playlist reach': [
        { pos: 1, titulo: 'No Le Da', artistas: 'Moreno & Prieto, Sortech, Dany Gomez', valor: '287K', url: 'https://songstats.com/track/j25fsiqb/no-le-da', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0' },
        { pos: 2, titulo: 'El Mañanero', artistas: 'DH Moon, PepeGoitia, JEREMI REID', valor: '77.8K', url: 'https://songstats.com/track/wl1a2yg5/el-mananero', portada: 'https://i.scdn.co/image/ab67616d00001e0276636c75fffe1337f71a3724' },
        { pos: 3, titulo: 'Call Me Mor', artistas: 'Moreno & Prieto, DH Moon, Grood Taste', valor: '59.5K', url: 'https://songstats.com/track/mkqidga8/call-me-mor', portada: 'https://i.scdn.co/image/ab67616d00001e02aef502973f1c34785f950884' },
        { pos: 4, titulo: 'Mi Love', artistas: 'Gama, DH Moon, Moreno & Prieto', valor: '50K', url: 'https://songstats.com/track/tp9oa8sq/mi-love', portada: 'https://i.scdn.co/image/ab67616d00001e02cc2aa8c54d79266f01464a3d' },
        { pos: 5, titulo: 'Sonido Estelar', artistas: 'Moreno & Prieto, Dem Boyz, DH Moon', valor: '45.8K', url: 'https://songstats.com/track/mv1nqzy2/sonido-estelar', portada: 'https://i.scdn.co/image/ab67616d00001e020f3a378589207ef43d3d4d14' },
        { pos: 6, titulo: 'I Don\'t Cook', artistas: 'Moreno & Prieto, DH Moon', valor: '20.8K', url: 'https://songstats.com/track/rkbxz36q/i-don-t-cook', portada: 'https://i.scdn.co/image/ab67616d00001e0202b05467004cd298034db6f1' },
        { pos: 7, titulo: 'Bombo Clap', artistas: 'Moreno & Prieto, DH Moon', valor: '14.2K', url: 'https://songstats.com/track/hxg67wl0/bombo-clap', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31' },
        { pos: 8, titulo: 'Que Pasaría - Moreno & Prieto, DH Moon Remix', artistas: 'ART NO LOGIA, Dany Gomez, Moreno & Prieto', valor: '13.2K', url: 'https://songstats.com/track/soh49rg0/que-pasaria-moreno-prieto-dh-moon-remix', portada: 'https://i.scdn.co/image/ab67616d00001e0242e2bd3ae11437ca2f02c2ab' },
        { pos: 9, titulo: 'Who Made This', artistas: 'Moreno & Prieto, DH Moon', valor: '13.1K', url: 'https://songstats.com/track/rvqwy4uk/who-made-this', portada: 'https://i.scdn.co/image/ab67616d00001e02f74db99cca240031d45434c4' },
        { pos: 10, titulo: 'Maybach', artistas: 'DH Moon, Wildchildz, JEREMI REID', valor: '6.9K', url: 'https://songstats.com/track/rgpl67fe/maybach', portada: 'https://i.scdn.co/image/ab67616d00001e025a58012fba4fa046d68eff85' },
        { pos: 11, titulo: 'Not Your Suggar', artistas: 'Moreno & Prieto, DH Moon', valor: '6.5K', url: 'https://songstats.com/track/12bkvspr/not-your-suggar', portada: 'https://i.scdn.co/image/ab67616d00001e02dd0c67f616b97f60e6a78eba' },
        { pos: 12, titulo: 'Bum Bum Joga', artistas: 'DH Moon, Moreno & Prieto, Sortech', valor: '5.8K', url: 'https://songstats.com/track/imt6jg49/bum-bum-joga', portada: 'https://i.scdn.co/image/ab67616d00001e029b7f8d6ff124bbf592cd78e9' },
        { pos: 13, titulo: 'Desacatá', artistas: 'Moreno & Prieto, DH Moon', valor: '4.2K', url: 'https://songstats.com/track/ezlbujck/desacata', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31' },
        { pos: 14, titulo: 'Hule hule', artistas: 'DH Moon, Dem Boyz, Calao Sense', valor: '4.1K', url: 'https://songstats.com/track/5396zbjc/hule-hule', portada: 'https://i.scdn.co/image/ab67616d00001e02c8fa42150b87a87d2b714f8f' },
        { pos: 15, titulo: 'Why', artistas: 'DH Moon, Moreno & Prieto', valor: '2.1K', url: 'https://songstats.com/track/2tcjwq75/why', portada: 'https://i.scdn.co/image/ab67616d00001e022ee7aba159e085a5a9452106' },
      ],
    },
    hitos: [
      { texto: 'New video by 𝕯𝖆𝖞𝖆𝖓𝖆𝖗𝖆 💖 (660 Followers)', pista: 'Que Pasaría - Moreno & Prieto, DH Moon Remix', fecha: '01 sept', url: 'https://www.tiktok.com/@tiktok/video/7680364725896629511', portada: 'https://i.scdn.co/image/ab67616d00001e0242e2bd3ae11437ca2f02c2ab', fuente: 'tiktok' },
      { texto: 'New video by Ivanna Sofia🍕 (2133 Followers)', pista: 'Que Pasaría - Moreno & Prieto, DH Moon Remix', fecha: '01 sept', url: 'https://www.tiktok.com/@tiktok/video/7680679081918221586', portada: 'https://i.scdn.co/image/ab67616d00001e0242e2bd3ae11437ca2f02c2ab', fuente: 'tiktok' },
      { texto: 'Playlisted by Juank on TECHAJK (741 Followers)', pista: 'I Don\'t Cook', fecha: '01 sept', url: 'http://open.spotify.com/playlist/79zSLgbfKB2R5hd73HH96x', portada: 'https://i.scdn.co/image/ab67616d00001e0202b05467004cd298034db6f1', fuente: 'spotify' },
      { texto: 'Playlisted by Juank on TECHAJK (741 Followers)', pista: 'Peace & Love', fecha: '01 sept', url: 'http://open.spotify.com/playlist/79zSLgbfKB2R5hd73HH96x', portada: 'https://i.scdn.co/image/ab67616d00001e02a563e2c2c29c0be072a3ef36', fuente: 'spotify' },
      { texto: 'Playlisted by Juank on TECHAJK (741 Followers)', pista: 'Desacatá', fecha: '01 sept', url: 'http://open.spotify.com/playlist/79zSLgbfKB2R5hd73HH96x', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31', fuente: 'spotify' },
      { texto: 'Playlisted by Juank on TECHAJK (741 Followers)', pista: 'Le Go', fecha: '01 sept', url: 'http://open.spotify.com/playlist/79zSLgbfKB2R5hd73HH96x', portada: 'https://i.scdn.co/image/ab67616d00001e02a563e2c2c29c0be072a3ef36', fuente: 'spotify' },
      { texto: 'Playlisted by Juank on TECHAJK (741 Followers)', pista: 'Mi Love', fecha: '01 sept', url: 'http://open.spotify.com/playlist/79zSLgbfKB2R5hd73HH96x', portada: 'https://i.scdn.co/image/ab67616d00001e02cc2aa8c54d79266f01464a3d', fuente: 'spotify' },
      { texto: 'Charted #102 on Dance: Cayman Islands', pista: 'No Le Da', fecha: '31 ago', url: 'https://songstats.com/track/j25fsiqb/no-le-da', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'apple_music' },
      { texto: 'New video by 👑Baby Queen👑 (266K Followers)', pista: 'No Le Da', fecha: '31 ago', url: 'https://www.tiktok.com/@tiktok/video/7679621673196342549', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
      { texto: 'New video by 👑Baby Queen👑 (266K Followers)', pista: 'No Le Da', fecha: '31 ago', url: 'https://www.tiktok.com/@tiktok/video/7680019127125265685', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
      { texto: 'New video by Angie Carol🌸 (53.1K Followers)', pista: 'No Le Da', fecha: '31 ago', url: 'https://www.tiktok.com/@tiktok/video/7675146189615992071', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
      { texto: 'New video by MELANIE✨ (42.2K Followers)', pista: 'No Le Da', fecha: '31 ago', url: 'https://www.tiktok.com/@tiktok/video/7678813115173113096', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
      { texto: 'New video by Isaa🧚‍♀️💗 (24.6K Followers)', pista: 'No Le Da', fecha: '31 ago', url: 'https://www.tiktok.com/@tiktok/video/7672469617171893524', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
      { texto: 'New video by Carlasha💗🪽✨ (1.12M Followers)', pista: 'No Le Da', fecha: '30 ago', url: 'https://www.tiktok.com/@tiktok/video/7677807335842073864', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
      { texto: 'New video by Victoria Valentina Acosta F (763K Followers)', pista: 'No Le Da', fecha: '30 ago', url: 'https://www.tiktok.com/@tiktok/video/7671049873441049877', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
      { texto: 'Playlisted by kat on Afro Cota 905  (5369 Followers)', pista: 'No Le Da', fecha: '30 ago', url: 'http://open.spotify.com/playlist/3pLk4uIUuqQE4LqKgfay67', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'spotify' },
      { texto: 'New video by anivaleencia (286K Followers)', pista: 'No Le Da', fecha: '30 ago', url: 'https://www.tiktok.com/@tiktok/video/7678758203345095957', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
      { texto: 'New video by 𝐍𝐎𝐑𝐄💜 (327K Followers)', pista: 'No Le Da', fecha: '30 ago', url: 'https://www.tiktok.com/@tiktok/video/7678409083354942740', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0', fuente: 'tiktok' },
    ],
    releases: [
      { titulo: 'Hey Mami', fecha: 'jul 2026' },
      { titulo: 'No Le Da', fecha: 'jun 2026' },
      { titulo: 'Not Your Suggar', fecha: 'jun 2026' },
      { titulo: 'El Mañanero', fecha: 'may 2026' },
      { titulo: 'Maybach', fecha: 'may 2026' },
      { titulo: 'Hule hule', fecha: 'abr 2026' },
      { titulo: 'Que Pasaría - Moreno & Prieto, DH Moon Remix', fecha: 'mar 2026' },
      { titulo: 'Amo Tu Boca', fecha: 'feb 2026' },
      { titulo: 'Sonido Estelar', fecha: 'oct 2025' },
      { titulo: 'Call Me Mor', fecha: 'sept 2025' },
      { titulo: 'Bum Bum Joga', fecha: 'jul 2025' },
      { titulo: 'Mi Love', fecha: 'jul 2025' },
      { titulo: 'Cu Duro', fecha: 'dic 2024' },
      { titulo: 'Why', fecha: 'feb 2024' },
      { titulo: 'Bombo Clap', fecha: 'nov 2023' },
      { titulo: 'Desacatá', fecha: 'nov 2023' },
      { titulo: 'Le Go', fecha: 'jul 2023' },
      { titulo: 'Peace & Love', fecha: 'jul 2023' },
      { titulo: 'I Don\'t Cook', fecha: 'jun 2023' },
      { titulo: 'Who Made This', fecha: 'feb 2021' },
    ],
    topPlaylists: [
      { nombre: '🔥REGUETON CLASICO OLD SCHOOL 🔥', seguidores: '77.1K', url: 'https://open.spotify.com/playlist/3v861bcbMF62aFTGS1sFWs', portada: 'https://mosaic.scdn.co/1280/ab67616d0000b27372b621a4c23f797307d35f11ab67616d0000b27382006d254ea03f92cd476012ab67616d0000b2738af39763a2fe74b223a93f61ab67616d0000b273cd2eb13fe1593d277229c233' },
      { nombre: 'La Casa del House by Space Fear', seguidores: '49.8K', url: 'https://open.spotify.com/playlist/3Hp49cJCb4hdf139GHa5aZ', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84925dded3e06b8ba2cba6ea41' },
      { nombre: 'Ibiza 2026 🍒🇪🇸', seguidores: '35.6K', url: 'https://open.spotify.com/playlist/6HXeXQhQJRXeu1xazB1lAK', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da841fefec6102b9ba8000b9e9fa' },
      { nombre: 'La carpa dn7 Music ', seguidores: '10.2K', url: 'https://open.spotify.com/playlist/2d988scuB7GzxPxu31seMo', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8415f181a36fccc8492e6e40f8' },
      { nombre: 'Top 50 Madrid', seguidores: '9167', url: 'https://open.spotify.com/playlist/2tnMzSdkxcl17XJ6u18yB9', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da846f8d7e78b9101bed3ee305a2' },
      { nombre: 'latin | house', seguidores: '7876', url: 'https://open.spotify.com/playlist/2G3h3nUbwez7ZlWAFzzRXn', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da843dd7a44c8a762693154fd16f' },
      { nombre: 'Tech House🎉', seguidores: '6102', url: 'https://open.spotify.com/playlist/3ZxbHXV1rgc8GzAAu2plSV', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c000097ac95c954cd009e25eecdaa1a5e' },
      { nombre: 'tech house & grooves', seguidores: '5816', url: 'https://open.spotify.com/playlist/2JsJE6GnzRIidyvtoFKJ8U', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8479cd529844b97ae8ffd99937' },
      { nombre: ' La Isla De Las Tentaciones 2026', seguidores: '5780', url: 'https://open.spotify.com/playlist/2AENNJSoCDMFfiyqZbsep8', portada: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c000097ac3d7ba94a1f122795aa0ba295' },
      { nombre: 'House Music: Tech, Afro, Deep.', seguidores: '5767', url: 'https://open.spotify.com/playlist/4nXKb6XUfZm4YJHkh9mgRD', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84d0229fa54a91a65b7cf5f333' },
      { nombre: 'Afro Cota 905 ', seguidores: '5369', url: 'https://open.spotify.com/playlist/3pLk4uIUuqQE4LqKgfay67', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c000097acddfe26326fbbddb6e06d3751' },
      { nombre: 'weekly favs', seguidores: '5104', url: 'https://open.spotify.com/playlist/4Sx923WtVE0Hp3TCuNHMKW', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da845e01e89740cd5fbd1e08d974' },
      { nombre: 'tech | house', seguidores: '4633', url: 'https://open.spotify.com/playlist/2NjWpJwdw4GCiQVJQ4HWmL', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84035150ee60ad92ed4bceb59d' },
      { nombre: 'El House ', seguidores: '3520', url: 'https://open.spotify.com/playlist/40PvQOGetejL7bdFKx4TRM', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da847b1795177b3827a17a68eb2a' },
    ],
    beatportTracks: [
      { pos: 1, titulo: 'Bombo Clap', artistas: 'Moreno & Prieto, DH Moon', valor: '8', url: 'https://songstats.com/track/hxg67wl0/bombo-clap', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31' },
      { pos: 2, titulo: 'Call Me Mor', artistas: 'Moreno & Prieto, DH Moon, Grood Taste', valor: '5', url: 'https://songstats.com/track/mkqidga8/call-me-mor', portada: 'https://i.scdn.co/image/ab67616d00001e02aef502973f1c34785f950884' },
      { pos: 3, titulo: 'No Le Da', artistas: 'Moreno & Prieto, Sortech, Dany Gomez', valor: '5', url: 'https://songstats.com/track/j25fsiqb/no-le-da', portada: 'https://i.scdn.co/image/ab67616d00001e02ac9ff55636c1c944aa434ef0' },
      { pos: 4, titulo: 'Why', artistas: 'DH Moon, Moreno & Prieto', valor: '1', url: 'https://songstats.com/track/2tcjwq75/why', portada: 'https://i.scdn.co/image/ab67616d00001e022ee7aba159e085a5a9452106' },
      { pos: 5, titulo: 'Who Made This', artistas: 'Moreno & Prieto, DH Moon', valor: '1', url: 'https://songstats.com/track/rvqwy4uk/who-made-this', portada: 'https://i.scdn.co/image/ab67616d00001e02f74db99cca240031d45434c4' },
      { pos: 6, titulo: 'Cu Duro', artistas: 'DH Moon, NOISSE', valor: '1', url: 'https://songstats.com/track/qkfgenro/cu-duro', portada: 'https://i.scdn.co/image/ab67616d00001e0234a58b34ab0179573a3f29a9' },
      { pos: 7, titulo: 'Desacatá', artistas: 'Moreno & Prieto, DH Moon', valor: '1', url: 'https://songstats.com/track/ezlbujck/desacata', portada: 'https://i.scdn.co/image/ab67616d00001e029ab7ae7e526f880c13000f31' },
      { pos: 8, titulo: 'Peace & Love', artistas: 'Moreno & Prieto, DH Moon', valor: '1', url: 'https://songstats.com/track/aqz9f0nb/peace-love', portada: 'https://i.scdn.co/image/ab67616d00001e02a563e2c2c29c0be072a3ef36' },
    ],
    beatportCharts: [
    ],
    ciudades: [
      { nombre: 'Caracas', pais: 'VE', actual: 17821, pico: 17821, fechaPico: '02 sept 26', lat: 10.4806, lng: -66.9036 },
      { nombre: 'Valencia', pais: 'VE', actual: 6960, pico: 6960, fechaPico: '02 sept 26', lat: 10.1579, lng: -67.9972 },
      { nombre: 'Bogotá', pais: 'CO', actual: 6941, pico: 6941, fechaPico: '02 sept 26', lat: 4.711, lng: -74.0721 },
      { nombre: 'Medellín', pais: 'CO', actual: 5418, pico: 5418, fechaPico: '02 sept 26', lat: 6.2476, lng: -75.5658 },
      { nombre: 'Barquisimeto', pais: 'VE', actual: 4655, pico: 4655, fechaPico: '02 sept 26', lat: 10.0678, lng: -69.3474 },
      { nombre: 'Santiago', pais: 'CL', actual: 3880, pico: 3880, fechaPico: '02 sept 26', lat: -33.4489, lng: -70.6693 },
      { nombre: 'Mexico City', pais: 'MX', actual: 3664, pico: 7735, fechaPico: '12 nov 25', lat: 19.4326, lng: -99.1332 },
      { nombre: 'Maracay', pais: 'VE', actual: 3519, pico: 3519, fechaPico: '02 sept 26', lat: 10.2442, lng: -67.6066 },
      { nombre: 'Lima', pais: 'PE', actual: 3287, pico: 3287, fechaPico: '02 sept 26', lat: -12.0467, lng: -77.0431 },
      { nombre: 'Madrid', pais: 'ES', actual: 2961, pico: 2961, fechaPico: '02 sept 26', lat: 40.4167, lng: -3.7033 },
      { nombre: 'Maracaibo', pais: 'VE', actual: 2435, pico: 2435, fechaPico: '02 sept 26', lat: 10.641, lng: -71.6074 },
      { nombre: 'Cali', pais: 'CO', actual: 2252, pico: 2360, fechaPico: '29 may 26', lat: 3.4516, lng: -76.532 },
      { nombre: 'Barcelona', pais: 'ES', actual: 1671, pico: 1671, fechaPico: '02 sept 26', lat: 41.3874, lng: 2.1686 },
      { nombre: 'Barranquilla', pais: 'CO', actual: 1626, pico: 1626, fechaPico: '02 sept 26', lat: 11.0041, lng: -74.807 },
      { nombre: 'Miami', pais: 'US', actual: 1599, pico: 1599, fechaPico: '02 sept 26', lat: 25.7617, lng: -80.1918 },
      { nombre: 'Barcelona', pais: 'VE', actual: 1347, pico: 1347, fechaPico: '02 sept 26', lat: 10.1446, lng: -64.6777 },
      { nombre: 'Barinas', pais: 'VE', actual: 1192, pico: 1192, fechaPico: '02 sept 26', lat: 8.6206, lng: -70.2311 },
      { nombre: 'Guayaquil', pais: 'EC', actual: 1149, pico: 1149, fechaPico: '02 sept 26', lat: -2.1891, lng: -79.8899 },
      { nombre: 'São Paulo', pais: 'BR', actual: 1080, pico: 1102, fechaPico: '29 ago 26', lat: -23.5558, lng: -46.6396 },
      { nombre: 'San Cristobal', pais: 'VE', actual: 1047, pico: 1047, fechaPico: '02 sept 26', lat: 7.7714, lng: -72.2261 },
      { nombre: 'Acarigua', pais: 'VE', actual: 977, pico: 977, fechaPico: '02 sept 26', lat: 9.5504, lng: -69.1805 },
      { nombre: 'Santo Domingo', pais: 'DO', actual: 963, pico: 963, fechaPico: '02 sept 26', lat: 18.4626, lng: -69.9361 },
      { nombre: 'Panama City', pais: 'PA', actual: 958, pico: 958, fechaPico: '02 sept 26', lat: 8.9824, lng: -79.5199 },
      { nombre: 'Quito', pais: 'EC', actual: 851, pico: 851, fechaPico: '02 sept 26', lat: -0.2233, lng: -78.5141 },
      { nombre: 'Turmero', pais: 'VE', actual: 832, pico: 832, fechaPico: '02 sept 26', lat: 10.2152, lng: -67.4858 },
      { nombre: 'Porlamar', pais: 'VE', actual: 802, pico: 802, fechaPico: '02 sept 26', lat: 10.957, lng: -63.87 },
      { nombre: 'Maturín', pais: 'VE', actual: 801, pico: 801, fechaPico: '02 sept 26', lat: 9.7334, lng: -63.1914 },
      { nombre: 'Mérida', pais: 'VE', actual: 743, pico: 743, fechaPico: '02 sept 26', lat: 8.5698, lng: -71.1805 },
      { nombre: 'Los Teques', pais: 'VE', actual: 742, pico: 742, fechaPico: '02 sept 26', lat: 10.3492, lng: -67.0345 },
      { nombre: 'Santo Domingo Este', pais: 'DO', actual: 707, pico: 707, fechaPico: '02 sept 26', lat: 18.4893, lng: -69.8255 },
      { nombre: 'Málaga', pais: 'ES', actual: 687, pico: 697, fechaPico: '01 sept 26', lat: 36.7178, lng: -4.4256 },
      { nombre: 'New York', pais: 'US', actual: 682, pico: 682, fechaPico: '02 sept 26', lat: 40.7128, lng: -74.006 },
      { nombre: 'Trujillo', pais: 'PE', actual: 677, pico: 677, fechaPico: '02 sept 26', lat: -8.1158, lng: -79.0257 },
      { nombre: 'Buenos Aires', pais: 'AR', actual: 612, pico: 612, fechaPico: '02 sept 26', lat: -34.6143, lng: -58.4402 },
      { nombre: 'Coro', pais: 'VE', actual: 599, pico: 599, fechaPico: '02 sept 26', lat: 11.3946, lng: -69.681 },
      { nombre: 'Valencia', pais: 'ES', actual: 596, pico: 596, fechaPico: '02 sept 26', lat: 39.4738, lng: -0.3756 },
      { nombre: 'Guayana City', pais: 'VE', actual: 581, pico: 581, fechaPico: '02 sept 26', lat: 8.3663, lng: -62.6497 },
      { nombre: 'Orlando', pais: 'US', actual: 569, pico: 569, fechaPico: '02 sept 26', lat: 28.5384, lng: -81.3789 },
      { nombre: 'Palma', pais: 'ES', actual: 549, pico: 549, fechaPico: '02 sept 26', lat: 39.5727, lng: 2.6569 },
      { nombre: 'Piso 8', pais: 'VE', actual: 489, pico: 489, fechaPico: '02 sept 26', lat: 10.4824, lng: -66.849 },
      { nombre: 'Bucaramanga', pais: 'CO', actual: 478, pico: 478, fechaPico: '02 sept 26', lat: 7.1193, lng: -73.1227 },
      { nombre: 'Cartagena', pais: 'CO', actual: 466, pico: 466, fechaPico: '02 sept 26', lat: 10.3932, lng: -75.4832 },
      { nombre: 'Dallas', pais: 'US', actual: 464, pico: 464, fechaPico: '02 sept 26', lat: 32.7767, lng: -96.797 },
      { nombre: 'London', pais: 'GB', actual: 459, pico: 459, fechaPico: '02 sept 26', lat: 51.5072, lng: -0.1276 },
      { nombre: 'Chicago', pais: 'US', actual: 453, pico: 453, fechaPico: '02 sept 26', lat: 41.8832, lng: -87.6324 },
      { nombre: 'Cúcuta', pais: 'CO', actual: 432, pico: 432, fechaPico: '02 sept 26', lat: 7.8891, lng: -72.4967 },
      { nombre: 'Guatemala City', pais: 'GT', actual: 410, pico: 410, fechaPico: '02 sept 26', lat: 14.6349, lng: -90.5069 },
      { nombre: 'San José', pais: 'CR', actual: 0, pico: 781, fechaPico: '01 sept 26', lat: 9.9281, lng: -84.0907 },
      { nombre: 'Seville', pais: 'ES', actual: 0, pico: 489, fechaPico: '01 sept 26', lat: 37.3891, lng: -5.9845 },
      { nombre: 'Pereira', pais: 'CO', actual: 0, pico: 457, fechaPico: '28 may 26', lat: 4.8087, lng: -75.6906 },
      { nombre: 'Curitiba', pais: 'BR', actual: 0, pico: 442, fechaPico: '30 ago 26', lat: -25.4269, lng: -49.2652 },
      { nombre: 'Ciudad Nezahualcoyotl', pais: 'MX', actual: 0, pico: 414, fechaPico: '12 nov 25', lat: 19.3995, lng: -98.9897 },
      { nombre: 'Puebla', pais: 'MX', actual: 0, pico: 393, fechaPico: '21 abr 26', lat: 19.0414, lng: -98.2063 },
      { nombre: 'Municipality of Las Palmas', pais: 'ES', actual: 0, pico: 367, fechaPico: '22 ago 26', lat: 28.1009, lng: -15.4654 },
      { nombre: 'Guadalajara', pais: 'MX', actual: 0, pico: 350, fechaPico: '12 nov 25', lat: 20.6752, lng: -103.3473 },
      { nombre: 'Puebla', pais: 'MX', actual: 0, pico: 342, fechaPico: '05 nov 25', lat: 32.5727, lng: -115.3467 },
      { nombre: 'Amsterdam', pais: 'NL', actual: 0, pico: 335, fechaPico: '25 ago 26', lat: 52.3676, lng: 4.9041 },
      { nombre: 'Ecatepec de Morelos', pais: 'MX', actual: 0, pico: 333, fechaPico: '12 nov 25', lat: 19.5671, lng: -99.0445 },
      { nombre: 'Manizales', pais: 'CO', actual: 0, pico: 310, fechaPico: '29 may 26', lat: 5.063, lng: -75.5028 },
      { nombre: 'Santa Cruz de Tenerife', pais: 'ES', actual: 0, pico: 309, fechaPico: '22 ago 26', lat: 28.4636, lng: -16.2518 },
      { nombre: 'Los Angeles', pais: 'US', actual: 0, pico: 278, fechaPico: '17 ago 26', lat: 34.0549, lng: -118.2426 },
      { nombre: 'Naples', pais: 'IT', actual: 0, pico: 272, fechaPico: '11 may 26', lat: 40.8657, lng: 14.2644 },
      { nombre: 'Brooklyn', pais: 'US', actual: 0, pico: 258, fechaPico: '16 ago 26', lat: 40.6782, lng: -73.9442 },
      { nombre: 'Villavicencio', pais: 'CO', actual: 0, pico: 255, fechaPico: '28 may 26', lat: 4.1492, lng: -73.6285 },
      { nombre: 'Santiago de Querétaro', pais: 'MX', actual: 0, pico: 230, fechaPico: '12 nov 25', lat: 20.5888, lng: -100.3899 },
      { nombre: 'Cuautitlán Izcalli', pais: 'MX', actual: 0, pico: 222, fechaPico: '12 nov 25', lat: 19.6528, lng: -99.2231 },
      { nombre: 'Concepción', pais: 'CL', actual: 0, pico: 196, fechaPico: '19 nov 25', lat: -36.8201, lng: -73.0444 },
      { nombre: 'Rionegro', pais: 'CO', actual: 0, pico: 188, fechaPico: '29 may 26', lat: 6.149, lng: -75.379 },
      { nombre: 'Mérida', pais: 'MX', actual: 0, pico: 186, fechaPico: '03 abr 26', lat: 20.9674, lng: -89.5926 },
      { nombre: 'Naucalpan de Juárez', pais: 'MX', actual: 0, pico: 183, fechaPico: '12 nov 25', lat: 19.4737, lng: -99.2337 },
      { nombre: 'Toluca', pais: 'MX', actual: 0, pico: 178, fechaPico: '05 nov 25', lat: 19.2826, lng: -99.6557 },
      { nombre: 'Tlalnepantla de Baz', pais: 'MX', actual: 0, pico: 173, fechaPico: '23 abr 26', lat: 19.5361, lng: -99.1968 },
      { nombre: 'Zapopan', pais: 'MX', actual: 0, pico: 172, fechaPico: '22 abr 26', lat: 20.672, lng: -103.4165 },
      { nombre: 'Bello', pais: 'CO', actual: 0, pico: 171, fechaPico: '29 may 26', lat: 6.3367, lng: -75.5596 },
      { nombre: 'León', pais: 'MX', actual: 0, pico: 150, fechaPico: '08 abr 26', lat: 21.125, lng: -101.686 },
      { nombre: 'Fort Lauderdale', pais: 'US', actual: 0, pico: 149, fechaPico: '08 may 26', lat: 26.1224, lng: -80.1373 },
      { nombre: 'Coacalco', pais: 'MX', actual: 0, pico: 143, fechaPico: '30 mar 26', lat: 19.6291, lng: -99.1043 },
      { nombre: 'Milan', pais: 'IT', actual: 0, pico: 133, fechaPico: '15 oct 25', lat: 45.4685, lng: 9.1824 },
      { nombre: 'Tultitlan de Mariano Escobedo', pais: 'MX', actual: 0, pico: 126, fechaPico: '12 nov 25', lat: 19.6392, lng: -99.1669 },
      { nombre: 'Chalco de Díaz Covarrubias', pais: 'MX', actual: 0, pico: 126, fechaPico: '05 nov 25', lat: 19.2624, lng: -98.8969 },
      { nombre: 'Montréal', pais: 'CA', actual: 0, pico: 124, fechaPico: '17 jun 26', lat: 45.5019, lng: -73.5674 },
      { nombre: 'Rome', pais: 'IT', actual: 0, pico: 118, fechaPico: '09 jul 26', lat: 41.8967, lng: 12.4822 },
      { nombre: 'Toronto', pais: 'CA', actual: 0, pico: 118, fechaPico: '23 mar 26', lat: 43.6532, lng: -79.3832 },
      { nombre: 'Paris', pais: 'FR', actual: 0, pico: 117, fechaPico: '09 oct 25', lat: 48.8575, lng: 2.3514 },
      { nombre: 'Chimalhuacan', pais: 'MX', actual: 0, pico: 116, fechaPico: '05 nov 25', lat: 19.4314, lng: -98.9582 },
      { nombre: 'Córdoba', pais: 'AR', actual: 0, pico: 116, fechaPico: '11 dic 25', lat: -31.4201, lng: -64.1888 },
      { nombre: 'Tijuana', pais: 'MX', actual: 0, pico: 115, fechaPico: '22 mar 26', lat: 32.5332, lng: -117.0193 },
      { nombre: 'Chiclayo', pais: 'PE', actual: 0, pico: 110, fechaPico: '11 dic 25', lat: -6.7713, lng: -79.8452 },
      { nombre: 'Colonia Cuauhtémoc', pais: 'MX', actual: 0, pico: 109, fechaPico: '28 ago 25', lat: 19.4301, lng: -99.1691 },
      { nombre: 'Acapulco', pais: 'MX', actual: 0, pico: 107, fechaPico: '19 feb 26', lat: 16.864, lng: -99.8823 },
      { nombre: 'Piura', pais: 'PE', actual: 0, pico: 101, fechaPico: '03 dic 25', lat: -5.1783, lng: -80.6549 },
      { nombre: 'Benito Juarez', pais: 'MX', actual: 0, pico: 95, fechaPico: '03 sept 25', lat: 19.3794, lng: -99.1591 },
      { nombre: 'Rotterdam', pais: 'NL', actual: 0, pico: 92, fechaPico: '15 oct 25', lat: 51.9244, lng: 4.4777 },
      { nombre: 'Gustavo A. Madero', pais: 'MX', actual: 0, pico: 80, fechaPico: '30 jul 25', lat: 19.4873, lng: -99.1236 },
      { nombre: 'Monterrey', pais: 'MX', actual: 0, pico: 74, fechaPico: '15 oct 25', lat: 25.6866, lng: -100.3161 },
      { nombre: 'Iztapalapa', pais: 'MX', actual: 0, pico: 74, fechaPico: '30 jul 25', lat: 19.3421, lng: -99.0532 },
      { nombre: 'Santiago Province', pais: 'DO', actual: 0, pico: 71, fechaPico: '28 ene 26', lat: 19.4541, lng: -70.6922 },
      { nombre: 'Ibiza', pais: 'ES', actual: 0, pico: 71, fechaPico: '15 oct 25', lat: 38.9066, lng: 1.4207 },
      { nombre: 'Suba', pais: 'CO', actual: 0, pico: 65, fechaPico: '09 oct 25', lat: 4.7208, lng: -74.0748 },
      { nombre: 'Budapest', pais: 'HU', actual: 0, pico: 65, fechaPico: '01 oct 25', lat: 47.4979, lng: 19.0402 },
      { nombre: 'Brussels', pais: 'BE', actual: 0, pico: 57, fechaPico: '01 oct 25', lat: 50.8477, lng: 4.3572 },
      { nombre: 'Miguel Hidalgo', pais: 'MX', actual: 0, pico: 51, fechaPico: '03 sept 25', lat: 19.4307, lng: -99.2084 },
      { nombre: 'Frankfurt', pais: 'DE', actual: 0, pico: 49, fechaPico: '24 sept 25', lat: 50.1109, lng: 8.6821 },
      { nombre: 'Azcapotzalco', pais: 'MX', actual: 0, pico: 38, fechaPico: '03 sept 25', lat: 19.4847, lng: -99.1887 },
      { nombre: 'Lyon', pais: 'FR', actual: 0, pico: 35, fechaPico: '17 sept 25', lat: 45.764, lng: 4.8357 },
      { nombre: 'Venustiano Carranza', pais: 'MX', actual: 0, pico: 34, fechaPico: '30 jul 25', lat: 19.4306, lng: -99.095 },
      { nombre: 'Álvaro Obregón', pais: 'MX', actual: 0, pico: 29, fechaPico: '03 sept 25', lat: 19.3605, lng: -99.2267 },
      { nombre: 'Envigado', pais: 'CO', actual: 0, pico: 26, fechaPico: '03 sept 25', lat: 6.1673, lng: -75.5837 },
      { nombre: 'Iztacalco', pais: 'MX', actual: 0, pico: 24, fechaPico: '30 jul 25', lat: 19.3948, lng: -99.0977 },
      { nombre: 'Coyoacán', pais: 'MX', actual: 0, pico: 23, fechaPico: '20 ago 25', lat: 19.3487, lng: -99.1629 },
      { nombre: 'Sydney', pais: 'AU', actual: 0, pico: 21, fechaPico: '30 jul 25', lat: -33.8727, lng: 151.2057 },
      { nombre: 'Riosucio', pais: 'CO', actual: 0, pico: 20, fechaPico: '07 ago 25', lat: 5.4207, lng: -75.7054 },
      { nombre: 'Queens', pais: 'US', actual: 0, pico: 17, fechaPico: '07 ago 25', lat: 40.7282, lng: -73.7949 },
      { nombre: 'Melbourne', pais: 'AU', actual: 0, pico: 16, fechaPico: '25 jul 25', lat: -37.8136, lng: 144.9631 },
      { nombre: 'Zürich', pais: 'CH', actual: 0, pico: 14, fechaPico: '11 jul 25', lat: 47.3769, lng: 8.5417 },
      { nombre: 'Houston', pais: 'US', actual: 0, pico: 12, fechaPico: '09 abr 25', lat: 29.7601, lng: -95.3701 },
      { nombre: 'Hialeah', pais: 'US', actual: 0, pico: 12, fechaPico: '28 dic 23', lat: 25.8576, lng: -80.2781 },
      { nombre: 'Tampa', pais: 'US', actual: 0, pico: 12, fechaPico: '10 abr 24', lat: 27.9517, lng: -82.4588 },
      { nombre: 'Vancouver', pais: 'CA', actual: 0, pico: 12, fechaPico: '27 mar 25', lat: 49.2827, lng: -123.1207 },
      { nombre: 'Dubai', pais: 'AE', actual: 0, pico: 11, fechaPico: '26 feb 25', lat: 25.2048, lng: 55.2708 },
      { nombre: 'San Antonio', pais: 'US', actual: 0, pico: 10, fechaPico: '03 ene 24', lat: 29.4252, lng: -98.4946 },
      { nombre: 'Atlanta', pais: 'US', actual: 0, pico: 10, fechaPico: '15 may 25', lat: 33.7501, lng: -84.3885 },
      { nombre: 'Loja', pais: 'EC', actual: 0, pico: 10, fechaPico: '21 nov 24', lat: -4.0079, lng: -79.2113 },
      { nombre: 'Düsseldorf', pais: 'DE', actual: 0, pico: 10, fechaPico: '25 jun 25', lat: 51.223, lng: 6.7825 },
      { nombre: 'Buenos Aires', pais: 'AR', actual: 0, pico: 10, fechaPico: '23 oct 24', lat: -34.6037, lng: -58.3821 },
      { nombre: 'Austin', pais: 'US', actual: 0, pico: 10, fechaPico: '08 dic 23', lat: 30.2672, lng: -97.7431 },
      { nombre: 'Cairo', pais: 'EG', actual: 0, pico: 9, fechaPico: '13 jun 25', lat: 30.0444, lng: 31.2357 },
      { nombre: 'Sofia', pais: 'BG', actual: 0, pico: 9, fechaPico: '17 ago 23', lat: 42.6977, lng: 23.3219 },
      { nombre: 'Cuenca', pais: 'EC', actual: 0, pico: 9, fechaPico: '26 dic 24', lat: -2.9001, lng: -79.0059 },
      { nombre: 'Porto', pais: 'PT', actual: 0, pico: 9, fechaPico: '07 may 25', lat: 41.1462, lng: -8.6122 },
      { nombre: 'Nice', pais: 'FR', actual: 0, pico: 8, fechaPico: '09 abr 25', lat: 43.7102, lng: 7.262 },
      { nombre: 'Southwark', pais: 'GB', actual: 0, pico: 8, fechaPico: '09 abr 25', lat: 51.5028, lng: -0.0877 },
      { nombre: 'Montevideo', pais: 'UY', actual: 0, pico: 8, fechaPico: '16 may 24', lat: -34.9055, lng: -56.1851 },
      { nombre: 'Utrecht', pais: 'NL', actual: 0, pico: 8, fechaPico: '31 may 24', lat: 52.0919, lng: 5.123 },
      { nombre: 'Rosario', pais: 'AR', actual: 0, pico: 8, fechaPico: '09 abr 25', lat: -32.9587, lng: -60.693 },
      { nombre: 'Manchester', pais: 'GB', actual: 0, pico: 8, fechaPico: '09 abr 25', lat: 53.4808, lng: -2.2426 },
      { nombre: 'Newark', pais: 'US', actual: 0, pico: 7, fechaPico: '06 feb 25', lat: 40.7315, lng: -74.1745 },
      { nombre: 'Bologna', pais: 'IT', actual: 0, pico: 7, fechaPico: '20 feb 25', lat: 44.3693, lng: 11.2524 },
      { nombre: 'Brisbane', pais: 'AU', actual: 0, pico: 7, fechaPico: '13 jun 25', lat: -27.4705, lng: 153.026 },
      { nombre: 'Mar del Plata', pais: 'AR', actual: 0, pico: 7, fechaPico: '06 feb 25', lat: -38.0055, lng: -57.5426 },
      { nombre: 'Lisbon', pais: 'PT', actual: 0, pico: 7, fechaPico: '30 ago 23', lat: 38.7223, lng: -9.1393 },
      { nombre: 'Armenia', pais: 'CO', actual: 0, pico: 7, fechaPico: '16 feb 24', lat: 6.1563, lng: -75.7876 },
      { nombre: 'Denpasar', pais: 'ID', actual: 0, pico: 7, fechaPico: '02 abr 25', lat: -8.6559, lng: 115.2168 },
      { nombre: 'The Hague', pais: 'NL', actual: 0, pico: 7, fechaPico: '05 jun 24', lat: 52.0705, lng: 4.3007 },
      { nombre: 'Phoenix', pais: 'US', actual: 0, pico: 7, fechaPico: '04 abr 24', lat: 33.4483, lng: -112.0725 },
      { nombre: 'San Francisco', pais: 'US', actual: 0, pico: 6, fechaPico: '29 ene 25', lat: 37.7749, lng: -122.4194 },
      { nombre: 'San Pedro Sula', pais: 'HN', actual: 0, pico: 6, fechaPico: '22 dic 23', lat: 15.5039, lng: -88.0139 },
      { nombre: 'Zagreb', pais: 'HR', actual: 0, pico: 6, fechaPico: '24 abr 25', lat: 45.815, lng: 15.9819 },
      { nombre: 'Tuluá', pais: 'CO', actual: 0, pico: 6, fechaPico: '14 mar 24', lat: 4.0899, lng: -76.1915 },
      { nombre: 'Birmingham', pais: 'GB', actual: 0, pico: 6, fechaPico: '14 mar 24', lat: 52.4823, lng: -1.89 },
      { nombre: 'Denver', pais: 'US', actual: 0, pico: 6, fechaPico: '21 mar 24', lat: 39.7392, lng: -104.9903 },
      { nombre: 'San Diego', pais: 'US', actual: 0, pico: 6, fechaPico: '12 jun 24', lat: 32.7157, lng: -117.1611 },
      { nombre: 'Santa Fe', pais: 'AR', actual: 0, pico: 6, fechaPico: '26 feb 25', lat: -31.6107, lng: -60.6973 },
      { nombre: 'Charlotte', pais: 'US', actual: 0, pico: 6, fechaPico: '16 abr 25', lat: 35.2271, lng: -80.8409 },
      { nombre: 'Heredia Province', pais: 'CR', actual: 0, pico: 6, fechaPico: '02 oct 24', lat: 10.4735, lng: -84.0167 },
      { nombre: 'Bronx', pais: 'US', actual: 0, pico: 6, fechaPico: '06 feb 25', lat: 40.8448, lng: -73.8648 },
      { nombre: 'Groningen', pais: 'NL', actual: 0, pico: 5, fechaPico: '04 dic 24', lat: 53.2194, lng: 6.5665 },
      { nombre: 'Bilbao', pais: 'ES', actual: 0, pico: 5, fechaPico: '01 may 24', lat: 43.2634, lng: -2.9348 },
      { nombre: 'Berlin', pais: 'DE', actual: 0, pico: 5, fechaPico: '28 mar 24', lat: 52.52, lng: 13.405 },
      { nombre: 'Alicante', pais: 'ES', actual: 0, pico: 5, fechaPico: '20 jun 24', lat: 38.3458, lng: -0.4909 },
      { nombre: 'Viña del Mar', pais: 'CL', actual: 0, pico: 5, fechaPico: '19 dic 24', lat: -33.0153, lng: -71.55 },
      { nombre: 'Vienna', pais: 'AT', actual: 0, pico: 5, fechaPico: '16 ago 24', lat: 48.2081, lng: 16.3713 },
      { nombre: 'Chia', pais: 'CO', actual: 0, pico: 5, fechaPico: '08 dic 23', lat: 4.8626, lng: -74.056 },
      { nombre: 'Las Vegas', pais: 'US', actual: 0, pico: 5, fechaPico: '16 may 24', lat: 36.1716, lng: -115.1391 },
      { nombre: 'Bucharest', pais: 'RO', actual: 0, pico: 5, fechaPico: '30 nov 23', lat: 44.4268, lng: 26.1025 },
      { nombre: 'Boynton Beach', pais: 'US', actual: 0, pico: 5, fechaPico: '25 oct 23', lat: 26.5318, lng: -80.0905 },
      { nombre: 'Munich', pais: 'DE', actual: 0, pico: 4, fechaPico: '02 nov 23', lat: 48.1351, lng: 11.582 },
      { nombre: 'Marrakesh', pais: 'MA', actual: 0, pico: 4, fechaPico: '05 jun 24', lat: 31.6225, lng: -7.9898 },
      { nombre: 'Cusco', pais: 'PE', actual: 0, pico: 4, fechaPico: '22 dic 23', lat: -13.532, lng: -71.9675 },
      { nombre: 'Lomas de Zamora', pais: 'AR', actual: 0, pico: 4, fechaPico: '07 nov 24', lat: -34.7612, lng: -58.4302 },
      { nombre: 'Zoetermeer', pais: 'NL', actual: 0, pico: 4, fechaPico: '04 sept 24', lat: 52.0607, lng: 4.494 },
      { nombre: 'Stockholm', pais: 'SE', actual: 0, pico: 4, fechaPico: '27 jul 23', lat: 59.3327, lng: 18.0656 },
      { nombre: 'Capelle aan den IJssel', pais: 'NL', actual: 0, pico: 4, fechaPico: '18 abr 24', lat: 51.9302, lng: 4.5777 },
      { nombre: 'Tegucigalpa', pais: 'HN', actual: 0, pico: 4, fechaPico: '18 ene 24', lat: 14.0607, lng: -87.1825 },
      { nombre: 'Thessaloníki', pais: 'GR', actual: 0, pico: 4, fechaPico: '18 ene 24', lat: 40.6401, lng: 22.9444 },
      { nombre: 'Athens', pais: 'GR', actual: 0, pico: 4, fechaPico: '22 dic 23', lat: 37.9838, lng: 23.7275 },
      { nombre: 'Antofagasta', pais: 'CL', actual: 0, pico: 4, fechaPico: '18 abr 24', lat: -23.6509, lng: -70.3975 },
      { nombre: 'Ibagué', pais: 'CO', actual: 0, pico: 4, fechaPico: '13 sept 23', lat: 4.4447, lng: -75.2424 },
      { nombre: 'Arequipa', pais: 'PE', actual: 0, pico: 4, fechaPico: '29 may 24', lat: -16.4057, lng: -71.5401 },
      { nombre: 'Coral Springs', pais: 'US', actual: 0, pico: 4, fechaPico: '14 dic 23', lat: 26.2712, lng: -80.2706 },
      { nombre: 'Bern', pais: 'CH', actual: 0, pico: 4, fechaPico: '17 ago 23', lat: 46.948, lng: 7.4474 },
      { nombre: 'Philadelphia', pais: 'US', actual: 0, pico: 4, fechaPico: '26 ago 23', lat: 39.9526, lng: -75.1652 },
      { nombre: 'Boston', pais: 'US', actual: 0, pico: 4, fechaPico: '14 dic 23', lat: 42.3555, lng: -71.0565 },
      { nombre: 'Jacksonville', pais: 'US', actual: 0, pico: 4, fechaPico: '04 jul 24', lat: 30.3298, lng: -81.6592 },
      { nombre: 'Rio de Janeiro', pais: 'BR', actual: 0, pico: 4, fechaPico: '14 mar 24', lat: -22.9068, lng: -43.1729 },
      { nombre: 'Cardiff', pais: 'GB', actual: 0, pico: 4, fechaPico: '18 abr 24', lat: 51.4837, lng: -3.1681 },
      { nombre: 'Palmira', pais: 'CO', actual: 0, pico: 4, fechaPico: '19 dic 24', lat: 3.5379, lng: -76.2972 },
      { nombre: 'Hollywood', pais: 'US', actual: 0, pico: 4, fechaPico: '09 may 24', lat: 26.0099, lng: -80.1591 },
      { nombre: 'Escazu', pais: 'CR', actual: 0, pico: 4, fechaPico: '17 oct 24', lat: 9.9202, lng: -84.1391 },
      { nombre: 'Florence', pais: 'IT', actual: 0, pico: 4, fechaPico: '30 ago 23', lat: 43.77, lng: 11.2577 },
      { nombre: 'Istanboel', pais: 'TR', actual: 0, pico: 4, fechaPico: '13 sept 23', lat: 41.1634, lng: 28.7664 },
      { nombre: 'Marseille', pais: 'FR', actual: 0, pico: 4, fechaPico: '12 dic 24', lat: 43.3026, lng: 5.3691 },
      { nombre: 'El Vigia', pais: 'VE', actual: 0, pico: 4, fechaPico: '03 may 24', lat: 10.1238, lng: -68.0984 },
      { nombre: 'Padua', pais: 'IT', actual: 0, pico: 3, fechaPico: '02 ago 23', lat: 45.4105, lng: 11.8782 },
      { nombre: 'Antalya', pais: 'TR', actual: 0, pico: 3, fechaPico: '28 sept 23', lat: 36.8969, lng: 30.7133 },
      { nombre: 'Gouda', pais: 'NL', actual: 0, pico: 3, fechaPico: '29 feb 24', lat: 52.0115, lng: 4.7105 },
      { nombre: 'Lausanne', pais: 'CH', actual: 0, pico: 3, fechaPico: '30 nov 23', lat: 46.5197, lng: 6.6323 },
      { nombre: 'Brent', pais: 'GB', actual: 0, pico: 3, fechaPico: '17 oct 24', lat: 51.5571, lng: -0.286 },
      { nombre: 'Chinchina', pais: 'CO', actual: 0, pico: 3, fechaPico: '16 feb 24', lat: 4.9827, lng: -75.6053 },
      { nombre: 'Santa Elena', pais: 'EC', actual: 0, pico: 3, fechaPico: '26 dic 24', lat: -2.2269, lng: -80.8594 },
      { nombre: 'El Vigía', pais: 'VE', actual: 0, pico: 3, fechaPico: '16 feb 24', lat: 8.6144, lng: -71.6555 },
      { nombre: 'Windermere', pais: 'GB', actual: 0, pico: 3, fechaPico: '08 feb 24', lat: 54.3739, lng: -2.9376 },
      { nombre: 'Würzburg', pais: 'DE', actual: 0, pico: 3, fechaPico: '29 feb 24', lat: 49.7913, lng: 9.9534 },
      { nombre: 'San Salvador', pais: 'SV', actual: 0, pico: 3, fechaPico: '26 ago 23', lat: 13.6981, lng: -89.1915 },
      { nombre: 'Cologne', pais: 'DE', actual: 0, pico: 3, fechaPico: '27 jul 23', lat: 50.9375, lng: 6.9603 },
      { nombre: 'Valladolid', pais: 'ES', actual: 0, pico: 3, fechaPico: '09 ago 23', lat: 41.6544, lng: -4.7223 },
      { nombre: 'Montería', pais: 'CO', actual: 0, pico: 3, fechaPico: '21 nov 24', lat: 8.751, lng: -75.8785 },
      { nombre: 'Florianópolis', pais: 'BR', actual: 0, pico: 3, fechaPico: '05 oct 23', lat: -27.5969, lng: -48.5468 },
      { nombre: 'Padova', pais: 'IT', actual: 0, pico: 3, fechaPico: '17 ago 23', lat: 45.3993, lng: 11.8778 },
      { nombre: 'La Paz', pais: 'BO', actual: 0, pico: 3, fechaPico: '30 ago 23', lat: -16.4944, lng: -68.1212 },
      { nombre: 'Joinville', pais: 'BR', actual: 0, pico: 3, fechaPico: '23 nov 23', lat: -26.3044, lng: -48.8464 },
      { nombre: 'La Plata', pais: 'AR', actual: 0, pico: 3, fechaPico: '19 oct 23', lat: -34.9205, lng: -57.9536 },
      { nombre: 'Scottsdale', pais: 'US', actual: 0, pico: 2, fechaPico: '09 nov 23', lat: 33.4949, lng: -111.9217 },
      { nombre: 'Flushing', pais: 'US', actual: 0, pico: 2, fechaPico: '12 jul 23', lat: 40.7647, lng: -73.8307 },
      { nombre: 'Chino', pais: 'US', actual: 0, pico: 2, fechaPico: '20 jul 23', lat: 34.0137, lng: -117.6906 },
      { nombre: 'Braga', pais: 'PT', actual: 0, pico: 2, fechaPico: '27 jul 23', lat: 41.5454, lng: -8.4265 },
      { nombre: 'Vilnius', pais: 'LT', actual: 0, pico: 2, fechaPico: '09 ago 23', lat: 54.6872, lng: 25.2797 },
      { nombre: 'Fontana', pais: 'US', actual: 0, pico: 2, fechaPico: '09 nov 23', lat: 34.0922, lng: -117.435 },
      { nombre: 'Bristol', pais: 'GB', actual: 0, pico: 2, fechaPico: '20 jul 23', lat: 51.4545, lng: -2.5879 },
      { nombre: 'Brighton', pais: 'GB', actual: 0, pico: 2, fechaPico: '05 jul 23', lat: 50.8229, lng: -0.1363 },
      { nombre: 'Wrocław', pais: 'PL', actual: 0, pico: 2, fechaPico: '20 jul 23', lat: 51.1093, lng: 17.0386 },
      { nombre: 'Giessen', pais: 'DE', actual: 0, pico: 2, fechaPico: '05 jul 23', lat: 50.5841, lng: 8.6784 },
      { nombre: 'Ridderkerk', pais: 'NL', actual: 0, pico: 2, fechaPico: '27 jul 23', lat: 51.8703, lng: 4.6022 },
      { nombre: 'Hamburg', pais: 'DE', actual: 0, pico: 2, fechaPico: '09 ago 23', lat: 53.5488, lng: 9.9872 },
      { nombre: 'Weiden', pais: 'DE', actual: 0, pico: 2, fechaPico: '02 nov 23', lat: 49.6744, lng: 12.1489 },
      { nombre: 'Nuremberg', pais: 'DE', actual: 0, pico: 1, fechaPico: '12 jul 23', lat: 49.4543, lng: 11.0746 },
      { nombre: 'Davie', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 26.0765, lng: -80.2521 },
      { nombre: 'Aplared', pais: 'SE', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 57.6508, lng: 13.0711 },
      { nombre: 'Reading', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 40.337, lng: -75.9214 },
      { nombre: 'Arnhem', pais: 'NL', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 51.9851, lng: 5.8987 },
      { nombre: 'Gibsonton', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 27.8536, lng: -82.3826 },
      { nombre: 'Lekkerkerk', pais: 'NL', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 51.9021, lng: 4.6904 },
      { nombre: 'Aarau', pais: 'CH', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 47.3904, lng: 8.0457 },
      { nombre: 'Geldern', pais: 'DE', actual: 0, pico: 1, fechaPico: '12 jul 23', lat: 51.5204, lng: 6.3258 },
      { nombre: 'Miramar', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 25.9861, lng: -80.3036 },
      { nombre: 'Villeta', pais: 'CO', actual: 0, pico: 1, fechaPico: '12 jul 23', lat: 5.0117, lng: -74.4704 },
      { nombre: 'Dussen', pais: 'NL', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 51.7301, lng: 4.9637 },
      { nombre: 'Oyster Bay', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 40.8657, lng: -73.5321 },
      { nombre: 'Bielefeld', pais: 'DE', actual: 0, pico: 1, fechaPico: '12 jul 23', lat: 52.0221, lng: 8.5279 },
      { nombre: 'Lorena', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 31.3866, lng: -97.2156 },
      { nombre: 'Msida', pais: 'MT', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 35.8994, lng: 14.4846 },
      { nombre: 'Tilburg', pais: 'NL', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 51.5606, lng: 5.0919 },
      { nombre: 'Sliema', pais: 'MT', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 35.9124, lng: 14.5018 },
      { nombre: 'Seattle', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 47.6061, lng: -122.3328 },
      { nombre: 'Lubbock', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 33.5778, lng: -101.8553 },
      { nombre: 'Gothenburg', pais: 'SE', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 57.7089, lng: 11.9746 },
      { nombre: 'Ludwigshafen', pais: 'DE', actual: 0, pico: 1, fechaPico: '12 jul 23', lat: 49.4774, lng: 8.4447 },
      { nombre: 'Huntsville', pais: 'US', actual: 0, pico: 1, fechaPico: '05 jul 23', lat: 34.7304, lng: -86.5861 },
    ],
    plataformas: [
      {
        clave: 'spotify', nombre: 'Spotify', color: '#1DB954',
        metrica: 'Oyentes mensuales',
        kpis: [{ label: 'Oyentes', valor: '130.7K' }, { label: 'Followers', valor: '966' }, { label: 'Streams', valor: '1.7M' }, { label: 'Popularidad', valor: '37' }, { label: 'Playlists', valor: '80' }, { label: 'Playlist reach', valor: '286.7K' }],
        serie: serie('2024-09-04', [0, 1072, 1, 1072, 2, 1072, 3, 1072, 4, 1072, 5, 1072, 6, 1072, 7, 1055, 8, 1055, 9, 1055, 10, 1055, 11, 1055, 12, 1055, 13, 1055, 14, 1029, 15, 1029, 16, 1029, 17, 1029, 18, 1029, 19, 1029, 20, 1029, 21, 1048, 22, 1048, 23, 1048, 24, 1048, 25, 1048, 26, 1048, 27, 1048, 28, 1014, 29, 1023, 30, 1023, 31, 1023, 32, 1023, 33, 1023, 34, 1023, 35, 1034, 36, 1034, 37, 1034, 38, 1034, 39, 1034, 40, 1034, 41, 1034, 42, 1017, 43, 1017, 44, 1017, 45, 1017, 46, 1017, 47, 1017, 48, 1017, 49, 994, 50, 994, 51, 994, 52, 994, 53, 994, 54, 994, 55, 994, 56, 994, 57, 994, 58, 994, 59, 994, 60, 994, 61, 994, 62, 994, 63, 994, 64, 982, 65, 982, 66, 982, 67, 982, 68, 982, 69, 982, 70, 976, 71, 976, 72, 976, 73, 976, 74, 976, 75, 976, 76, 976, 77, 950, 78, 950, 79, 950, 80, 950, 81, 950, 82, 950, 83, 950, 84, 950, 85, 929, 86, 929, 87, 929, 88, 929, 89, 929, 90, 929, 91, 917, 92, 917, 93, 917, 94, 917, 95, 917, 96, 917, 97, 917, 98, 915, 99, 915, 100, 915, 101, 915, 102, 915, 103, 915, 104, 915, 105, 974, 106, 974, 107, 974, 108, 974, 109, 974, 110, 974, 111, 974, 112, 944, 113, 944, 114, 944, 115, 944, 116, 944, 117, 944, 118, 944, 119, 963, 120, 963, 121, 963, 122, 963, 123, 963, 124, 963, 125, 963, 126, 963, 127, 963, 128, 963, 129, 963, 130, 963, 131, 963, 132, 963, 133, 963, 134, 983, 135, 983, 136, 983, 137, 983, 138, 983, 139, 983, 140, 1098, 141, 1098, 142, 1098, 143, 1098, 144, 1098, 145, 1098, 146, 1098, 147, 1386, 148, 1386, 149, 1386, 150, 1386, 151, 1386, 152, 1386, 153, 1386, 154, 1561, 155, 1561, 156, 1561, 157, 1561, 158, 1561, 159, 1561, 160, 1561, 161, 1621, 162, 1621, 163, 1621, 164, 1621, 165, 1621, 166, 1621, 167, 1621, 168, 1600, 169, 1600, 170, 1600, 171, 1600, 172, 1600, 173, 1600, 174, 1600, 175, 1481, 176, 1481, 177, 1481, 178, 1481, 179, 1481, 180, 1481, 181, 1481, 182, 1447, 183, 1447, 184, 1447, 185, 1447, 186, 1447, 187, 1447, 188, 1447, 189, 1503, 190, 1503, 191, 1503, 192, 1503, 193, 1503, 194, 1503, 195, 1503, 196, 1581, 197, 1581, 198, 1581, 199, 1581, 200, 1581, 201, 1581, 202, 1581, 203, 1670, 204, 1670, 205, 1670, 206, 1670, 207, 1670, 208, 1670, 209, 1670, 210, 1828, 211, 1828, 212, 1828, 213, 1828, 214, 1828, 215, 1828, 216, 1828, 217, 1847, 218, 1847, 219, 1847, 220, 1847, 221, 1847, 222, 1847, 223, 1847, 224, 1824, 225, 1824, 226, 1824, 227, 1824, 228, 1824, 229, 1824, 230, 1824, 231, 1813, 232, 1813, 233, 1813, 234, 1813, 235, 1813, 236, 1813, 237, 1813, 238, 1748, 239, 1748, 240, 1748, 241, 1748, 242, 1748, 243, 1748, 244, 1748, 245, 1684, 246, 1684, 247, 1684, 248, 1684, 249, 1684, 250, 1684, 251, 1684, 252, 1702, 253, 1702, 254, 1702, 255, 1702, 256, 1702, 257, 1702, 258, 1702, 259, 1732, 260, 1732, 261, 1732, 262, 1732, 263, 1732, 264, 1732, 265, 1732, 266, 1824, 267, 1824, 268, 1824, 269, 1824, 270, 1824, 271, 1824, 272, 1824, 273, 1892, 274, 1892, 275, 1892, 276, 1892, 277, 1892, 278, 1892, 279, 1892, 280, 1892, 281, 1891, 282, 1891, 283, 1891, 284, 1891, 285, 1891, 286, 1891, 287, 1888, 288, 1888, 289, 1888, 290, 1888, 291, 1888, 292, 1888, 293, 1888, 294, 1796, 295, 1796, 296, 1796, 297, 1796, 298, 1796, 299, 1796, 300, 1796, 301, 2129, 302, 2129, 303, 2129, 304, 2129, 305, 2129, 306, 2129, 307, 2129, 308, 3411, 309, 3411, 310, 3411, 311, 3411, 312, 3411, 313, 3411, 314, 3411, 315, 3411, 316, 4419, 317, 4419, 318, 4419, 319, 4419, 320, 4419, 321, 4419, 322, 4419, 323, 4476, 324, 4476, 325, 4476, 326, 4476, 327, 4476, 328, 4476, 329, 4892, 330, 4892, 331, 4892, 332, 4892, 333, 4892, 334, 4892, 335, 4892, 336, 4766, 337, 4766, 338, 4766, 339, 4766, 340, 4766, 341, 4766, 342, 4766, 343, 4920, 344, 4920, 345, 4920, 346, 4920, 347, 4920, 348, 4920, 349, 4920, 350, 5085, 351, 5085, 352, 5085, 353, 5085, 354, 5085, 355, 5085, 356, 5085, 357, 5270, 358, 5270, 359, 5270, 360, 5270, 361, 5270, 362, 5270, 363, 5270, 364, 5881, 365, 5881, 366, 5881, 367, 5881, 368, 5881, 369, 5881, 370, 5881, 371, 6979, 372, 6979, 373, 6979, 374, 6979, 375, 6979, 376, 6979, 377, 6979, 378, 11162, 379, 11162, 380, 11162, 381, 11162, 382, 11162, 383, 11162, 384, 11162, 385, 15511, 386, 15511, 387, 15511, 388, 15511, 389, 15511, 390, 15511, 391, 15511, 392, 18042, 393, 18042, 394, 18042, 395, 18042, 396, 18042, 397, 18042, 398, 18042, 399, 19434, 400, 19434, 401, 19434, 402, 19434, 403, 19434, 404, 19434, 405, 19434, 406, 20955, 407, 20955, 408, 20955, 409, 20955, 410, 20955, 411, 20955, 412, 20955, 413, 28051, 414, 28051, 415, 28051, 416, 28051, 417, 28051, 418, 28051, 419, 28051, 420, 33693, 421, 33693, 422, 33693, 423, 33693, 424, 33693, 425, 33693, 426, 33693, 427, 39842, 428, 39842, 429, 39842, 430, 39842, 431, 39842, 432, 39842, 433, 39842, 434, 43403, 435, 43403, 436, 43403, 437, 43403, 438, 43403, 439, 43403, 440, 43403, 441, 39781, 442, 39781, 443, 39781, 444, 39781, 445, 39781, 446, 39781, 447, 39781, 448, 36204, 449, 36204, 450, 36204, 451, 36204, 452, 36204, 453, 36204, 454, 36204, 455, 33420, 456, 33420, 457, 33420, 458, 33420, 459, 33420, 460, 33420, 461, 33420, 462, 30251, 463, 30251, 464, 30251, 465, 30251, 466, 30251, 467, 30251, 468, 30251, 469, 28070, 470, 28070, 471, 28070, 472, 28070, 473, 28070, 474, 28070, 475, 28070, 476, 27447, 477, 27447, 478, 27447, 479, 27447, 480, 27447, 481, 27447, 482, 27447, 483, 26327, 484, 26327, 485, 26327, 486, 26327, 487, 26327, 488, 26327, 489, 26327, 490, 24607, 491, 24607, 492, 24607, 493, 24607, 494, 24607, 495, 24607, 496, 24607, 497, 24502, 498, 24502, 499, 24502, 500, 24502, 501, 24502, 502, 24502, 503, 24502, 504, 24434, 505, 24434, 506, 24434, 507, 24434, 508, 24434, 509, 24434, 510, 24434, 511, 24651, 512, 24651, 513, 24651, 514, 24651, 515, 24651, 516, 24651, 517, 24651, 518, 25306, 519, 25306, 520, 25306, 521, 25306, 522, 25306, 523, 25306, 524, 25306, 525, 26270, 526, 26270, 527, 26270, 528, 26270, 529, 26270, 530, 26270, 531, 26270, 532, 26905, 533, 26905, 534, 26905, 535, 26905, 536, 26905, 537, 26905, 538, 26905, 539, 29160, 540, 29160, 541, 29160, 542, 29160, 543, 29160, 544, 29160, 545, 29160, 546, 31581, 547, 31581, 548, 31581, 549, 31581, 550, 31581, 551, 31581, 552, 31581, 553, 35371, 554, 35371, 555, 35371, 556, 35371, 557, 36575, 558, 36672, 559, 37100, 560, 37804, 561, 38297, 562, 38992, 563, 39637, 564, 40576, 565, 41268, 566, 41486, 567, 41932, 568, 42134, 569, 42749, 570, 43326, 571, 44055, 572, 44982, 573, 45363, 574, 45294, 575, 45468, 576, 45818, 577, 45878, 578, 46372, 579, 46663, 580, 46333, 581, 46802, 582, 47299, 583, 47462, 584, 47264, 585, 47564, 586, 48124, 587, 48124, 588, 47989, 589, 47738, 590, 47523, 591, 47449, 592, 47250, 593, 47631, 594, 48009, 595, 48258, 596, 48603, 597, 48603, 598, 47839, 599, 47117, 600, 46329, 601, 45815, 602, 45585, 603, 45013, 604, 44569, 605, 44641, 606, 44453, 607, 45370, 608, 46216, 609, 48316, 610, 49168, 611, 50577, 612, 50577, 613, 52656, 614, 53806, 615, 54376, 616, 55036, 617, 55609, 618, 56030, 619, 55871, 620, 56266, 621, 55534, 622, 54975, 623, 54959, 624, 54959, 625, 55416, 626, 55681, 627, 56063, 628, 56789, 629, 56789, 630, 58049, 631, 58612, 632, 58823, 633, 58496, 634, 58455, 635, 57738, 636, 57035, 637, 54902, 638, 53911, 639, 53911, 640, 51557, 641, 50867, 642, 50867, 643, 49060, 644, 48426, 645, 47724, 646, 47099, 647, 47090, 648, 46497, 649, 46356, 650, 46154, 651, 45616, 652, 45365, 653, 45116, 654, 44990, 655, 44640, 656, 43308, 657, 43308, 658, 42825, 659, 42825, 660, 42825, 661, 42825, 662, 42825, 663, 42825, 664, 42825, 665, 43094, 666, 43094, 667, 43094, 668, 43094, 669, 43094, 670, 43094, 671, 43094, 672, 44822, 673, 45112, 674, 45112, 675, 45112, 676, 45112, 677, 45112, 678, 45112, 679, 46553, 680, 46553, 681, 46553, 682, 46553, 683, 46553, 684, 46553, 685, 46553, 686, 49558, 687, 49558, 688, 49558, 689, 49558, 690, 49558, 691, 49558, 692, 49558, 693, 52684, 694, 52684, 695, 52684, 696, 52684, 697, 52684, 698, 52684, 699, 52684, 700, 62597, 701, 62597, 702, 62597, 703, 62597, 704, 62597, 705, 62597, 706, 62597, 707, 79416, 708, 79416, 709, 79416, 710, 79416, 711, 86674, 712, 88627, 713, 90502, 714, 92367, 715, 94376, 716, 96544, 717, 99064, 718, 101784, 719, 105017, 720, 108315, 721, 111595, 722, 114551, 723, 117334, 724, 121325, 725, 124897, 726, 127991, 727, 130734, 728, 133237]),
      },
      {
        clave: 'beatport', nombre: 'Beatport', color: '#01FF95',
        metrica: 'DJ charts (acumulado)',
        kpis: [{ label: 'DJ charts', valor: '2' }, { label: 'Tracks charteados', valor: '3' }, { label: 'Releases charteados', valor: '—' }],
        serie: serie('2024-09-02', [0, 9, 1, 9, 2, 9, 3, 9, 4, 9, 5, 9, 6, 9, 7, 9, 8, 9, 9, 9, 10, 9, 11, 9, 12, 9, 13, 9, 14, 9, 15, 9, 16, 9, 17, 10, 18, 10, 19, 10, 20, 10, 21, 10, 22, 10, 23, 10, 24, 10, 25, 10, 26, 10, 27, 10, 28, 10, 29, 10, 30, 10, 31, 10, 32, 10, 33, 10, 34, 10, 35, 10, 36, 10, 37, 10, 38, 10, 39, 10, 40, 10, 41, 10, 42, 10, 43, 10, 44, 10, 45, 10, 46, 10, 47, 10, 48, 10, 49, 10, 50, 10, 51, 10, 52, 10, 53, 10, 54, 10, 55, 10, 56, 10, 57, 10, 58, 10, 59, 10, 60, 11, 61, 11, 62, 11, 63, 11, 64, 11, 65, 11, 66, 11, 67, 11, 68, 11, 69, 11, 70, 11, 71, 11, 72, 11, 73, 11, 74, 11, 75, 11, 76, 11, 77, 11, 78, 11, 79, 11, 80, 11, 81, 11, 82, 11, 83, 11, 84, 11, 85, 11, 86, 11, 87, 11, 88, 11, 89, 11, 90, 11, 91, 11, 92, 11, 93, 11, 94, 11, 95, 11, 96, 11, 97, 11, 98, 11, 99, 11, 100, 11, 101, 11, 102, 11, 103, 11, 104, 11, 105, 11, 106, 11, 107, 11, 108, 11, 109, 11, 110, 11, 111, 11, 112, 11, 113, 11, 114, 11, 115, 11, 116, 11, 117, 11, 118, 11, 119, 11, 120, 11, 121, 11, 122, 11, 123, 11, 124, 11, 125, 11, 126, 11, 127, 11, 128, 11, 129, 11, 130, 11, 131, 11, 132, 11, 133, 11, 134, 11, 135, 11, 136, 11, 137, 11, 138, 11, 139, 11, 140, 11, 141, 11, 142, 11, 143, 11, 144, 11, 145, 11, 146, 11, 147, 11, 148, 11, 149, 11, 150, 11, 151, 11, 152, 11, 153, 11, 154, 11, 155, 11, 156, 11, 157, 11, 158, 11, 159, 11, 160, 11, 161, 11, 162, 11, 163, 11, 164, 11, 165, 11, 166, 11, 167, 11, 168, 11, 169, 11, 170, 11, 171, 11, 172, 11, 173, 11, 174, 11, 175, 11, 176, 11, 177, 11, 178, 11, 179, 11, 180, 11, 181, 11, 182, 11, 183, 11, 184, 11, 185, 11, 186, 11, 187, 11, 188, 11, 189, 11, 190, 11, 191, 11, 192, 11, 193, 11, 194, 11, 195, 11, 196, 11, 197, 11, 198, 11, 199, 11, 200, 11, 201, 11, 202, 11, 203, 11, 204, 11, 205, 11, 206, 11, 207, 11, 208, 11, 209, 11, 210, 11, 211, 11, 212, 11, 213, 11, 214, 11, 215, 11, 216, 11, 217, 11, 218, 11, 219, 11, 220, 11, 221, 11, 222, 11, 223, 11, 224, 11, 225, 11, 226, 11, 227, 11, 228, 11, 229, 11, 230, 11, 231, 11, 232, 11, 233, 11, 234, 11, 235, 11, 236, 11, 237, 11, 238, 11, 239, 11, 240, 11, 241, 11, 242, 11, 243, 11, 244, 11, 245, 11, 246, 11, 247, 11, 248, 11, 249, 11, 250, 11, 251, 11, 252, 11, 253, 11, 254, 11, 255, 11, 256, 11, 257, 11, 258, 11, 259, 11, 260, 11, 261, 11, 262, 11, 263, 11, 264, 11, 265, 11, 266, 11, 267, 11, 268, 11, 269, 11, 270, 11, 271, 11, 272, 11, 273, 11, 274, 11, 275, 11, 276, 11, 277, 11, 278, 11, 279, 11, 280, 11, 281, 11, 282, 11, 283, 11, 284, 11, 285, 11, 286, 11, 287, 11, 288, 11, 289, 11, 290, 11, 291, 11, 292, 11, 293, 11, 294, 11, 295, 11, 296, 11, 297, 11, 298, 11, 299, 11, 300, 11, 301, 11, 302, 11, 303, 11, 304, 11, 305, 11, 306, 11, 307, 11, 308, 11, 309, 11, 310, 11, 311, 11, 312, 11, 313, 11, 314, 11, 315, 11, 316, 11, 317, 11, 318, 11, 319, 11, 320, 11, 321, 11, 322, 11, 323, 11, 324, 11, 325, 11, 326, 11, 327, 11, 328, 11, 329, 11, 330, 11, 331, 11, 332, 11, 333, 11, 334, 11, 335, 11, 336, 11, 337, 11, 338, 11, 339, 11, 340, 11, 341, 11, 342, 11, 343, 11, 344, 11, 345, 11, 346, 11, 347, 11, 348, 12, 349, 12, 350, 12, 351, 12, 352, 12, 353, 12, 354, 12, 355, 12, 356, 12, 357, 12, 358, 12, 359, 12, 360, 12, 361, 12, 362, 12, 363, 12, 364, 12, 365, 12, 366, 12, 367, 12, 368, 12, 369, 12, 370, 12, 371, 12, 372, 12, 373, 12, 374, 12, 375, 13, 376, 13, 377, 14, 378, 15, 379, 15, 380, 15, 381, 15, 382, 15, 383, 15, 384, 15, 385, 15, 386, 15, 387, 15, 388, 15, 389, 15, 390, 15, 391, 15, 392, 15, 393, 15, 394, 15, 395, 15, 396, 15, 397, 15, 398, 15, 399, 15, 400, 15, 401, 15, 402, 15, 403, 15, 404, 15, 405, 15, 406, 15, 407, 15, 408, 15, 409, 15, 410, 16, 411, 16, 412, 16, 413, 16, 414, 16, 415, 16, 416, 16, 417, 16, 418, 16, 419, 16, 420, 16, 421, 16, 422, 16, 423, 16, 424, 16, 425, 16, 426, 16, 427, 17, 428, 17, 429, 17, 430, 17, 431, 17, 432, 17, 433, 17, 434, 17, 435, 17, 436, 17, 437, 17, 438, 17, 439, 17, 440, 17, 441, 17, 442, 17, 443, 17, 444, 17, 445, 17, 446, 17, 447, 17, 448, 17, 449, 17, 450, 17, 451, 17, 452, 17, 453, 17, 454, 17, 455, 17, 456, 17, 457, 17, 458, 17, 459, 17, 460, 17, 461, 17, 462, 17, 463, 17, 464, 17, 465, 17, 466, 17, 467, 17, 468, 17, 469, 17, 470, 17, 471, 17, 472, 17, 473, 17, 474, 17, 475, 17, 476, 17, 477, 17, 478, 17, 479, 17, 480, 17, 481, 17, 482, 17, 483, 17, 484, 17, 485, 17, 486, 17, 487, 17, 488, 17, 489, 17, 490, 17, 491, 17, 492, 17, 493, 17, 494, 17, 495, 17, 496, 17, 497, 17, 498, 17, 499, 17, 500, 17, 501, 17, 502, 17, 503, 17, 504, 17, 505, 17, 506, 17, 507, 17, 508, 17, 509, 17, 510, 17, 511, 17, 512, 17, 513, 17, 514, 17, 515, 17, 516, 17, 517, 17, 518, 17, 519, 17, 520, 17, 521, 17, 522, 17, 523, 17, 524, 17, 525, 17, 526, 17, 527, 17, 528, 17, 529, 17, 530, 17, 531, 17, 532, 17, 533, 17, 534, 17, 535, 17, 536, 17, 537, 17, 538, 17, 539, 17, 540, 17, 541, 17, 542, 17, 543, 17, 544, 17, 545, 17, 546, 17, 547, 17, 548, 17, 549, 17, 550, 17, 551, 17, 552, 17, 553, 17, 554, 17, 555, 17, 556, 17, 557, 17, 558, 17, 559, 17, 560, 17, 561, 17, 562, 17, 563, 17, 564, 17, 565, 17, 566, 17, 567, 17, 568, 17, 569, 17, 570, 17, 571, 17, 572, 17, 573, 17, 574, 17, 575, 17, 576, 17, 577, 17, 578, 17, 579, 17, 580, 17, 581, 17, 582, 17, 583, 17, 584, 17, 585, 17, 586, 17, 587, 17, 588, 17, 589, 17, 590, 17, 591, 17, 592, 17, 593, 17, 594, 17, 595, 17, 596, 17, 597, 17, 598, 17, 599, 17, 600, 17, 601, 17, 602, 17, 603, 17, 604, 17, 605, 17, 606, 17, 607, 17, 608, 17, 609, 17, 610, 17, 611, 17, 612, 17, 613, 17, 614, 17, 615, 17, 616, 17, 617, 17, 618, 17, 619, 17, 620, 17, 621, 17, 622, 17, 623, 17, 624, 17, 625, 17, 626, 17, 627, 17, 628, 17, 629, 17, 630, 17, 631, 17, 632, 17, 633, 17, 634, 17, 635, 18, 636, 18, 637, 18, 638, 18, 639, 18, 640, 18, 641, 18, 642, 18, 643, 18, 644, 18, 645, 18, 646, 18, 647, 18, 648, 18, 649, 18, 650, 18, 651, 18, 652, 18, 653, 18, 654, 18, 655, 19, 656, 19, 657, 19, 658, 19, 659, 19, 660, 19, 661, 19, 662, 19, 663, 19, 664, 19, 665, 19, 666, 21, 667, 21, 668, 21, 669, 21, 670, 21, 671, 21, 672, 21, 673, 21, 674, 21, 675, 21, 676, 22, 677, 22, 678, 22, 679, 22, 680, 23, 681, 23, 682, 23, 683, 23, 684, 23, 685, 23, 686, 23, 687, 23, 688, 23, 689, 23, 690, 23, 691, 23, 692, 23, 693, 23, 694, 23, 695, 23, 696, 23, 697, 23, 698, 23, 699, 23, 700, 23, 701, 23, 702, 23, 703, 23, 704, 23, 705, 23, 706, 23, 707, 23, 708, 23, 709, 23, 710, 23, 711, 23, 712, 23, 713, 23, 714, 23, 715, 23, 716, 23, 717, 23, 718, 23, 719, 23, 720, 23, 721, 23, 722, 23, 723, 23, 724, 23, 725, 23, 726, 23, 727, 23, 728, 23, 729, 23, 730, 23]),
      },
      {
        clave: 'shazam', nombre: 'Shazam', color: '#0088FF',
        metrica: 'Shazams',
        kpis: [{ label: 'Shazams', valor: '47.4K' }, { label: 'Charts', valor: '2' }],
        serie: serie('2024-09-02', [0, 691, 1, 691, 2, 691, 3, 691, 4, 691, 5, 691, 6, 691, 7, 691, 8, 691, 9, 691, 10, 691, 11, 691, 12, 691, 13, 691, 14, 691, 15, 691, 16, 691, 17, 691, 18, 691, 19, 691, 20, 691, 21, 691, 22, 691, 23, 691, 24, 691, 25, 691, 26, 691, 27, 691, 28, 691, 29, 691, 30, 691, 31, 691, 32, 691, 33, 691, 34, 691, 35, 691, 36, 691, 37, 691, 38, 691, 39, 691, 40, 704, 41, 704, 42, 704, 43, 704, 44, 704, 45, 704, 46, 704, 47, 704, 48, 704, 49, 704, 50, 704, 51, 704, 52, 704, 53, 704, 54, 704, 55, 704, 56, 704, 57, 704, 58, 704, 59, 704, 60, 704, 61, 704, 62, 704, 63, 704, 64, 704, 65, 704, 66, 704, 67, 704, 68, 712, 69, 712, 70, 712, 71, 712, 72, 712, 76, 712, 83, 712, 90, 712, 97, 712, 104, 714, 111, 714, 118, 714, 125, 714, 132, 728, 139, 728, 146, 728, 153, 728, 160, 728, 167, 731, 174, 731, 181, 731, 188, 731, 195, 736, 202, 736, 209, 736, 210, 8331, 216, 8353, 223, 8359, 230, 8473, 237, 8473, 244, 8697, 251, 8769, 257, 8769, 264, 8931, 271, 8931, 278, 9119, 286, 9124, 292, 9216, 299, 9216, 306, 9395, 313, 9398, 320, 9591, 327, 9591, 334, 9726, 341, 9798, 348, 9801, 355, 10002, 362, 10002, 369, 10002, 376, 10004, 383, 10382, 390, 10382, 397, 10400, 404, 10400, 411, 10600, 418, 10600, 425, 10685, 432, 10731, 440, 10735, 446, 10832, 453, 10832, 460, 10913, 467, 10913, 474, 11041, 481, 11043, 488, 11143, 495, 11200, 502, 11201, 509, 11253, 516, 14082, 523, 14275, 530, 14276, 537, 14570, 544, 14676, 551, 14934, 558, 15080, 559, 15080, 560, 15080, 561, 15080, 562, 15160, 563, 15160, 564, 15160, 565, 15272, 566, 15272, 567, 15272, 568, 15272, 569, 15272, 570, 15272, 571, 15272, 573, 15419, 574, 15419, 575, 15419, 576, 15486, 577, 15486, 578, 15486, 579, 15658, 580, 15658, 581, 15658, 582, 15658, 583, 15658, 584, 15658, 585, 15658, 586, 15783, 587, 15783, 588, 15783, 589, 15783, 590, 15841, 591, 16058, 592, 16058, 594, 16189, 595, 16189, 596, 16189, 597, 16189, 598, 16189, 599, 16189, 600, 16336, 601, 16336, 603, 16336, 604, 16430, 605, 16430, 607, 16545, 610, 16545, 611, 16569, 612, 16569, 613, 16569, 617, 16713, 618, 16713, 619, 16713, 621, 16839, 622, 16839, 623, 16839, 624, 16839, 625, 16839, 626, 16839, 630, 16959, 631, 16959, 632, 16959, 634, 16959, 635, 17071, 639, 17212, 641, 17342, 642, 17342, 643, 17342, 644, 24045, 645, 24045, 646, 24047, 647, 24047, 648, 24047, 649, 24267, 651, 24267, 652, 24267, 654, 24315, 655, 24315, 656, 24584, 657, 24584, 659, 24584, 663, 24833, 675, 31751, 676, 31962, 677, 31962, 678, 31962, 679, 31962, 680, 32072, 681, 32072, 682, 32072, 683, 33097, 684, 33097, 685, 33097, 686, 33097, 687, 33097, 688, 33097, 689, 33097, 690, 33987, 691, 33987, 692, 33987, 693, 33987, 694, 34226, 695, 34226, 696, 34226, 697, 35416, 698, 35416, 699, 35416, 700, 35416, 701, 35549, 702, 35549, 703, 35549, 704, 37162, 705, 37162, 706, 37211, 707, 37211, 708, 37211, 709, 37211, 710, 37211, 711, 39227, 712, 39374, 713, 40363, 714, 40683, 715, 41058, 716, 41436, 717, 41436, 718, 41436, 719, 41436, 720, 41436, 721, 41436, 722, 41436, 723, 41436, 724, 41436, 725, 41436, 726, 46821, 727, 47437, 728, 47439, 729, 47439, 730, 48376]),
      },
      {
        clave: 'youtube', nombre: 'YouTube', color: '#FF0000',
        metrica: 'Suscriptores',
        kpis: [{ label: 'Suscriptores', valor: '246' }, { label: 'Followers', valor: '—' }, { label: 'Views', valor: '—' }, { label: 'Vídeos', valor: '19' }],
        serie: serie('2025-03-31', [0, 28, 1, 28, 2, 28, 3, 28, 4, 28, 5, 28, 6, 28, 7, 28, 8, 28, 9, 28, 10, 28, 11, 28, 12, 28, 13, 28, 14, 28, 15, 28, 16, 28, 17, 28, 18, 29, 19, 29, 20, 29, 21, 29, 22, 29, 23, 29, 24, 29, 25, 29, 26, 29, 27, 29, 28, 29, 29, 29, 30, 29, 31, 29, 32, 29, 33, 29, 34, 29, 35, 29, 36, 29, 37, 29, 38, 29, 39, 29, 40, 29, 41, 29, 42, 29, 43, 29, 44, 30, 45, 30, 46, 30, 47, 30, 48, 30, 49, 30, 50, 30, 51, 30, 52, 30, 53, 30, 54, 30, 55, 31, 56, 31, 57, 31, 58, 31, 59, 31, 60, 31, 61, 31, 62, 31, 63, 31, 64, 31, 65, 31, 66, 31, 67, 31, 68, 31, 69, 31, 70, 31, 71, 31, 72, 31, 73, 31, 74, 31, 75, 31, 76, 31, 77, 31, 78, 31, 79, 31, 80, 31, 81, 31, 82, 33, 83, 33, 84, 33, 85, 33, 86, 33, 87, 33, 88, 33, 89, 33, 90, 33, 91, 33, 92, 33, 93, 33, 94, 35, 95, 35, 96, 35, 97, 35, 98, 35, 99, 35, 100, 35, 101, 35, 102, 35, 103, 35, 104, 35, 105, 35, 106, 35, 107, 35, 108, 35, 109, 35, 110, 35, 111, 35, 112, 35, 113, 35, 114, 35, 115, 35, 116, 35, 117, 35, 118, 35, 119, 35, 120, 35, 121, 35, 122, 35, 123, 35, 124, 35, 125, 36, 126, 36, 127, 36, 128, 36, 129, 36, 130, 36, 131, 36, 132, 36, 133, 38, 134, 38, 135, 38, 136, 38, 137, 38, 138, 38, 139, 38, 140, 38, 141, 38, 142, 38, 143, 38, 144, 38, 145, 38, 146, 39, 147, 39, 148, 39, 149, 39, 150, 39, 151, 39, 152, 39, 153, 40, 154, 40, 155, 40, 156, 40, 157, 40, 158, 40, 159, 40, 160, 41, 161, 41, 162, 41, 163, 41, 164, 41, 165, 41, 166, 41, 167, 47, 168, 47, 169, 47, 170, 47, 171, 47, 172, 47, 173, 47, 174, 58, 175, 58, 176, 58, 177, 58, 178, 58, 179, 58, 180, 58, 181, 58, 182, 68, 183, 68, 184, 68, 185, 68, 186, 68, 187, 68, 188, 70, 189, 70, 190, 70, 191, 70, 192, 70, 193, 70, 194, 70, 195, 78, 196, 78, 197, 78, 198, 78, 199, 78, 200, 78, 201, 78, 202, 78, 203, 78, 204, 78, 205, 78, 206, 78, 207, 78, 208, 78, 209, 78, 210, 86, 211, 86, 212, 86, 213, 86, 214, 86, 215, 86, 216, 90, 217, 90, 218, 90, 219, 90, 220, 90, 221, 90, 222, 90, 223, 93, 224, 93, 225, 93, 226, 93, 227, 93, 228, 93, 229, 93, 230, 93, 231, 93, 232, 93, 233, 93, 234, 93, 235, 93, 236, 98, 237, 98, 238, 98, 239, 98, 240, 98, 241, 98, 242, 98, 243, 98, 244, 98, 245, 98, 246, 98, 247, 98, 248, 98, 249, 98, 250, 98, 251, 101, 252, 101, 253, 101, 254, 101, 255, 101, 256, 101, 257, 101, 258, 101, 259, 101, 260, 101, 261, 101, 262, 101, 263, 101, 264, 107, 265, 107, 266, 107, 267, 107, 268, 107, 269, 107, 270, 107, 271, 107, 272, 107, 273, 107, 274, 107, 275, 107, 276, 107, 277, 107, 278, 107, 279, 107, 280, 107, 281, 107, 282, 107, 283, 107, 284, 107, 285, 107, 286, 113, 287, 113, 288, 113, 289, 113, 290, 113, 291, 113, 292, 113, 293, 115, 294, 115, 295, 115, 296, 115, 297, 115, 298, 115, 299, 115, 300, 115, 301, 115, 302, 115, 303, 115, 304, 115, 305, 115, 306, 115, 307, 115, 308, 115, 309, 115, 310, 115, 311, 115, 312, 115, 313, 115, 314, 115, 315, 115, 316, 115, 317, 115, 318, 115, 319, 115, 320, 115, 321, 115, 322, 115, 323, 115, 324, 115, 325, 115, 326, 115, 327, 115, 328, 115, 329, 115, 330, 115, 331, 115, 332, 115, 333, 115, 334, 115, 335, 115, 336, 115, 337, 115, 338, 115, 339, 115, 340, 115, 341, 115, 342, 115, 343, 115, 344, 115, 345, 115, 346, 115, 347, 115, 348, 115, 349, 115, 350, 115, 351, 115, 352, 115, 353, 115, 354, 115, 355, 115, 356, 115, 357, 115, 358, 115, 359, 115, 360, 115, 361, 115, 362, 115, 363, 115, 364, 115, 365, 115, 366, 115, 367, 115, 368, 115, 369, 115, 370, 115, 371, 115, 372, 115, 373, 115, 374, 115, 375, 115, 376, 115, 377, 115, 378, 115, 379, 115, 380, 115, 381, 115, 382, 115, 383, 115, 384, 115, 385, 115, 386, 115, 387, 115, 388, 115, 389, 115, 390, 115, 391, 115, 392, 115, 393, 115, 394, 115, 395, 115, 396, 115, 397, 115, 398, 115, 399, 115, 400, 115, 401, 115, 402, 115, 403, 115, 404, 115, 405, 115, 406, 115, 407, 115, 408, 115, 409, 115, 410, 115, 411, 115, 412, 115, 413, 115, 414, 115, 415, 115, 416, 115, 417, 115, 418, 115, 419, 115, 420, 115, 421, 115, 422, 115, 423, 115, 424, 115, 425, 115, 426, 115, 427, 115, 428, 115, 429, 115, 430, 115, 431, 115, 432, 115, 433, 115, 434, 115, 435, 115, 436, 115, 437, 115, 438, 115, 439, 115, 440, 115, 441, 115, 442, 115, 443, 115, 444, 115, 445, 115, 446, 115, 447, 115, 448, 115, 449, 115, 450, 115, 451, 115, 452, 115, 453, 115, 454, 115, 455, 115, 456, 115, 457, 115, 458, 115, 459, 115, 460, 115, 461, 115, 462, 115, 463, 115, 464, 115, 465, 196, 466, 196, 467, 200, 468, 200, 469, 200, 470, 200, 471, 200, 472, 200, 473, 200, 474, 206, 475, 206, 476, 206, 477, 206, 478, 206, 479, 206, 480, 206, 481, 213, 482, 213, 483, 213, 484, 213, 485, 213, 486, 213, 487, 213, 488, 224, 489, 224, 490, 224, 491, 224, 492, 224, 493, 224, 494, 224, 495, 224, 496, 230, 497, 230, 498, 230, 499, 230, 500, 230, 501, 230, 502, 230, 503, 236, 504, 236, 505, 238, 506, 238, 507, 238, 508, 238, 509, 239, 510, 239, 511, 239, 512, 241, 513, 243, 514, 243, 515, 243, 516, 245, 517, 245, 518, 246, 519, 246, 520, 246]),
      },
      {
        clave: 'tiktok', nombre: 'TikTok', color: '#000000',
        metrica: 'Likes',
        kpis: [{ label: 'Followers', valor: '0' }, { label: 'Likes', valor: '1M' }, { label: 'Vídeos', valor: '15.1K' }],
        serie: serie('2025-04-06', [0, 21, 7, 21, 14, 21, 21, 21, 28, 21, 35, 21, 41, 21, 48, 21, 49, 47, 55, 47, 62, 47, 70, 47, 76, 47, 83, 47, 90, 47, 97, 47, 104, 47, 111, 47, 118, 47, 125, 47, 132, 47, 139, 47, 146, 47, 153, 47, 160, 47, 167, 47, 174, 47, 181, 47, 188, 47, 195, 47, 202, 47, 209, 47, 216, 47, 224, 47, 230, 47, 237, 47, 244, 47, 251, 47, 258, 47, 265, 49, 272, 49, 279, 49, 286, 49, 293, 49, 300, 49, 307, 49, 314, 49, 321, 49, 328, 49, 335, 49, 342, 49, 343, 49, 344, 49, 345, 49, 346, 49, 347, 49, 348, 49, 349, 49, 350, 49, 351, 49, 352, 49, 353, 49, 354, 49, 355, 49, 357, 49, 358, 49, 359, 49, 360, 49, 361, 49, 362, 49, 363, 49, 364, 49, 365, 49, 366, 49, 367, 49, 368, 49, 369, 49, 370, 49, 371, 49, 372, 49, 373, 49, 374, 502, 375, 502, 376, 502, 378, 502, 379, 502, 380, 502, 381, 502, 382, 502, 383, 502, 384, 502, 385, 502, 387, 502, 388, 502, 389, 502, 391, 502, 394, 502, 395, 502, 396, 502, 397, 502, 401, 502, 402, 502, 403, 502, 405, 502, 406, 502, 407, 502, 408, 502, 409, 502, 410, 502, 414, 502, 415, 502, 416, 502, 418, 5179, 419, 5265, 420, 5344, 421, 5424, 422, 5503, 423, 5587, 424, 5663, 425, 5750, 426, 5829, 427, 5912, 428, 5997, 429, 6080, 430, 6166, 431, 6239, 432, 6327, 433, 6414, 434, 6501, 435, 6587, 436, 6681, 437, 6776, 438, 6879, 439, 6973, 440, 7073, 441, 7173, 442, 7274, 443, 7362, 444, 7471, 445, 7566, 446, 7671, 447, 7778, 448, 7885, 449, 7995, 450, 8219, 451, 8440, 452, 8660, 453, 8892, 454, 9355, 455, 9906, 456, 10463, 457, 11111, 458, 11794, 459, 12519, 460, 12975, 461, 13437, 462, 13891, 463, 14351, 464, 14810, 465, 15268, 466, 15735, 467, 16205, 468, 16706, 469, 17216, 470, 17728, 471, 18238, 472, 18755, 473, 19263, 474, 19777, 475, 20289, 476, 20796, 477, 21382, 478, 21974, 479, 22571, 480, 23162, 481, 23751, 482, 24344, 483, 24937, 484, 25537, 485, 26144, 486, 27531, 487, 29078, 488, 32788, 489, 37081, 490, 44140, 491, 52876, 492, 62324, 493, 72569, 494, 85413, 495, 100276, 496, 119116, 497, 139929, 498, 164430, 499, 191361, 500, 219522, 501, 249701, 502, 282051, 503, 322277, 504, 374867, 505, 431513, 506, 492693, 507, 560863, 508, 645098, 509, 744468, 510, 854377, 511, 972907, 512, 983344, 513, 1004283, 514, 1037779]),
      },
      {
        clave: 'instagram', nombre: 'Instagram', color: '#E1306C',
        metrica: 'Followers',
        kpis: [{ label: 'Followers', valor: '22.6K' }],
        serie: serie('2024-09-08', [0, 20293, 1, 20293, 2, 20293, 3, 20293, 4, 20293, 5, 20293, 6, 20293, 7, 20313, 8, 20313, 9, 20313, 10, 20313, 11, 20313, 12, 20313, 13, 20313, 14, 20390, 15, 20390, 16, 20390, 17, 20390, 18, 20390, 19, 20390, 20, 20390, 21, 20504, 22, 20504, 23, 20504, 24, 20504, 25, 20504, 26, 20504, 27, 20504, 28, 20612, 29, 20612, 30, 20612, 31, 20612, 32, 20612, 33, 20612, 34, 20612, 35, 20656, 36, 20656, 37, 20656, 38, 20656, 39, 20656, 40, 20656, 41, 20656, 42, 20679, 43, 20679, 44, 20679, 45, 20679, 46, 20679, 47, 20679, 48, 20679, 49, 20746, 50, 20746, 51, 20746, 52, 20746, 53, 20746, 54, 20746, 55, 20746, 56, 20847, 57, 20847, 58, 20847, 59, 20847, 60, 20847, 61, 20847, 62, 20847, 63, 21038, 64, 21038, 65, 21038, 66, 21038, 67, 21038, 68, 21038, 69, 21038, 70, 21022, 71, 21022, 72, 21022, 73, 21022, 74, 21022, 75, 21022, 76, 21022, 77, 21022, 78, 21022, 79, 21022, 80, 21022, 81, 21022, 82, 21022, 83, 21022, 84, 21033, 85, 21033, 86, 21033, 87, 21033, 88, 21033, 89, 21033, 90, 21033, 91, 21047, 92, 21047, 93, 21047, 94, 21047, 95, 21047, 96, 21047, 97, 21047, 98, 21011, 99, 21011, 100, 21011, 101, 21011, 102, 21011, 103, 21011, 104, 21011, 105, 20979, 106, 20979, 107, 20979, 108, 20979, 109, 20979, 110, 20979, 111, 20979, 112, 21018, 113, 21018, 114, 21018, 115, 21018, 116, 21018, 117, 21018, 118, 21018, 119, 21024, 120, 21024, 121, 21024, 122, 21024, 123, 21024, 124, 21024, 125, 21024, 126, 20993, 127, 20993, 128, 20993, 129, 20993, 130, 20993, 131, 20993, 132, 20993, 133, 20959, 134, 20959, 135, 20959, 136, 20959, 137, 20959, 138, 20959, 139, 20959, 140, 20977, 141, 20977, 142, 20977, 143, 20977, 144, 20977, 145, 20977, 146, 20977, 147, 20974, 148, 20974, 149, 20974, 150, 20974, 151, 20974, 152, 20974, 153, 20974, 154, 21010, 155, 21010, 156, 21010, 157, 21010, 158, 21010, 159, 21010, 160, 21010, 161, 20986, 162, 20986, 163, 20986, 164, 20986, 165, 20986, 166, 20986, 167, 20986, 168, 20986, 169, 20973, 170, 20973, 171, 20973, 172, 20973, 173, 20973, 174, 20973, 175, 20967, 176, 20967, 177, 20967, 178, 20967, 179, 20967, 180, 20967, 181, 20967, 182, 20948, 183, 20948, 184, 20948, 185, 20948, 186, 20948, 187, 20948, 188, 20948, 189, 20948, 190, 20948, 191, 20948, 192, 20948, 193, 20948, 194, 20948, 195, 20948, 196, 20995, 197, 20995, 198, 20995, 199, 20995, 200, 20995, 201, 20995, 202, 20995, 203, 21037, 204, 21037, 205, 21037, 206, 21037, 207, 21037, 208, 21037, 209, 21037, 210, 21032, 211, 21032, 212, 21032, 213, 21032, 214, 21032, 215, 21032, 216, 21032, 217, 21036, 218, 21036, 219, 21036, 220, 21036, 221, 21036, 222, 21036, 223, 21036, 224, 21028, 225, 21028, 226, 21028, 227, 21028, 228, 21028, 229, 21028, 230, 21028, 231, 21029, 232, 21029, 233, 21029, 234, 21029, 235, 21029, 236, 21029, 237, 21029, 238, 21001, 239, 21001, 240, 21001, 241, 21001, 242, 21001, 243, 21001, 244, 21001, 245, 21001, 246, 21001, 247, 21001, 248, 21001, 249, 21001, 250, 21001, 251, 21001, 252, 20975, 253, 20975, 254, 20975, 255, 20975, 256, 20975, 257, 20975, 258, 20975, 259, 20975, 260, 20949, 261, 20949, 262, 20949, 263, 20949, 264, 20949, 265, 20949, 266, 20940, 267, 20937, 268, 20937, 269, 20937, 270, 20937, 271, 20937, 272, 20937, 273, 20937, 274, 20931, 275, 20931, 276, 20931, 277, 20931, 278, 20931, 279, 20931, 280, 20931, 281, 20919, 282, 20919, 283, 20919, 284, 20919, 285, 20919, 286, 20919, 287, 20919, 288, 20919, 289, 20919, 290, 20919, 291, 20919, 292, 20919, 293, 20919, 294, 20919, 295, 20972, 296, 20972, 297, 20972, 298, 20972, 299, 20972, 300, 20972, 301, 20972, 302, 21056, 303, 21056, 304, 21056, 305, 21056, 306, 21056, 307, 21056, 308, 21062, 309, 21062, 310, 21062, 311, 21062, 312, 21062, 313, 21062, 314, 21062, 315, 21080, 316, 21080, 317, 21080, 318, 21080, 319, 21080, 320, 21080, 321, 21080, 322, 21109, 323, 21109, 324, 21109, 325, 21109, 326, 21109, 327, 21109, 328, 21109, 329, 21139, 330, 21139, 331, 21139, 332, 21139, 333, 21139, 334, 21139, 335, 21139, 336, 21147, 337, 21147, 338, 21147, 339, 21147, 340, 21147, 341, 21147, 342, 21147, 343, 21123, 344, 21123, 345, 21123, 346, 21123, 347, 21123, 348, 21123, 349, 21123, 350, 21125, 351, 21125, 352, 21125, 353, 21125, 354, 21125, 355, 21125, 356, 21125, 357, 21125, 358, 21125, 359, 21125, 360, 21125, 361, 21125, 362, 21125, 363, 21125, 364, 21147, 365, 21147, 366, 21147, 367, 21147, 368, 21147, 369, 21147, 370, 21147, 371, 21188, 372, 21188, 373, 21188, 374, 21188, 375, 21188, 376, 21188, 377, 21188, 378, 21207, 379, 21207, 380, 21207, 381, 21207, 382, 21207, 383, 21207, 384, 21207, 385, 21212, 386, 21212, 387, 21212, 388, 21212, 389, 21212, 390, 21212, 391, 21212, 392, 21232, 393, 21232, 394, 21232, 395, 21232, 396, 21232, 397, 21232, 398, 21232, 399, 21244, 400, 21244, 401, 21244, 402, 21244, 403, 21244, 404, 21244, 405, 21244, 406, 21240, 407, 21240, 408, 21240, 409, 21240, 410, 21240, 411, 21240, 412, 21240, 413, 21223, 414, 21223, 415, 21223, 416, 21223, 417, 21223, 418, 21223, 419, 21223, 420, 21236, 421, 21236, 422, 21236, 423, 21236, 424, 21236, 425, 21236, 426, 21236, 427, 21251, 428, 21251, 429, 21251, 430, 21251, 431, 21251, 432, 21251, 433, 21251, 434, 21277, 435, 21277, 436, 21277, 437, 21277, 438, 21277, 439, 21277, 440, 21277, 441, 21314, 442, 21314, 443, 21314, 444, 21314, 445, 21314, 446, 21314, 447, 21314, 448, 21387, 449, 21387, 450, 21387, 451, 21387, 452, 21387, 453, 21387, 454, 21387, 455, 21394, 456, 21394, 457, 21394, 458, 21394, 459, 21394, 460, 21394, 461, 21394, 462, 21389, 463, 21389, 464, 21389, 465, 21389, 466, 21389, 467, 21389, 468, 21389, 469, 21414, 470, 21414, 471, 21414, 472, 21414, 473, 21414, 474, 21414, 475, 21414, 476, 21420, 477, 21420, 478, 21420, 479, 21420, 480, 21420, 481, 21420, 482, 21420, 483, 21424, 484, 21424, 485, 21424, 486, 21424, 487, 21424, 488, 21424, 489, 21424, 490, 21458, 491, 21458, 492, 21458, 493, 21458, 494, 21458, 495, 21458, 496, 21458, 497, 21458, 498, 21458, 499, 21494, 500, 21494, 501, 21494, 502, 21494, 503, 21494, 504, 21494, 505, 21494, 506, 21494, 507, 21494, 508, 21494, 509, 21494, 510, 21494, 511, 21494, 512, 21494, 513, 21494, 514, 21494, 515, 21494, 516, 21494, 517, 21494, 518, 21519, 519, 21519, 520, 21519, 521, 21519, 522, 21519, 523, 21519, 524, 21519, 525, 21523, 526, 21523, 527, 21523, 528, 21523, 529, 21523, 530, 21523, 531, 21523, 532, 21523, 533, 21523, 534, 21523, 535, 21523, 536, 21523, 537, 21523, 538, 21523, 539, 21571, 540, 21571, 541, 21577, 542, 21577, 543, 21577, 544, 21577, 545, 21577, 546, 21577, 547, 21577, 548, 21577, 549, 21577, 550, 21577, 551, 21577, 552, 21577, 553, 21688, 554, 21695, 555, 21691, 556, 21700, 557, 21708, 558, 21708, 559, 21703, 560, 21702, 561, 21702, 562, 21717, 563, 21721, 564, 21729, 565, 21728, 566, 21744, 567, 21755, 568, 21768, 569, 21768, 570, 21770, 571, 21779, 572, 21794, 573, 21812, 574, 21812, 575, 21812, 576, 21812, 577, 21821, 578, 21820, 579, 21820, 580, 21826, 581, 21874, 582, 21878, 583, 21886, 584, 21899, 585, 21911, 586, 21921, 587, 21933, 588, 21933, 589, 21960, 590, 21973, 591, 21988, 592, 22014, 593, 22016, 594, 22016, 595, 22027, 596, 22032, 597, 22034, 598, 22034, 599, 22056, 600, 22058, 601, 22066, 602, 22087, 603, 22080, 604, 22069, 605, 21982, 606, 21982, 607, 21965, 608, 21969, 609, 21988, 610, 21988, 611, 21989, 612, 21994, 613, 22011, 614, 22019, 615, 22016, 616, 22032, 617, 22032, 618, 22032, 619, 22037, 620, 22042, 621, 22040, 622, 22034, 623, 22040, 624, 22037, 625, 22037, 626, 22036, 627, 22042, 628, 22046, 629, 22050, 630, 22055, 631, 22055, 632, 22060, 633, 22060, 634, 22078, 635, 22094, 636, 22118, 637, 22118, 638, 22125, 639, 22125, 640, 22133, 641, 22132, 642, 22137, 643, 22144, 644, 22144, 645, 22150, 646, 22150, 647, 22300, 648, 22315, 649, 22321, 650, 22417, 651, 22436, 652, 22436, 653, 22465, 654, 22465, 655, 22465, 656, 22465, 657, 22465, 658, 22523, 659, 22523, 660, 22523, 661, 22523, 662, 22523, 663, 22523, 664, 22523, 665, 22602, 666, 22602, 667, 22602, 668, 22602, 669, 22611, 670, 22611, 671, 22611, 672, 22646, 673, 22646, 674, 22646, 675, 22646, 676, 22646, 677, 22646, 678, 22646, 679, 22646, 680, 22646, 681, 22646, 682, 22646, 683, 22646, 684, 22646, 685, 22646, 686, 22646, 687, 22614, 688, 22614, 689, 22614, 690, 22614, 691, 22614, 692, 22614, 693, 22628, 694, 22628, 695, 22628, 696, 22628, 697, 22628, 698, 22628, 699, 22628, 700, 22643, 701, 22643, 702, 22643, 703, 22643, 704, 22643, 705, 22643, 706, 22637, 707, 22642, 708, 22642, 709, 22640, 710, 22632, 711, 22633, 712, 22631, 713, 22638, 714, 22637, 715, 22636, 716, 22637, 717, 22632, 718, 22628, 719, 22630, 720, 22628, 721, 22623, 722, 22624, 723, 22624, 724, 22624]),
      },
      {
        clave: 'soundcloud', nombre: 'SoundCloud', color: '#FF5500',
        metrica: 'Plays',
        kpis: [{ label: 'Followers', valor: '4.1K' }, { label: 'Plays', valor: '95.4K' }],
        serie: serie('2026-01-31', [0, 14103, 7, 14462, 14, 14903, 21, 14903, 28, 15813, 35, 15813, 42, 16293, 43, 16843, 44, 16843, 45, 16843, 46, 16843, 47, 16843, 48, 16843, 49, 17337, 50, 17337, 51, 17337, 52, 17337, 53, 17337, 54, 17337, 55, 17337, 57, 17730, 58, 17730, 59, 17730, 60, 17730, 61, 17730, 62, 17730, 63, 18111, 64, 18111, 65, 18111, 66, 18111, 67, 18111, 68, 18111, 69, 18111, 70, 18593, 71, 18593, 72, 18593, 73, 18593, 74, 18963, 75, 18963, 76, 18963, 78, 19424, 79, 19424, 80, 19424, 81, 19424, 82, 19424, 83, 19424, 84, 20062, 85, 20062, 87, 20062, 88, 20062, 89, 20062, 91, 20810, 94, 20810, 95, 20810, 96, 20810, 97, 20810, 101, 21563, 102, 21563, 103, 21563, 105, 22318, 106, 22318, 107, 22318, 108, 22318, 109, 22318, 110, 22318, 114, 23246, 115, 23246, 116, 23246, 118, 23246, 119, 24076, 123, 24076, 125, 24076, 126, 24848, 127, 24848, 128, 45784, 129, 45784, 130, 45784, 131, 45784, 132, 45788, 133, 47014, 135, 47019, 136, 47023, 138, 47034, 139, 47051, 140, 48403, 141, 48403, 143, 48409, 147, 49772, 159, 75174, 161, 75174, 168, 78222, 175, 81345, 182, 81349, 189, 83527, 196, 87298, 197, 89446, 198, 90324, 199, 90503, 200, 90785, 201, 91227, 202, 91801, 203, 92158, 204, 92519, 205, 93131, 206, 93407, 207, 93860, 208, 94133, 209, 94704, 210, 95001, 211, 95351, 212, 95351, 213, 95351, 214, 96132]),
      },
      {
        clave: 'apple_music', nombre: 'Apple Music', color: '#FA243C',
        metrica: 'Playlists',
        kpis: [{ label: 'Playlists', valor: '1' }, { label: 'Playlist reach', valor: '—' }, { label: 'Charts', valor: '5' }],
        serie: serie('2024-09-12', [0, 0, 167, 0, 359, 0, 360, 0, 362, 0, 374, 0, 447, 0, 458, 0, 459, 0, 467, 0, 468, 0, 501, 0, 502, 0, 504, 0, 506, 0, 507, 0, 508, 0, 556, 0, 561, 0, 574, 0, 576, 0, 590, 0, 597, 0, 605, 0, 606, 0, 621, 0, 622, 0, 625, 0, 631, 0, 636, 0, 637, 0, 638, 0, 639, 0, 640, 0, 642, 0, 643, 0, 647, 0, 652, 0, 653, 0, 654, 0, 658, 0, 659, 0, 660, 0, 661, 0, 662, 0, 663, 0, 664, 0, 665, 0, 666, 0, 667, 0, 668, 0, 669, 0, 670, 0, 671, 0, 672, 0, 673, 0, 674, 0, 675, 0, 676, 0, 677, 0, 678, 0, 679, 0, 680, 0, 681, 0, 682, 0, 683, 0, 684, 0, 685, 0, 686, 0, 687, 0, 688, 0, 689, 0, 690, 0, 691, 0, 692, 0, 693, 0, 694, 0, 695, 0, 696, 0, 697, 0, 698, 0, 699, 0, 700, 0, 701, 0, 702, 0, 703, 0, 704, 0, 705, 0, 706, 1, 707, 1, 708, 1, 709, 1, 710, 1, 711, 1, 712, 1, 713, 1, 714, 1, 715, 1, 716, 1, 717, 1, 718, 1, 719, 1, 720, 1]),
      },
      {
        clave: 'deezer', nombre: 'Deezer', color: '#A238FF',
        metrica: 'Followers',
        kpis: [{ label: 'Followers', valor: '2' }, { label: 'Playlists', valor: '1' }],
        serie: serie('2026-06-11', [0, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 20, 1, 21, 1, 22, 1, 23, 1, 24, 1, 25, 1, 26, 1, 27, 1, 28, 1, 29, 1, 30, 1, 31, 1, 32, 1, 33, 1, 34, 1, 35, 1, 36, 1, 37, 1, 38, 1, 39, 1, 40, 1, 41, 1, 42, 1, 43, 1, 44, 1, 45, 1, 46, 1, 47, 1, 48, 1, 49, 1, 50, 1, 51, 1, 52, 1, 53, 1, 54, 1, 55, 1, 56, 1, 57, 1, 58, 1, 59, 1, 60, 1, 61, 1, 62, 1, 63, 1, 64, 1, 65, 1, 66, 1, 67, 1, 68, 1, 69, 1, 70, 1, 71, 1, 72, 1, 73, 1, 74, 1, 75, 1, 76, 1, 77, 1, 78, 1, 79, 2, 80, 2, 81, 2, 82, 2, 83, 2]),
      },
      {
        clave: 'tidal', nombre: 'Tidal', color: '#00FFFF',
        metrica: 'Playlists',
        kpis: [{ label: 'Playlists', valor: '2' }, { label: 'Charts', valor: '0' }],
        serie: serie('2026-07-28', [0, 1, 1, 1, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 16, 2, 17, 2, 18, 2, 19, 2, 20, 2, 21, 2, 22, 2, 23, 2, 24, 2, 25, 2, 26, 2, 27, 2, 28, 2, 29, 2, 30, 2, 31, 2, 32, 2, 33, 2, 34, 2, 35, 2, 36, 2]),
      },
    ],
  },
  {
    id: 'marcelbs',
    nombre: 'Marcel BS',
    estado: 'Creciendo',
    actualizado: '2/9/2026',
    fallo: false,
    kpis: ['82', '43', '15.4K', '0', '3.3K', '0', '0', '0', '0'],
    topTracks: {
      'Streams': [
        { pos: 1, titulo: 'Nothing to Hide', artistas: 'CANVI, Wildness Rose, Marcel BS', valor: '15.4K', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9' },
      ],
      'Popularidad': [
        { pos: 1, titulo: 'Nothing to Hide', artistas: 'CANVI, Wildness Rose, Marcel BS', valor: '5', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9' },
      ],
      'Playlist reach': [
        { pos: 1, titulo: 'Nothing to Hide', artistas: 'CANVI, Wildness Rose, Marcel BS', valor: '638K', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9' },
      ],
    },
    hitos: [
      { texto: 'Charted #7 on Electronic Albums: Portugal', pista: 'Summer Ibiza 2025', fecha: '27 ago', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f9/1b/8f/f91b8f43-4324-3bdc-1b7f-f7e255a3b154/00_Cover_Art.jpg/300x300bb.webp', fuente: 'itunes' },
      { texto: 'Charted #35 on Overall Albums: Portugal', pista: 'Summer Ibiza 2025', fecha: '27 ago', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f9/1b/8f/f91b8f43-4324-3bdc-1b7f-f7e255a3b154/00_Cover_Art.jpg/300x300bb.webp', fuente: 'itunes' },
      { texto: 'Charted #4 on Electronic Albums: Turkey', pista: 'Summer Ibiza 2025', fecha: '20 may', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f9/1b/8f/f91b8f43-4324-3bdc-1b7f-f7e255a3b154/00_Cover_Art.jpg/300x300bb.webp', fuente: 'itunes' },
      { texto: 'Charted #194 on Electronic Albums: Chile', pista: 'A Journey Into House Music Volumen 2 (DJ Mix)', fecha: '01 feb', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1a/4e/4c/1a4e4c09-07ee-42d0-d126-20726c81d193/00_Cover_Art.jpg/300x300bb.webp', fuente: 'apple_music' },
      { texto: 'Playlisted by Musical Touch on CIRCOLOCO IBIZA 2026 (279 Followers)', pista: 'Nothing to Hide', fecha: '01 dic', url: 'http://open.spotify.com/playlist/3gzwxLFcqGxgZkowgGu7a5', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'spotify' },
      { texto: 'New Comment by Still-Life (246 Followers)', pista: 'Nothing to Hide', fecha: '24 nov', url: 'https://soundcloud.com/tenibiza/wildness-rose-canvi-marcel-bs-nothing-to-hide-original-mix-7', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'soundcloud' },
      { texto: 'New Comment by Amine (13 Followers)', pista: 'Nothing to Hide', fecha: '24 nov', url: 'https://soundcloud.com/tenibiza/wildness-rose-canvi-marcel-bs-nothing-to-hide-original-mix-7', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'soundcloud' },
      { texto: 'Reposted by Markuss (6503 Followers)', pista: 'Nothing to Hide', fecha: '18 oct', url: 'https://soundcloud.com/markussmusic', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'soundcloud' },
      { texto: 'Added to Sounds of Sirin Release Chart by Still-Life', pista: 'Nothing to Hide', fecha: '04 oct', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'beatport' },
      { texto: 'Added to All Day I Dream Release Chart by Still-Life', pista: 'Nothing to Hide', fecha: '23 sept', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'beatport' },
      { texto: 'Reposted by Ay-Pi Musik (69 Followers)', pista: 'Nothing to Hide', fecha: '20 sept', url: 'https://soundcloud.com/aymen-pipo', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'soundcloud' },
      { texto: 'Reposted by Momni (20 Followers)', pista: 'Nothing to Hide', fecha: '13 sept', url: 'https://soundcloud.com/momni', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'soundcloud' },
      { texto: 'Charted #48 on Electronic Albums: Argentina', pista: 'Summer Ibiza 2025', fecha: '31 ago', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f9/1b/8f/f91b8f43-4324-3bdc-1b7f-f7e255a3b154/00_Cover_Art.jpg/300x300bb.webp', fuente: 'apple_music' },
      { texto: 'Playlisted by Tomi H on BEST AFRO HOUSE 2025 (  Keinemusik ,Ajna(BE), black coffee, Maxi Meraki, Samm(BE) ) (1914 Followers)', pista: 'Nothing to Hide', fecha: '03 ago', url: 'http://open.spotify.com/playlist/17vZuYVlihgr8VJ1H3Ivhd', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'spotify' },
      { texto: 'Playlisted by Artists To Watch on Artists To Watch 2025: Reggae & Dancehall (8630 Followers)', pista: 'Nothing to Hide', fecha: '01 ago', url: 'http://open.spotify.com/playlist/0NC0vrldGBjZWFDyU6i2Yf', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'spotify' },
      { texto: 'Playlisted by SUPER SUNDAY on Super Sunday (35.2K Followers)', pista: 'Nothing to Hide', fecha: '01 ago', url: 'http://open.spotify.com/playlist/4kKpsYbqTYh2NRtV25EbUs', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'spotify' },
      { texto: 'Playlisted by Mixed Audio on IBIZA AFRO & ELECTRONICA HOUSE 2026 | Heliograph (22.9K Followers)', pista: 'Nothing to Hide', fecha: '01 ago', url: 'http://open.spotify.com/playlist/4qtJdhNELeu3oPy19ehjWa', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'spotify' },
      { texto: 'Charted #96 on Afro House Releases', pista: 'Summer Ibiza 2025', fecha: '29 jul', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://geo-media.beatport.com/image_size/300x300/747fd798-f565-4c9e-ae17-7e610ff7c197.jpg', fuente: 'beatport' },
    ],
    releases: [
      { titulo: 'Nothing to Hide', fecha: 'jun 2025' },
    ],
    topPlaylists: [
      { nombre: 'BEST AFRO HOUSE 2025 (  Keinemusik ,Ajna(BE), black coffee, Maxi Meraki, Samm(BE) )', seguidores: '1914', url: 'https://open.spotify.com/playlist/17vZuYVlihgr8VJ1H3Ivhd', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84d6521144eef2fd61055af5d1' },
      { nombre: 'SXM Festival 2026', seguidores: '1397', url: 'https://open.spotify.com/playlist/78SUcOaCeIqmK0ksbiJqjl', portada: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84f805ec28b6b293708b14bd78' },
    ],
    beatportTracks: [
      { pos: 1, titulo: 'Nothing to Hide', artistas: 'CANVI, Wildness Rose, Marcel BS', valor: '6', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9' },
    ],
    beatportCharts: [
      { texto: 'Added to Sounds of Sirin Release Chart by Still-Life', pista: 'Nothing to Hide', fecha: '04 oct', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'beatport' },
      { texto: 'Added to All Day I Dream Release Chart by Still-Life', pista: 'Nothing to Hide', fecha: '23 sept', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://i.scdn.co/image/ab67616d00001e0202c14fcc58c41f3c3479c1e9', fuente: 'beatport' },
      { texto: 'Charted #96 on Afro House Releases', pista: 'Summer Ibiza 2025', fecha: '29 jul', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://geo-media.beatport.com/image_size/300x300/747fd798-f565-4c9e-ae17-7e610ff7c197.jpg', fuente: 'beatport' },
      { texto: 'Charted #64 on Organic House / Downtempo Releases', pista: 'Summer Ibiza 2025', fecha: '29 jul', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://geo-media.beatport.com/image_size/300x300/747fd798-f565-4c9e-ae17-7e610ff7c197.jpg', fuente: 'beatport' },
      { texto: 'Charted #99 on Afro House Releases', pista: 'Summer Ibiza 2025', fecha: '28 jul', url: 'https://songstats.com/track/nio1yakj/nothing-to-hide', portada: 'https://geo-media.beatport.com/image_size/300x300/747fd798-f565-4c9e-ae17-7e610ff7c197.jpg', fuente: 'beatport' },
    ],
    ciudades: [
      { nombre: 'Stockholm', pais: 'SE', actual: 3, pico: 13, fechaPico: '21 ago 25', lat: 59.3327, lng: 18.0656 },
      { nombre: 'Bucharest', pais: 'RO', actual: 0, pico: 135, fechaPico: '24 jul 25', lat: 44.4268, lng: 26.1025 },
      { nombre: 'Barcelona', pais: 'ES', actual: 0, pico: 82, fechaPico: '11 jul 25', lat: 41.3874, lng: 2.1686 },
      { nombre: 'Cluj-Napoca', pais: 'RO', actual: 0, pico: 73, fechaPico: '11 jul 25', lat: 46.7712, lng: 23.6236 },
      { nombre: 'Sydney', pais: 'AU', actual: 0, pico: 65, fechaPico: '07 ago 25', lat: -33.8727, lng: 151.2057 },
      { nombre: 'Melbourne', pais: 'AU', actual: 0, pico: 51, fechaPico: '13 ago 25', lat: -37.8136, lng: 144.9631 },
      { nombre: 'Athens', pais: 'GR', actual: 0, pico: 42, fechaPico: '24 jul 25', lat: 37.9838, lng: 23.7275 },
      { nombre: 'Cairo', pais: 'EG', actual: 0, pico: 41, fechaPico: '24 jul 25', lat: 30.0444, lng: 31.2357 },
      { nombre: 'Auckland', pais: 'NZ', actual: 0, pico: 36, fechaPico: '13 ago 25', lat: -36.8509, lng: 174.7645 },
      { nombre: 'Brussels', pais: 'BE', actual: 0, pico: 35, fechaPico: '24 jul 25', lat: 50.8477, lng: 4.3572 },
      { nombre: 'Madrid', pais: 'ES', actual: 0, pico: 31, fechaPico: '11 jul 25', lat: 40.4167, lng: -3.7033 },
      { nombre: 'Lisbon', pais: 'PT', actual: 0, pico: 31, fechaPico: '24 jul 25', lat: 38.7223, lng: -9.1393 },
      { nombre: 'Hamilton', pais: 'NZ', actual: 0, pico: 30, fechaPico: '31 jul 25', lat: -37.7826, lng: 175.2528 },
      { nombre: 'Timișoara', pais: 'RO', actual: 0, pico: 27, fechaPico: '11 jul 25', lat: 45.7489, lng: 21.2087 },
      { nombre: 'Perth', pais: 'AU', actual: 0, pico: 26, fechaPico: '13 ago 25', lat: -31.9514, lng: 115.8617 },
      { nombre: 'Luxembourg', pais: 'LU', actual: 0, pico: 26, fechaPico: '07 ago 25', lat: 49.6116, lng: 6.1319 },
      { nombre: 'Napier City Council', pais: 'NZ', actual: 0, pico: 25, fechaPico: '21 ago 25', lat: -39.5068, lng: 176.8822 },
      { nombre: 'Brisbane', pais: 'AU', actual: 0, pico: 23, fechaPico: '13 ago 25', lat: -27.4705, lng: 153.026 },
      { nombre: 'Frankfurt', pais: 'DE', actual: 0, pico: 22, fechaPico: '24 jul 25', lat: 50.1109, lng: 8.6821 },
      { nombre: 'Oslo', pais: 'NO', actual: 0, pico: 21, fechaPico: '31 jul 25', lat: 59.9139, lng: 10.7522 },
      { nombre: 'Toronto', pais: 'CA', actual: 0, pico: 21, fechaPico: '11 jul 25', lat: 43.6532, lng: -79.3832 },
      { nombre: 'Istanboel', pais: 'TR', actual: 0, pico: 20, fechaPico: '24 jul 25', lat: 41.1634, lng: 28.7664 },
      { nombre: 'Montréal', pais: 'CA', actual: 0, pico: 20, fechaPico: '11 jul 25', lat: 45.5019, lng: -73.5674 },
      { nombre: 'Adelaide', pais: 'AU', actual: 0, pico: 20, fechaPico: '07 ago 25', lat: -34.9285, lng: 138.6007 },
      { nombre: 'Brașov', pais: 'RO', actual: 0, pico: 19, fechaPico: '24 jul 25', lat: 45.6427, lng: 25.5887 },
      { nombre: 'Tel Aviv-Yafo', pais: 'IL', actual: 0, pico: 19, fechaPico: '24 jul 25', lat: 32.0853, lng: 34.7818 },
      { nombre: 'Dunedin', pais: 'NZ', actual: 0, pico: 19, fechaPico: '13 ago 25', lat: -45.8795, lng: 170.5006 },
      { nombre: 'Remich', pais: 'LU', actual: 0, pico: 19, fechaPico: '13 ago 25', lat: 49.5474, lng: 6.3624 },
      { nombre: 'Zürich', pais: 'CH', actual: 0, pico: 19, fechaPico: '24 jul 25', lat: 47.3769, lng: 8.5417 },
      { nombre: 'Romania', pais: 'RO', actual: 0, pico: 18, fechaPico: '24 jul 25', lat: 45.9432, lng: 24.9668 },
      { nombre: 'Milan', pais: 'IT', actual: 0, pico: 18, fechaPico: '31 jul 25', lat: 45.4685, lng: 9.1824 },
      { nombre: 'Amsterdam', pais: 'NL', actual: 0, pico: 18, fechaPico: '24 jul 25', lat: 52.3676, lng: 4.9041 },
      { nombre: 'Porto', pais: 'PT', actual: 0, pico: 18, fechaPico: '24 jul 25', lat: 41.1462, lng: -8.6122 },
      { nombre: 'Christchurch', pais: 'NZ', actual: 0, pico: 18, fechaPico: '21 ago 25', lat: -43.532, lng: 172.6366 },
      { nombre: 'New Plymouth', pais: 'NZ', actual: 0, pico: 18, fechaPico: '21 ago 25', lat: -39.0572, lng: 174.0794 },
      { nombre: 'London', pais: 'GB', actual: 0, pico: 18, fechaPico: '07 ago 25', lat: 51.5072, lng: -0.1276 },
      { nombre: 'Whangarei', pais: 'NZ', actual: 0, pico: 18, fechaPico: '21 ago 25', lat: -35.7275, lng: 174.3166 },
      { nombre: 'Munich', pais: 'DE', actual: 0, pico: 17, fechaPico: '24 jul 25', lat: 48.1351, lng: 11.582 },
      { nombre: 'Santiago', pais: 'CL', actual: 0, pico: 17, fechaPico: '24 jul 25', lat: -33.4489, lng: -70.6693 },
      { nombre: 'Timaru', pais: 'NZ', actual: 0, pico: 17, fechaPico: '21 ago 25', lat: -44.3904, lng: 171.2373 },
      { nombre: 'São Paulo', pais: 'BR', actual: 0, pico: 16, fechaPico: '11 jul 25', lat: -23.5558, lng: -46.6396 },
      { nombre: 'Rotorua', pais: 'NZ', actual: 0, pico: 16, fechaPico: '31 jul 25', lat: -38.1446, lng: 176.2378 },
      { nombre: 'Invercargill', pais: 'NZ', actual: 0, pico: 16, fechaPico: '31 jul 25', lat: -46.4179, lng: 168.3615 },
      { nombre: 'Budapest', pais: 'HU', actual: 0, pico: 16, fechaPico: '31 jul 25', lat: 47.4979, lng: 19.0402 },
      { nombre: 'Palmerston North', pais: 'NZ', actual: 0, pico: 15, fechaPico: '21 ago 25', lat: -40.3545, lng: 175.6097 },
      { nombre: 'Esch-sur-Alzette', pais: 'LU', actual: 0, pico: 14, fechaPico: '13 ago 25', lat: 49.5024, lng: 5.9722 },
      { nombre: 'Dublin', pais: 'IE', actual: 0, pico: 14, fechaPico: '24 jul 25', lat: 53.3498, lng: -6.2603 },
      { nombre: 'Kyiv', pais: 'UA', actual: 0, pico: 14, fechaPico: '24 jul 25', lat: 50.4501, lng: 30.5234 },
      { nombre: 'Berlin', pais: 'DE', actual: 0, pico: 14, fechaPico: '24 jul 25', lat: 52.52, lng: 13.405 },
      { nombre: 'Rome', pais: 'IT', actual: 0, pico: 14, fechaPico: '24 jul 25', lat: 41.8967, lng: 12.4822 },
      { nombre: 'Wellington', pais: 'NZ', actual: 0, pico: 14, fechaPico: '31 jul 25', lat: -41.2924, lng: 174.7787 },
      { nombre: 'Bogotá', pais: 'CO', actual: 0, pico: 13, fechaPico: '24 jul 25', lat: 4.711, lng: -74.0721 },
      { nombre: 'Vilnius', pais: 'LT', actual: 0, pico: 13, fechaPico: '07 ago 25', lat: 54.6872, lng: 25.2797 },
      { nombre: 'Vienna', pais: 'AT', actual: 0, pico: 13, fechaPico: '11 jul 25', lat: 48.2081, lng: 16.3713 },
      { nombre: 'New York', pais: 'US', actual: 0, pico: 13, fechaPico: '26 nov 25', lat: 40.7128, lng: -74.006 },
      { nombre: 'Pétange', pais: 'LU', actual: 0, pico: 12, fechaPico: '13 ago 25', lat: 49.5563, lng: 5.8766 },
      { nombre: 'Casablanca', pais: 'MA', actual: 0, pico: 12, fechaPico: '11 jul 25', lat: 33.5731, lng: -7.5898 },
      { nombre: 'El Paso', pais: 'US', actual: 0, pico: 12, fechaPico: '07 jul 25', lat: 31.7619, lng: -106.485 },
      { nombre: 'Cologne', pais: 'DE', actual: 0, pico: 12, fechaPico: '24 jul 25', lat: 50.9375, lng: 6.9603 },
      { nombre: 'Liège', pais: 'BE', actual: 0, pico: 12, fechaPico: '07 ago 25', lat: 50.6402, lng: 5.5689 },
      { nombre: 'Taupo', pais: 'NZ', actual: 0, pico: 12, fechaPico: '13 ago 25', lat: -38.6843, lng: 176.0704 },
      { nombre: 'Gothenburg', pais: 'SE', actual: 0, pico: 12, fechaPico: '13 ago 25', lat: 57.7089, lng: 11.9746 },
      { nombre: 'Porirua', pais: 'NZ', actual: 0, pico: 11, fechaPico: '07 ago 25', lat: -41.1381, lng: 174.8472 },
      { nombre: 'Craiova', pais: 'RO', actual: 0, pico: 11, fechaPico: '11 jul 25', lat: 44.3302, lng: 23.7949 },
      { nombre: 'Dubai', pais: 'AE', actual: 0, pico: 11, fechaPico: '31 jul 25', lat: 25.2048, lng: 55.2708 },
      { nombre: 'Bratislava', pais: 'SK', actual: 0, pico: 11, fechaPico: '24 jul 25', lat: 48.1486, lng: 17.1077 },
      { nombre: 'Whyalla', pais: 'AU', actual: 0, pico: 11, fechaPico: '13 ago 25', lat: -33.0346, lng: 137.5757 },
      { nombre: 'Ploiești', pais: 'RO', actual: 0, pico: 11, fechaPico: '07 jul 25', lat: 44.9367, lng: 26.0129 },
      { nombre: 'Buenos Aires', pais: 'AR', actual: 0, pico: 11, fechaPico: '11 jul 25', lat: -34.6143, lng: -58.4402 },
      { nombre: 'Colombo', pais: 'LK', actual: 0, pico: 11, fechaPico: '24 jul 25', lat: 6.8758, lng: 79.8607 },
      { nombre: 'Colonia Cuauhtémoc', pais: 'MX', actual: 0, pico: 11, fechaPico: '11 jul 25', lat: 19.4301, lng: -99.1691 },
      { nombre: 'Buenos Aires', pais: 'AR', actual: 0, pico: 11, fechaPico: '24 jul 25', lat: -34.6037, lng: -58.3821 },
      { nombre: 'Mérida', pais: 'MX', actual: 0, pico: 10, fechaPico: '11 jul 25', lat: 20.9674, lng: -89.5926 },
      { nombre: 'Bregenz', pais: 'AT', actual: 0, pico: 10, fechaPico: '13 ago 25', lat: 47.5018, lng: 9.7454 },
      { nombre: 'Ljubljana', pais: 'SI', actual: 0, pico: 10, fechaPico: '31 jul 25', lat: 46.0569, lng: 14.5058 },
      { nombre: 'Warsaw', pais: 'PL', actual: 0, pico: 10, fechaPico: '11 jul 25', lat: 52.2297, lng: 21.0122 },
      { nombre: 'San José', pais: 'CR', actual: 0, pico: 10, fechaPico: '31 jul 25', lat: 9.9281, lng: -84.0907 },
      { nombre: 'Chicago', pais: 'US', actual: 0, pico: 9, fechaPico: '07 jul 25', lat: 41.8832, lng: -87.6324 },
      { nombre: 'Esbjerg', pais: 'DK', actual: 0, pico: 9, fechaPico: '21 ago 25', lat: 55.4765, lng: 8.4594 },
      { nombre: 'Lenzing', pais: 'AT', actual: 0, pico: 9, fechaPico: '13 ago 25', lat: 47.9549, lng: 13.6045 },
      { nombre: 'Kufstein', pais: 'AT', actual: 0, pico: 9, fechaPico: '13 ago 25', lat: 47.5824, lng: 12.1628 },
      { nombre: 'Oradea', pais: 'RO', actual: 0, pico: 9, fechaPico: '11 jul 25', lat: 47.0465, lng: 21.9189 },
      { nombre: 'Charleroi', pais: 'BE', actual: 0, pico: 9, fechaPico: '07 ago 25', lat: 50.4081, lng: 4.4476 },
      { nombre: 'Hamburg', pais: 'DE', actual: 0, pico: 8, fechaPico: '11 jul 25', lat: 53.5488, lng: 9.9872 },
      { nombre: 'Cambridge', pais: 'US', actual: 0, pico: 8, fechaPico: '07 jul 25', lat: 42.3736, lng: -71.1097 },
      { nombre: 'Copenhagen', pais: 'DK', actual: 0, pico: 8, fechaPico: '21 ago 25', lat: 55.6761, lng: 12.5683 },
      { nombre: 'Tauranga', pais: 'NZ', actual: 0, pico: 8, fechaPico: '21 ago 25', lat: -37.687, lng: 176.1654 },
      { nombre: 'Paris', pais: 'FR', actual: 0, pico: 8, fechaPico: '11 jul 25', lat: 48.8575, lng: 2.3514 },
      { nombre: 'Rodange', pais: 'LU', actual: 0, pico: 8, fechaPico: '21 ago 25', lat: 49.5452, lng: 5.8391 },
      { nombre: 'Zagreb', pais: 'HR', actual: 0, pico: 8, fechaPico: '13 ago 25', lat: 45.815, lng: 15.9819 },
      { nombre: 'Hazelwood', pais: 'US', actual: 0, pico: 8, fechaPico: '07 jul 25', lat: 38.7714, lng: -90.3709 },
      { nombre: 'Palma', pais: 'ES', actual: 0, pico: 8, fechaPico: '11 jul 25', lat: 39.5727, lng: 2.6569 },
      { nombre: 'Riga', pais: 'LV', actual: 0, pico: 8, fechaPico: '13 ago 25', lat: 56.9677, lng: 24.1056 },
      { nombre: 'Miami', pais: 'US', actual: 0, pico: 8, fechaPico: '11 jul 25', lat: 25.7617, lng: -80.1918 },
      { nombre: 'Queenstown', pais: 'NZ', actual: 0, pico: 7, fechaPico: '21 ago 25', lat: -45.0302, lng: 168.6615 },
      { nombre: 'San Francisco', pais: 'US', actual: 0, pico: 7, fechaPico: '07 jul 25', lat: 37.7749, lng: -122.4194 },
      { nombre: 'Fredrikstad', pais: 'NO', actual: 0, pico: 7, fechaPico: '21 ago 25', lat: 59.2205, lng: 10.9347 },
      { nombre: 'Paraparaumu', pais: 'NZ', actual: 0, pico: 7, fechaPico: '27 ago 25', lat: -40.9155, lng: 175.0073 },
      { nombre: 'Sun Valley', pais: 'US', actual: 0, pico: 7, fechaPico: '07 jul 25', lat: 34.2225, lng: -118.3878 },
      { nombre: 'Düsseldorf', pais: 'DE', actual: 0, pico: 7, fechaPico: '07 jul 25', lat: 51.223, lng: 6.7825 },
      { nombre: 'Baku', pais: 'AZ', actual: 0, pico: 7, fechaPico: '18 sept 25', lat: 40.4093, lng: 49.8671 },
      { nombre: 'Fischamend', pais: 'AT', actual: 0, pico: 7, fechaPico: '21 ago 25', lat: 48.1187, lng: 16.6126 },
      { nombre: 'Johannesburg', pais: 'ZA', actual: 0, pico: 7, fechaPico: '21 ago 25', lat: -26.2056, lng: 28.0337 },
      { nombre: 'Vöcklabruck', pais: 'AT', actual: 0, pico: 6, fechaPico: '27 ago 25', lat: 48.0033, lng: 13.6561 },
      { nombre: 'Brooklyn', pais: 'US', actual: 0, pico: 6, fechaPico: '20 nov 25', lat: 40.6782, lng: -73.9442 },
      { nombre: 'Málaga', pais: 'ES', actual: 0, pico: 6, fechaPico: '27 ago 25', lat: 36.7178, lng: -4.4256 },
      { nombre: 'Klagenfurt', pais: 'AT', actual: 0, pico: 5, fechaPico: '04 sept 25', lat: 46.6257, lng: 14.3137 },
      { nombre: 'Little Hartley', pais: 'AU', actual: 0, pico: 5, fechaPico: '04 sept 25', lat: -33.5696, lng: 150.2066 },
      { nombre: 'Hall in Tirol', pais: 'AT', actual: 0, pico: 5, fechaPico: '27 ago 25', lat: 47.2804, lng: 11.5058 },
      { nombre: 'Kaunas', pais: 'LT', actual: 0, pico: 5, fechaPico: '27 ago 25', lat: 54.8985, lng: 23.9036 },
      { nombre: 'Graz', pais: 'AT', actual: 0, pico: 5, fechaPico: '27 ago 25', lat: 47.0679, lng: 15.4417 },
      { nombre: 'Belgrade', pais: 'RS', actual: 0, pico: 4, fechaPico: '18 sept 25', lat: 44.8125, lng: 20.4612 },
      { nombre: 'Municipality of Las Palmas', pais: 'ES', actual: 0, pico: 4, fechaPico: '25 sept 25', lat: 28.1009, lng: -15.4654 },
      { nombre: 'Granada', pais: 'ES', actual: 0, pico: 4, fechaPico: '04 sept 25', lat: 37.1825, lng: -3.6012 },
      { nombre: 'Mieming', pais: 'AT', actual: 0, pico: 4, fechaPico: '04 sept 25', lat: 47.3281, lng: 10.9533 },
      { nombre: 'Medellín', pais: 'CO', actual: 0, pico: 4, fechaPico: '04 sept 25', lat: 6.2476, lng: -75.5658 },
      { nombre: 'Mexico City', pais: 'MX', actual: 0, pico: 4, fechaPico: '29 ene 26', lat: 19.4326, lng: -99.1332 },
      { nombre: 'Alexandria', pais: 'EG', actual: 0, pico: 3, fechaPico: '18 sept 25', lat: 31.2001, lng: 29.9187 },
      { nombre: 'Puerto Juarez', pais: 'MX', actual: 0, pico: 3, fechaPico: '25 feb 26', lat: 21.1824, lng: -86.8086 },
      { nombre: 'Seville', pais: 'ES', actual: 0, pico: 3, fechaPico: '16 oct 25', lat: 37.3891, lng: -5.9845 },
      { nombre: 'Abu Dhabi', pais: 'AE', actual: 0, pico: 3, fechaPico: '09 oct 25', lat: 24.4539, lng: 54.3773 },
      { nombre: 'Lyon', pais: 'FR', actual: 0, pico: 3, fechaPico: '25 sept 25', lat: 45.764, lng: 4.8357 },
      { nombre: 'Cape Town', pais: 'ZA', actual: 0, pico: 3, fechaPico: '01 oct 25', lat: -33.9221, lng: 18.4231 },
      { nombre: 'Pretoria', pais: 'ZA', actual: 0, pico: 3, fechaPico: '25 sept 25', lat: -25.7566, lng: 28.1914 },
      { nombre: 'Marbella', pais: 'ES', actual: 0, pico: 3, fechaPico: '18 sept 25', lat: 36.5103, lng: -4.8853 },
      { nombre: 'Belo Horizonte', pais: 'BR', actual: 0, pico: 3, fechaPico: '18 sept 25', lat: -19.9191, lng: -43.9387 },
      { nombre: 'Denpasar', pais: 'ID', actual: 0, pico: 3, fechaPico: '16 oct 25', lat: -8.6559, lng: 115.2168 },
    ],
    plataformas: [
      {
        clave: 'spotify', nombre: 'Spotify', color: '#1DB954',
        metrica: 'Oyentes mensuales',
        kpis: [{ label: 'Oyentes', valor: '82' }, { label: 'Followers', valor: '43' }, { label: 'Streams', valor: '15.4K' }, { label: 'Popularidad', valor: '0' }, { label: 'Playlists', valor: '2' }, { label: 'Playlist reach', valor: '3.3K' }],
        serie: serie('2025-07-07', [0, 2010, 1, 2010, 2, 2547, 3, 2547, 4, 2547, 5, 2547, 6, 2547, 7, 2547, 8, 2547, 9, 2547, 10, 4254, 11, 4254, 12, 4254, 13, 4254, 14, 4254, 15, 4254, 16, 4254, 17, 4254, 18, 4254, 19, 4254, 20, 4254, 21, 4254, 22, 4254, 23, 4372, 24, 4372, 25, 4372, 26, 4372, 27, 4372, 28, 4372, 29, 4372, 30, 4281, 31, 4281, 32, 4281, 33, 4281, 34, 4281, 35, 4281, 36, 4281, 37, 4383, 38, 4383, 39, 4383, 40, 4383, 41, 4383, 42, 4383, 43, 4383, 44, 4055, 45, 4055, 46, 4055, 47, 4055, 48, 4055, 49, 4055, 50, 4055, 51, 3073, 52, 3073, 53, 3073, 54, 3073, 55, 3073, 56, 3073, 57, 3073, 58, 2202, 59, 2202, 60, 2202, 61, 2202, 62, 2202, 63, 2202, 64, 2202, 65, 2202, 66, 2202, 67, 2202, 68, 2202, 69, 2202, 70, 2202, 71, 2202, 72, 343, 73, 343, 74, 343, 75, 343, 76, 343, 77, 343, 78, 343, 79, 336, 80, 336, 81, 336, 82, 336, 83, 336, 84, 336, 85, 336, 86, 321, 87, 321, 88, 321, 89, 321, 90, 321, 91, 321, 92, 321, 93, 288, 94, 288, 95, 288, 96, 288, 97, 288, 98, 288, 99, 288, 100, 248, 101, 248, 102, 248, 103, 248, 104, 248, 105, 248, 106, 248, 107, 210, 108, 210, 109, 210, 110, 210, 111, 210, 112, 210, 113, 210, 114, 182, 115, 182, 116, 182, 117, 182, 118, 182, 119, 182, 120, 182, 121, 189, 122, 189, 123, 189, 124, 189, 125, 189, 126, 189, 127, 189, 128, 189, 129, 189, 130, 189, 131, 189, 132, 189, 133, 189, 134, 189, 135, 184, 136, 184, 137, 184, 138, 184, 139, 184, 140, 184, 141, 184, 142, 181, 143, 181, 144, 181, 145, 181, 146, 181, 147, 181, 148, 181, 149, 153, 150, 153, 151, 153, 152, 153, 153, 153, 154, 153, 155, 153, 156, 132, 157, 132, 158, 132, 159, 132, 160, 132, 161, 132, 162, 132, 163, 125, 164, 125, 165, 125, 166, 125, 167, 125, 168, 125, 169, 125, 170, 119, 171, 119, 172, 119, 173, 119, 174, 119, 175, 119, 176, 119, 177, 119, 178, 114, 179, 114, 180, 114, 181, 114, 182, 114, 183, 114, 184, 109, 185, 109, 186, 109, 187, 109, 188, 109, 189, 109, 190, 109, 191, 106, 192, 106, 193, 106, 194, 106, 195, 106, 196, 106, 197, 106, 198, 108, 199, 108, 200, 108, 201, 108, 202, 108, 203, 108, 204, 108, 205, 121, 206, 121, 207, 121, 208, 121, 209, 121, 210, 121, 211, 121, 212, 121, 213, 121, 214, 121, 215, 121, 216, 121, 217, 121, 218, 121, 219, 136, 220, 136, 221, 136, 222, 136, 223, 136, 224, 136, 225, 136, 226, 136, 227, 136, 228, 136, 229, 136, 230, 136, 231, 136, 232, 136, 233, 117, 234, 117, 235, 117, 236, 117, 237, 117, 238, 117, 239, 117, 240, 108, 241, 108, 242, 108, 243, 108, 244, 108, 245, 108, 246, 108, 247, 108, 248, 108, 249, 108, 250, 108, 251, 108, 252, 108, 253, 108, 254, 98, 255, 98, 256, 98, 257, 98, 258, 98, 259, 98, 260, 98, 261, 97, 262, 97, 263, 97, 264, 97, 265, 97, 266, 97, 267, 97, 268, 101, 269, 100, 270, 100, 271, 101, 272, 101, 273, 100, 274, 101, 275, 102, 276, 99, 277, 98, 278, 97, 279, 97, 280, 97, 281, 97, 282, 99, 283, 99, 284, 100, 285, 97, 286, 94, 287, 98, 288, 99, 289, 96, 290, 96, 291, 96, 292, 96, 293, 92, 294, 88, 295, 84, 296, 86, 297, 86, 298, 86, 299, 86, 300, 86, 301, 86, 302, 86, 303, 90, 304, 90, 305, 90, 306, 90, 307, 90, 308, 90, 309, 90, 310, 79, 311, 79, 312, 79, 313, 79, 314, 79, 315, 79, 316, 79, 317, 79, 318, 79, 319, 79, 320, 79, 321, 79, 322, 79, 323, 79, 324, 81, 325, 81, 326, 81, 327, 81, 328, 81, 329, 81, 330, 81, 331, 77, 332, 77, 333, 77, 334, 77, 335, 77, 336, 77, 337, 77, 338, 84, 339, 84, 340, 84, 341, 84, 342, 84, 343, 84, 344, 84, 345, 87, 346, 87, 347, 87, 348, 87, 349, 87, 350, 87, 351, 87, 352, 91, 353, 91, 354, 91, 355, 91, 356, 91, 357, 91, 358, 91, 359, 89, 360, 89, 361, 89, 362, 89, 363, 89, 364, 89, 365, 89, 366, 98, 367, 98, 368, 98, 369, 98, 370, 98, 371, 98, 372, 98, 373, 117, 374, 117, 375, 117, 376, 117, 377, 117, 378, 117, 379, 117, 380, 102, 381, 102, 382, 102, 383, 102, 384, 102, 385, 102, 386, 102, 387, 107, 388, 107, 389, 107, 390, 107, 391, 107, 392, 107, 393, 107, 394, 97, 395, 97, 396, 97, 397, 97, 398, 97, 399, 97, 400, 97, 401, 83, 402, 83, 403, 83, 404, 83, 405, 90, 406, 91, 407, 96, 408, 97, 409, 97, 410, 97, 411, 95, 412, 93, 413, 93, 414, 90, 415, 90, 416, 89, 417, 88, 418, 87, 419, 85, 420, 83, 421, 82, 422, 83]),
      },
      {
        clave: 'shazam', nombre: 'Shazam', color: '#0088FF',
        metrica: 'Shazams',
        kpis: [{ label: 'Shazams', valor: '165' }, { label: 'Charts', valor: '0' }],
        serie: serie('2025-07-07', [0, 41, 5, 44, 12, 51, 19, 56, 26, 57, 33, 60, 40, 62, 47, 64, 54, 64, 61, 81, 68, 117, 75, 131, 82, 132, 89, 133, 96, 136, 103, 138, 110, 139, 117, 141, 124, 141, 132, 142, 138, 143, 145, 143, 152, 143, 159, 145, 166, 145, 173, 145, 187, 145, 194, 147, 201, 152, 208, 152, 215, 152, 222, 152, 229, 153, 236, 154, 250, 156, 257, 157, 264, 157, 268, 157, 269, 157, 270, 157, 272, 157, 273, 157, 274, 157, 275, 157, 276, 157, 277, 157, 278, 158, 279, 158, 280, 158, 281, 158, 282, 158, 283, 158, 284, 158, 285, 159, 286, 159, 287, 159, 288, 159, 289, 159, 290, 159, 291, 159, 292, 160, 293, 160, 294, 160, 295, 160, 296, 160, 300, 161, 306, 161, 321, 162, 328, 163, 336, 163, 341, 163, 348, 163, 355, 163, 369, 164, 376, 164, 383, 164, 390, 164, 397, 164, 404, 164, 405, 164, 406, 164, 407, 164, 408, 164, 409, 164, 410, 164, 411, 164, 412, 164, 413, 164, 414, 164, 415, 164, 416, 164, 417, 164, 418, 164, 419, 165, 420, 165, 421, 165, 422, 165]),
      },
      {
        clave: 'youtube', nombre: 'YouTube', color: '#FF0000',
        kpis: [{ label: 'Suscriptores', valor: '0' }, { label: 'Followers', valor: '—' }, { label: 'Views', valor: '—' }, { label: 'Vídeos', valor: '1' }],
        serie: [],
      },
      {
        clave: 'soundcloud', nombre: 'SoundCloud', color: '#FF5500',
        metrica: 'Plays',
        kpis: [{ label: 'Followers', valor: '0' }, { label: 'Plays', valor: '7.6K' }],
        serie: serie('2025-07-07', [0, 1338, 5, 1338, 12, 1695, 19, 2232, 26, 2232, 33, 2461, 40, 2864, 47, 3143, 54, 3465, 61, 3792, 68, 4166, 75, 5486, 82, 5486, 89, 6031, 96, 6296, 103, 6420, 110, 6542, 117, 6657, 124, 6772, 132, 6814, 138, 6873, 145, 6903, 152, 6903, 159, 6932, 166, 6932, 173, 7023, 187, 7072, 194, 7096, 201, 7152, 208, 7176, 215, 7176, 222, 7226, 229, 7226, 236, 7266, 250, 7278, 257, 7314, 264, 7314, 268, 7334, 269, 7334, 270, 7334, 272, 7351, 273, 7351, 274, 7351, 275, 7351, 276, 7351, 277, 7351, 278, 7360, 279, 7360, 280, 7360, 281, 7360, 282, 7360, 283, 7360, 284, 7360, 285, 7373, 286, 7373, 287, 7373, 288, 7373, 289, 7373, 290, 7373, 291, 7373, 292, 7388, 293, 7388, 294, 7388, 295, 7388, 296, 7388, 300, 7404, 306, 7414, 321, 7453, 328, 7466, 336, 7483, 341, 7483, 348, 7490, 355, 7502, 369, 7502, 376, 7502, 383, 7542, 390, 7542, 397, 7542, 404, 7566, 405, 7566, 406, 7571, 407, 7571, 408, 7573, 409, 7573, 410, 7576, 411, 7576, 412, 7576, 413, 7576, 414, 7576, 415, 7576, 416, 7576, 417, 7578, 418, 7578, 419, 7578, 420, 7578, 421, 7578, 422, 7578]),
      },
    ],
  },
  {
    id: 'ledher',
    nombre: 'Sebastian Ledher',
    estado: 'Sin datos',
    actualizado: '2/9/2026',
    fallo: true,
    ...FICHA_VACIA,
  },
];
