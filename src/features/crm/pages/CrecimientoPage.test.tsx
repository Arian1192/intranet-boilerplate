import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CrecimientoPage } from './CrecimientoPage';

describe('CrecimientoPage', () => {
  it('renders both sections and the unassigned note', () => {
    render(<CrecimientoPage />);
    expect(screen.getByRole('heading', { name: 'Crecimiento' })).toBeInTheDocument();
    expect(screen.getByText('VENTA CRUZADA (CROSS-SELL)')).toBeInTheDocument();
    expect(screen.getByText('CLIENTES EN RIESGO (INACTIVOS)')).toBeInTheDocument();
    expect(screen.getByText(/sin ninguna empresa asignada/)).toBeInTheDocument();
  });

  it('has a risk-threshold select with 3/6/12 month options', () => {
    render(<CrecimientoPage />);
    const select = screen.getByLabelText('Umbral de inactividad') as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toEqual([
      'Sin actividad en 3 meses', 'Sin actividad en 6 meses', 'Sin actividad en 12 meses',
    ]);
  });
});
