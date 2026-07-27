import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { HerramientasResumenPage } from './HerramientasResumenPage';

describe('HerramientasResumenPage', () => {
  it('renders the H1, subtitle and the Proyecciones card link', () => {
    render(<MemoryRouter><HerramientasResumenPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Utilidades del grupo' })).toBeInTheDocument();
    expect(screen.getByText(/Calculadoras y herramientas transversales del equipo/)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Proyecciones · P&L de eventos/ });
    expect(link).toHaveAttribute('href', '/herramientas/proyecciones');
    expect(screen.getByText(/Cuenta de explotación por aforo, ventas y gastos/)).toBeInTheDocument();
  });
});
