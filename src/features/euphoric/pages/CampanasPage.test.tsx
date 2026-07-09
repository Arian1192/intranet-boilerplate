import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { CampanasPage } from './CampanasPage';

test('shows board columns and the campaign row', () => {
  render(
    <MemoryRouter>
      <CampanasPage />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: 'Campañas' })).toBeInTheDocument();
  expect(screen.getByText('Planificada')).toBeInTheDocument();
  expect(screen.getAllByText('Genérico Julio').length).toBeGreaterThan(0);
  expect(screen.getByText('Paid media')).toBeInTheDocument();
});

test('switches to Cronograma view and shows the Gantt helper text', () => {
  render(
    <MemoryRouter>
      <CampanasPage />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Cronograma' }));
  expect(
    screen.getByText('Las barras van de la fecha de inicio a la de fin de cada campaña. Clic para abrir.')
  ).toBeInTheDocument();
});

test('switches to Gestión view and shows the empty state', () => {
  render(
    <MemoryRouter>
      <CampanasPage />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Gestión' }));
  expect(screen.getByText('Selecciona una campaña o crea una nueva.')).toBeInTheDocument();
});
