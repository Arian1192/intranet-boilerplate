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
}

export const CURRENT_USER = 'Carlos';

export const pieces: CreativePiece[] = [
  {
    id: 'p1', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out',
    client: 'SIGHT', type: 'Vídeo', version: 'v1', priority: 'Media',
    deadline: '10 jul 2026', status: 'Briefing', checklist: { done: 2, total: 3 },
  },
  {
    id: 'p2', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out',
    client: 'SIGHT', type: 'Estático', version: 'v1', priority: 'Media',
    deadline: '10 jul 2026', status: 'En producción', checklist: { done: 0, total: 3 },
  },
  {
    id: 'p3', assignee: 'Carlos', title: 'Test',
    client: 'SIGHT', type: 'Estático', version: 'v1', priority: 'Alta',
    deadline: '09 jul 2026', status: 'Revisión', isOverdue: true,
  },
];
