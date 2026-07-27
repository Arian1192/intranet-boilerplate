import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, it, expect } from 'vitest';
import { KpiCard } from './KpiCard';

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}{location.search}</span>;
}

const mockKpi = {
  id: '1',
  label: 'Confirmado',
  amount: 7000,
  count: 4,
  status: 'confirmed' as const,
};

describe('KpiCard', () => {
  it('renders amount, label and count', () => {
    render(
      <MemoryRouter>
        <KpiCard kpi={mockKpi} />
      </MemoryRouter>
    );
    expect(screen.getByText(/7000,00/)).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
    expect(screen.getByText('4 shows')).toBeInTheDocument();
  });

  it('matches the original compact KPI button and exposes the show status filter action', () => {
    render(
      <MemoryRouter initialEntries={['/conceptone']}>
        <KpiCard kpi={{ ...mockKpi, label: 'Contrato', status: 'contract', count: 0, amount: 0 }} />
        <LocationProbe />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /0,00.*Contrato.*0 shows/s });
    expect(button).toHaveAttribute('title', 'Ver shows en Contrato');
    expect(button).toHaveClass(
      'rounded-xl',
      'px-3',
      'py-2.5',
      'text-left',
      'text-white',
      'transition-transform',
      'hover:-translate-y-0.5',
      'bg-blue-500'
    );
    expect(screen.getByText(/0,00/)).toHaveClass('text-lg', 'font-bold', 'leading-tight');
    expect(screen.getByText('Contrato')).toHaveClass('text-[11px]', 'font-medium', 'uppercase', 'tracking-wide', 'opacity-90');
    expect(screen.getByText('0 shows')).toHaveClass('text-[11px]', 'opacity-80');

    fireEvent.click(button);
    expect(screen.getByTestId('location')).toHaveTextContent('/shows?status=contract');
  });

  it('relabela pending-payment como "Pendiente cobro" y done como "Liquidado"', () => {
    render(
      <MemoryRouter>
        <KpiCard kpi={{ id: 'x', label: '', amount: 0, count: 0, status: 'pending-payment' }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Pendiente cobro')).toBeInTheDocument();
  });

  it('done se muestra como "Liquidado"', () => {
    render(
      <MemoryRouter>
        <KpiCard kpi={{ id: 'y', label: '', amount: 0, count: 0, status: 'done' }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Liquidado')).toBeInTheDocument();
  });
});
