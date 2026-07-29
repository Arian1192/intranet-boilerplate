import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GastosPage } from './GastosPage';

describe('GastosPage', () => {
  it('calca cabecera y bajada del live', () => {
    render(<GastosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Gastos' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Salidas de las cuentas de Holded (banco, PayPal, Stripe). Concilia cada movimiento con un show: gasto de la agencia o liquidación al artista. Últimos 120 días.'
      )
    ).toBeInTheDocument();
  });

  it('muestra los 3 KPIs del live', () => {
    render(<GastosPage />);
    const sinAsignar = screen.getByText('GASTO SIN ASIGNAR').parentElement!;
    expect(within(sinAsignar).getByText('0,00 €')).toBeInTheDocument();
    expect(within(sinAsignar).getByText('0 movimiento(s)')).toBeInTheDocument();

    const total = screen.getByText('MOVIMIENTOS (TOTAL)').parentElement!;
    expect(within(total).getByText('0')).toBeInTheDocument();

    const cuentas = screen.getByText('CUENTAS').parentElement!;
    expect(within(cuentas).getByText('0')).toBeInTheDocument();
  });

  it('se queda en el estado de carga de Holded, como el live', () => {
    render(<GastosPage />);
    expect(screen.getByText('Cargando movimientos de Holded…')).toBeInTheDocument();
  });
});
