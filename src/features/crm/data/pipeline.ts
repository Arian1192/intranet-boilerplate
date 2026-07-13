export interface PipelineStage {
  id: string;
  company: string;
  name: string;
  order: number;
  probability: number; // 0..1
  outcome?: 'won' | 'lost';
}

export interface Opportunity {
  id: string;
  orgId: string;
  orgName: string;
  // Denormalization of stage.company (derivable via stageId → stage); kept for convenient filtering.
  company: string;
  stageId: string;
  amount: number;
  ownerInitials: string;
  ownerColor: string; // hex
  closeDate: string;  // ISO yyyy-mm-dd
  note?: string;
  createdAt: string;  // ISO
}

export const COMPANIES_WITH_PIPELINE = ['ConceptOne', 'Etra Agency'];

// Probabilidades: solo Contactado (.25, Etra) es observado en el live; el resto son
// asunción de venta razonable a sustituir cuando llegue Supabase.
const CONCEPTONE_STAGES: Omit<PipelineStage, 'company'>[] = [
  { id: 'c1-interes', name: 'Interés', order: 0, probability: 0.1 },
  { id: 'c1-oferta', name: 'Oferta enviada', order: 1, probability: 0.4 },
  { id: 'c1-confirmando', name: 'Confirmando fecha', order: 2, probability: 0.7 },
  { id: 'c1-contratado', name: 'Contratado', order: 3, probability: 1, outcome: 'won' },
  { id: 'c1-caido', name: 'Caído', order: 4, probability: 0, outcome: 'lost' },
];
const ETRA_STAGES: Omit<PipelineStage, 'company'>[] = [
  { id: 'et-nuevo', name: 'Nuevo', order: 0, probability: 0.1 },
  { id: 'et-contactado', name: 'Contactado', order: 1, probability: 0.25 },
  { id: 'et-cualificado', name: 'Cualificado', order: 2, probability: 0.4 },
  { id: 'et-propuesta', name: 'Propuesta', order: 3, probability: 0.6 },
  { id: 'et-negociacion', name: 'Negociación', order: 4, probability: 0.8 },
  { id: 'et-ganada', name: 'Ganada', order: 5, probability: 1, outcome: 'won' },
  { id: 'et-perdida', name: 'Perdida', order: 6, probability: 0, outcome: 'lost' },
];

export const STAGES: PipelineStage[] = [
  ...CONCEPTONE_STAGES.map((s) => ({ ...s, company: 'ConceptOne' })),
  ...ETRA_STAGES.map((s) => ({ ...s, company: 'Etra Agency' })),
];

// Oportunidades sobre clientes existentes (orgs). Incluye el patrón de la real
// del live (Etra · Contactado · 48.000 € · nota con fecha).
export const opportunities: Opportunity[] = [
  { id: 'op1', orgId: 'o2', orgName: 'Foot District', company: 'Etra Agency', stageId: 'et-contactado', amount: 48000, ownerInitials: 'IC', ownerColor: '#059669', closeDate: '2026-10-01', note: 'Mostrar la oficina reformada · 15 sept 2026', createdAt: '2026-06-20' },
  { id: 'op2', orgId: 'o1', orgName: 'BMG', company: 'Etra Agency', stageId: 'et-nuevo', amount: 12000, ownerInitials: 'MR', ownerColor: '#2563eb', closeDate: '2026-11-15', note: 'Campaña lanzamiento Q4', createdAt: '2026-07-01' },
  { id: 'op3', orgId: 'o3', orgName: 'New Era', company: 'Etra Agency', stageId: 'et-propuesta', amount: 30000, ownerInitials: 'AC', ownerColor: '#db2777', closeDate: '2026-09-30', note: 'Propuesta anual · 12 sept 2026', createdAt: '2026-05-10' },
  { id: 'op4', orgId: 'o1', orgName: 'BMG', company: 'Etra Agency', stageId: 'et-ganada', amount: 20000, ownerInitials: 'IC', ownerColor: '#059669', closeDate: '2026-06-01', note: 'Cerrada · retención', createdAt: '2026-03-01' },
  { id: 'op5', orgId: 'o5', orgName: 'ALQUIEVENTS SL', company: 'ConceptOne', stageId: 'c1-interes', amount: 8000, ownerInitials: 'JG', ownerColor: '#7c3aed', closeDate: '2026-12-01', note: 'Alquiler escenario', createdAt: '2026-07-05' },
  { id: 'op6', orgId: 'o4', orgName: '1A PROJECTS 1802 SL', company: 'ConceptOne', stageId: 'c1-oferta', amount: 15000, ownerInitials: 'JG', ownerColor: '#7c3aed', closeDate: '2026-10-20', note: 'Oferta producción', createdAt: '2026-06-15' },
  { id: 'op7', orgId: 'o5', orgName: 'ALQUIEVENTS SL', company: 'ConceptOne', stageId: 'c1-confirmando', amount: 25000, ownerInitials: 'IC', ownerColor: '#059669', closeDate: '2026-09-15', note: 'Confirmando fecha festival', createdAt: '2026-04-22' },
];

export function stagesFor(company: string): PipelineStage[] {
  return STAGES.filter((s) => s.company === company).sort((a, b) => a.order - b.order);
}

export function opportunitiesFor(opps: Opportunity[], company: string): Opportunity[] {
  return opps.filter((o) => o.company === company);
}

export function groupByStage(opps: Opportunity[], stages: PipelineStage[]) {
  return stages.map((stage) => {
    const stageOpps = opps.filter((o) => o.stageId === stage.id);
    return { stage, opps: stageOpps, total: stageOpps.reduce((a, o) => a + o.amount, 0) };
  });
}

export function pipelineStats(opps: Opportunity[], stages: PipelineStage[]) {
  const byId = Object.fromEntries(stages.map((s) => [s.id, s]));
  const open = opps.filter((o) => !byId[o.stageId]?.outcome);
  const won = opps.filter((o) => byId[o.stageId]?.outcome === 'won');
  return {
    openTotal: open.reduce((a, o) => a + o.amount, 0),
    openCount: open.length,
    forecast: open.reduce((a, o) => a + o.amount * (byId[o.stageId]?.probability ?? 0), 0),
    wonTotal: won.reduce((a, o) => a + o.amount, 0),
    wonCount: won.length,
  };
}

export function moveOpportunity(opps: Opportunity[], oppId: string, dir: 1 | -1, stages: PipelineStage[]): Opportunity[] {
  return opps.map((o) => {
    if (o.id !== oppId) return o;
    const idx = stages.findIndex((s) => s.id === o.stageId);
    if (idx === -1) return o;
    const next = Math.max(0, Math.min(stages.length - 1, idx + dir));
    return { ...o, stageId: stages[next].id };
  });
}

const EUR = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
export function formatEur(n: number): string {
  return EUR.format(n);
}

const DATE = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
export function formatDate(iso: string): string {
  return DATE.format(new Date(iso + 'T00:00:00')).replace('.', '');
}
