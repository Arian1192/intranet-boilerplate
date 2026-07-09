import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { ContenidoPage } from './ContenidoPage';

test('renders month calendar with content controls', () => {
  render(
    <MemoryRouter>
      <ContenidoPage />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: 'Contenido' })).toBeInTheDocument();
  expect(screen.getByText('Julio 2026')).toBeInTheDocument();
  expect(screen.getByText('Todas')).toBeInTheDocument();
});

test('switches to Lista view and shows the publication row', () => {
  render(
    <MemoryRouter>
      <ContenidoPage />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Lista' }));
  expect(screen.getByText('EVENTO')).toBeInTheDocument();
  expect(screen.getByText('En producción')).toBeInTheDocument();
});

test('switches to Kanban view and shows the Falta arte column with the Set Times card', () => {
  render(
    <MemoryRouter>
      <ContenidoPage />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Kanban' }));
  expect(screen.getByText('Falta arte')).toBeInTheDocument();
  expect(screen.getByText('T: Aprobado')).toBeInTheDocument();
});
