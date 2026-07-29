import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { PedidosPage } from './PedidosPage';

test('renders order list, summary and phase cards', () => {
  render(<MemoryRouter><PedidosPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Pedidos', level: 1 })).toBeInTheDocument();
  expect(screen.getByText('CR00104 · TAGMAG')).toBeInTheDocument();
  expect(screen.getByText('CR00103 · New Era')).toBeInTheDocument();
  expect(screen.getByText('20 jul 2026 · Colección')).toBeInTheDocument();
  expect(screen.getByText('1650,00 €')).toBeInTheDocument();
  expect(screen.getByText('5 pedidos')).toBeInTheDocument();
  expect(screen.getByText('En curso (activos)')).toBeInTheDocument();
  // activeAmount and coleccionAmount share the same seeded value (17264.85),
  // so both the "En curso" and "Por línea de negocio" cards render it.
  expect(screen.getAllByText('17.264,85 €').length).toBeGreaterThanOrEqual(2);
  expect(screen.getByRole('button', { name: '+ Nuevo pedido' })).toBeInTheDocument();
});

test('selecting an order shows its detail; back returns to the list', () => {
  render(<MemoryRouter><PedidosPage /></MemoryRouter>);
  fireEvent.click(screen.getByText('CR00104 · TAGMAG'));
  expect(screen.getByRole('heading', { name: /CR00104/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '← Todos los pedidos' }));
  fireEvent.click(screen.getByText('CR00103 · New Era'));
  expect(screen.getByRole('heading', { name: /CR00103/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '← Todos los pedidos' }));
  expect(screen.getByText('En curso (activos)')).toBeInTheDocument();
});

test('la columna derecha no estira la página: la fila de fases scrollea dentro', () => {
  const { container } = render(<MemoryRouter><PedidosPage /></MemoryRouter>);
  const grid = container.querySelector('div.grid') as HTMLElement;
  expect(grid.className).toContain('lg:grid-cols-[360px_1fr]');
  // sin min-w-0 la pista 1fr crece con su contenido y el documento desborda a 1620px
  const rightColumn = grid.children[1] as HTMLElement;
  expect(rightColumn.className).toContain('min-w-0');
});

test('new order button shows the creation form', () => {
  render(<MemoryRouter><PedidosPage /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: '+ Nuevo pedido' }));
  expect(screen.getByRole('heading', { name: 'Nuevo pedido' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Crear pedido' })).toBeInTheDocument();
});
