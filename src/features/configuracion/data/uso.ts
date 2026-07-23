export type UsagePeriod = '7d' | '30d' | '90d' | '1y';

export interface AiSubfunction {
  id: string;
  label: string;
  model: string;
  usos: number;
  tokensIn: string;
  tokensOut: string;
  spend: number;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  pricingModel: 'cuota' | 'por_uso';
  monthlyFee?: number;
  statusDot: 'green' | 'amber';
  statusLabel: string;
  subfunctions?: AiSubfunction[];
}

export interface IntegrationUsageSnapshot {
  integrationId: string;
  period: UsagePeriod;
  usos?: number;
  tarda?: string;
  tokensLabel?: string;
  spend?: number;
  perUse?: number | null;
  includedNote?: string;
}

export interface UsageTotals {
  period: UsagePeriod;
  cuotaFijaMes: number;
  gastoTotalPeriodo: number;
  errores: number;
}

export interface UsageBannerData {
  boldText?: string;
  text: string;
  linkLabel?: string;
}

const AI_SUBFUNCTIONS: AiSubfunction[] = [
  { id: 'ia-triaje', label: 'Triaje de incidencias', model: 'gemini-flash-latest', usos: 11, tokensIn: '44k', tokensOut: '1k', spend: 0.0154 },
  { id: 'ia-chat', label: 'Chat de ayuda', model: 'gemini-flash-latest', usos: 12, tokensIn: '46k', tokensOut: '923', spend: 0.015 },
  { id: 'ia-copys', label: 'copys', model: 'gemini-flash-latest', usos: 3, tokensIn: '1k', tokensOut: '695', spend: 0.0019 },
  { id: 'ia-mejorar', label: 'mejorar', model: 'gemini-flash-latest', usos: 2, tokensIn: '490', tokensOut: '159', spend: 0.0005 },
];

const INTEGRATIONS: Integration[] = [
  { id: 'precio-vuelos', name: 'Precio de vuelos', provider: 'FlightAPI', pricingModel: 'cuota', monthlyFee: 42.89, statusDot: 'green', statusLabel: 'Funciona · última vez 21/7/2026' },
  { id: 'ia', name: 'Inteligencia artificial', provider: 'Anthropic / Google / OpenAI', pricingModel: 'por_uso', statusDot: 'green', statusLabel: 'Funciona · última vez 21/7/2026', subfunctions: AI_SUBFUNCTIONS },
  { id: 'correo-saliente', name: 'Correo saliente', provider: 'Resend', pricingModel: 'por_uso', statusDot: 'amber', statusLabel: 'Sin usar en este periodo' },
  { id: 'firma-contratos', name: 'Firma de contratos', provider: 'Signaturit', pricingModel: 'por_uso', statusDot: 'amber', statusLabel: 'Sin usar en este periodo' },
  { id: 'perfiles-artista', name: 'Perfiles de artista', provider: 'Spotify / Deezer', pricingModel: 'cuota', monthlyFee: 11, statusDot: 'amber', statusLabel: 'Lo pagas y no lo has usado' },
  { id: 'horarios-vuelos', name: 'Horarios de vuelos', provider: 'AeroDataBox (RapidAPI)', pricingModel: 'por_uso', statusDot: 'amber', statusLabel: 'Sin usar en este periodo' },
];

// Solo hay cifras reales observadas para el periodo 30d; 7d/90d/1y reutilizan el mismo
// snapshot como delta documentado (no se fabrican series temporales no observadas en el live).
const SNAPSHOTS_30D: IntegrationUsageSnapshot[] = [
  { integrationId: 'precio-vuelos', period: '30d', usos: 1, tarda: '10.6 s', perUse: 42.89, includedNote: '1 de 30.000 incluidas' },
  { integrationId: 'ia', period: '30d', usos: 28, tarda: '11.2 s', tokensLabel: '92k → 3k', spend: 0.03 },
  { integrationId: 'correo-saliente', period: '30d', usos: 0, spend: 0 },
  { integrationId: 'perfiles-artista', period: '30d', usos: 0, perUse: null },
  { integrationId: 'horarios-vuelos', period: '30d', usos: 0, spend: 0 },
  // 'firma-contratos': el live no muestra fila de métricas para esta integración.
];

const TOTALS_30D: UsageTotals = { period: '30d', cuotaFijaMes: 53.89, gastoTotalPeriodo: 53.92, errores: 0 };

const USAGE_BANNERS: UsageBannerData[] = [
  { boldText: '3 suscripciones sin importe.', text: 'Salen a 0 €, y eso no es que sean gratis: es que no le has dicho lo que pagas.', linkLabel: 'Rellenar precios' },
  { boldText: 'Estás pagando y no lo usas:', text: 'Perfiles de artista. Ninguna llamada en 30 días.' },
  { text: '12 tarifas de IA sin verificar contra una factura real. El coste que ves es un orden de magnitud, no una cifra contable.' },
];

export function integrations(): Integration[] {
  return INTEGRATIONS.map((i) => ({ ...i, subfunctions: i.subfunctions ? i.subfunctions.map((s) => ({ ...s })) : undefined }));
}

export function snapshotFor(integrationId: string, period: UsagePeriod): IntegrationUsageSnapshot | undefined {
  const found = SNAPSHOTS_30D.find((s) => s.integrationId === integrationId);
  return found ? { ...found, period } : undefined;
}

export function totalsFor(period: UsagePeriod): UsageTotals {
  return { ...TOTALS_30D, period };
}

export function usageBanners(): UsageBannerData[] {
  return USAGE_BANNERS.map((b) => ({ ...b }));
}
