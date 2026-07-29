import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { EventosPage } from './EventosPage';

afterEach(cleanup);

function renderPage() {
  render(
    <MemoryRouter>
      <EventosPage />
    </MemoryRouter>
  );
}

describe('Eventos (calco del live 2026-07-29)', () => {
  test('cabecera y filtros de cuenta', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Eventos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SIGHT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nuevo evento' })).toBeInTheDocument();
  });

  test('la vista es el calendario del mes en curso, sin selector de vistas', () => {
    renderPage();
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lista' })).not.toBeInTheDocument();
  });

  test('cada evento muestra cuenta, ciudad y tipo', () => {
    renderPage();
    const calendar = screen.getByRole('region', { name: 'Calendario de eventos' });
    const mixmag = within(calendar).getByText('Mixmag Intimate Sessions: BLOND:ISH').closest('div') as HTMLElement;
    expect(within(mixmag).getByText('Ibiza')).toBeInTheDocument();
    expect(within(mixmag).getByText('Producción')).toBeInTheDocument();
    const levi = within(calendar).getByText('Levi').closest('div') as HTMLElement;
    expect(within(levi).getByText('SIGHT · Barcelona')).toBeInTheDocument();
    expect(within(levi).getByText('Marketing')).toBeInTheDocument();
  });

  test('filtrar por SIGHT esconde los eventos sin cuenta', () => {
    renderPage();
    expect(screen.getByText('Mixmag Intimate Sessions: BLOND:ISH')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'SIGHT' }));
    expect(screen.queryByText('Mixmag Intimate Sessions: BLOND:ISH')).not.toBeInTheDocument();
    expect(screen.getByText('Levi')).toBeInTheDocument();
  });

  test('+ Nuevo evento abre el formulario de alta', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: '+ Nuevo evento' }));
    expect(screen.getByText('La produce Black Moose')).toBeInTheDocument();
  });
});
