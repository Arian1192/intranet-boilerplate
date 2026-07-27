import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { CalendarioPage } from './CalendarioPage';

describe('CalendarioPage', () => {
  it('renders heading and today banner for July 2026', () => {
    render(<MemoryRouter><CalendarioPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Calendario del equipo' })).toBeInTheDocument();
    const banner = screen.getByText('Hoy:').closest('div')!;
    expect(banner).toHaveTextContent('Carlos Ramudo Valencia');
    expect(banner).toHaveTextContent('Vacaciones');
  });

  it('navigates month with arrows', async () => {
    render(<MemoryRouter><CalendarioPage /></MemoryRouter>);
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(screen.getByText('Agosto 2026')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
  });
});
