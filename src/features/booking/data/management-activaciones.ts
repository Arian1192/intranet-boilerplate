/**
 * Activaciones de Management — calco de `/management/activaciones` del live,
 * capturado el 2026-09-09 entre las 09:20 y las 09:40 CEST
 * (`docs/references/conceptone-v3-2026-09-09/management--activaciones.main.html`),
 * más los estados secundarios medidos a las 11:24-11:25 CEST
 * (`f2b-management--activaciones-{filtros,vacia}.*` y
 * `f2b-management--{contadores,vacios}.txt`).
 *
 * Las 31 activaciones van en el orden del live: por fecha ascendente, agrupadas
 * por mes. La fecha se guarda en ISO y la pantalla deriva de ella el día, el día
 * de la semana (`jue`, `mié`, `sáb`) y el rótulo del mes (`septiembre de 2026`):
 * comprobado que `Intl` en `es-ES` produce exactamente los literales del live.
 *
 * **Las 31 están en `Programada`.** No es una suposición: los `<select>` del
 * volcado no llevan el atributo `selected` —React fija el valor por propiedad—,
 * así que se leyó del PNG, donde las 31 filas rotulan `Programada`.
 *
 * `nota` es lo que el live pinta tras el `·` del artista. Se guarda entera, con
 * sus saltos de línea, aunque la fila la recorte con `truncate`: truncar el dato
 * sería perderlo.
 *
 * El filtro `Solo futuras` viene marcado en el live y compara contra el día de
 * hoy. Aquí compara contra `HOY_CAPTURA`, el día de la foto, no contra la fecha
 * real: si comparase con hoy, la pantalla se iría vaciando sola con el tiempo y
 * dejaría de ser el calco de la captura. Es la misma decisión que fijar las
 * cifras de Campañas.
 */
export type TipoActivacion =
  | 'Deadline de prensa'
  | 'Publicación'
  | 'Post social'
  | 'Activación de ads'
  | 'Release'
  | 'Show'
  | 'Rodaje de contenido'
  | 'Entrega'
  | 'Deadline de aprobación';

export type EstadoActivacion = 'Programada' | 'En curso' | 'Hecha' | 'Perdida';

export interface Activacion {
  /** ISO. La pantalla deriva de aquí el día, el día de la semana y el mes. */
  fecha: string;
  titulo: string;
  tipo: TipoActivacion;
  artista: string;
  /** Lo que el live pinta tras el `·`. Entera, con sus saltos de línea. */
  nota?: string;
}

/**
 * Las nueve opciones del filtro `Todos los tipos`, en el orden del live. Doble
 * medida coincidente: el menú abierto del filtro y el `<select>` del modal
 * `Editar activación` (`f2-management--activaciones-detalle.main.html`).
 */
export const TIPOS_ACTIVACION: readonly TipoActivacion[] = [
  'Deadline de prensa',
  'Publicación',
  'Post social',
  'Activación de ads',
  'Release',
  'Show',
  'Rodaje de contenido',
  'Entrega',
  'Deadline de aprobación',
];

/** Los cuatro estados del `<select>` de cada fila, en el orden del live. */
export const ESTADOS_ACTIVACION: readonly EstadoActivacion[] = [
  'Programada',
  'En curso',
  'Hecha',
  'Perdida',
];

/**
 * El día de la captura. `Solo futuras` compara contra esto para que la pantalla
 * siga enseñando las 31 de la foto pase el tiempo que pase.
 */
export const HOY_CAPTURA = '2026-09-09';

