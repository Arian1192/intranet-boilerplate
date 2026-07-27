import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MonthGrid } from './MonthGrid';
import { eventsForMonth } from '../data/calendar';

describe('MonthGrid', () => {
  it('julio 2026: cabeceras LU..DO y chips en sus días', () => {
    render(<MonthGrid year={2026} month={6} events={eventsForMonth(2026, 6)} />);
    ['LU', 'MA', 'MI', 'JU', 'VI', 'SÁ', 'DO'].forEach((d) =>
      expect(screen.getByText(d)).toBeInTheDocument()
    );
    expect(screen.getByText(/Bizza · Illes Balears/)).toBeInTheDocument();
    expect(screen.getByText(/Pau Guilera · Valencia/)).toBeInTheDocument();
    // el hold muestra artista · título
    expect(screen.getByText(/Test Artist · Dentista/)).toBeInTheDocument();
    // día 1 presente
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
