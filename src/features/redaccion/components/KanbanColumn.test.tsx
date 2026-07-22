import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanColumn } from './KanbanColumn';
import { piecesFor, statusesFor, filterPieces } from '../data/contenidos';

const idea = statusesFor('mixmag').find((s) => s.label === 'IDEA')!;
const aprobado = statusesFor('mixmag').find((s) => s.label === 'APROBADO')!;

describe('KanbanColumn', () => {
  it('columna con piezas muestra label, contador y tarjetas', () => {
    const cards = filterPieces(piecesFor('mixmag'), { statusId: idea.id });
    render(<KanbanColumn status={idea} pieces={cards} />);
    expect(screen.getByText('IDEA')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByTestId('kanban-column')).not.toHaveAttribute('data-collapsed', 'true');
    expect(screen.getAllByText(/Artículo patrocinado|Story/).length).toBeGreaterThan(0);
  });

  it('columna vacía se colapsa (data-collapsed)', () => {
    render(<KanbanColumn status={aprobado} pieces={[]} />);
    expect(screen.getByTestId('kanban-column')).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByText('APROBADO')).toBeInTheDocument();
  });
});
