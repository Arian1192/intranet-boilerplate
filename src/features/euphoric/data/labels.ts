import type { CampaignStatus, PieceStatus } from './types';

export const campaignStatusLabel: Record<CampaignStatus, string> = {
  'planificada': 'Planificada',
  'en-curso': 'En curso',
  'pausada': 'Pausada',
  'finalizada': 'Finalizada',
  'cancelada': 'Cancelada',
};

export const pieceStatusLabel: Record<PieceStatus, string> = {
  'briefing': 'Briefing',
  'en-produccion': 'En producción',
  'revision': 'Revisión',
  'cambios': 'Cambios',
  'aprobado': 'Aprobado',
};
