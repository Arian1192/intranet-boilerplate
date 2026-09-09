/**
 * Insights — calco de `/management/insights` del live, capturado el 2026-09-09
 * entre las 09:20 y las 09:40 CEST
 * (`docs/references/conceptone-v3-2026-09-09/management--insights.main.html`).
 *
 * **Las cifras son las de esa foto.** El live las mueve a diario: son los datos
 * de Songstats a 90 días, así que cualquier comparación posterior contra el live
 * dará números distintos sin que nada esté roto.
 *
 * Se guardan **tal como los pinta el live** (`137.1K`, `9.7M`, `—`), no en crudo:
 * el formateo es del origen y no nos toca reinventarlo. Para ordenar la tabla se
 * interpreta el literal (ver `valorNumerico` en la página).
 *
 * Dos rarezas del origen que se calcan sin corregir:
 *
 * - Hay un sexto estado, `Sin datos`, que no aparece entre los cinco chips de
 *   filtro; lo lleva Sebastian Ledher, con guiones en todas las métricas y sin
 *   sparkline. Aun así el contador del live dice «17 con datos · 17 artistas».
 * - El color del sparkline no sigue al estado: casi todos van en acento y el de
 *   Marcel BS en rosa. No se ha deducido la regla, así que va guardado por fila.
 *
 * Los `id` son nuestros (slug del nombre). En el live son UUID; el único
 * conocido es el de Janse, `d371328b-a849-40ce-9320-dee3af5c017c`, y mezclar un
 * UUID real con dieciséis inventados sería peor que un slug legible.
 */
export type EstadoInsight =
  | 'Escalando'
  | 'Creciendo'
  | 'Estable'
  | 'En declive'
  | 'Inactivo'
  | 'Sin datos';

export interface MetricaInsight {
  /** El literal que pinta el live, ya formateado. */
  valor: string;
  /** Variación a 90 días, cuando el live la muestra. */
  delta?: string;
  tono?: 'emerald' | 'rose';
}

export interface ArtistaInsight {
  id: string;
  nombre: string;
  estado: EstadoInsight;
  oyentes: MetricaInsight;
  followers: MetricaInsight;
  streams: MetricaInsight;
  youtube: MetricaInsight;
  instagram: MetricaInsight;
  tiktok: MetricaInsight;
  /** Ausente en quien no tiene histórico. */
  sparkline?: { d: string; tono: 'accent' | 'rose' };
}

/** Los KPI de cabecera, con las cifras de la captura. */
export const RESUMEN_INSIGHTS = {
  oyentesDelRoster: '674.7K',
  followersDelRoster: '59.5K',
  conMomentum: 7,
  requierenAtencion: 7,
  contador: '17 con datos · 17 artistas',
} as const;

