/**
 * Campañas de Management — calco de `/management/campanas` del live, capturado
 * el 2026-09-09 entre las 09:20 y las 09:40 CEST
 * (`docs/references/conceptone-v3-2026-09-09/management--campanas.main.html`),
 * los filtros a las 11:24-11:26 (`f2b-`) y **los once modales de edición campo a
 * campo a las 11:52** (`f2d-management--campanas-{modales,opciones}.txt`).
 *
 * **Las cifras son las de esa foto.** El live las mueve a diario, así que una
 * comparación posterior dará otros números sin que nada esté roto.
 *
 * Los importes van en número, no en literal, porque los tres KPI se suman de
 * ellos y coinciden al céntimo con los de la captura:
 *
 * - `INVERSIÓN DEL ARTISTA 1150,00 €` = 850 + 300, el gasto de las que paga el
 *   artista o van compartidas.
 * - `PRESUPUESTO ACTIVO 450,00 €` = 75 + 100 + 75 + 200, el presupuesto de las
 *   aprobadas y activas.
 * - `CAMPAÑAS ACTIVAS 1` = la de Bizza.
 *
 * Y **los tres se recalculan con el filtro puesto**: medido filtrando por Abdon,
 * el live pasa a `0,00 €` / `250,00 €` / `0` y a «3 campañas»
 * (`f2b-management--campanas-filtrada-abdon.png`). No son totales del conjunto.
 *
 * **`inicio` es la fecha que la fila pinta tras el artista.** Se guarda en ISO y
 * de ahí salen las dos formas que usa el live sin escribir ninguna a mano: la
 * fila dice `17 sept 2026` y el modal `17/09/2026`. Comprobado que `Intl` en
 * `es-ES` da el literal exacto de la fila. Las dos campañas sin fecha en la
 * lista son justo las dos que tienen `Inicio` vacío en su modal.
 *
 * Dos rarezas del origen que se calcan sin corregir:
 *
 * - **Fran Hernandez tiene campaña pero no está en el desplegable de artistas.**
 *   El filtro lista los 17 del roster de management y él no es uno
 *   (`management: false` en `management-roster.ts`), así que su campaña no se
 *   puede aislar desde la pantalla. Es del live, no un fallo del calco.
 * - Varias campañas repiten el mismo texto en `Objetivo` y en `Notas`.
 */
export type CanalCampana =
  'Google Ads' | 'Meta Ads' | 'Spotify Ads' | 'Playlisting' | 'PR' | 'Otro';

export type EstadoCampana = 'Propuesta' | 'Aprobada' | 'Activa' | 'Completada' | 'Cancelada';

export type PagaCampana = 'Artista' | 'Agencia' | 'Compartido';

export interface Campana {
  nombre: string;
  artista: string;
  /** ISO. La fila y el modal derivan de aquí sus dos formatos. Ausente en dos. */
  inicio?: string;
  /** ISO. Sólo en el modal. */
  fin?: string;
  canal: CanalCampana;
  estado: EstadoCampana;
  paga: PagaCampana;
  gasto: number;
  presupuesto: number;
  /** Campo `Estrategia (a qué plan pertenece)` del modal. */
  estrategia?: string;
  objetivo?: string;
  notas?: string;
  /**
   * Campo `Campaña madre (opcional)`. Ninguna de las once lo tiene puesto: las
   * once dicen «— Ninguna (es principal) —». Se declara porque el modal lo pinta.
   */
  campanaMadre?: string;
}

/**
 * Las seis opciones del filtro `Todos los canales`, en el orden del live.
 * Medidas dos veces y coincidentes: el menú abierto del filtro y el `<select>`
 * del modal `Editar campaña`.
 */
export const CANALES_CAMPANA: readonly CanalCampana[] = [
  'Google Ads',
  'Meta Ads',
  'Spotify Ads',
  'Playlisting',
  'PR',
  'Otro',
];

/** Las cinco del filtro `Todos los estados`, con la misma doble medida. */
export const ESTADOS_CAMPANA: readonly EstadoCampana[] = [
  'Propuesta',
  'Aprobada',
  'Activa',
  'Completada',
  'Cancelada',
];

/** Las tres del `<select>` `Paga` del modal, en su orden. */
export const PAGA_CAMPANA: readonly PagaCampana[] = ['Artista', 'Agencia', 'Compartido'];

/**
 * Qué estrategias ofrece el `<select>` `Estrategia` **de cada artista**: la lista
 * no es global, cambia con el artista elegido. Medida abriendo los once modales
 * (`f2d-management--campanas-opciones.txt`). Los artistas que no aparecen aquí
 * sólo ven «— Sin estrategia —».
 *
 * El catálogo completo vive en `/management/estrategias`, que no es de esta
 * fase: aquí sólo se guarda lo que el modal enseña.
 */
export const ESTRATEGIAS_POR_ARTISTA: Record<string, readonly string[]> = {
  Abdon: ['Plan de Crecimiento Redes'],
  'DH Moon': ['Estrategia de Crecimiento Redes 2026/2027'],
  'Gaston Zani': ['Lanzamiento Marca Nueva "Aktivo"', 'Más bookings en EU'],
};

