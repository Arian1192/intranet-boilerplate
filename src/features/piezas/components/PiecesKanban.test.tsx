import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PiecesKanban } from './PiecesKanban';
import { pieces } from '../data/seed';

describe('PiecesKanban', () => {
  it('renders the 5 status columns with colored header badges and counts', () => {
    render(<PiecesKanban pieces={pieces} />);
    expect(screen.getByText('Briefing')).toHaveClass('bg-slate-100', 'text-slate-600');
    expect(screen.getByText('En producción')).toHaveClass('bg-sky-100', 'text-sky-700');
    expect(screen.getByText('Cambios')).toHaveClass('bg-rose-100', 'text-rose-700');
    expect(screen.getByText('Aprobado')).toHaveClass('bg-emerald-100', 'text-emerald-700');
  });

  it('shows a dash for empty columns and each creatividad in its column', () => {
    render(<PiecesKanban pieces={pieces} />);
    expect(screen.getByText('Video Pomo 26/07')).toBeInTheDocument(); // Briefing
    expect(screen.getByText('Pack Sold Out · Pack Sold Out')).toBeInTheDocument(); // En producción
    expect(screen.getByText('Flyer Claptone 02/08')).toBeInTheDocument(); // Aprobado
    // Revisión + Cambios are empty → two em-dash placeholders (live: Revisión 0 · Cambios 0)
    expect(screen.getAllByText('—')).toHaveLength(2);
  });
});
