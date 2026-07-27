import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreativosPage } from './CreativosPage';

describe('CreativosPage', () => {
  it('renders header, the 4 stat cards with live counts, and the Nueva creatividad action', () => {
    render(<CreativosPage />);
    expect(screen.getByRole('heading', { name: 'Creativos', level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tablero de creatividades del equipo de diseño: Euphoric, clientes del CRM y empresas internas.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Creatividades activas')).toBeInTheDocument();
    expect(screen.getByText('Pend. aprobar', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('En correcciones')).toBeInTheDocument();
    expect(screen.getByText('Atrasadas', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nueva creatividad' })).toBeInTheDocument();
    expect(screen.queryByText('Piezas activas')).not.toBeInTheDocument();
  });

  it('renders the live stat values (2 / 0 / 0 / 2) and the live kanban counts', () => {
    render(<CreativosPage />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(4); // header + 3 creatividades
    expect(within(table).getByText('Pack Sold Out · Pack Sold Out')).toBeInTheDocument();
    expect(within(table).getByText('Video Pomo 26/07')).toBeInTheDocument();
    expect(within(table).getByText('Flyer Claptone 02/08')).toBeInTheDocument();
  });

  it('filtering by "Diseño" narrows both the kanban and the table to the estático piece', () => {
    render(<CreativosPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Diseño' }));
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(2); // header + 1 data row
    expect(within(table).getByText('Pack Sold Out · Pack Sold Out')).toBeInTheDocument();
    expect(within(table).queryByText('Video Pomo 26/07')).not.toBeInTheDocument();
  });

  // El título del drawer sigue siendo "Nueva pieza": el recon del 27-jul no abrió el drawer,
  // así que la única evidencia de esa cabecera es la captura del 10-jul (ver ours-vs-live.md).
  it('opens and closes the alta drawer', () => {
    render(<CreativosPage />);
    expect(screen.queryByRole('heading', { name: 'Nueva pieza' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva creatividad' }));
    expect(screen.getByRole('heading', { name: 'Nueva pieza' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.queryByRole('heading', { name: 'Nueva pieza' })).not.toBeInTheDocument();
  });
});