/** Las 31 activaciones, en el orden del live. Todas en `Programada`. */
export const ACTIVACIONES: Activacion[] = [
  {
    fecha: '2026-09-10',
    titulo: '"What it Do" single release - ',
    tipo: 'Release',
    artista: 'Milan Torne',
  },
  {
    fecha: '2026-09-10',
    titulo: 'YouTube Set: Cova Santa ',
    tipo: 'Post social',
    artista: 'Abdon',
    nota: 'Activamos campaña de google ads',
  },
  {
    fecha: '2026-09-10',
    titulo: 'YouTube Set: Tantra Ibiza',
    tipo: 'Post social',
    artista: 'DH Moon',
  },
  {
    fecha: '2026-09-10',
    titulo: 'Contactar con el Row - JASSI',
    tipo: 'Post social',
    artista: 'Vidaloca',
  },
  {
    fecha: '2026-09-11',
    titulo: '4 Track EP - Lost in the Groove Release collab w/ Sera de Villalta',
    tipo: 'Release',
    artista: 'Aaron Martin',
  },
  {
    fecha: '2026-09-13',
    titulo: 'Brunch Show - Grabación',
    tipo: 'Rodaje de contenido',
    artista: 'Londonground',
  },
  {
    fecha: '2026-09-15',
    titulo: '7-8 videos de Support ',
    tipo: 'Post social',
    artista: 'Janse',
    nota: 'Recopilar videos y hacer 2 posts\n',
  },
  {
    fecha: '2026-09-15',
    titulo: 'Photoshoot | De estudio y de calle',
    tipo: 'Rodaje de contenido',
    artista: 'Bizza',
    nota: 'Presupuesto aproximado €250 | Wardrobe by WANF | Beige color palette\n\nEstudio: https://shootestudios.com/alquiler-localizaciones-barcelona/alquiler-loft-para-rodaje-brooklyn/downtown-brooklyn/ = €280 + IVA\n\nRopa: WANF \nEstilismo: TBC\nMaquillaje: TBC',
  },
  {
    fecha: '2026-09-16',
    titulo: 'IDEA CONCEPTUAL -> Mariposas rodeando Janse -> Metamorfosi',
    tipo: 'Rodaje de contenido',
    artista: 'Janse',
    nota: 'Esta en un picnic cuando es rodeado de mariposas poco a poco hasta comerselo',
  },
  {
    fecha: '2026-09-16',
    titulo: 'Fiesta y Bullshit | Podcast o entrevista',
    tipo: 'Deadline de prensa',
    artista: 'Bizza',
    nota: 'Patri hablara con TEO para intentar cerrar\n\nCosas antiguas:\nParadise - Debut en UNVRS\nCecille - Release + B2B w/ Nick Curly at Showcase  \nBotaniq - House Release + Off Week Showcase \nMagentic People - Residencia en marca en crecimiento \n\nCosas nuevas:    \nOhana - Tema principal porque vamos a estar desarrollando el sello y showcase\nDeeperfect EP Release w/ Florentia + Potencial showcase ADE\nOrigins EP Release w/ Caal\nRhoush EP Release w/ Miike\nLTF potencialmente, contar esfuerzo de que nos aprueben sample\n\nGUIA DE PODCAST: https://docs.google.com/document/d/1LfhdmsTBqbj4A7iDFCDRivjlqVdTlHHZojo0U0_sj50/edit?usp=sharing',
  },
  {
    fecha: '2026-09-17',
    titulo: 'Clothes Sponsorship Study',
    tipo: 'Deadline de prensa',
    artista: 'Sebastian Ledher',
    nota: 'Armani Exchange | Prada | etc',
  },
  {
    fecha: '2026-09-17',
    titulo: 'Vlog de Lifestyle (formato largo)',
    tipo: 'Rodaje de contenido',
    artista: 'DH Moon',
  },
  {
    fecha: '2026-09-18',
    titulo: '8bit Release "Answer The Light" - 4 Track EP',
    tipo: 'Release',
    artista: 'Londonground',
    nota: 'Tenemos muy buen support sobre el track',
  },
  {
    fecha: '2026-09-19',
    titulo: 'Grabación - UNVRS',
    tipo: 'Post social',
    artista: 'Londonground',
  },
  {
    fecha: '2026-09-19',
    titulo: 'VideoSet en Boris - Set después de Damian Lazarus',
    tipo: 'Rodaje de contenido',
    artista: 'Janse',
    nota: 'Multi-cam para YouTube\n',
  },
  {
    fecha: '2026-09-24',
    titulo: 'Clips -> Formato TikTok (del vlog)',
    tipo: 'Post social',
    artista: 'DH Moon',
  },
  {
    fecha: '2026-09-24',
    titulo: 'Clips -> Formato Instagram (del vlog)',
    tipo: 'Post social',
    artista: 'DH Moon',
  },
  {
    fecha: '2026-09-27',
    titulo: 'Cova Santa B2B Abdon',
    tipo: 'Rodaje de contenido',
    artista: 'Janse',
    nota: 'Potencial multi-cam dependiendo de horario y aforo',
  },
  {
    fecha: '2026-10-10',
    titulo: 'Lapsus VA "Feel the ritmo"',
    tipo: 'Release',
    artista: 'Vidaloca',
  },
  {
    fecha: '2026-10-16',
    titulo: '"Everything" EP - Machaca la Membrana',
    tipo: 'Release',
    artista: 'Janse',
    nota: 'EP de 2 tracks: "Everything" y "That\'s Right"',
  },
  {
    fecha: '2026-10-19',
    titulo: 'LEXLAY x VIDALOCA EP TBC',
    tipo: 'Release',
    artista: 'Vidaloca',
    nota: 'Intercambio por fechas Happy Techno en Argentina',
  },
  {
    fecha: '2026-10-31',
    titulo: 'YouTube Set: Halloween Cueva (Mexico)',
    tipo: 'Rodaje de contenido',
    artista: 'DH Moon',
  },
  { fecha: '2026-11-01', titulo: '15 DIAS EN ESPAÑA ', tipo: 'Show', artista: 'DH Moon' },
  {
    fecha: '2026-11-06',
    titulo: '"Realase Name TBC" EP - Laundry',
    tipo: 'Release',
    artista: 'Janse',
    nota: 'EP de 3 tracks: "Guess what", "Don\'t Get It" y "Want Ya"',
  },
  {
    fecha: '2026-11-07',
    titulo: 'Posible videoset Mute Monkey | RD Punta Cana',
    tipo: 'Rodaje de contenido',
    artista: 'DH Moon',
  },
  {
    fecha: '2026-11-09',
    titulo: 'Videoset Comuna 13',
    tipo: 'Rodaje de contenido',
    artista: 'DH Moon',
    nota: 'Fecha TBC',
  },
  {
    fecha: '2026-11-11',
    titulo: 'A-SIMÉTRICO ALBUM RELEASE (En fase de Produción)',
    tipo: 'Release',
    artista: 'Abdon',
    nota: 'DIA DE RELEASE DE SINGLE 11/11 -> ALBUM RELEASE FEBRERO',
  },
  {
    fecha: '2026-12-16',
    titulo: 'Metamorfosi VA Release',
    tipo: 'Release',
    artista: 'Janse',
    nota: 'Saldrá antes de Navidad',
  },
  {
    fecha: '2026-12-18',
    titulo: 'EP "SIKO LELE" on ELROW MUSIC',
    tipo: 'Release',
    artista: 'Abdon',
    nota: 'Confirmed',
  },
  {
    fecha: '2027-01-01',
    titulo: 'Single "Corazón" en COCOA music',
    tipo: 'Release',
    artista: 'Aaron Martin',
    nota: 'TO BE CONFIRMED DATE',
  },
  {
    fecha: '2027-01-01',
    titulo: 'Single "Flowers in Anounymous" on NUSONIDO',
    tipo: 'Post social',
    artista: 'Abdon',
    nota: 'FECHA TO BE CONFIRMED',
  },
];
