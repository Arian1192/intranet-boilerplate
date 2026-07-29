import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { OrderDetail } from './OrderDetail';
import { orders } from '../data/seed';

const cr = orders.find((o) => o.id === 'CR00103')!;
const cr104 = orders.find((o) => o.id === 'CR00104')!;

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

test('la cabecera lleva el badge Reposición solo si el pedido lo es', () => {
  const { unmount } = render(<OrderDetail order={cr104} onBack={vi.fn()} />);
  const heading = screen.getByRole('heading', { name: /CR00104/ });
  expect(heading).toHaveTextContent('Colección');
  expect(heading).toHaveTextContent('Reposición');
  unmount();

  render(<OrderDetail order={cr} onBack={vi.fn()} />);
  const plain = screen.getByRole('heading', { name: /CR00103/ });
  expect(plain).toHaveTextContent('Colección');
  expect(plain).not.toHaveTextContent('Reposición');
});

test('la fila meta muestra la nota de origen o el responsable, según el pedido', () => {
  const { unmount } = render(<OrderDetail order={cr104} onBack={vi.fn()} />);
  expect(screen.getByText('TAGMAG')).toBeInTheDocument();
  expect(screen.getByText('Fecha: 20 jul 2026')).toBeInTheDocument();
  expect(screen.getByText('Reposición solicitada desde el portal de cliente.')).toBeInTheDocument();
  expect(screen.queryByText(/Resp\.:/)).not.toBeInTheDocument();
  unmount();

  render(<OrderDetail order={cr} onBack={vi.fn()} />);
  expect(screen.getByText('Resp.: Israel Cuenca')).toBeInTheDocument();
  expect(screen.queryByText(/portal de cliente/)).not.toBeInTheDocument();
});

test('el portal muestra el acceso ya concedido con Quitar acceso; el invitar sigue vacío', () => {
  const { unmount } = render(<OrderDetail order={cr104} onBack={vi.fn()} />);
  // el live pinta el email concedido como texto, no como valor del input de invitar
  expect(screen.getByText('hello@carlospego.com')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Quitar acceso' })).toBeInTheDocument();
  const invite = screen.getByPlaceholderText('email@cliente.com') as HTMLInputElement;
  expect(invite.value).toBe('');
  expect(screen.getByRole('button', { name: 'Invitar' })).toBeInTheDocument();
  unmount();

  render(<OrderDetail order={cr} onBack={vi.fn()} />);
  expect(screen.queryByRole('button', { name: 'Quitar acceso' })).not.toBeInTheDocument();
  expect(screen.getByPlaceholderText('email@cliente.com')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Invitar' })).toBeInTheDocument();
});

test('las acciones van en la misma fila que la barra de estados', () => {
  render(<OrderDetail order={cr104} onBack={vi.fn()} />);
  const statusRow = screen.getByRole('button', { name: 'Borrador' }).parentElement as HTMLElement;
  expect(statusRow).toContainElement(screen.getByRole('button', { name: 'Anular' }));
  expect(statusRow).toContainElement(screen.getByRole('button', { name: 'Descontar del stock' }));
  expect(statusRow).toContainElement(screen.getByRole('button', { name: 'Hoja de pedido (PDF)' }));
});

test('back button fires onBack', () => {
  const onBack = vi.fn();
  render(<OrderDetail order={cr} onBack={onBack} />);
  fireEvent.click(screen.getByRole('button', { name: '← Todos los pedidos' }));
  expect(onBack).toHaveBeenCalled();
});
