import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { PiezasPage } from './PiezasPage';

afterEach(cleanup);

function renderPage() {
  render(
    <MemoryRouter>
      <PiezasPage />
    </MemoryRouter>
  );
}

describe('Creatividades (calco del live 2026-07-29)', () => {
  test('cabecera, asignación rápida y alta', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Creatividades' })).toBeInTheDocument();
    expect(screen.getByText('Content creation: seguimiento de artes por estado de producción.')).toBeInTheDocument();
    expect(screen.getByText('Asignar a:')).toBeInTheDocument();
    ['+ Alba', '+ Carlos', '+ Maf'].forEach((name) => {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: '+ Nueva creatividad' })).toBeInTheDocument();
  });

  test('los 4 indicadores del live', () => {
    renderPage();
    const stats = screen.getByRole('region', { name: 'Indicadores de creatividades' });
    const stat = (label: string) => within(stats).getByText(label).closest('div') as HTMLElement;
    expect(within(stat('Creatividades activas')).getByText('7')).toBeInTheDocument();
    expect(within(stat('Pend. aprobar')).getByText('0')).toBeInTheDocument();
    expect(within(stat('En correcciones')).getByText('1')).toBeInTheDocument();
    expect(within(stat('Atrasadas')).getByText('4')).toBeInTheDocument();
  });

  test('los filtros y el bloque de recursos del live', () => {
    renderPage();
    ['Todas', 'Mías', 'Diseño', 'Vídeo', 'Pend. aprobar', 'Correcciones', 'Atrasadas'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
    expect(screen.getByText(/Recursos:/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });

  test('el tablero espeja el reparto por estado', () => {
    renderPage();
    const board = screen.getByRole('region', { name: 'Tablero de creatividades' });
    const counts = [
      ['Briefing', '5'],
      ['En producción', '1'],
      ['Revisión', '0'],
      ['Cambios', '1'],
      ['Aprobado', '3'],
    ] as const;
    counts.forEach(([label, count]) => {
      const column = within(board).getByText(label).closest('div')?.parentElement as HTMLElement;
      expect(within(column).getByText(count)).toBeInTheDocument();
    });
  });

  test('la tabla lista las 10 creatividades con las columnas del live', () => {
    renderPage();
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual([
      'CREATIVIDAD',
      'CLIENTE',
      'TIPO',
      'DEADLINE',
      'ESTADO',
      'CLIENTE APROB.',
    ]);
    expect(within(table).getAllByRole('row')).toHaveLength(11); // cabecera + 10 creatividades
    expect(within(table).getAllByText('Pendiente cliente')).toHaveLength(2);
  });

  test('el filtro Vídeo deja solo las creatividades de vídeo', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Vídeo' }));
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3); // cabecera + 2 vídeos
    expect(within(table).getByText(/Video Pomo 26\/07/)).toBeInTheDocument();
    expect(within(table).getByText(/Flyer Claptone 02\/08/)).toBeInTheDocument();
  });

  test('la vista Calendario sustituye al tablero', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Calendario' }));
    expect(screen.queryByRole('region', { name: 'Tablero de creatividades' })).not.toBeInTheDocument();
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    expect(screen.getByText('1 sin deadline')).toBeInTheDocument();
  });

  test('el chip de asignación conmuta su estado (solo estado local)', () => {
    renderPage();
    const albaChip = screen.getByRole('button', { name: '+ Alba' });
    expect(albaChip).not.toHaveClass('bg-brand-600');
    fireEvent.click(albaChip);
    expect(albaChip).toHaveClass('bg-brand-600');
    fireEvent.click(albaChip);
    expect(albaChip).not.toHaveClass('bg-brand-600');
  });
});
