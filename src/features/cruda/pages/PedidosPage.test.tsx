import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { PedidosPage } from './PedidosPage';

test('renders order list, summary and phase cards', () => {
  render(<MemoryRouter><PedidosPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Pedidos', level: 1 })).toBeInTheDocument();
  expect(screen.getByText('CR00103 · New Era')).toBeInTheDocument();
  expect(screen.getByText('En curso (activos)')).toBeInTheDocument();
  // activeAmount and coleccionAmount share the same seeded value (15614.85),
  // so both the "En curso" and "Por línea de negocio" cards render it.
  expect(screen.getAllByText('15.614,85 €').length).toBeGreaterThanOrEqual(2);
  expect(screen.getByRole('button', { name: '+ Nuevo pedido' })).toBeInTheDocument();
});
