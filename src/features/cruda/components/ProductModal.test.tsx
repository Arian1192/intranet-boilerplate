import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { ProductModal } from './ProductModal';

test('prefills an existing product and lists its variants', () => {
  render(<ProductModal open productId="p1" onClose={vi.fn()} />);
  expect(screen.getByDisplayValue('(Test) Camiseta A&F')).toBeInTheDocument();
  expect(screen.getByText('Stock total: 340 uds')).toBeInTheDocument();
  expect(screen.getByDisplayValue('4878test01')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
});

test('renders empty form for a new product', () => {
  render(<ProductModal open productId="new" onClose={vi.fn()} />);
  expect(screen.getByText('Con variantes')).toBeInTheDocument();
  expect(screen.getByText('Producto único')).toBeInTheDocument();
});
