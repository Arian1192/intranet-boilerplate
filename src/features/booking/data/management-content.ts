/**
 * Content de Management — calco de `/management/content` del live, capturado el
 * 2026-09-09 entre las 09:20 y las 09:40 CEST
 * (`docs/references/conceptone-v3-2026-09-09/management--content.main.html`),
 * más los estados secundarios medidos a las 11:24-11:25 CEST
 * (`f2b-management--content-{filtros,vacia}.*` y `f2b-management--{contadores,vacios}.txt`).
 *
 * El live tiene **un solo proyecto**, en `Idea`; las otras cuatro columnas
 * pintan su guion. Sus campos salen del modal `Editar proyecto`
 * (`f2-management--content-detalle.main.html`): `Producido por` es lo que la
 * tarjeta escribe tras el `·` del artista, y vale `ConceptOne`.
 *
 * Las cinco fases son las cinco columnas del tablero, en el orden del live: el
 * `<select>` `Fase` del modal declara `idea`, `briefed`, `in_production`,
 * `in_review` y `delivered`, con esos rótulos. Aquí se guarda el rótulo, no el
 * código, siguiendo lo que ya hacen `management-insights.ts` y sus hermanas.
 *
 * El resto de campos son los del modal `Editar proyecto`, leídos el 2026-09-09 a
 * las 11:52 CEST (`f2d-management--content-modales.txt`). En el único proyecto
 * del live **están todos vacíos** menos `Producido por`: sin brief, sin importes,
 * sin fechas y con las tres casillas desmarcadas. Se declaran igualmente porque
 * el modal los pinta, y se dejan vacíos porque es lo que hay, no lo que
 * imaginamos.
 */
export type FaseContent = 'Idea' | 'Briefado' | 'Producción' | 'Revisión' | 'Entregado';

export type TipoContent = 'Vídeo' | 'Foto' | 'Artwork' | 'Branding' | 'Otro';

export interface ProyectoContent {
  titulo: string;
  artista: string;
  tipo: TipoContent;
  fase: FaseContent;
  /** El campo `Producido por` del modal; la tarjeta lo pinta tras el `·`. */
  producidoPor?: string;
  /** `Campaña (de qué campaña forma parte)`. */
  campana?: string;
  proveedorExterno?: boolean;
  brief?: string;
  presupuestoCotizado?: number;
  aprobadoImporte?: number;
  real?: number;
  paga?: PagaProyecto;
  recuperable?: boolean;
  /** ISO. Campo `Brief enviado`. */
  briefEnviado?: string;
  /** ISO. Campo `Entrega prevista`. */
  entregaPrevista?: string;
  aprobado?: boolean;
  notas?: string;
}

export type PagaProyecto = 'Artista' | 'Agencia' | 'Compartido';

/** Las tres del `<select>` `Paga` del modal, en su orden. */
export const PAGA_PROYECTO: readonly PagaProyecto[] = ['Artista', 'Agencia', 'Compartido'];

/** Las cinco columnas del tablero, en el orden del live. */
export const FASES_CONTENT: readonly FaseContent[] = [
  'Idea',
  'Briefado',
  'Producción',
  'Revisión',
  'Entregado',
];

/** Los cinco tipos del `<select>` `Tipo` del modal, en su orden. */
export const TIPOS_CONTENT: readonly TipoContent[] = [
  'Vídeo',
  'Foto',
  'Artwork',
  'Branding',
  'Otro',
];

/** El único proyecto que tiene el live el 2026-09-09. */
export const PROYECTOS_CONTENT: ProyectoContent[] = [
  {
    titulo: '8bit Release promo video "LIFESTYLE"',
    artista: 'Londonground',
    tipo: 'Vídeo',
    fase: 'Idea',
    producidoPor: 'ConceptOne',
    paga: 'Artista',
    proveedorExterno: false,
    recuperable: false,
    aprobado: false,
  },
];
