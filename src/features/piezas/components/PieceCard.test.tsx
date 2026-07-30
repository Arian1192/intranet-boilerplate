import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PieceCard } from './PieceCard';
import type { CreativePiece } from '../data/seed';

const overdue: CreativePiece = {
  id: 'f1', assignee: 'Alba', title: 'Video Pomo 26/07', client: 'SIGHT', type: 'Vídeo',
  version: 'v1', priority: 'Alta', deadline: '23 jul 2026', status: 'Briefing',
  checklist: { done: 0, total: 1 }, icon: '🎬', iconTitle: 'Vídeo',
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
    // Tonos del live (30-jul): vencido en rose-100/700; aprobada, aunque venza, en slate-100/500.
    expect(screen.getByText('23 jul 2026')).toHaveClass('bg-rose-100', 'text-rose-700');
    unmount();

    render(<PieceCard piece={approved} />);
    expect(screen.getByText('22 jul 2026')).toHaveClass('bg-slate-100', 'text-slate-500');
  });

  // El live marca la tarjeta como arrastrable; es el destino del kanban.
  it('is draggable', () => {
    render(<PieceCard piece={overdue} />);
    expect(screen.getByRole('button', { name: /Video Pomo/ })).toHaveAttribute('draggable', 'true');
  });

  // Los otros dos tonos, que solo se ven con fechas futuras.
  it('paints the two forward-looking deadline tones', () => {
    const { unmount } = render(
      <PieceCard piece={{ ...overdue, deadline: '04 ago 2026' }} />
    );
    expect(screen.getByText('04 ago 2026')).toHaveClass('bg-amber-100', 'text-amber-800');
    unmount();

    render(<PieceCard piece={{ ...overdue, deadline: '11 ago 2026' }} />);
    expect(screen.getByText('11 ago 2026')).toHaveClass('bg-emerald-100', 'text-emerald-700');
  });

  // R3, resuelto contra el live del 30-jul: la aprobación SÍ se pinta en la tarjeta, después del
  // badge de deadline. El caso negativo no pinta raya, simplemente no hay badge.
  it('renders the client approval badge after the deadline, and nothing when absent', () => {
    const { unmount } = render(
      <PieceCard piece={{ ...overdue, clientApproval: 'Pendiente cliente' }} />
    );
    expect(screen.getByText('Pendiente cliente')).toHaveClass(
      'bg-amber-100', 'text-amber-700', 'text-[10px]'
    );
    unmount();

    render(<PieceCard piece={overdue} />);
    expect(screen.queryByText('Pendiente cliente')).not.toBeInTheDocument();
  });

  // Sin responsable el live no pinta píldora: span pelado en slate-300.
  it('renders «Sin asignar» as a bare span, with no pill', () => {
    render(<PieceCard piece={{ ...overdue, assignee: 'Sin asignar' }} />);
    const sinAsignar = screen.getByText('Sin asignar');
    expect(sinAsignar).toHaveClass('shrink-0', 'text-[11px]', 'text-slate-300');
    expect(sinAsignar).not.toHaveClass('rounded-full', 'bg-slate-100');
  });

  // Sin deadline (la etiqueta del live es «—») no hay badge, no un badge con una raya dentro.
  it('renders no deadline badge when there is no deadline', () => {
    render(<PieceCard piece={{ ...overdue, deadline: '—' }} />);
    expect(screen.queryByText('—')).not.toBeInTheDocument();
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
