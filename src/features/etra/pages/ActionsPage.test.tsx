import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ActionsPage } from './ActionsPage';

vi.mock('../hooks/usePrActions', () => ({
  usePrActions: () => ({
    isLoading: false,
    error: null,
    data: [
      {
        id: 'act1',
        title: 'Acción de prensa Cliente A',
        account: 'Cliente A',
        type: 'Evento',
        amount: 10000,
        status: 'in-progress',
        date: '16 jul 2026',
      },
    ],
  }),
}));

describe('ActionsPage', () => {
  it('toggles the Nueva tarea panel from the header button', () => {
    render(
      <MemoryRouter>
        <ActionsPage />
      </MemoryRouter>
    );
    expect(screen.queryByText('Nueva tarea')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '+ Nueva acción' }));
    expect(screen.getByText('Nueva tarea')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear y abrir' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByText('Nueva tarea')).not.toBeInTheDocument();
  });

  it('renders the card with amount and links it to the action detail', () => {
    render(
      <MemoryRouter>
        <ActionsPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Evento · 10\.000,00/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Acción de prensa Cliente A/ })).toHaveAttribute(
      'href',
      '/etra/tareas/act1'
    );
  });
});
