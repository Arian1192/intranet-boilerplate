export type ContentTeam = 'redes' | 'web' | 'revista';
export type MagazineId = 'mixmag' | 'tagmag';

export interface ContentStatus {
  id: string;
  magazine: MagazineId;
  label: string;
  order: number;
  teamsOnly?: ContentTeam[];
  tone: 'plain' | 'slate' | 'amber';
}

export interface ContentPiece {
  id: string;
  magazine: MagazineId;
  team: ContentTeam;
  statusId: string;
  title: string;
  type: string;
  campaignId?: string;
  campaignName?: string;
  dueLabel: string;
  ownerInitials?: string;
  ownerColor?: string;
  mine: boolean;
}

export const TEAMS: { id: ContentTeam; label: string; chip: string }[] = [
  { id: 'redes', label: 'Redes', chip: 'bg-violet-100 text-violet-700' },
  { id: 'web', label: 'Web', chip: 'bg-rose-100 text-rose-700' },
  { id: 'revista', label: 'Revista', chip: 'bg-emerald-100 text-emerald-700' },
];

const M = (id: string, label: string, order: number, tone: ContentStatus['tone'], teamsOnly?: ContentTeam[]): ContentStatus =>
  ({ id, magazine: 'mixmag', label, order, tone, teamsOnly });
const T = (id: string, label: string, order: number, tone: ContentStatus['tone']): ContentStatus =>
  ({ id, magazine: 'tagmag', label, order, tone });

export const STATUSES: ContentStatus[] = [
  M('mix-idea', 'IDEA', 1, 'plain'),
  M('mix-borrador', 'BORRADOR', 2, 'slate'),
  M('mix-encurso', 'EN CURSO', 3, 'amber'),
  M('mix-correcciones', 'CORRECCIONES', 4, 'slate'),
  M('mix-maquetacion', 'MAQUETACIÓN', 5, 'slate', ['revista']),
  M('mix-pend-aprob', 'PENDIENTE DE APROBACIÓN', 6, 'slate'),
  M('mix-aprobado', 'APROBADO', 7, 'slate'),
  M('mix-programado', 'PROGRAMADO', 8, 'slate'),
  M('mix-publicado', 'PUBLICADO', 9, 'slate'),
  T('tag-pend-rev', 'PENDIENTE DE REVISIÓN', 1, 'slate'),
  T('tag-aprob-escribir', 'APROBADO (A ESCRIBIR)', 2, 'slate'),
  T('tag-borrador', 'BORRADOR', 3, 'slate'),
  T('tag-correcciones', 'CORRECCIONES', 4, 'slate'),
  T('tag-programado', 'PROGRAMADO', 5, 'slate'),
  T('tag-publicado', 'PUBLICADO', 6, 'slate'),
];

const CAMP = { id: 'cmp-test-1', name: 'Campaña Test 1' };

export const pieces: ContentPiece[] = [
  { id: 'c1', magazine: 'mixmag', team: 'redes', statusId: 'mix-idea', title: 'Campaña Test 1 · Story', type: 'Stories', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
  { id: 'c2', magazine: 'mixmag', team: 'redes', statusId: 'mix-borrador', title: 'Campaña Test 1 · Post en redes', type: 'Post (IG/FB)', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
  { id: 'c3', magazine: 'mixmag', team: 'web', statusId: 'mix-idea', title: 'Campaña Test 1 · Artículo patrocinado', type: 'Artículo', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
  { id: 'c4', magazine: 'mixmag', team: 'web', statusId: 'mix-encurso', title: 'Campaña Test 1 · Artículo patrocinado', type: 'Noticia', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
  { id: 'c5', magazine: 'mixmag', team: 'revista', statusId: 'mix-borrador', title: 'Artículo Soho Farmhouse Ibiza', type: 'Artículo', dueLabel: 'hoy', ownerInitials: 'A', ownerColor: '#64748b', mine: true },
  { id: 'c6', magazine: 'mixmag', team: 'revista', statusId: 'mix-borrador', title: 'Campaña Test 1 · Publirreportaje', type: 'Artículo', campaignId: CAMP.id, campaignName: CAMP.name, dueLabel: '29 jul 2026', mine: false },
];

export function statusesFor(magazine: MagazineId): ContentStatus[] {
  return STATUSES.filter((s) => s.magazine === magazine).sort((a, b) => a.order - b.order);
}

export function statusesForTeam(magazine: MagazineId, team: ContentTeam): ContentStatus[] {
  return statusesFor(magazine).filter((s) => !s.teamsOnly || s.teamsOnly.includes(team));
}

export function piecesFor(magazine: MagazineId): ContentPiece[] {
  return pieces.filter((p) => p.magazine === magazine);
}

export interface PieceFilter {
  query?: string;
  mine?: boolean;
  scope?: 'todo' | 'campana' | 'organico';
  team?: ContentTeam;
  statusId?: string;
}

export function filterPieces(list: ContentPiece[], f: PieceFilter): ContentPiece[] {
  return list.filter((p) => {
    if (f.query && !p.title.toLowerCase().includes(f.query.toLowerCase())) return false;
    if (f.mine && !p.mine) return false;
    if (f.scope === 'campana' && !p.campaignId) return false;
    if (f.scope === 'organico' && p.campaignId) return false;
    if (f.team && p.team !== f.team) return false;
    if (f.statusId && p.statusId !== f.statusId) return false;
    return true;
  });
}

export function groupByTeam(list: ContentPiece[]): Record<ContentTeam, ContentPiece[]> {
  return {
    redes: list.filter((p) => p.team === 'redes'),
    web: list.filter((p) => p.team === 'web'),
    revista: list.filter((p) => p.team === 'revista'),
  };
}

export function countByStatus(list: ContentPiece[], statuses: ContentStatus[]): Record<string, number> {
  const out: Record<string, number> = {};
  statuses.forEach((s) => (out[s.id] = 0));
  list.forEach((p) => { if (p.statusId in out) out[p.statusId] += 1; });
  return out;
}

export function teamCounts(list: ContentPiece[]): { todos: number; redes: number; web: number; revista: number } {
  return {
    todos: list.length,
    redes: list.filter((p) => p.team === 'redes').length,
    web: list.filter((p) => p.team === 'web').length,
    revista: list.filter((p) => p.team === 'revista').length,
  };
}
