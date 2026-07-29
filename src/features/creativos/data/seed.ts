export type PieceStatus = 'Briefing' | 'En producción' | 'Revisión' | 'Cambios' | 'Aprobado';
export type PiecePriority = 'Alta' | 'Media' | 'Baja';
export type PieceType = 'Estático' | 'Vídeo' | 'Animado';

export interface CreativePiece {
  id: string;
  assignee: string;
  title: string;
  client: string;
  type: PieceType;
  version: string;
  priority: PiecePriority;
  deadline: string;
  status: PieceStatus;
  checklist?: { done: number; total: number };
  clientApproval?: string;
  isOverdue?: boolean;
  /**
   * Marcador libre que el live pinta al extremo derecho de la fila del responsable.
   * HUECO: la evidencia del 27-jul solo muestra `🎬` en `Video Pomo 26/07`, y NO depende del
   * tipo (`Flyer Claptone 02/08` también es Vídeo y no lo lleva). Sin regla derivable de la
   * evidencia, se modela como dato por creatividad en vez de inventar la semántica.
   */
  icon?: string;
}

export const CURRENT_USER = 'Carlos';

/**
 * Las 3 creatividades del live del 27-jul (`live-2026-07-27-21-tablero.json`), en el orden en
 * que el live las lista en la tabla: Pack Sold Out, Video Pomo, Flyer Claptone.
 *
 * `isOverdue` se SIEMBRA en vez de calcularse a propósito: la regla del live es
 * `deadline vencido && status !== 'Aprobado'` (DD1 de la spec, confirmada en la Tarea 1 —
 * la creatividad aprobada lleva el badge de deadline en pizarra, no en rosa, y el stat
 * `Atrasadas` marca 2 con los tres deadlines vencidos). Calcularla contra `Date.now()` ataría
 * los tests a la fecha del sistema, así que el flag es la fuente y esta nota es la regla.
 *
 * `priority` ya no se muestra en ninguna vista del live (ni tarjeta ni tabla); se conserva
 * porque el drawer de alta la sigue pidiendo. Sin evidencia del valor real, va en 'Media'.
 */
export const pieces: CreativePiece[] = [
  {
    id: 'p2', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out',
    client: 'SIGHT', type: 'Estático', version: 'v1', priority: 'Media',
    deadline: '10 jul 2026', status: 'En producción', checklist: { done: 0, total: 3 },
    isOverdue: true,
  },
  {
    id: 'p1', assignee: 'Alba', title: 'Video Pomo 26/07',
    client: 'SIGHT', type: 'Vídeo', version: 'v1', priority: 'Media',
    deadline: '23 jul 2026', status: 'Briefing', checklist: { done: 0, total: 1 },
    isOverdue: true, icon: '🎬',
  },
  {
    id: 'p3', assignee: 'Carlos', title: 'Flyer Claptone 02/08',
    client: 'SIGHT', type: 'Vídeo', version: 'v1', priority: 'Media',
    deadline: '22 jul 2026', status: 'Aprobado', checklist: { done: 2, total: 3 },
  },
];
