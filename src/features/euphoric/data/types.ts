export type CampaignStatus = 'planificada' | 'en-curso' | 'pausada' | 'finalizada' | 'cancelada';
export type PieceStatus = 'briefing' | 'en-produccion' | 'revision' | 'cambios' | 'aprobado';
export type PiecePriority = 'baja' | 'media' | 'alta';
export type EventKind = 'marketing' | 'produccion';
export type PublicationKanbanColumn =
  | 'falta-copy'
  | 'falta-arte'
  | 'falta-aprobacion'
  | 'listo'
  | 'programado'
  | 'publicado';

export interface Account {
  id: string; name: string; kind: string; services: string[];
  status: 'Activa' | 'Pausada' | 'Inactiva'; retainer: number;
}
export interface Campaign {
  id: string; name: string; account: string; type: string;
  startLabel: string; endLabel: string; status: CampaignStatus; owner: string; budget: number; spent: number;
}
export interface Piece {
  id: string; title: string; client: string; type: string; priority: PiecePriority;
  deadlineLabel: string; status: PieceStatus; owner: string;
  clientApproval: string; checklistDone: number; checklistTotal: number;
}
export interface EventItem {
  id: string; name: string; dateLabel: string; isoDate: string; city: string;
  kind: EventKind; euphoricCount?: number;
}
export interface Publication {
  id: string; name: string; dateLabel: string; isoDate: string; channel: string;
  account: string; status: string; type: string; eventName?: string;
  time: string; textApproval: string; imageApproval: string; kanbanColumn: PublicationKanbanColumn;
}
export interface Artist {
  id: string; name: string; kind: 'Agencia' | 'Externo';
}
