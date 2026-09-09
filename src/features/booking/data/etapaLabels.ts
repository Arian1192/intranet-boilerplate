import type { ShowStatus } from '@/types';

/**
 * Diccionario de etiquetas de etapa. Compartido entre `KpiCard` (los tiles del
 * dashboard), `ShowCard` (la lista de Shows), `AgendaHoldCard` y el drawer de
 * Filtros, que lo deriva de aquí para que no haya dos listas.
 * Mantiene la clave `offer` porque el Record debe ser exhaustivo sobre ShowStatus.
 *
 * **`done` se llama `Cerrado`, no `Liquidado`** (recalco del 2026-09-09). Medido
 * en el live tres veces: el `<select>` `Etapa` trae las mismas seis opciones en
 * el mismo orden con sólo la sexta cambiada, el tile del dashboard rotula
 * «Ver shows en Cerrado» con el mismo `emerald-600`, y la palabra «Cerrado»
 * aparece **cero veces** en `/liquidaciones`.
 *
 * Ese último dato es el que lo hace seguro: `Liquidado` es vocabulario del eje
 * de **liquidación** —el que usan `/liquidaciones` y `PaymentStatus`— y `Cerrado`
 * lo es del eje de **etapa**. Nosotros veníamos usando la misma palabra para los
 * dos, y el live los tiene separados. Esto no colapsa dos significados: deshace
 * una ambigüedad nuestra.
 */
export const etapaLabels: Record<ShowStatus, string> = {
  tentative: 'Tentative',
  offer: 'Oferta',
  confirmed: 'Confirmado',
  contract: 'Contrato',
  'pending-payment': 'Pendiente cobro',
  'pending-settlement': 'Pendiente liquidar',
  done: 'Cerrado',
};

export function etapaLabel(status: ShowStatus): string {
  return etapaLabels[status];
}
