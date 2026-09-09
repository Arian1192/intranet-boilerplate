import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { AppRouter } from './router';

describe('la ficha de artista de Insights está registrada', () => {
  it('/management/insights/:artistaId pinta la ficha dentro de la carcasa', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/management/insights/janse']}>
        <AppRouter />
      </MemoryRouter>
    );
    // Desde la Fase F la ruta ya no es un stub: el `h1` es el nombre del artista.
    expect(await screen.findByRole('heading', { level: 1, name: 'Janse' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '←' })).toHaveAttribute('href', '/management/insights');
    expect(container.querySelector('.apx-side')).toBeInTheDocument();
  });
});
