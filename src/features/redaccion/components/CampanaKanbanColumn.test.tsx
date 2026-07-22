import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampanaKanbanColumn } from './CampanaKanbanColumn';
import { campaignsFor, stagesFor } from '../data/campanas';

const stages = stagesFor('mixmag');
const aceptada = stages.find((s) => s.label === 'ACEPTADA')!;
const tentativa = stages.find((s) => s.label === 'TENTATIVA')!;
const items = campaignsFor('mixmag').filter((c) => c.stageId === aceptada.id);

describe('CampanaKanbanColumn', () => {
  it('columna con campañas: label, contador y tarjeta (no colapsada)', () => {
    render(<CampanaKanbanColumn stage={aceptada} items={items} />);
    expect(screen.getByText('ACEPTADA')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByTestId('campana-column')).toHaveAttribute('data-collapsed', 'false');
  });

  it('columna vacía se colapsa', () => {
    render(<CampanaKanbanColumn stage={tentativa} items={[]} />);
    expect(screen.getByTestId('campana-column')).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByText('TENTATIVA')).toBeInTheDocument();
  });
});
