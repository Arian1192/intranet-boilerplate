import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { AgendaPage } from './AgendaPage';

afterEach(cleanup);

function renderPage() {
  render(
    <MemoryRouter>
      <AgendaPage />
    </MemoryRouter>
  );
}

describe('Agenda de Euphoric (calco del live 2026-07-29)', () => {
  test('cabecera y alta de entrada', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Agenda · Euphoric' })).toBeInTheDocument();
    expect(
      screen.getByText('Todo en un solo calendario: reuniones, publicaciones, deadlines y eventos.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Entrada' })).toBeInTheDocument();
  });

  test('las 4 capas y los filtros de cuenta del live', () => {
    renderPage();
    const layers = screen.getByRole('group', { name: 'Capas de la agenda' });
    expect(within(layers).getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Agenda',
      'Publicaciones',
      'Creatividades',
      'Eventos',
    ]);
    const filters = screen.getByRole('group', { name: 'Filtro de cuenta' });
    expect(within(filters).getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Todas',
      'Opium Bcn',
      'SIGHT',
    ]);
  });

  test('el calendario mezcla las 4 capas del mes en curso', () => {
    renderPage();
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    const calendar = screen.getByRole('region', { name: 'Agenda unificada' });
    expect(within(calendar).getByText('Board Meeting')).toBeInTheDocument();
    expect(within(calendar).getByText('11:00')).toBeInTheDocument();
    expect(within(calendar).getByText('Set Times')).toBeInTheDocument(); // publicación
    expect(within(calendar).getByText('Pack Sold Out · Pack Sold Out')).toBeInTheDocument(); // creatividad
    expect(within(calendar).getByText('Please Quiet x SIGHT')).toBeInTheDocument(); // evento
  });

  test('apagar una capa esconde sus elementos', () => {
    renderPage();
    const layers = screen.getByRole('group', { name: 'Capas de la agenda' });
    fireEvent.click(within(layers).getByRole('button', { name: 'Eventos' }));
    const calendar = screen.getByRole('region', { name: 'Agenda unificada' });
    expect(within(calendar).queryByText('Please Quiet x SIGHT')).not.toBeInTheDocument();
    expect(within(calendar).getByText('Board Meeting')).toBeInTheDocument();
  });

  test('la leyenda del pie repite tipos de entrada y capas', () => {
    renderPage();
    const legend = screen.getByRole('region', { name: 'Leyenda de la agenda' });
    ['Reunión', 'Lanzamiento', 'Grabación', 'Entrega', 'Renovación', 'Otro'].forEach((kind) => {
      expect(within(legend).getByText(kind)).toBeInTheDocument();
    });
    expect(within(legend).getByText('Capas:')).toBeInTheDocument();
  });
});
