import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { AppRouter } from './router';

describe('el detalle de gira está registrado', () => {
  it('/tours/:tourId pinta la gira dentro de la carcasa', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/tours/c68ade2f-5f01-4686-869c-34e744cf445a']}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(await screen.findByDisplayValue('LATAM Sept 2026')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Volver a tours' })).toHaveAttribute(
      'href',
      '/tours'
    );
    expect(container.querySelector('.apx-side')).toBeInTheDocument();
  });
});
