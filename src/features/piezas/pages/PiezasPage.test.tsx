import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { PiezasPage } from './PiezasPage';

afterEach(cleanup);

/**
 * Cobertura de la instancia de euphoric del tablero compartido. Sustituye a la que vivía en
 * `src/features/euphoric/pages/PiezasPage.test.tsx` antes de la convergencia, con las cifras del
 * live del 30-jul intactas.
 */
describe('/euphoric/piezas — instancia euphoric del tablero compartido', () => {
  it('lleva su propio título y su propia bajada', () => {
    render(<PiezasPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Creatividades' })).toBeInTheDocument();
    expect(
      screen.getByText('Content creation: seguimiento de artes por estado de producción.')
    ).toBeInTheDocument();
  });

  it('mantiene los 4 indicadores del live', () => {
    render(<PiezasPage />);
    const stats = screen.getByRole('region', { name: 'Indicadores de creatividades' });
    const stat = (label: string) => within(stats).getByText(label).closest('div') as HTMLElement;
    expect(within(stat('Creatividades activas')).getByText('7')).toBeInTheDocument();
    expect(within(stat('Pend. aprobar')).getByText('0')).toBeInTheDocument();
    expect(within(stat('En correcciones')).getByText('1')).toBeInTheDocument();
    // Las 4 atrasadas salen ya derivadas del deadline y el estado, no de un flag sembrado.
    expect(within(stat('Atrasadas')).getByText('4')).toBeInTheDocument();
  });

  it('reparte las 10 creatividades por estado como el live', () => {
    render(<PiezasPage />);
    const board = screen.getByRole('region', { name: 'Tablero de creatividades' });
    const counts: [string, string][] = [
      ['Briefing', '5'],
      ['En producción', '1'],
      ['Revisión', '0'],
      ['Cambios', '1'],
      ['Aprobado', '3'],
    ];
    counts.forEach(([label, count]) => {
      const column = within(board).getByText(label).closest('div')?.parentElement as HTMLElement;
      expect(within(column).getByText(count)).toBeInTheDocument();
    });
  });

  it('lista las 10 creatividades en la tabla, con sus 2 aprobaciones pendientes', () => {
    render(<PiezasPage />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(11); // cabecera + 10
    expect(within(table).getAllByText('Pendiente cliente')).toHaveLength(2);
  });

  it('el filtro Vídeo deja solo las dos creatividades de vídeo', () => {
    render(<PiezasPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Vídeo' }));
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText(/Video Pomo 26\/07/)).toBeInTheDocument();
    expect(within(table).getByText(/Flyer Claptone 02\/08/)).toBeInTheDocument();
  });

  it('la vista Calendario sustituye al tablero', () => {
    render(<PiezasPage today={new Date('2026-07-30T00:00:00Z')} />);
    fireEvent.click(screen.getByRole('button', { name: 'Calendario' }));
    expect(
      screen.queryByRole('region', { name: 'Tablero de creatividades' })
    ).not.toBeInTheDocument();
  });

  it('«Sin asignar» sigue saliendo sin píldora tras la migración del seed', () => {
    render(<PiezasPage />);
    // 4 de las 10 piezas del live no tienen responsable.
    const sueltos = screen.getAllByText('Sin asignar');
    expect(sueltos).toHaveLength(4);
    sueltos.forEach((s) => expect(s).toHaveClass('text-[11px]', 'text-slate-300'));
  });

  it('solo «Video Pomo» lleva marcador, aunque haya otra pieza de vídeo', () => {
    render(<PiezasPage />);
    expect(screen.getAllByTitle('Vídeo')).toHaveLength(1);
  });
});
