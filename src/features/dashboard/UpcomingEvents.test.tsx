import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import { UpcomingEvents } from './UpcomingEvents';
import type { Event } from '@/types';

const events: Event[] = [
  {
    id: 'event-1',
    title: 'Mixmag Intimate Sessions: BLOND:ISH',
    date: '15 jul 2026',
    timeRange: '20:00–21:30',
    location: 'Soho Farmhouse, Ibiza',
    status: 'confirmed',
  },
  {
    id: 'event-2',
    title: 'Please Quiet x SIGHT',
    date: '18 jul 2026',
    timeRange: '18:00–23:00',
    location: 'Cósmico - SLS Barcelona, Barcelona',
    status: 'in-production',
  },
];

describe('UpcomingEvents', () => {
  it('links each event to its produccion detail and shows the meta line', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /Mixmag Intimate Sessions/ });
    expect(link).toHaveAttribute('href', '/produccion/event-1');
    expect(
      screen.getByText('15 jul 2026 · 20:00–21:30 · Soho Farmhouse, Ibiza')
    ).toBeInTheDocument();
  });

  it('renders status badges with the right label and color', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    expect(screen.getByText('Confirmado')).toHaveClass('bg-blue-100', 'text-blue-700');
    expect(screen.getByText('En producción')).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('has a "Ver todos" link to produccion', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Ver todos' })).toHaveAttribute('href', '/produccion');
  });
});
