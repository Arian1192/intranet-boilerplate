import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DayAgenda } from './DayAgenda';
import { eventsForMonth } from '../data/calendar';

describe('DayAgenda', () => {
  it('agrupa julio por día con encabezados es-ES', () => {
    render(<DayAgenda events={eventsForMonth(2026, 6)} />);
    expect(screen.getByText('miércoles, 15 de julio')).toBeInTheDocument();
    expect(screen.getByText('sábado, 18 de julio')).toBeInTheDocument();
    expect(screen.getByText('jueves, 23 de julio')).toBeInTheDocument(); // el hold
    // el 18-jul agrupa 2 shows
    expect(screen.getAllByText('Show').length).toBeGreaterThan(1);
    expect(screen.getByText(/Dentista \(del artista\)/)).toBeInTheDocument();
  });
});
