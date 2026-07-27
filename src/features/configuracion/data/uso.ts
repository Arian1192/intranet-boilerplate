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

export interface IntegrationDetailRow {
  id: string;
  label: string;
  usos?: number;
  errors?: number;
  spend?: number;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  pricingModel: 'cuota' | 'por_uso';
  monthlyFee?: number;
  statusDot: 'green' | 'amber' | 'red' | 'slate';
  statusLabel: string;
  subfunctions?: AiSubfunction[];
  detailRows?: IntegrationDetailRow[];
}

export interface IntegrationUsageSnapshot {
  integrationId: string;
  period: UsagePeriod;
  usos?: number;
  tarda?: string;
  tokensLabel?: string;
  spend?: number;
  perUse?: number | null;
  errors?: number;
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

export interface UsageFailure {
  id: string;
  date: string;
  integration: string;
  message: string;
}

const AI_SUBFUNCTIONS: AiSubfunction[] = [
  { id: 'ia-triaje', label: 'Triaje de incidencias', model: 'gemini-flash-latest', usos: 11, tokensIn: '44k', tokensOut: '1k', spend: 0.0154 },
  { id: 'ia-chat', label: 'Chat de ayuda', model: 'gemini-flash-latest', usos: 12, tokensIn: '46k', tokensOut: '923', spend: 0.015 },
  { id: 'ia-copys', label: 'copys', model: 'gemini-flash-latest', usos: 3, tokensIn: '1k', tokensOut: '695', spend: 0.0019 },
  { id: 'ia-mejorar', label: 'mejorar', model: 'gemini-flash-latest', usos: 2, tokensIn: '490', tokensOut: '159', spend: 0.0005 },
];

const INTEGRATIONS: Integration[] = [
  {
    id: 'precio-vuelos',
    name: 'Precio de vuelos',
    provider: 'FlightAPI',
    pricingModel: 'cuota',
    monthlyFee: 42.89,
    statusDot: 'red',
    statusLabel: 'Falló la última vez · 400 something went wrong, please try again',
    detailRows: [
      { id: 'estimar', label: 'estimar', usos: 4, errors: 2, spend: 0 },
      { id: 'estimar-roundtrip', label: 'estimar_roundtrip', usos: 1, errors: 1, spend: 0 },
    ],
  },
  {
    id: 'perfiles-artista',
    name: 'Perfiles de artista',
    provider: 'Spotify / Deezer',
    pricingModel: 'cuota',
    monthlyFee: 11,
    statusDot: 'green',
    statusLabel: 'Funciona · última vez 27/7/2026',
    detailRows: [
      { id: 'refrescar', label: 'refrescar', usos: 45, spend: 0 },
      { id: 'perfil', label: 'perfil', usos: 8, spend: 0 },
      { id: 'buscar', label: 'buscar', usos: 5, spend: 0 },
    ],
  },
  { id: 'ia', name: 'Inteligencia artificial', provider: 'Anthropic / Google / OpenAI', pricingModel: 'por_uso', statusDot: 'green', statusLabel: 'Funciona · última vez 21/7/2026', subfunctions: AI_SUBFUNCTIONS },
  { id: 'vat', name: 'vat', provider: '—', pricingModel: 'por_uso', statusDot: 'red', statusLabel: 'Falló la última vez · CONFIG_GB' },
  { id: 'firma-contratos', name: 'Firma de contratos', provider: 'Signaturit', pricingModel: 'por_uso', statusDot: 'slate', statusLabel: 'Sin usar en este periodo' },
  { id: 'correo-saliente', name: 'Correo saliente', provider: 'Resend', pricingModel: 'por_uso', statusDot: 'slate', statusLabel: 'Sin usar en este periodo' },
  { id: 'horarios-vuelos', name: 'Horarios de vuelos', provider: 'AeroDataBox (RapidAPI)', pricingModel: 'por_uso', statusDot: 'slate', statusLabel: 'Sin usar en este periodo' },
];

// Snapshot live de 30 días capturado en `/configuracion/uso`.
const SNAPSHOTS_30D: IntegrationUsageSnapshot[] = [
  { integrationId: 'precio-vuelos', period: '30d', usos: 5, tarda: '5.9 s', errors: 3, perUse: 8.58, includedNote: '5 de 30.000 incluidas' },
  { integrationId: 'perfiles-artista', period: '30d', usos: 58, tarda: '0.7 s', perUse: 0.19 },
  { integrationId: 'ia', period: '30d', usos: 28, tarda: '11.2 s', tokensLabel: '92k → 3k', spend: 0.03 },
  { integrationId: 'vat', period: '30d', usos: 4, errors: 4, spend: 0 },
  { integrationId: 'firma-contratos', period: '30d', usos: 0, spend: 0 },
  { integrationId: 'correo-saliente', period: '30d', usos: 0, spend: 0 },
  { integrationId: 'horarios-vuelos', period: '30d', usos: 0, spend: 0 },
];

const TOTALS_30D: UsageTotals = { period: '30d', cuotaFijaMes: 53.89, gastoTotalPeriodo: 53.92, errores: 7 };

const USAGE_BANNERS: UsageBannerData[] = [
  { boldText: '3 suscripciones sin importe.', text: 'Salen a 0 €, y eso no es que sean gratis: es que no le has dicho lo que pagas.', linkLabel: 'Rellenar precios' },
  { text: '12 tarifas de IA sin verificar contra una factura real. El coste que ves es un orden de magnitud, no una cifra contable.' },
];

const FAILURES: UsageFailure[] = [
  { id: 'f-1', date: '27/7, 00:31', integration: 'vat', message: 'CONFIG_GB' },
  { id: 'f-2', date: '27/7, 00:30', integration: 'vat', message: 'CONFIG_GB' },
  { id: 'f-3', date: '27/7, 00:15', integration: 'vat', message: 'HMRC 401: {"code": "MISSING_CREDENTIALS", "message": "Authentication information is not provided"}' },
  { id: 'f-4', date: '27/7, 00:15', integration: 'vat', message: 'HMRC 401: {"code": "MISSING_CREDENTIALS", "message": "Authentication information is not provided"}' },
  { id: 'f-5', date: '23/7, 16:50', integration: 'Precio de vuelos', message: '400 something went wrong, please try again' },
  { id: 'f-6', date: '23/7, 16:50', integration: 'Precio de vuelos', message: '400 something went wrong, please try again' },
  { id: 'f-7', date: '23/7, 16:50', integration: 'Precio de vuelos', message: '400 something went wrong, please try again' },
];

export function integrations(): Integration[] {
  return INTEGRATIONS.map((i) => ({
    ...i,
    subfunctions: i.subfunctions ? i.subfunctions.map((s) => ({ ...s })) : undefined,
    detailRows: i.detailRows ? i.detailRows.map((r) => ({ ...r })) : undefined,
  }));
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

export function usageFailures(): UsageFailure[] {
  return FAILURES.map((f) => ({ ...f }));
}
