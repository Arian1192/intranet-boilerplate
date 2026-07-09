import type { CampaignStatus } from './types';

export const campaignStatusLabel: Record<CampaignStatus, string> = {
  'planificada': 'Planificada',
  'en-curso': 'En curso',
  'pausada': 'Pausada',
  'finalizada': 'Finalizada',
  'cancelada': 'Cancelada',
};