/** Las 11 campañas, en el orden del live (por fecha descendente, las sin fecha al final). */
export const CAMPANAS: Campana[] = [
  {
    nombre: 'Campaña de aumento de suscriptores en YouTube',
    artista: 'Abdon',
    inicio: '2026-09-17',
    fin: '2026-10-01',
    canal: 'Otro',
    estado: 'Aprobada',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 75,
    estrategia: 'Plan de Crecimiento Redes',
    objetivo: 'Aumentar suscriptores hasta 1K mínimo',
    notas: 'Aumentar suscriptores hasta 1K mínimo',
  },
  {
    nombre: 'YouTube: Suscriptores al canal',
    artista: 'DH Moon',
    inicio: '2026-09-17',
    fin: '2026-09-30',
    canal: 'Google Ads',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 150,
    estrategia: 'Estrategia de Crecimiento Redes 2026/2027',
    objetivo: '10%',
  },
  {
    nombre: 'YouTube: Visualizaciones sobre Tantra Liveset',
    artista: 'DH Moon',
    inicio: '2026-09-10',
    fin: '2026-09-17',
    canal: 'Google Ads',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 50,
    estrategia: 'Estrategia de Crecimiento Redes 2026/2027',
    objetivo: '6K-10K visualizaciones',
  },
  {
    nombre: 'Campaña de Views en YouTube set COVA SANTA ',
    artista: 'Abdon',
    inicio: '2026-09-10',
    fin: '2026-09-20',
    canal: 'Google Ads',
    estado: 'Aprobada',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 100,
    estrategia: 'Plan de Crecimiento Redes',
    objetivo: '10K views',
    notas: 'Aumentar views en YouTube hasta 10K mínimo.',
  },
  {
    nombre: 'Campaña de aumento de seguidores - Meta (Instagram)',
    artista: 'Abdon',
    inicio: '2026-09-10',
    fin: '2026-09-17',
    canal: 'Meta Ads',
    estado: 'Aprobada',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 75,
    estrategia: 'Plan de Crecimiento Redes',
    objetivo: 'Aumentar seguidores en IG',
    notas:
      'Aumentar seguidores en IG a través de meta ads. Elegir un pieza de contenido que sea la que mejor views tenga en RRSS de Abdon.',
  },
  {
    nombre: "Campaña lanzamiento 'Favela'",
    artista: 'Claudia Tejeda',
    inicio: '2026-09-04',
    fin: '2026-10-04',
    canal: 'Meta Ads',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 850,
    presupuesto: 0,
    objetivo:
      'Aumentar plays en Spotify y maximizar fees y cantidad de bolos en las regiones con más escuchas',
    notas:
      'Aumentar plays en spotify\nEnfocarse en territorios donde podamos maximizar fees y cantidad de bolos: España, México, Colombia, Chile y Argentina',
  },
  {
    nombre: 'Campaña general Bizza',
    artista: 'Bizza',
    inicio: '2026-09-02',
    canal: 'Otro',
    estado: 'Activa',
    paga: 'Agencia',
    gasto: 0,
    presupuesto: 0,
    objetivo: 'Actualizar press kit, biografía, imágenes, checkear redes sociales, etc',
    notas: 'Actualizar press kit, biografía, imágenes, checkear redes sociales, etc',
  },
  {
    nombre: "Campaña lanzamiento 'Wild Groove'",
    artista: 'Claudia Tejeda',
    inicio: '2026-08-27',
    fin: '2026-09-27',
    canal: 'Playlisting',
    estado: 'Aprobada',
    paga: 'Artista',
    gasto: 300,
    presupuesto: 0,
    objetivo: 'Aumentar plays en spotify Enfocarse en subir el índice de popularidad del track',
    notas:
      'Aumentar plays en spotify\nEnfocarse en subir el índice de popularidad del track y que Spotify lo empiece a incluir en las playlist editoriales de la plataforma',
  },
  {
    nombre: 'Campaña General para EU',
    artista: 'Gaston Zani',
    inicio: '2026-08-26',
    fin: '2026-09-02',
    canal: 'Meta Ads',
    estado: 'Aprobada',
    paga: 'Compartido',
    gasto: 0,
    presupuesto: 200,
    objetivo: 'Mas shows en EU',
    notas:
      'Regiones:\n\n🇩🇪 Alemania: Berlín, Frankfurt, Hamburgo, Stuttgart, Düsseldorf\n🇳🇱 Netherlands: Amsterdam\n🇫🇷 Francia: París, Lyon, Marsella, Toulouse, Lille\n\nAGENCIA ADELANTA €200 QUE SE RECUPERAN DE LOS 2 SIGUIENTES SHOWS',
  },
  {
    nombre: 'Hey Mami - Spotify Streams + YouTube Views',
    artista: 'DH Moon',
    canal: 'Otro',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 0,
    notas: 'Indice de popularidad 24 -> Streams bajos (objetivo subir)',
  },
  {
    nombre: 'Campaña EP c/Bizza "ABC" y "Club Fiction" EP (TBC date and EP name)',
    artista: '— Elige —',
    canal: 'Otro',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 0,
  },
];
