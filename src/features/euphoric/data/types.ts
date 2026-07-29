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

export type AccountHealth = 'Sana' | 'Riesgo' | 'Crítica';
export type PaymentStatus = 'Al corriente' | 'Pendiente' | 'Retraso';
export type CommercialStatus = 'Lead' | 'Activo' | 'Finalizado';

/** Base de datos de contactos subida y limpiada para una cuenta. */
export interface AccountDatabase {
  id: string; name: string; eventName: string; cleanContacts: number; totalContacts: number; state: string;
}
/** Plantilla que genera publicaciones solas al crear un evento de la cuenta. */
export interface PublicationTemplate {
  id: string; title: string; offsetDays: number; time: string; channel: string; format: string; active: boolean;
}
/** Plantilla que genera creatividades solas al crear un evento de la cuenta. */
export interface CreativeTemplate {
  id: string; name: string; type: string; department: string; deadlineOffsetDays: number;
  linkedPublication: string; active: boolean;
}

export interface Account {
  id: string; name: string; kind: string; services: string[];
  status: 'Activa' | 'Pausada' | 'Inactiva'; retainer: number;
  health: AccountHealth;
  commercialStatus: CommercialStatus;
  tier: string;
  sector: string;
  startDate: string;
  monthlyHours: string;
  contractSigned: boolean;
  paymentStatus: PaymentStatus;
  crmClient: string;
  approvalLink: string;
  databases: AccountDatabase[];
  publicationTemplates: PublicationTemplate[];
  creativeTemplates: CreativeTemplate[];
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
