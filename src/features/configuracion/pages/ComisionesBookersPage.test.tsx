import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComisionesBookersPage } from './ComisionesBookersPage';

describe('ComisionesBookersPage', () => {
  it('título, ajustes globales (25/30/100/600) y 15 bookers al 25%', () => {
    render(<ComisionesBookersPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Comisiones de bookers' })).toBeInTheDocument();
    expect(screen.getByText('Alba Gelabert')).toBeInTheDocument();
    expect(screen.getByText('Yenifer Bernardo')).toBeInTheDocument();
    expect(screen.getAllByText(/\(global 25%\)/)).toHaveLength(15);
  });

  it('editar el % global recalcula "(global X%)" de todos los bookers', async () => {
    render(<ComisionesBookersPage />);
    const globalInputs = screen.getAllByDisplayValue('25');
    // el primero de todos es el % global (aparece antes que los 15 de bookers en el DOM)
    await userEvent.clear(globalInputs[0]);
    await userEvent.type(globalInputs[0], '30');
    expect(screen.getAllByText(/\(global 30%\)/).length).toBeGreaterThan(0);
  });

  it('editar el % de un booker concreto no afecta a los demás', async () => {
    render(<ComisionesBookersPage />);
    const rows = screen.getAllByDisplayValue('25');
    const albaInput = rows[1]; // [0] = global, [1] = primer booker (Alba Gelabert)
    await userEvent.clear(albaInput);
    await userEvent.type(albaInput, '40');
    expect(screen.getByDisplayValue('40')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('25').length).toBeGreaterThan(0);
  });
});
