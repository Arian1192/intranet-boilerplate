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
  /**
   * Flag propio de la pieza, **ortogonal al estado**: en el live sale en una tarjeta Briefing y en
   * otra Cambios, y no sale en ninguna Aprobado. Se pinta en la tarjeta y en la tabla.
   */
  clientApproval?: string;
  /** Avatar real del live (Supabase Storage). Sin él se cae a la inicial. */
  avatarUrl?: string;
  /** El live pone el nombre largo en el `alt` y el corto en el texto de al lado. */
  assigneeFullName?: string;
  /**
   * Marcador que el live empuja con `ml-auto` al extremo derecho de la fila del responsable.
   *
   * HUECO CONFIRMADO, no un descuido: **no se deriva del tipo**. La captura del 30-jul da el
   * contraejemplo limpio — `Video Pomo 26/07` lo lleva y `Flyer Claptone 02/08` no, teniendo los
   * dos la misma bajada `SIGHT · Vídeo · v1`. Cuál es el campo real que lo dispara no se puede
   * saber desde esta pantalla, así que se modela como dato por pieza y no se inventa la regla.
   */
  icon?: string;
  /** `title` del marcador. En el live, «Vídeo» en la única tarjeta que lo lleva. */
  iconTitle?: string;
}

export const CURRENT_USER = 'Carlos';

/**
 * Las 3 creatividades del live del 27-jul (`live-2026-07-27-21-tablero.json`), en el orden en
 * que el live las lista en la tabla: Pack Sold Out, Video Pomo, Flyer Claptone.
 *
 * Ya no se siembra `isOverdue`: el tono del deadline se deriva de la fecha y el estado con
 * `tonoDeadline()`, contra la fecha fija `HOY_ISO`. Así los tests siguen siendo deterministas
 * y de paso salen los cuatro tonos del live, no solo «vencido / no vencido».
 *
 * `priority` ya no se muestra en ninguna vista del live (ni tarjeta ni tabla); se conserva
 * porque el drawer de alta la sigue pidiendo. Sin evidencia del valor real, va en 'Media'.
 */
export const pieces: CreativePiece[] = [
  {
    id: 'p2', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out',
    client: 'SIGHT', type: 'Estático', version: 'v1', priority: 'Media',
    deadline: '10 jul 2026', status: 'En producción', checklist: { done: 0, total: 3 },
  },
  {
    id: 'p1', assignee: 'Alba', title: 'Video Pomo 26/07',
    client: 'SIGHT', type: 'Vídeo', version: 'v1', priority: 'Media',
    deadline: '23 jul 2026', status: 'Briefing', checklist: { done: 0, total: 1 },
    icon: '🎬', iconTitle: 'Vídeo',
  },
  {
    id: 'p3', assignee: 'Carlos', title: 'Flyer Claptone 02/08',
    client: 'SIGHT', type: 'Vídeo', version: 'v1', priority: 'Media',
    deadline: '22 jul 2026', status: 'Aprobado', checklist: { done: 2, total: 3 },
  },
];
