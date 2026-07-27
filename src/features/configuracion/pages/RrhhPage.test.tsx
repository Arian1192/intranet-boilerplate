import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RrhhPage } from './RrhhPage';

describe('RrhhPage', () => {
  it('título y valores exactos de asalariados/autónomos/avisos', () => {
    render(<RrhhPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'RRHH' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('31.5')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('21')).toHaveLength(2);
    expect(screen.getByDisplayValue('160')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('60, 30, 15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15, 7')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /cumpleaños/ })).toBeChecked();
  });

  it('permite editar libremente las listas de días de aviso', async () => {
    render(<RrhhPage />);
    const input = screen.getByDisplayValue('60, 30, 15');
    await userEvent.clear(input);
    await userEvent.type(input, '45, 10');
    expect(input).toHaveValue('45, 10');
  });

  it('12 departamentos activos y selector de 8 colores para "Nuevo departamento"', () => {
    render(<RrhhPage />);
    expect(screen.getByText('Advancing')).toBeInTheDocument();
    expect(screen.getByText('Vídeo')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Desactivar' })).toHaveLength(12);
    expect(screen.getAllByLabelText(/^(blue|green|orange|red|purple|cyan|pink|amber)$/)).toHaveLength(8);
  });

  it('añadir y eliminar un departamento funciona solo en estado local', async () => {
    render(<RrhhPage />);
    await userEvent.type(screen.getByPlaceholderText('Booking, Marketing, Producción…'), 'Eventos');
    await userEvent.click(screen.getByRole('button', { name: 'Añadir' }));
    const row = screen.getByText('Eventos').closest('[data-department-row]')!;
    expect(row).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Desactivar' })).toHaveLength(13);
    await userEvent.click(within(row as HTMLElement).getByRole('button', { name: 'Eliminar Eventos' }));
    expect(screen.queryByText('Eventos')).not.toBeInTheDocument();
  });

  it('Desactivar un departamento lo pasa a "Activar"', async () => {
    render(<RrhhPage />);
    const row = screen.getByText('Advancing').closest('[data-department-row]')!;
    await userEvent.click(within(row as HTMLElement).getByRole('button', { name: 'Desactivar' }));
    expect(within(row as HTMLElement).getByRole('button', { name: 'Activar' })).toBeInTheDocument();
  });
});
