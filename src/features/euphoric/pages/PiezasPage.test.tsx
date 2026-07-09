import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { PiezasPage } from './PiezasPage';

test('renders KPIs, board and table', () => {
  render(
    <MemoryRouter>
      <PiezasPage />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: 'Piezas' })).toBeInTheDocument();
  expect(screen.getByText('Piezas activas')).toBeInTheDocument();
  expect(screen.getAllByText('Briefing').length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Pack Sold Out/).length).toBeGreaterThan(0);
});
