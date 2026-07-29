import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PieceCard } from './PieceCard';
import type { CreativePiece } from '../data/seed';

const overdue: CreativePiece = {
  id: 'f1', assignee: 'Alba', title: 'Video Pomo 26/07', client: 'SIGHT', type: 'Vídeo',
  version: 'v1', priority: 'Alta', deadline: '23 jul 2026', status: 'Briefing',
  checklist: { done: 0, total: 1 }, isOverdue: true, icon: '🎬',
};
const approved: CreativePiece = {
  id: 'f2', assignee: 'Carlos', title: 'Flyer Claptone 02/08', client: 'SIGHT',
  type: 'Vídeo', version: 'v1', priority: 'Media', deadline: '22 jul 2026',
  status: 'Aprobado', checklist: { done: 2, total: 3 },
};

describe('PieceCard', () => {
  it('shows assignee, title, meta line, deadline and checklist', () => {
    render(<PieceCard piece={overdue} />);
    expect(screen.getByText('Alba')).toBeInTheDocument();
    expect(screen.getByText('Video Pomo 26/07')).toBeInTheDocument();
    expect(screen.getByText('SIGHT · Vídeo · v1')).toBeInTheDocument();
    expect(screen.getByText('23 jul 2026')).toBeInTheDocument();
    expect(screen.getByText(/0\/1/)).toBeInTheDocument(); // rendered as "☑ 0/1"
  });

  // Tarea 1 / P1: en el live ninguna tarjeta pinta el badge de prioridad.
  it('never renders the priority badge', () => {
    render(<PieceCard piece={overdue} />);
    expect(screen.queryByText('Alta')).not.toBeInTheDocument();
    expect(screen.queryByText('Media')).not.toBeInTheDocument();
    expect(screen.queryByText('Baja')).not.toBeInTheDocument();
  });

  // Tarea 1 / P1: el borde es siempre slate-200; el live no marca la tarjeta atrasada en rojo.
  // Tarea 1 / P2: el rojo vive solo en el badge de deadline, y no en la creatividad aprobada.
  it('keeps the live card chrome and colours the deadline badge only when overdue', () => {
    const { unmount } = render(<PieceCard piece={overdue} />);
    const button = screen.getByRole('button', { name: /Video Pomo/ });
    expect(button).toHaveClass(
      'block', 'w-full', 'rounded-lg', 'border', 'border-slate-200', 'bg-white', 'p-2.5',
      'text-left', 'hover:border-brand-300', 'hover:shadow-sm'
    );
    expect(button).not.toHaveClass('border-red-300');
    expect(screen.getByText('23 jul 2026')).toHaveClass('bg-rose-50', 'text-rose-600');
    unmount();

    render(<PieceCard piece={approved} />);
    expect(screen.getByText('22 jul 2026')).toHaveClass('bg-slate-100', 'text-slate-600');
  });

  // Tarea 1: el 📅 de ours no existe en el live.
  it('does not render the calendar emoji', () => {
    render(<PieceCard piece={overdue} />);
    expect(screen.queryByText(/📅/)).not.toBeInTheDocument();
  });

  // Tarea 1: el 🎬 no depende del tipo (Flyer Claptone es Vídeo y no lo lleva); se pinta solo
  // cuando la creatividad trae un `icon`, y va al extremo derecho de la fila del responsable.
  it('renders the per-piece icon only when present', () => {
    const { unmount } = render(<PieceCard piece={overdue} />);
    expect(screen.getByText('🎬')).toBeInTheDocument();
    unmount();

    render(<PieceCard piece={approved} />);
    expect(screen.queryByText('🎬')).not.toBeInTheDocument();
  });
});
