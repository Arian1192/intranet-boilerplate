import type { MagazineId } from './contenidos';

export interface CampaignStage {
  id: string;
  magazine: MagazineId;
  label: string;
  order: number;
  bucket: 'aire' | 'ganado';
  tone: 'slate' | 'emerald';
}

export interface Campaign {
  id: string;
  magazine: MagazineId;
  stageId: string;
  name: string;
  client: string;
  clientId?: string;
  amount: number;
  untilLabel: string;
}

const stagesForMagazine = (magazine: MagazineId, prefix: string): CampaignStage[] => [
  { id: `${prefix}-tentativa`, magazine, label: 'TENTATIVA', order: 1, bucket: 'aire', tone: 'slate' },
  { id: `${prefix}-propuesta`, magazine, label: 'PROPUESTA ENVIADA', order: 2, bucket: 'aire', tone: 'slate' },
  { id: `${prefix}-negociacion`, magazine, label: 'NEGOCIACIÓN', order: 3, bucket: 'aire', tone: 'slate' },
  { id: `${prefix}-aceptada`, magazine, label: 'ACEPTADA', order: 4, bucket: 'ganado', tone: 'emerald' },
  { id: `${prefix}-encurso`, magazine, label: 'EN CURSO', order: 5, bucket: 'ganado', tone: 'slate' },
  { id: `${prefix}-completada`, magazine, label: 'COMPLETADA', order: 6, bucket: 'ganado', tone: 'slate' },
];

export const STAGES: CampaignStage[] = [
  ...stagesForMagazine('mixmag', 'mix'),
  ...stagesForMagazine('tagmag', 'tag'),
];

export const campaigns: Campaign[] = [
  { id: 'cm1', magazine: 'mixmag', stageId: 'mix-aceptada', name: 'Campaña Test 1', client: 'Cold Cloud SL', amount: 1500, untilLabel: 'hasta 29 jul' },
  { id: 'ct1', magazine: 'tagmag', stageId: 'tag-aceptada', name: 'Campaña Test 1', client: 'Cold Cloud SL', amount: 1500, untilLabel: 'hasta 29 jul' },
];

export function stagesFor(magazine: MagazineId): CampaignStage[] {
  return STAGES.filter((s) => s.magazine === magazine).sort((a, b) => a.order - b.order);
}

export function campaignsFor(magazine: MagazineId): Campaign[] {
  return campaigns.filter((c) => c.magazine === magazine);
}

export interface CampaignFilter {
  query?: string;
  stageId?: string;
}

export function filterCampaigns(list: Campaign[], f: CampaignFilter): Campaign[] {
  return list.filter((c) => {
    if (f.query) {
      const q = f.query.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.client.toLowerCase().includes(q)) return false;
    }
    if (f.stageId && c.stageId !== f.stageId) return false;
    return true;
  });
}

export function groupByStage(list: Campaign[], stages: CampaignStage[]): { stage: CampaignStage; items: Campaign[] }[] {
  return stages.map((stage) => ({ stage, items: list.filter((c) => c.stageId === stage.id) }));
}

export function countByStage(list: Campaign[], stages: CampaignStage[]): Record<string, number> {
  const out: Record<string, number> = {};
  stages.forEach((s) => (out[s.id] = 0));
  list.forEach((c) => { if (c.stageId in out) out[c.stageId] += 1; });
  return out;
}

export function sumByStage(list: Campaign[], stages: CampaignStage[]): Record<string, number> {
  const out: Record<string, number> = {};
  stages.forEach((s) => (out[s.id] = 0));
  list.forEach((c) => { if (c.stageId in out) out[c.stageId] += c.amount; });
  return out;
}

export function campaignStats(list: Campaign[], stages: CampaignStage[]): { enElAire: number; ganado: number } {
  const bucketOf: Record<string, 'aire' | 'ganado'> = {};
  stages.forEach((s) => (bucketOf[s.id] = s.bucket));
  let enElAire = 0;
  let ganado = 0;
  list.forEach((c) => {
    if (bucketOf[c.stageId] === 'aire') enElAire += c.amount;
    else if (bucketOf[c.stageId] === 'ganado') ganado += c.amount;
  });
  return { enElAire, ganado };
}
