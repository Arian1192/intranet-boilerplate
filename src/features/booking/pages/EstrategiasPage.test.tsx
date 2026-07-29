import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { EstrategiasPage } from './EstrategiasPage';
import { ARTISTAS_ESTRATEGIA } from '../data/estrategias';

describe('EstrategiasPage', () => {
  it('calca cabecera y bajada del live', () => {
    render(<EstrategiasPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Estrategias · Management' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Estrategia de crecimiento por artista: shows, música, patrocinios y conexiones.'
      )
    ).toBeInTheDocument();
  });

  it('lista los 22 artistas del live en orden', () => {
    render(<EstrategiasPage />);
    const filas = screen.getAllByRole('button');
    expect(filas).toHaveLength(22);
    filas.forEach((fila, i) => {
      expect(fila.textContent?.endsWith(ARTISTAS_ESTRATEGIA[i])).toBe(true);
    });
  });

  it('arranca sin selección y con el aviso del live', () => {
    render(<EstrategiasPage />);
    expect(screen.getByText('Selecciona un artista para ver su estrategia.')).toBeInTheDocument();
  });

  it('al elegir un artista abre su estrategia con los cuatro frentes', async () => {
    const user = userEvent.setup();
    render(<EstrategiasPage />);
    await user.click(screen.getByRole('button', { name: /Bizza/ }));
    expect(screen.getByRole('heading', { level: 2, name: 'Bizza' })).toBeInTheDocument();
    for (const frente of ['Shows', 'Música', 'Patrocinios', 'Conexiones']) {
      expect(screen.getByRole('heading', { level: 3, name: frente })).toBeInTheDocument();
    }
    expect(screen.queryByText('Selecciona un artista para ver su estrategia.')).toBeNull();
  });
});
