import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { ResumenPage } from './ResumenPage';

test('renders KPIs and reference panels', () => {
  render(<MemoryRouter><ResumenPage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Euphoric Media' })).toBeInTheDocument();
  expect(screen.getByText('CUENTAS ACTIVAS')).toBeInTheDocument();
  expect(screen.getByText('Genérico Julio')).toBeInTheDocument();
  expect(screen.getByText('Set Times')).toBeInTheDocument();
  expect(screen.getByText('En curso')).toBeInTheDocument();
  expect(screen.getByText('En producción')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Cuentas activas/i })).toHaveAttribute('href', '/euphoric/cuentas');
  expect(screen.getByRole('link', { name: /Genérico Julio/i })).toHaveAttribute('href', '/euphoric/campanas');
  expect(screen.getByRole('link', { name: /Set Times/i })).toHaveAttribute('href', '/euphoric/calendario');
  expect(
    screen.getByText('Campañas y calendario de contenido se gestionan en las siguientes fases del espacio.')
  ).toBeInTheDocument();
});
