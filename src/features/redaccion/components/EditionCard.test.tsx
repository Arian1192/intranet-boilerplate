import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EditionCard } from './EditionCard';
import { MIXMAG } from '../data/seed';

describe('EditionCard', () => {
  it('muestra número, título, mes, estado y progreso', () => {
    render(<EditionCard edition={MIXMAG.editions[0]} />);
    expect(screen.getByText('#29')).toBeInTheDocument();
    expect(screen.getByText('Patrick Topping')).toBeInTheDocument();
    expect(screen.getByText('Agosto 2026')).toBeInTheDocument();
    expect(screen.getByText('En preparación')).toBeInTheDocument();
    expect(screen.getByText('0 de 1 listos')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
