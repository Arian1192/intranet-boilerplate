import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
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
});
