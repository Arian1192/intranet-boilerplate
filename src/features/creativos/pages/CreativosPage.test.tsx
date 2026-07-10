import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreativosPage } from './CreativosPage';

describe('CreativosPage', () => {
  it('renders header, the 4 stat cards with live counts, and the Nueva pieza action', () => {
    render(<CreativosPage />);
    expect(screen.getByRole('heading', { name: 'Creativos', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Piezas activas')).toBeInTheDocument();
    expect(screen.getByText('Pend. aprobar', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('En correcciones')).toBeInTheDocument();
    expect(screen.getByText('Atrasadas', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Nueva pieza/ })).toBeInTheDocument();
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

  it('opens and closes the Nueva pieza drawer', () => {
    render(<CreativosPage />);
    expect(screen.queryByRole('heading', { name: 'Nueva pieza' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Nueva pieza/ }));
    expect(screen.getByRole('heading', { name: 'Nueva pieza' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.queryByRole('heading', { name: 'Nueva pieza' })).not.toBeInTheDocument();
  });
});
