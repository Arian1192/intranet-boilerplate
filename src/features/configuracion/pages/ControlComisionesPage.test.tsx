import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ControlComisionesPage } from './ControlComisionesPage';

describe('ControlComisionesPage', () => {
  it('título y 3 stat cards en 0,00 €', () => {
    render(<ControlComisionesPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Control de comisiones' })).toBeInTheDocument();
    expect(screen.getAllByText(/0,00/)).toHaveLength(3);
    expect(screen.getByText('DEVENGADO TOTAL')).toBeInTheDocument();
    expect(screen.getByText('ABONADO')).toBeInTheDocument();
    expect(screen.getByText('PENDIENTE DE ABONAR')).toBeInTheDocument();
  });

  it('estado vacío real: "Aún no hay comisiones devengadas ni abonos."', () => {
    render(<ControlComisionesPage />);
    expect(screen.getByText('Aún no hay comisiones devengadas ni abonos.')).toBeInTheDocument();
  });
});
