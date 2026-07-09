import type { BadgeProps } from '@/components/ui/Badge';
import type { CampaignStatus, PiecePriority, PieceStatus } from './types';

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

export const PRIORITY_VARIANT: Record<PiecePriority, BadgeProps['variant']> = {
  baja: 'neutral',
  media: 'amber',
  alta: 'danger',
};

export const PRIORITY_LABEL: Record<PiecePriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
};
