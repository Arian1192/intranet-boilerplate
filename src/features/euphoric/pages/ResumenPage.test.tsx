import '@testing-library/jest-dom';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { ResumenPage } from './ResumenPage';

afterEach(cleanup);

function renderPage() {
  render(
    <MemoryRouter>
      <ResumenPage />
    </MemoryRouter>
  );
}

describe('Resumen de Euphoric (raíz /euphoric, calco del live 2026-07-29)', () => {
  test('cabecera con el nombre del espacio y su bajada', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Euphoric Media' })).toBeInTheDocument();
    expect(
      screen.getByText('Marketing del grupo: cuentas, campañas y calendario de contenido.')
    ).toBeInTheDocument();
  });

  test('cuentas activas: 2 de 3, enlazando al listado', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /Cuentas activas/i });
    expect(link).toHaveAttribute('href', '/euphoric/cuentas');
    expect(within(link).getByText('2')).toBeInTheDocument();
    expect(within(link).getByText('de 3')).toBeInTheDocument();
  });

  test('campañas en curso: 0 y bloque vacío', () => {
    renderPage();
    const [statLabel] = screen.getAllByText('CAMPAÑAS EN CURSO');
    expect(within(statLabel.parentElement as HTMLElement).getByText('0')).toBeInTheDocument();
    expect(screen.getByText('No hay campañas en curso.')).toBeInTheDocument();
  });

  test('publicaciones de los próximos 7 días: 1', () => {
    renderPage();
    const label = screen.getByText('PUBLICACIONES (7 DÍAS)');
    expect(within(label.parentElement as HTMLElement).getByText('1')).toBeInTheDocument();
  });

  test('próximas publicaciones lista la del live con canal y estado', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /Set Times SIGHT: Claptone/ });
    expect(link).toHaveAttribute('href', '/euphoric/calendario');
    expect(within(link).getByText('01 ago 2026 · Instagram · SIGHT')).toBeInTheDocument();
    expect(within(link).getByText('Idea')).toBeInTheDocument();
  });

  test('ya no queda la nota de fases pendientes', () => {
    renderPage();
    expect(
      screen.queryByText('Campañas y calendario de contenido se gestionan en las siguientes fases del espacio.')
    ).not.toBeInTheDocument();
  });
});
