import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContratosPage } from './ContratosPage';

describe('ContratosPage', () => {
  it('título "Plantillas de contrato", botón +Nueva plantilla y 2 filas', () => {
    render(<ContratosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Plantillas de contrato' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nueva plantilla' })).toHaveAttribute('type', 'button');
    expect(screen.getByText('Contrato estándar (ES)')).toBeInTheDocument();
    expect(screen.getByText('Booking Agreement (EN)')).toBeInTheDocument();
  });
});
