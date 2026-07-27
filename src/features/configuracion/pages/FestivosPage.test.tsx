import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FestivosPage } from './FestivosPage';

describe('FestivosPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });


  it('título, 2026 (7) y 2027 (16), checkbox de pasados y acordeón de importación colapsado', () => {
    render(<FestivosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Festivos' })).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getAllByText("L'Assumpció")).toHaveLength(2);
    expect(screen.getByRole('checkbox', { name: /festivos pasados/ })).not.toBeChecked();
    expect(screen.queryByTestId('import-accordion-body')).toBeNull();
    expect(screen.getAllByRole('button', { name: /Eliminar/ })).toHaveLength(23);
  });

  it('el acordeón de importación alterna abierto/cerrado sin contenido interno', () => {
    render(<FestivosPage />);
    const toggle = screen.getByRole('button', { name: /Importar un año entero/ });
    fireEvent.click(toggle);
    expect(screen.getByTestId('import-accordion-body')).toBeInTheDocument();
    expect(screen.getByTestId('import-accordion-body')).toBeEmptyDOMElement();
    fireEvent.click(toggle);
    expect(screen.queryByTestId('import-accordion-body')).toBeNull();
  });

  it('añadir un festivo inline lo suma a la lista local', () => {
    render(<FestivosPage />);
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2026-12-24' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. La Mercè'), { target: { value: 'Prueba' } });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(screen.getByText('Prueba')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Eliminar/ })).toHaveLength(24);
  });

  it('eliminar un festivo lo quita de la lista', () => {
    render(<FestivosPage />);
    const before = screen.getAllByRole('button', { name: /Eliminar/ }).length;
    fireEvent.click(screen.getAllByRole('button', { name: /Eliminar/ })[0]);
    expect(screen.getAllByRole('button', { name: /Eliminar/ })).toHaveLength(before - 1);
  });

  it('el checkbox de pasados oculta o muestra fechas anteriores a hoy', () => {
    vi.setSystemTime(new Date('2027-09-20T10:00:00'));
    render(<FestivosPage />);
    expect(screen.queryByText('Any Nou')).toBeNull();
    fireEvent.click(screen.getByRole('checkbox', { name: /festivos pasados/ }));
    expect(screen.getByText('Any Nou')).toBeInTheDocument();
  });
});
