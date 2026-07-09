import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { AnaliticaPage } from './AnaliticaPage';

test('renders stat cards, chart and reused panels', () => {
  render(<AnaliticaPage />);
  expect(screen.getByRole('heading', { name: 'Analítica CRUDA', level: 1 })).toBeInTheDocument();
  expect(screen.getByText('En curso (activos)')).toBeInTheDocument();
  expect(screen.getByText('Facturado (histórico)')).toBeInTheDocument();
  expect(screen.getByText('Ventas facturadas por mes · 2026')).toBeInTheDocument();
  expect(screen.getByText('Jul')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Productos más vendidos' })).toBeInTheDocument();
});

test('changing the year with no data zeroes the chart heading', () => {
  render(<AnaliticaPage />);
  fireEvent.change(screen.getByLabelText('Año'), { target: { value: '2025' } });
  expect(screen.getByText('Ventas facturadas por mes · 2025')).toBeInTheDocument();
});
