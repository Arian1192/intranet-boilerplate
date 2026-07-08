import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ShowsPage } from './ShowsPage';

vi.mock('../hooks/useShows', () => ({
  useShows: () => ({
    isLoading: false,
    error: null,
    shows: [
      { id: 's1', name: 'Show confirmado', client: 'Cliente A', date: '15 jul 2026', status: 'confirmed', amount: 3500 },
      { id: 's2', name: 'Show contrato', client: 'Cliente B', date: '18 jul 2026', status: 'contract', amount: 800 },
    ],
  }),
}));

describe('ShowsPage', () => {
  it('filters shows by the status query parameter', () => {
    render(
      <MemoryRouter initialEntries={['/conceptone/shows?status=contract']}>
        <ShowsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Show contrato')).toBeInTheDocument();
    expect(screen.queryByText('Show confirmado')).not.toBeInTheDocument();
  });
});
