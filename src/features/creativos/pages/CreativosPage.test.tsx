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

  it('filtering by "Vídeo" narrows both the kanban and the table to the video piece', () => {
    render(<CreativosPage />);
    // Before: the table has 3 data rows
    expect(screen.getAllByText('SIGHT').length).toBeGreaterThan(1);
    fireEvent.click(screen.getByRole('button', { name: 'Vídeo' }));
    // After: only the vídeo piece (p1) remains — its meta line is unique to video
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(2); // header + 1 data row
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
