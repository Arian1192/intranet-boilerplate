import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ProyeccionRow } from './ProyeccionRow';
import { seedProyecciones } from '../data/seed';

describe('ProyeccionRow', () => {
  const proyeccion = seedProyecciones[0];

  it('renders name, badges, dates and PREVISIÓN/REAL amounts', () => {
    render(<MemoryRouter><ProyeccionRow proyeccion={proyeccion} onDuplicate={vi.fn()} onDelete={vi.fn()} /></MemoryRouter>);
    expect(screen.getByText('PQ @ SLS Barcelona')).toBeInTheDocument();
    expect(screen.getByText('Aprobada')).toBeInTheDocument();
    expect(screen.getByText('Real')).toBeInTheDocument();
    expect(screen.getByText(/860,14/)).toBeInTheDocument();
    expect(screen.getByText(/-4792,73|-4\.792,73/)).toBeInTheDocument();
  });

  it('links to the detail route', () => {
    render(<MemoryRouter><ProyeccionRow proyeccion={proyeccion} onDuplicate={vi.fn()} onDelete={vi.fn()} /></MemoryRouter>);
    expect(screen.getByRole('link')).toHaveAttribute('href', `/herramientas/proyecciones/${proyeccion.id}`);
  });

  it('calls onDuplicate / onDelete with the id when clicked', async () => {
    const onDuplicate = vi.fn();
    const onDelete = vi.fn();
    render(<MemoryRouter><ProyeccionRow proyeccion={proyeccion} onDuplicate={onDuplicate} onDelete={onDelete} /></MemoryRouter>);
    await userEvent.click(screen.getByText('Duplicar'));
    await userEvent.click(screen.getByText('Borrar'));
    expect(onDuplicate).toHaveBeenCalledWith(proyeccion.id);
    expect(onDelete).toHaveBeenCalledWith(proyeccion.id);
  });

  it('no muestra el badge "Real" ni la columna REAL si resultadoReal es null', () => {
    const sinReal = { ...proyeccion, resultadoReal: null };
    render(<MemoryRouter><ProyeccionRow proyeccion={sinReal} onDuplicate={vi.fn()} onDelete={vi.fn()} /></MemoryRouter>);
    expect(screen.queryByText('Real')).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
