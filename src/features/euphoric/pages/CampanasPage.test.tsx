import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
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

test('el cronograma pinta las campañas que solapan la ventana, no solo las «en curso»', () => {
  render(
    <MemoryRouter>
      <CampanasPage />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Cronograma' }));
  // Genérico Julio está Finalizada pero va del 10 jul al 31 ago: el live la muestra igual.
  expect(screen.getByText('Genérico Julio')).toBeInTheDocument();
  expect(screen.getByText('Campañas activas · próximas 3 semanas')).toBeInTheDocument();
  expect(screen.getByText('29 jul')).toBeInTheDocument();
  expect(screen.getByText('05 ago')).toBeInTheDocument();
  expect(screen.getByText('12 ago')).toBeInTheDocument();
});

test('el tablero espeja los recuentos por estado del live', () => {
  render(
    <MemoryRouter>
      <CampanasPage />
    </MemoryRouter>
  );
  const board = screen.getByRole('region', { name: 'Tablero de campañas' });
  const finalizada = within(board).getByText('Finalizada').closest('div') as HTMLElement;
  expect(finalizada.textContent).toContain('1');
  expect(screen.getAllByText('—')).toHaveLength(4); // las otras 4 columnas están vacías
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
