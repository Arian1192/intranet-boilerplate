/**
 * Campañas de Management — calco de `/management/campanas` del live, capturado
 * el 2026-09-09 entre las 09:20 y las 09:40 CEST
 * (`docs/references/conceptone-v3-2026-09-09/management--campanas.main.html`),
 * más los estados secundarios medidos a las 11:24-11:25 CEST
 * (`f2b-management--campanas-{filtros,contador,contadores,vacios}.txt`).
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
 * Dos rarezas del origen que se calcan sin corregir:
 *
 * - **Fran Hernandez tiene campaña pero no está en el desplegable de artistas.**
 *   El filtro lista los 17 del roster de management y él no es uno
 *   (`management: false` en `management-roster.ts`), así que su campaña no se
 *   puede aislar desde la pantalla. Es del live, no un fallo del calco.
 * - Dos campañas **no traen fecha**; el live entonces pinta sólo el artista.
 */
export type CanalCampana =
  'Google Ads' | 'Meta Ads' | 'Spotify Ads' | 'Playlisting' | 'PR' | 'Otro';

export type EstadoCampana = 'Propuesta' | 'Aprobada' | 'Activa' | 'Completada' | 'Cancelada';

export type PagaCampana = 'Artista' | 'Agencia' | 'Compartido';

export interface Campana {
  nombre: string;
  artista: string;
  /** Tal como lo pinta el live (`17 sept 2026`). Ausente en dos campañas. */
  fecha?: string;
  canal: CanalCampana;
  estado: EstadoCampana;
  paga: PagaCampana;
  gasto: number;
  presupuesto: number;
}

/**
 * Las seis opciones del filtro `Todos los canales`, en el orden del live.
 * Medidas dos veces y coincidentes: el menú abierto del filtro y el `<select>`
 * del modal `Editar campaña` (`f2-management--campanas-detalle.main.html`).
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

/** Las 11 campañas, en el orden del live (por fecha descendente, las sin fecha al final). */
export const CAMPANAS: Campana[] = [
  {
    nombre: 'Campaña de aumento de suscriptores en YouTube',
    artista: 'Abdon',
    fecha: '17 sept 2026',
    canal: 'Otro',
    estado: 'Aprobada',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 75,
  },
  {
    nombre: 'YouTube: Suscriptores al canal',
    artista: 'DH Moon',
    fecha: '17 sept 2026',
    canal: 'Google Ads',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 150,
  },
  {
    nombre: 'YouTube: Visualizaciones sobre Tantra Liveset',
    artista: 'DH Moon',
    fecha: '10 sept 2026',
    canal: 'Google Ads',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 50,
  },
  {
    // El espacio final del nombre es del live.
    nombre: 'Campaña de Views en YouTube set COVA SANTA ',
    artista: 'Abdon',
    fecha: '10 sept 2026',
    canal: 'Google Ads',
    estado: 'Aprobada',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 100,
  },
  {
    nombre: 'Campaña de aumento de seguidores - Meta (Instagram)',
    artista: 'Abdon',
    fecha: '10 sept 2026',
    canal: 'Meta Ads',
    estado: 'Aprobada',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 75,
  },
  {
    nombre: "Campaña lanzamiento 'Favela'",
    artista: 'Claudia Tejeda',
    fecha: '04 sept 2026',
    canal: 'Meta Ads',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 850,
    presupuesto: 0,
  },
  {
    nombre: 'Campaña general Bizza',
    artista: 'Bizza',
    fecha: '02 sept 2026',
    canal: 'Otro',
    estado: 'Activa',
    paga: 'Agencia',
    gasto: 0,
    presupuesto: 0,
  },
  {
    nombre: "Campaña lanzamiento 'Wild Groove'",
    artista: 'Claudia Tejeda',
    fecha: '27 ago 2026',
    canal: 'Playlisting',
    estado: 'Aprobada',
    paga: 'Artista',
    gasto: 300,
    presupuesto: 0,
  },
  {
    nombre: 'Campaña General para EU',
    artista: 'Gaston Zani',
    fecha: '26 ago 2026',
    canal: 'Meta Ads',
    estado: 'Aprobada',
    paga: 'Compartido',
    gasto: 0,
    presupuesto: 200,
  },
  {
    nombre: 'Hey Mami - Spotify Streams + YouTube Views',
    artista: 'DH Moon',
    canal: 'Otro',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 0,
  },
  {
    nombre: 'Campaña EP c/Bizza "ABC" y "Club Fiction" EP (TBC date and EP name)',
    artista: 'Fran Hernandez',
    canal: 'Otro',
    estado: 'Propuesta',
    paga: 'Artista',
    gasto: 0,
    presupuesto: 0,
  },
];