export const INSIGHTS_ROSTER: ArtistaInsight[] = [
  {
    id: 'janse',
    nombre: 'Janse',
    estado: 'En declive',
    oyentes: { valor: '137.1K', delta: '-17.9K · -23%', tono: 'rose' },
    followers: { valor: '289', delta: '+19', tono: 'emerald' },
    streams: { valor: '9.7M' },
    youtube: { valor: '3' },
    instagram: { valor: '4K' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,20.0 L4.8,13.4 L7.6,11.1 L10.3,11.9 L13.1,13.2 L15.9,14.7 L18.7,15.4 L21.5,15.9 L24.3,2.0 L27.0,3.5 L29.8,4.9 L32.6,3.3 L35.4,3.7 L38.2,4.6 L41.0,5.0 L43.7,5.6 L46.5,5.8 L49.3,9.2 L52.1,13.1 L54.9,13.9 L57.7,14.7 L60.4,14.8 L63.2,14.8 L66.0,15.8', tono: 'accent' },
  },
  {
    id: 'londonground',
    nombre: 'Londonground',
    estado: 'Estable',
    oyentes: { valor: '132.5K', delta: '+22.6K · +1%', tono: 'emerald' },
    followers: { valor: '10.8K', delta: '+299', tono: 'emerald' },
    streams: { valor: '12.9M' },
    youtube: { valor: '1.4K' },
    instagram: { valor: '17.9K' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,19.8 L4.8,20.0 L7.6,16.4 L10.3,15.6 L13.1,15.7 L15.9,14.7 L18.7,13.4 L21.5,13.4 L24.3,9.1 L27.0,7.3 L29.8,3.9 L32.6,7.7 L35.4,10.8 L38.2,10.4 L41.0,9.4 L43.7,12.4 L46.5,9.1 L49.3,2.6 L52.1,2.6 L54.9,2.0 L57.7,3.7 L60.4,5.7 L63.2,7.9 L66.0,3.9', tono: 'accent' },
  },
  {
    id: 'dh-moon',
    nombre: 'DH Moon',
    estado: 'Escalando',
    oyentes: { valor: '130.7K', delta: '+80.6K · +147%', tono: 'emerald' },
    followers: { valor: '966', delta: '+58', tono: 'emerald' },
    streams: { valor: '1.7M' },
    youtube: { valor: '246' },
    instagram: { valor: '22.6K' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,20.0 L4.8,20.0 L7.6,20.0 L10.3,20.0 L13.1,20.0 L15.9,19.9 L18.7,19.9 L21.5,19.9 L24.3,19.9 L27.0,19.9 L29.8,19.5 L32.6,19.5 L35.4,18.6 L38.2,17.3 L41.0,14.7 L43.7,16.3 L46.5,16.8 L49.3,16.5 L52.1,14.2 L54.9,13.9 L57.7,12.2 L60.4,14.3 L63.2,13.0 L66.0,2.0', tono: 'accent' },
  },
  {
    id: 'art-no-logia',
    nombre: 'ART NO LOGIA',
    estado: 'En declive',
    oyentes: { valor: '88.8K', delta: '+4.4K · -10%', tono: 'emerald' },
    followers: { valor: '1.5K', delta: '+120', tono: 'emerald' },
    streams: { valor: '1.6M' },
    youtube: { valor: '716' },
    instagram: { valor: '30.8K' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,19.7 L4.8,19.9 L7.6,19.8 L10.3,19.9 L13.1,20.0 L15.9,20.0 L18.7,20.0 L21.5,20.0 L24.3,19.8 L27.0,18.9 L29.8,18.4 L32.6,17.2 L35.4,18.2 L38.2,18.4 L41.0,18.4 L43.7,17.9 L46.5,17.6 L49.3,18.0 L52.1,14.6 L54.9,9.4 L57.7,2.0 L60.4,2.8 L63.2,5.2 L66.0,4.2', tono: 'accent' },
  },
  {
    id: 'bizza',
    nombre: 'Bizza',
    estado: 'Escalando',
    oyentes: { valor: '51.8K', delta: '+27.2K · +19%', tono: 'emerald' },
    followers: { valor: '2.8K', delta: '+223', tono: 'emerald' },
    streams: { valor: '1.7M' },
    youtube: { valor: '172' },
    instagram: { valor: '17.7K' },
    tiktok: { valor: '1.3K' },
    sparkline: { d: 'M2.0,20.0 L4.8,20.0 L7.6,19.8 L10.3,18.9 L13.1,17.4 L15.9,16.8 L18.7,16.6 L21.5,17.3 L24.3,16.4 L27.0,17.2 L29.8,17.6 L32.6,17.5 L35.4,16.8 L38.2,17.3 L41.0,17.9 L43.7,12.7 L46.5,16.1 L49.3,13.7 L52.1,14.5 L54.9,10.6 L57.7,4.6 L60.4,9.8 L63.2,14.1 L66.0,2.0', tono: 'accent' },
  },
  {
    id: 'gaston-zani',
    nombre: 'Gaston Zani',
    estado: 'En declive',
    oyentes: { valor: '41.7K', delta: '-2.7K · -27%', tono: 'rose' },
    followers: { valor: '4K', delta: '+43', tono: 'emerald' },
    streams: { valor: '4.8M' },
    youtube: { valor: '719' },
    instagram: { valor: '52.1K' },
    tiktok: { valor: '23.4K' },
    sparkline: { d: 'M2.0,12.9 L4.8,14.5 L7.6,15.8 L10.3,17.1 L13.1,17.3 L15.9,16.4 L18.7,16.6 L21.5,17.6 L24.3,18.1 L27.0,18.0 L29.8,17.7 L32.6,16.6 L35.4,18.4 L38.2,18.8 L41.0,20.0 L43.7,19.8 L46.5,16.0 L49.3,16.2 L52.1,2.0 L54.9,11.4 L57.7,10.2 L60.4,10.3 L63.2,12.9 L66.0,13.8', tono: 'rose' },
  },
  {
    id: 'tony-guerra',
    nombre: 'Tony Guerra',
    estado: 'En declive',
    oyentes: { valor: '41.1K', delta: '+769 · -11%', tono: 'emerald' },
    followers: { valor: '22.7K', delta: '+201', tono: 'emerald' },
    streams: { valor: '7.6M' },
    youtube: { valor: '406.3K' },
    instagram: { valor: '219.8K' },
    tiktok: { valor: '158.8K' },
    sparkline: { d: 'M2.0,19.7 L4.8,20.0 L7.6,16.2 L10.3,16.2 L13.1,15.6 L15.9,15.9 L18.7,16.0 L21.5,17.9 L24.3,17.7 L27.0,18.1 L29.8,17.6 L32.6,17.6 L35.4,18.5 L38.2,16.9 L41.0,16.0 L43.7,16.8 L46.5,15.3 L49.3,14.5 L52.1,10.7 L54.9,9.8 L57.7,6.6 L60.4,2.0 L63.2,9.3 L66.0,8.8', tono: 'accent' },
  },
  {
    id: 'claudia-tejeda',
    nombre: 'Claudia Tejeda',
    estado: 'Escalando',
    oyentes: { valor: '9.3K', delta: '+1.6K · +107%', tono: 'emerald' },
    followers: { valor: '2K', delta: '+48', tono: 'emerald' },
    streams: { valor: '856K' },
    youtube: { valor: '657' },
    instagram: { valor: '43.3K' },
    tiktok: { valor: '3.1K' },
    sparkline: { d: 'M2.0,19.7 L4.8,20.0 L7.6,19.8 L10.3,17.0 L13.1,17.0 L15.9,17.5 L18.7,16.1 L21.5,16.3 L24.3,14.2 L27.0,15.0 L29.8,14.4 L32.6,15.0 L35.4,14.8 L38.2,16.7 L41.0,15.4 L43.7,15.6 L46.5,14.9 L49.3,14.5 L52.1,14.9 L54.9,13.4 L57.7,15.1 L60.4,11.9 L63.2,6.5 L66.0,2.0', tono: 'accent' },
  },
  {
    id: 'vidaloca',
    nombre: 'Vidaloca',
    estado: 'Escalando',
    oyentes: { valor: '8.9K', delta: '-2.5K · +18%', tono: 'rose' },
    followers: { valor: '4.4K', delta: '+27', tono: 'emerald' },
    streams: { valor: '1.7M' },
    youtube: { valor: '302' },
    instagram: { valor: '30K' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,17.7 L4.8,16.6 L7.6,17.5 L10.3,17.6 L13.1,14.4 L15.9,16.0 L18.7,16.9 L21.5,17.6 L24.3,17.6 L27.0,18.7 L29.8,18.4 L32.6,17.6 L35.4,18.6 L38.2,19.5 L41.0,20.0 L43.7,20.0 L46.5,18.9 L49.3,18.9 L52.1,18.3 L54.9,5.6 L57.7,7.0 L60.4,10.5 L63.2,2.0 L66.0,6.8', tono: 'accent' },
  },
  {
    id: 'los-canarios',
    nombre: 'Los Canarios',
    estado: 'Estable',
    oyentes: { valor: '8.9K', delta: '+147 · +1%', tono: 'emerald' },
    followers: { valor: '4.6K', delta: '+62', tono: 'emerald' },
    streams: { valor: '591.8K' },
    youtube: { valor: '2.3K' },
    instagram: { valor: '0' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,19.2 L4.8,19.6 L7.6,20.0 L10.3,16.2 L13.1,15.7 L15.9,18.0 L18.7,15.7 L21.5,18.0 L24.3,17.6 L27.0,16.1 L29.8,9.9 L32.6,2.0 L35.4,12.7 L38.2,12.1 L41.0,14.2 L43.7,9.5 L46.5,4.1 L49.3,8.5 L52.1,11.0 L54.9,8.2 L57.7,9.2 L60.4,9.4 L63.2,9.3 L66.0,8.7', tono: 'accent' },
  },
  {
    id: 'rivellino',
    nombre: 'Rivellino',
    estado: 'Escalando',
    oyentes: { valor: '8.9K', delta: '+5.1K · +149%', tono: 'emerald' },
    followers: { valor: '1K', delta: '+24', tono: 'emerald' },
    streams: { valor: '509.5K' },
    youtube: { valor: '105' },
    instagram: { valor: '13.2K' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,20.0 L4.8,9.0 L7.6,9.2 L10.3,10.6 L13.1,16.1 L15.9,17.0 L18.7,18.1 L21.5,18.5 L24.3,19.6 L27.0,17.0 L29.8,2.0 L32.6,10.7 L35.4,15.7 L38.2,14.9 L41.0,13.7 L43.7,15.7 L46.5,14.2 L49.3,13.1 L52.1,12.2 L54.9,13.7 L57.7,16.4 L60.4,14.3 L63.2,16.3 L66.0,8.1', tono: 'accent' },
  },
  {
    id: 'milan-torne',
    nombre: 'Milan Torne',
    estado: 'Escalando',
    oyentes: { valor: '8.7K', delta: '+1.2K · +43%', tono: 'emerald' },
    followers: { valor: '1K', delta: '+14', tono: 'emerald' },
    streams: { valor: '4.3M' },
    youtube: { valor: '16' },
    instagram: { valor: '7.7K' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,18.2 L4.8,20.0 L7.6,19.7 L10.3,13.6 L13.1,4.7 L15.9,2.0 L18.7,7.8 L21.5,11.0 L24.3,11.3 L27.0,9.2 L29.8,10.7 L32.6,12.6 L35.4,14.6 L38.2,14.4 L41.0,15.0 L43.7,16.2 L46.5,16.8 L49.3,17.4 L52.1,18.2 L54.9,18.1 L57.7,14.6 L60.4,16.2 L63.2,11.3 L66.0,8.0', tono: 'accent' },
  },
  {
    id: 'abdon',
    nombre: 'Abdon',
    estado: 'En declive',
    oyentes: { valor: '4.3K', delta: '+251 · -23%', tono: 'emerald' },
    followers: { valor: '572', delta: '+12', tono: 'emerald' },
    streams: { valor: '291.6K' },
    youtube: { valor: '36' },
    instagram: { valor: '0' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,20.0 L4.8,18.9 L7.6,19.2 L10.3,18.6 L13.1,13.0 L15.9,2.0 L18.7,3.5 L21.5,9.6 L24.3,9.9 L27.0,8.0 L29.8,8.4 L32.6,4.0 L35.4,6.1 L38.2,2.8 L41.0,7.8 L43.7,9.0 L46.5,9.5 L49.3,9.3 L52.1,11.4 L54.9,12.2 L57.7,9.1 L60.4,6.5 L63.2,11.8 L66.0,11.6', tono: 'accent' },
  },
  {
    id: 'aaron-martin',
    nombre: 'Aaron Martin',
    estado: 'En declive',
    oyentes: { valor: '1.6K', delta: '+99 · -29%', tono: 'emerald' },
    followers: { valor: '1.5K', delta: '+22', tono: 'emerald' },
    streams: { valor: '444.7K' },
    youtube: { valor: '180' },
    instagram: { valor: '26.3K' },
    tiktok: { valor: '1.3K' },
    sparkline: { d: 'M2.0,14.6 L4.8,16.6 L7.6,17.1 L10.3,16.9 L13.1,17.5 L15.9,17.9 L18.7,15.3 L21.5,18.3 L24.3,18.9 L27.0,19.0 L29.8,19.3 L32.6,19.4 L35.4,19.7 L38.2,20.0 L41.0,2.0 L43.7,14.0 L46.5,15.7 L49.3,15.7 L52.1,15.8 L54.9,17.1 L57.7,17.6 L60.4,18.4 L63.2,19.3 L66.0,19.1', tono: 'rose' },
  },
  {
    id: 'freddy-bello',
    nombre: 'Freddy Bello',
    estado: 'En declive',
    oyentes: { valor: '313', delta: '+14 · -11%', tono: 'emerald' },
    followers: { valor: '1.3K', delta: '+6', tono: 'emerald' },
    streams: { valor: '139.8K' },
    youtube: { valor: '111' },
    instagram: { valor: '37.1K' },
    tiktok: { valor: '3.3K' },
    sparkline: { d: 'M2.0,17.4 L4.8,16.1 L7.6,18.5 L10.3,19.1 L13.1,18.9 L15.9,2.0 L18.7,8.1 L21.5,13.7 L24.3,15.1 L27.0,16.2 L29.8,7.5 L32.6,14.2 L35.4,12.3 L38.2,18.8 L41.0,18.7 L43.7,19.1 L46.5,19.4 L49.3,19.3 L52.1,19.4 L54.9,19.1 L57.7,19.6 L60.4,19.8 L63.2,20.0 L66.0,19.9', tono: 'rose' },
  },
  {
    id: 'marcel-bs',
    nombre: 'Marcel BS',
    estado: 'Creciendo',
    oyentes: { valor: '82', delta: '-24 · +8%', tono: 'rose' },
    followers: { valor: '43', delta: '+3', tono: 'emerald' },
    streams: { valor: '15.4K' },
    youtube: { valor: '0' },
    instagram: { valor: '0' },
    tiktok: { valor: '0' },
    sparkline: { d: 'M2.0,11.9 L4.8,2.5 L7.6,2.0 L10.3,7.5 L13.1,18.9 L15.9,19.0 L18.7,19.5 L21.5,19.5 L24.3,19.6 L27.0,19.8 L29.8,19.9 L32.6,19.9 L35.4,19.8 L38.2,19.8 L41.0,19.9 L43.7,19.9 L46.5,20.0 L49.3,20.0 L52.1,20.0 L54.9,20.0 L57.7,19.9 L60.4,19.9 L63.2,20.0 L66.0,20.0', tono: 'rose' },
  },
  {
    id: 'sebastian-ledher',
    nombre: 'Sebastian Ledher',
    estado: 'Sin datos',
    oyentes: { valor: '—' },
    followers: { valor: '—' },
    streams: { valor: '—' },
    youtube: { valor: '—' },
    instagram: { valor: '—' },
    tiktok: { valor: '—' },
  },
];
