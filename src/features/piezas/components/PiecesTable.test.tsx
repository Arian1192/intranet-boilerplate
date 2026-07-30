import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PiecesTable } from './PiecesTable';
import type { CreativePiece } from '../data/seed';

const fixtures: CreativePiece[] = [
  {
    id: 'f1', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT',
    type: 'Estático', version: 'v1', priority: 'Media', deadline: '10 jul 2026',
    status: 'En producción', checklist: { done: 0, total: 3 },
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
    // El live escribe las cabeceras en capitalización normal y las sube con `uppercase`.
    expect(headers).toEqual([
      'Creatividad', 'Cliente', 'Tipo', 'Deadline', 'Estado', 'Cliente aprob.',
    ]);
    expect(screen.getAllByRole('columnheader')[0].parentElement).toHaveClass('uppercase');
    expect(screen.queryByRole('columnheader', { name: 'Prioridad' })).not.toBeInTheDocument();
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
  it('renders the deadline as a badge at 12px, rose only when overdue', () => {
    render(<PiecesTable pieces={fixtures} />);
    // Mismo badge que la tarjeta pero a text-xs en vez de text-[11px].
    expect(screen.getByText('10 jul 2026')).toHaveClass('bg-rose-100', 'text-rose-700', 'text-xs');
    expect(screen.getByText('22 jul 2026')).toHaveClass('bg-slate-100', 'text-slate-500');
  });

  // R3: la columna «Cliente aprob.» tiene dos formas, badge ámbar a 12px o una raya slate-300.
  it('renders the client approval as an amber badge, or a dash when absent', () => {
    render(
      <PiecesTable
        pieces={[{ ...fixtures[0], clientApproval: 'Pendiente cliente' }, fixtures[1]]}
      />
    );
    const conAprob = screen.getByText('Pendiente cliente');
    expect(conAprob).toHaveClass('bg-amber-100', 'text-amber-700');
    expect(conAprob).not.toHaveClass('text-[10px]');
    expect(screen.getByText('—')).toHaveClass('text-slate-300');
  });

  // «Sin enviar» es el default del live y pinta la raya, igual que la ausencia del campo.
  it('pinta la raya también cuando la aprobación es «Sin enviar»', () => {
    render(<PiecesTable pieces={[{ ...fixtures[0], clientApproval: 'Sin enviar' }]} />);
    expect(screen.queryByText('Sin enviar')).not.toBeInTheDocument();
    expect(screen.getByText('—')).toHaveClass('text-slate-300');
  });
});
