import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AgendaShowCard } from './AgendaShowCard';
import { AgendaHoldCard } from './AgendaHoldCard';
import type { CalendarEvent } from '@/types';

const show: CalendarEvent = {
  id: 'x', date: '2026-07-18', type: 'show', artist: 'Los Canarios',
  venue: 'Edén Ibiza', city: 'Sant Antoni de Portmany', event: 'FUEGO', paymentStatus: 'No abonado',
};
const hold: CalendarEvent = {
  id: 'h', date: '2026-07-23', type: 'hold', artist: 'Test Artist', holdTitle: 'Dentista', etapa: 'confirmed',
};

describe('AgendaShowCard', () => {
  it('pinta "Show", artista/venue/ciudad/evento y el pago', () => {
    render(<AgendaShowCard event={show} />);
    expect(screen.getByText('Show')).toBeInTheDocument();
    expect(screen.getByText(/Los Canarios/)).toBeInTheDocument();
    expect(screen.getByText(/Edén Ibiza/)).toBeInTheDocument();
    expect(screen.getByText(/Sant Antoni de Portmany/)).toBeInTheDocument();
    expect(screen.getByText(/FUEGO/)).toBeInTheDocument();
    expect(screen.getByText('No abonado')).toBeInTheDocument();
  });

  it('omite venue/ciudad nulos', () => {
    render(
      <AgendaShowCard
        event={{ ...show, venue: null, city: null, event: 'Alcazar de San Juan', artist: 'Brenda Serna', paymentStatus: 'Parcialmente abonado' }}
      />
    );
    expect(screen.getByText(/Brenda Serna/)).toBeInTheDocument();
    expect(screen.getByText(/Alcazar de San Juan/)).toBeInTheDocument();
    expect(screen.getByText('Parcialmente abonado')).toBeInTheDocument();
  });
});

describe('AgendaHoldCard', () => {
  it('pinta "Calendario", "(del artista)", el badge y 3 botones inertes', () => {
    render(<AgendaHoldCard event={hold} />);
    expect(screen.getByText('Calendario')).toBeInTheDocument();
    expect(screen.getByText(/Dentista \(del artista\)/)).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subir a show' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });
});
