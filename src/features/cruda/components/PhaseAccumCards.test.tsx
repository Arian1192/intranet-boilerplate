import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { PhaseAccumCards } from './PhaseAccumCards';
import { phaseAccum } from '../data/seed';

test('renders a card per phase with count and amount', () => {
  render(<PhaseAccumCards items={phaseAccum} />);
  expect(screen.getByText('Borrador')).toBeInTheDocument();
  expect(screen.getByText('6424,60 €')).toBeInTheDocument();
  expect(screen.getByText('8300,00 €')).toBeInTheDocument();
  // count badges: Borrador (2) and Confirmado (2)
  expect(screen.getAllByText('2')).toHaveLength(2);
});
