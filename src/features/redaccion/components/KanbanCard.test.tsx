import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanCard } from './KanbanCard';
import { piecesFor } from '../data/contenidos';

const p = piecesFor('mixmag');

describe('KanbanCard', () => {
  it('muestra título, chip de equipo, chip de tipo y fecha', () => {
    render(<KanbanCard piece={p.find((x) => x.id === 'c1')!} />); // Redes / Stories
    expect(screen.getByText('Campaña Test 1 · Story')).toBeInTheDocument();
    expect(screen.getByText('Redes')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('29 jul 2026')).toBeInTheDocument();
  });

  it('muestra avatar solo cuando hay owner', () => {
    render(<KanbanCard piece={p.find((x) => x.id === 'c5')!} />); // con owner
    expect(screen.getByTestId('card-avatar')).toBeInTheDocument();
  });

  it('no muestra avatar sin owner', () => {
    render(<KanbanCard piece={p.find((x) => x.id === 'c1')!} />);
    expect(screen.queryByTestId('card-avatar')).toBeNull();
  });
});
