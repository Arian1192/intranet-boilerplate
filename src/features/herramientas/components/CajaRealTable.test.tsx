import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CajaRealTable } from './CajaRealTable';
import { seedProyecciones } from '../data/seed';

describe('CajaRealTable', () => {
  it('estado vacío muestra el copy del live y total 0,00€', () => {
    render(<CajaRealTable proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    expect(screen.getByText('Caja real (barras, comida, extras)')).toBeInTheDocument();
    expect(screen.getByText('Sin líneas todavía. Añade o rellena con la previsión.')).toBeInTheDocument();
    expect(screen.getByText(/Total caja neto/)).toBeInTheDocument();
    expect(screen.getByText(/^0,00\s?€$/)).toBeInTheDocument();
  });

  it('"+ Añadir" agrega una línea vacía', () => {
    const onUpdate = vi.fn();
    render(<CajaRealTable proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText('+ Añadir'));
    expect(onUpdate).toHaveBeenCalled();
    expect(onUpdate.mock.calls[0][0].cajaReal.length).toBe(1);
  });

  it('"Rellenar con previsión" crea líneas desde la previsión base (barras/comida)', () => {
    const onUpdate = vi.fn();
    render(<CajaRealTable proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText('Rellenar con previsión'));
    expect(onUpdate).toHaveBeenCalled();
    const lineas = onUpdate.mock.calls[0][0].cajaReal;
    expect(lineas.length).toBeGreaterThan(0);
    // el seed tiene barras y comida con consumo > 0 (merch 0 → se omite)
    expect(lineas.map((l: { fuente: string }) => l.fuente)).toEqual(expect.arrayContaining(['Barras', 'Comida']));
    expect(lineas.every((l: { importe: number }) => l.importe > 0)).toBe(true);
  });

  it('con líneas, suma el total caja neto', () => {
    const conCaja = { ...seedProyecciones[0], cajaReal: [
      { id: 'c1', fuente: 'Barra 1', importe: 300 },
      { id: 'c2', fuente: 'Guardarropa', importe: 120 },
    ] };
    render(<CajaRealTable proyeccion={conCaja} onUpdate={vi.fn()} />);
    expect(screen.getByText(/^420,00\s?€$/)).toBeInTheDocument();
  });
});
