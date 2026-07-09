import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { ResumenPage } from './ResumenPage';

test('renders KPIs and reference panels', () => {
  render(<MemoryRouter><ResumenPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Euphoric Media' })).toBeInTheDocument();
  expect(screen.getByText('Cuentas activas')).toBeInTheDocument();
  expect(screen.getByText('Genérico Julio')).toBeInTheDocument();
  expect(screen.getByText('Set Times')).toBeInTheDocument();
});
