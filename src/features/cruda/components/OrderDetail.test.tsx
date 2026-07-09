import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { OrderDetail } from './OrderDetail';
import { orders } from '../data/seed';

const cr = orders.find((o) => o.id === 'CR00103')!;

test('shows header, stepper, lines and totals; editing qty recalculates', () => {
  render(<OrderDetail order={cr} onBack={vi.fn()} />);
  expect(screen.getByRole('heading', { name: /CR00103/ })).toBeInTheDocument();
  expect(screen.getByText('Israel Cuenca', { exact: false })).toBeInTheDocument();
  // three line subtotals
  expect(screen.getByText('1900,00 €')).toBeInTheDocument();
  // total
  expect(screen.getAllByText('6650,00 €').length).toBeGreaterThan(0);

  // edit first qty 100 -> 10, subtotal becomes 10*19 = 190,00 €
  const qtyInputs = screen.getAllByLabelText('Cantidad');
  fireEvent.change(qtyInputs[0], { target: { value: '10' } });
  expect(screen.getByText('190,00 €')).toBeInTheDocument();
});

test('back button fires onBack', () => {
  const onBack = vi.fn();
  render(<OrderDetail order={cr} onBack={onBack} />);
  fireEvent.click(screen.getByRole('button', { name: '← Todos los pedidos' }));
  expect(onBack).toHaveBeenCalled();
});
