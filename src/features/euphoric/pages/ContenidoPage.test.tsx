import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { ContenidoPage } from './ContenidoPage';

afterEach(cleanup);

function renderPage() {
  render(
    <MemoryRouter>
      <ContenidoPage />
    </MemoryRouter>
  );
}

describe('Publicaciones (calco del live 2026-07-29)', () => {
  test('cabecera y filtros de cuenta del live', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Publicaciones' })).toBeInTheDocument();
    expect(
      screen.getByText('Community management: planifica y controla el estado de las publicaciones.')
    ).toBeInTheDocument();
    ['Todas', 'Opium Bcn', 'SIGHT'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  test('la vista por defecto es el calendario del mes en curso', () => {
    renderPage();
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hoy' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '+ Publicación' })).not.toBeInTheDocument();
  });

  test('la vista Lista trae las 9 publicaciones del live con sus columnas', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Lista' }));
    const headers = screen.getAllByRole('columnheader').map((cell) => cell.textContent);
    expect(headers).toEqual([
      'FECHA',
      'PUBLICACIÓN',
      'CANAL',
      'CUENTA',
      'EVENTO',
      'TEXTO',
      'CREATIVIDAD',
      'ESTADO',
    ]);
    expect(screen.getAllByRole('row')).toHaveLength(10); // cabecera + 9 publicaciones
    expect(screen.getByRole('button', { name: '+ Publicación' })).toBeInTheDocument();
  });

  test('la vista Kanban espeja los recuentos por columna', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    const counts = [
      ['Falta copy', '6'],
      ['Falta arte', '1'],
      ['Falta aprobación', '1'],
      ['Listo para programar', '0'],
      ['Programado', '0'],
      ['Publicado', '1'],
    ] as const;
    counts.forEach(([label, count]) => {
      const column = screen.getByText(label).closest('div')?.parentElement as HTMLElement;
      expect(within(column).getByText(count)).toBeInTheDocument();
    });
    expect(screen.getByText('Todo aprobado')).toBeInTheDocument();
  });

  test('filtrar por Opium Bcn deja la lista vacía (todo el contenido es de SIGHT)', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Lista' }));
    fireEvent.click(screen.getByRole('button', { name: 'Opium Bcn' }));
    expect(screen.getByText('Sin publicaciones.')).toBeInTheDocument();
  });
});
