import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PiecesTable } from './PiecesTable';
import { pieces } from '../data/seed';

describe('PiecesTable', () => {
  it('renders the 7 column headers', () => {
    render(<PiecesTable pieces={pieces} />);
    ['PIEZA', 'CLIENTE', 'TIPO', 'PRIORIDAD', 'DEADLINE', 'ESTADO', 'CLIENTE APROB.'].forEach((h) =>
      expect(screen.getByRole('columnheader', { name: h })).toBeInTheDocument(),
    );
  });

  it('renders a row with estado + prioridad badges and a dash for empty client approval', () => {
    render(<PiecesTable pieces={pieces} />);
    const row = screen.getByText('Test').closest('tr')!;
    expect(within(row).getByText('Alta')).toHaveClass('bg-rose-100', 'text-rose-700');
    expect(within(row).getByText('Revisión')).toHaveClass('bg-amber-100', 'text-amber-700');
    expect(within(row).getByText('—')).toBeInTheDocument();
  });
});
