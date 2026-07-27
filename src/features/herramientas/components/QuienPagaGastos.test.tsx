import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuienPagaGastos } from './QuienPagaGastos';
import { seedProyecciones } from '../data/seed';

describe('QuienPagaGastos', () => {
  const gastos = seedProyecciones[0].gastos;

  it('agrupa por categoría con subtotal y muestra cada línea', () => {
    render(<QuienPagaGastos gastos={gastos} onTogglePagaLinea={vi.fn()} onTogglePagaCategoria={vi.fn()} />);
    expect(screen.getByText('Artística')).toBeInTheDocument();
    // Nota: Intl.NumberFormat('es-ES') en este runtime usa minimumGroupingDigits=2,
    // así que los importes de 4 cifras no llevan separador de miles (mismo comportamiento
    // ya observado y tolerado desde la Tarea 7).
    expect(screen.getByText(/-2\.?400,00/)).toBeInTheDocument(); // subtotal Artística
    expect(screen.getByText('US TWO - AF')).toBeInTheDocument();
    expect(screen.getByText('US TWO - BF')).toBeInTheDocument();
  });

  it('muestra el pie con Pagamos nosotros / Paga el venue', () => {
    render(<QuienPagaGastos gastos={gastos} onTogglePagaLinea={vi.fn()} onTogglePagaCategoria={vi.fn()} />);
    expect(screen.getByText(/Pagamos nosotros/)).toBeInTheDocument();
    expect(screen.getByText(/-5\.?470,00/)).toBeInTheDocument();
    expect(screen.getByText(/Paga el venue/)).toBeInTheDocument();
  });

  it('clicking a line toggle calls onTogglePagaLinea with the gasto id', async () => {
    const onTogglePagaLinea = vi.fn();
    render(<QuienPagaGastos gastos={gastos} onTogglePagaLinea={onTogglePagaLinea} onTogglePagaCategoria={vi.fn()} />);
    const venueButtons = screen.getAllByRole('button', { name: 'Venue' });
    await userEvent.click(venueButtons[1]); // primera línea (US TWO - AF) tras el toggle de categoría
    expect(onTogglePagaLinea).toHaveBeenCalledWith('gasto-1', 'venue');
  });

  it('clicking the category toggle calls onTogglePagaCategoria with the categoria', async () => {
    const onTogglePagaCategoria = vi.fn();
    render(<QuienPagaGastos gastos={gastos} onTogglePagaLinea={vi.fn()} onTogglePagaCategoria={onTogglePagaCategoria} />);
    const venueButtons = screen.getAllByRole('button', { name: 'Venue' });
    await userEvent.click(venueButtons[0]); // primer toggle = el de categoría (Artística)
    expect(onTogglePagaCategoria).toHaveBeenCalledWith('Artística', 'venue');
  });
});
