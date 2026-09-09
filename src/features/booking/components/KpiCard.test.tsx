import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, it, expect } from 'vitest';
import { KpiCard } from './KpiCard';

function LocationProbe() {
  const location = useLocation();
  return (
    <span data-testid="location">
      {location.pathname}
      {location.search}
    </span>
  );
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
    // Recalco del 2026-09-09: el recuento va pegado al importe como «· 4», no
    // en su propia línea diciendo «4 shows».
    expect(screen.getByText('· 4')).toBeInTheDocument();
    expect(screen.queryByText('4 shows')).not.toBeInTheDocument();
  });

  it('matches the original compact KPI button and exposes the show status filter action', () => {
    render(
      <MemoryRouter initialEntries={['/conceptone']}>
        <KpiCard kpi={{ ...mockKpi, label: 'Contrato', status: 'contract', count: 0, amount: 0 }} />
        <LocationProbe />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /Contrato.*0,00.*· 0/s });
    expect(button).toHaveAttribute('title', 'Ver shows en Contrato');
    expect(button).toHaveClass(
      'rounded-xl',
      'px-3',
      'py-2.5',
      'text-left',
      'text-white',
      'transition-transform',
      'hover:-translate-y-0.5',
      // El tile de Contrato es ámbar en el live (245,158,11), no azul.
      'bg-amber-500',
      // Y el live los apila al revés en pantalla ancha: rótulo arriba, importe
      // debajo. De ahí el `flex` con `lg:flex-col-reverse`.
      'flex',
      'lg:flex-col-reverse'
    );
    expect(screen.getByText(/0,00/)).toHaveClass('text-lg', 'font-bold', 'leading-tight');
    expect(screen.getByText('Contrato')).toHaveClass(
      'text-[11px]',
      'font-medium',
      'uppercase',
      'tracking-wide',
      'opacity-90'
    );
    expect(screen.getByText('· 0')).toHaveClass('ml-1', 'text-[11px]', 'opacity-80');

    fireEvent.click(button);
    expect(screen.getByTestId('location')).toHaveTextContent('/shows?status=contract');
  });

  it('relabela pending-payment como "Pendiente cobro"', () => {
    render(
      <MemoryRouter>
        <KpiCard kpi={{ id: 'x', label: '', amount: 0, count: 0, status: 'pending-payment' }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Pendiente cobro')).toBeInTheDocument();
  });

  // Recalco del 2026-09-09: el live rotula esta etapa «Cerrado», no «Liquidado».
  // Medido tres veces —el `<select>` Etapa, el `title` del propio tile y la
  // ausencia total de «Cerrado» en /liquidaciones—, y de paso deja «Liquidado»
  // sólo en el eje de pago, que es donde el live lo tiene.
  it('done se muestra como "Cerrado"', () => {
    render(
      <MemoryRouter>
        <KpiCard kpi={{ id: 'y', label: '', amount: 0, count: 0, status: 'done' }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Cerrado')).toBeInTheDocument();
  });
});
