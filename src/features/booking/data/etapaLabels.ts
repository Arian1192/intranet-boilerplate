import type { ShowStatus } from '@/types';

/**
 * Diccionario de etiquetas de etapa (relabels del live: "Pendiente cobro" / "Liquidado").
 * Compartido entre KpiCard (tiles del dashboard) y ShowCard (lista de Shows) para no duplicar.
 * Mantiene la clave `offer` porque el Record debe ser exhaustivo sobre ShowStatus.
 */
export const etapaLabels: Record<ShowStatus, string> = {
  tentative: 'Tentative',
  offer: 'Oferta',
  confirmed: 'Confirmado',
  contract: 'Contrato',
  'pending-payment': 'Pendiente cobro',
  'pending-settlement': 'Pendiente liquidar',
  done: 'Liquidado',
};

export function etapaLabel(status: ShowStatus): string {
  return etapaLabels[status];
}
