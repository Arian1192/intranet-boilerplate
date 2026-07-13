import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PipelinePage } from './PipelinePage';

describe('PipelinePage', () => {
  it('renders header, stat cards and the default ConceptOne board', () => {
    render(<PipelinePage />);
    expect(screen.getByRole('heading', { name: 'Pipeline de ventas' })).toBeInTheDocument();
    expect(screen.getByText('PIPELINE ABIERTO')).toBeInTheDocument();
    expect(screen.getByText('Interés')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Oportunidad/ })).toBeInTheDocument();
  });

  it('switching company to CRUDA shows its empty-state', () => {
    render(<PipelinePage />);
    fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: 'CRUDA' } });
    expect(screen.getByText('CRUDA no tiene etapas configuradas todavía.')).toBeInTheDocument();
  });

  it('switching to Etra shows its stages and an opportunity', () => {
    render(<PipelinePage />);
    fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: 'Etra Agency' } });
    expect(screen.getByText('Contactado')).toBeInTheDocument();
    expect(screen.getByText('Foot District')).toBeInTheDocument();
  });

  it('moving a card updates the forecast stat', () => {
    render(<PipelinePage />);
    fireEvent.change(screen.getByLabelText('Empresa'), { target: { value: 'Etra Agency' } });
    // FORECAST card shows 31.200,00 € initially (48000*.25 + 12000*.1 + 30000*.6)
    const forecastLabel = screen.getByText('FORECAST PONDERADO');
    const forecastCard = forecastLabel.parentElement as HTMLElement;
    expect(within(forecastCard).getByText(/31\.200,00/)).toBeInTheDocument();
    // move Foot District (Contactado, .25) to next stage (Cualificado, .4): 48000*.4=19200 → 38.400
    const card = screen.getByText('Foot District').closest('div.rounded-lg') as HTMLElement;
    fireEvent.click(within(card).getByRole('button', { name: 'Mover a etapa siguiente' }));
    expect(within(forecastCard).getByText(/38\.400,00/)).toBeInTheDocument();
  });
});
