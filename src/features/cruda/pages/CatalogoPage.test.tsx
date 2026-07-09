import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { CatalogoPage } from './CatalogoPage';

test('renders all catalog sections', () => {
  render(<CatalogoPage />);
  expect(screen.getByRole('heading', { name: 'Catálogo', level: 1 })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Colecciones' })).toBeInTheDocument();
  expect(screen.getAllByText('(Test) Camiseta A&F').length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: 'Productos más vendidos' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Alertas de stock' })).toBeInTheDocument();
  expect(screen.getByText('Bolsa Cierre Zip')).toBeInTheDocument();
  expect(screen.getByText('Acabados')).toBeInTheDocument();
  expect(screen.getByText('Tallas')).toBeInTheDocument();
  expect(screen.getByText('Colores')).toBeInTheDocument();
});

test('opening a product row shows the product modal', () => {
  render(<CatalogoPage />);
  // Product name renders in ProductsTable, TopProductsTable, and StockAlerts
  // (this seed product is also low-stock) — first match is the clickable
  // ProductsTable row.
  fireEvent.click(screen.getAllByText('(Test) Camiseta A&F')[0]);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  // The modal must be prefilled with the selected product's data, not blank.
  expect(screen.getByDisplayValue('(Test) Camiseta A&F')).toBeInTheDocument();
  expect(screen.getByText('Stock total: 340 uds')).toBeInTheDocument();
});
