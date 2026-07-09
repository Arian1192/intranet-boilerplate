import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { PhaseAccumCards } from './PhaseAccumCards';
import { phaseAccum } from '../data/seed';

test('renders a card per phase with count and amount', () => {
  render(<PhaseAccumCards items={phaseAccum} />);
  expect(screen.getByText('Borrador')).toBeInTheDocument();
  expect(screen.getByText('6424,60 €')).toBeInTheDocument();
  expect(screen.getByText('6650,00 €')).toBeInTheDocument();
  // count badge for Borrador
  expect(screen.getByText('2')).toBeInTheDocument();
});
