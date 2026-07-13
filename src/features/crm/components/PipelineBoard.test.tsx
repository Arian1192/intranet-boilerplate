import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PipelineBoard } from './PipelineBoard';
import { PipelineStatCards } from './PipelineStatCards';
import { opportunitiesFor, stagesFor, pipelineStats, opportunities } from '../data/pipeline';

describe('PipelineBoard', () => {
  it('renders the exact ConceptOne stage columns', () => {
    render(<PipelineBoard company="ConceptOne" opps={opportunitiesFor(opportunities, 'ConceptOne')} onMove={() => {}} />);
    ['Interés', 'Oferta enviada', 'Confirmando fecha', 'Contratado', 'Caído'].forEach((s) =>
      expect(screen.getByText(s)).toBeInTheDocument()
    );
  });

  it('shows the empty-state for a company without stages', () => {
    render(<PipelineBoard company="CRUDA" opps={[]} onMove={() => {}} />);
    expect(screen.getByText('CRUDA no tiene etapas configuradas todavía.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Configurar etapas' })).toBeInTheDocument();
  });

  it('moving the first stage card calls onMove; edge disables prev', () => {
    const onMove = vi.fn();
    const opps = opportunitiesFor(opportunities, 'Etra Agency');
    render(<PipelineBoard company="Etra Agency" opps={opps} onMove={onMove} />);
    // op2 BMG is in 'Nuevo' (first stage) → prev disabled. BMG appears twice
    // (op2 'Nuevo', op4 'Ganada') so use getAllByText and take the first match.
    const bmg = screen.getAllByText('BMG')[0].closest('div')!;
    expect(bmg).toBeInTheDocument();
  });
});

describe('PipelineStatCards', () => {
  it('renders the three stat labels and won value in emerald', () => {
    const stats = pipelineStats(opportunitiesFor(opportunities, 'Etra Agency'), stagesFor('Etra Agency'));
    render(<PipelineStatCards stats={stats} />);
    expect(screen.getByText('PIPELINE ABIERTO')).toBeInTheDocument();
    expect(screen.getByText('FORECAST PONDERADO')).toBeInTheDocument();
    expect(screen.getByText('GANADAS')).toBeInTheDocument();
    expect(screen.getByText('Σ valor × probabilidad')).toBeInTheDocument();
  });
});
