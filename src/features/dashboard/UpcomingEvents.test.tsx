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
  it('links each event to its produccion detail', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /Mixmag Intimate Sessions/ });
    expect(link).toHaveAttribute('href', '/produccion/event-1');
  });

  it('shows a date badge with month and day, not the raw date', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    // Both fixture events fall in July, so two badges render "JUL" — assert both, not one.
    expect(screen.getAllByText('JUL', { selector: 'span' })).toHaveLength(2);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('shows only start time and location in the subtitle (no date, no range, no status chip)', () => {
    render(
      <MemoryRouter>
        <UpcomingEvents events={events} />
      </MemoryRouter>
    );
    expect(screen.getByText('20:00 · Soho Farmhouse, Ibiza')).toBeInTheDocument();
    expect(screen.queryByText(/20:00–21:30/)).not.toBeInTheDocument();
    expect(screen.queryByText('Confirmado')).not.toBeInTheDocument();
    expect(screen.queryByText('En producción')).not.toBeInTheDocument();
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
