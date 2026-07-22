import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { EquipoPage } from './EquipoPage';

describe('EquipoPage Directorio', () => {
  it('renders 26 person cards', () => {
    render(<MemoryRouter><EquipoPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Equipo' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Ver ficha personal/ })).toHaveLength(26);
  });

  it('filters by search query', async () => {
    render(<MemoryRouter><EquipoPage /></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText(/Buscar por nombre/), 'zzz');
    expect(screen.queryAllByRole('link', { name: /Ver ficha personal/ })).toHaveLength(0);
  });

  it('filters by department', async () => {
    render(<MemoryRouter><EquipoPage /></MemoryRouter>);
    await userEvent.selectOptions(screen.getByLabelText('Departamento'), 'Marketing');
    const cards = screen.getAllByRole('link', { name: /Ver ficha personal/ });
    expect(cards.length).toBeLessThan(26);
    expect(screen.getByText('Alba Gelabert')).toBeInTheDocument();
  });
});
