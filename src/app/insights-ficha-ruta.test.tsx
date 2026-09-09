import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { AppRouter } from './router';

describe('la ficha de artista de Insights está registrada', () => {
  it('/management/insights/:artistaId pinta su stub dentro de la carcasa', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/management/insights/janse']}>
        <AppRouter />
      </MemoryRouter>
    );
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Ficha de artista' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '←' })).toHaveAttribute('href', '/management/insights');
    expect(container.querySelector('.apx-side')).toBeInTheDocument();
  });
});
