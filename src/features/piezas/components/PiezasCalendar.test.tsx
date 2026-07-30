import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PiezasCalendar } from './PiezasCalendar';
import { pieces } from '../data/seed';
import { filterPieces } from '../data/tablero';

const TODAY = new Date(2026, 6, 27); // el "hoy" del live: 27 jul 2026

describe('PiezasCalendar', () => {
  it('renders the month of "hoy", the weekday header and the ← → Hoy controls', () => {
    render(<PiezasCalendar pieces={pieces} today={TODAY} />);
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].forEach((d) =>
      expect(screen.getByText(d)).toBeInTheDocument()
    );
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toHaveTextContent('←');
    expect(screen.getByRole('button', { name: 'Mes siguiente' })).toHaveTextContent('→');
    expect(screen.getByRole('button', { name: 'Hoy' })).toBeInTheDocument();
  });

  it('drops each creatividad on its deadline day', () => {
    render(<PiezasCalendar pieces={pieces} today={TODAY} />);
    const day = (title: string) =>
      screen.getByRole('button', { name: title }).closest('[data-iso]')!.getAttribute('data-iso');
    expect(day('Pack Sold Out · Pack Sold Out')).toBe('2026-07-10');
    expect(day('Flyer Claptone 02/08')).toBe('2026-07-22');
    expect(day('Video Pomo 26/07')).toBe('2026-07-23');
  });

  it('marks the approved creatividad as done and the overdue ones in rose', () => {
    render(<PiezasCalendar pieces={pieces} today={TODAY} />);
    expect(screen.getByRole('button', { name: 'Flyer Claptone 02/08' })).toHaveClass('line-through');
    expect(screen.getByRole('button', { name: 'Video Pomo 26/07' })).not.toHaveClass('line-through');
  });

  // El live pinta siempre 6 semanas: "29 30" del mes anterior al principio y "1…9" del
  // siguiente al final (por eso el 9 aparece dos veces: 9 jul y 9 ago).
  it('always paints six weeks, with the leading and trailing filler days', () => {
    render(<PiezasCalendar pieces={pieces} today={TODAY} />);
    expect(screen.getAllByText('9')).toHaveLength(2);
    expect(screen.getAllByText('30')).toHaveLength(2);
  });

  it('navigates months and comes back with "Hoy"', () => {
    render(<PiezasCalendar pieces={pieces} today={TODAY} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByText('Junio 2026')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Video Pomo 26/07' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hoy' }));
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(screen.getByText('Agosto 2026')).toBeInTheDocument();
  });

  it('honours the active filter', () => {
    render(<PiezasCalendar pieces={filterPieces(pieces, 'Diseño', 'Carlos')} today={TODAY} />);
    expect(screen.getByRole('button', { name: 'Pack Sold Out · Pack Sold Out' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Video Pomo 26/07' })).not.toBeInTheDocument();
  });
});
