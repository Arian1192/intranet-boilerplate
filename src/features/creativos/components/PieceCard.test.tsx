import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PieceCard } from './PieceCard';
import type { CreativePiece } from '../data/seed';

const overdue: CreativePiece = {
  id: 'p3', assignee: 'Carlos', title: 'Test', client: 'SIGHT', type: 'Estático',
  version: 'v1', priority: 'Alta', deadline: '09 jul 2026', status: 'Revisión', isOverdue: true,
};
const normal: CreativePiece = {
  id: 'p1', assignee: 'Carlos', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT',
  type: 'Vídeo', version: 'v1', priority: 'Media', deadline: '10 jul 2026',
  status: 'Briefing', checklist: { done: 2, total: 3 },
};

describe('PieceCard', () => {
  it('shows assignee, title, meta line, and the priority badge', () => {
    render(<PieceCard piece={normal} />);
    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('Pack Sold Out · Pack Sold Out')).toBeInTheDocument();
    expect(screen.getByText('SIGHT · Vídeo · v1')).toBeInTheDocument();
    expect(screen.getByText('Media')).toHaveClass('bg-amber-100', 'text-amber-700');
    expect(screen.getByText(/2\/3/)).toBeInTheDocument(); // rendered as "☑ 2/3"
  });

  it('highlights overdue pieces and shows the priority "Alta" in rose', () => {
    render(<PieceCard piece={overdue} />);
    const button = screen.getByRole('button', { name: /Test/ });
    expect(button).toHaveClass('border-red-300', 'ring-1', 'ring-red-100');
    expect(screen.getByText('Alta')).toHaveClass('bg-rose-100', 'text-rose-700');
  });
});
