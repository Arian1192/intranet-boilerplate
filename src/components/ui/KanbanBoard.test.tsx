import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KanbanBoard, KanbanCard } from './KanbanBoard';

describe('KanbanBoard', () => {
  it('renders columns with counts and an empty-state dash when there are no items', () => {
    render(
      <KanbanBoard
        columns={[
          {
            id: 'planned',
            label: 'Planificada',
            accentClassName: 'border-t-blue-400',
            count: 0,
          },
          {
            id: 'in-progress',
            label: 'En curso',
            accentClassName: 'border-t-amber-400',
            count: 1,
            children: <KanbanCard>59FIFTY Madrid</KanbanCard>,
          },
        ]}
      />
    );

    expect(screen.getByText('Planificada')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('59FIFTY Madrid')).toBeInTheDocument();
  });
});
