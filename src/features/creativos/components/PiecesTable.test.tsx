import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PiecesTable } from './PiecesTable';
import type { CreativePiece } from '../data/seed';

const fixtures: CreativePiece[] = [
  {
    id: 'f1', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT',
    type: 'Estático', version: 'v1', priority: 'Media', deadline: '10 jul 2026',
    status: 'En producción', checklist: { done: 0, total: 3 }, isOverdue: true,
  },
  {
    id: 'f2', assignee: 'Carlos', title: 'Flyer Claptone 02/08', client: 'SIGHT',
    type: 'Vídeo', version: 'v1', priority: 'Media', deadline: '22 jul 2026',
    status: 'Aprobado', checklist: { done: 2, total: 3 },
  },
];

describe('PiecesTable', () => {
  it('renders exactly the 6 column headers of the live, in order and without PRIORIDAD', () => {
    render(<PiecesTable pieces={fixtures} />);
    const headers = screen.getAllByRole('columnheader').map((th) => th.textContent);
    expect(headers).toEqual([
      'CREATIVIDAD', 'CLIENTE', 'TIPO', 'DEADLINE', 'ESTADO', 'CLIENTE APROB.',
    ]);
    expect(screen.queryByRole('columnheader', { name: 'PRIORIDAD' })).not.toBeInTheDocument();
    expect(screen.queryByText('Media')).not.toBeInTheDocument();
  });

  it('renders a row with the estado badge and a dash for empty client approval', () => {
    render(<PiecesTable pieces={fixtures} />);
    const row = screen.getByText('Flyer Claptone 02/08').closest('tr')!;
    expect(within(row).getByText('Aprobado')).toHaveClass('bg-emerald-100', 'text-emerald-700');
    expect(within(row).getByText('—')).toBeInTheDocument();
  });

  // Hallazgo de la Tarea 1: en el live la columna DEADLINE es un badge, rosa solo cuando la
  // creatividad está atrasada (vencida y no aprobada); pizarra en el resto.
  it('renders the deadline as a badge, rose only when overdue', () => {
    render(<PiecesTable pieces={fixtures} />);
    expect(screen.getByText('10 jul 2026')).toHaveClass('bg-rose-50', 'text-rose-600');
    expect(screen.getByText('22 jul 2026')).toHaveClass('bg-slate-100', 'text-slate-600');
  });
});
