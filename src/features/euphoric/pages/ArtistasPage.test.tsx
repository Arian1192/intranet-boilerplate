import '@testing-library/jest-dom';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { ArtistasPage } from './ArtistasPage';
import { artists } from '../data/seed';

afterEach(cleanup);

function renderPage() {
  render(
    <MemoryRouter>
      <ArtistasPage />
    </MemoryRouter>
  );
}

describe('Artistas (calco del live 2026-07-29)', () => {
  test('cabecera, alta y estado vacío', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Artistas' })).toBeInTheDocument();
    expect(
      screen.getByText('Base compartida con ConceptOne. Crea aquí los artistas externos para tus line-ups y flyers.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nuevo artista' })).toBeInTheDocument();
    expect(screen.getByText('Elige un artista o crea uno nuevo.')).toBeInTheDocument();
  });

  test('la base espeja los 96 artistas del live, en orden alfabético', () => {
    expect(artists).toHaveLength(96);
    expect(artists[0].name).toBe('Aaron Martin');
    expect(artists[artists.length - 1].name).toBe('Xandro');
    expect(artists.some((artist) => artist.name === 'Test Artist')).toBe(true);
  });

  test('cada fila lleva su chip Agencia/Externo', () => {
    renderPage();
    const externo = screen.getByText('Nicole Moudaber').closest('button') as HTMLElement;
    expect(within(externo).getByText('Externo')).toBeInTheDocument();
    const agencia = screen.getByText('Tomi & Kesh').closest('button') as HTMLElement;
    expect(within(agencia).getByText('Agencia')).toBeInTheDocument();
  });

  test('la ficha del artista trae las acciones del live', async () => {
    renderPage();
    await userEvent.click(screen.getByText('Claptone'));
    expect(screen.getByRole('heading', { level: 2, name: 'Claptone' })).toBeInTheDocument();
    expect(screen.getByText('Foto y perfil del artista')).toBeInTheDocument();
    ['Refrescar', 'Cambiar', 'Desvincular', 'Eliminar artista', 'Guardar'].forEach((action) => {
      expect(screen.getByRole('button', { name: action })).toBeInTheDocument();
    });
  });

  test('+ Nuevo artista abre el formulario de alta', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: '+ Nuevo artista' }));
    expect(screen.getByText('Redes (URL)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Instagram')).toBeInTheDocument();
  });
});
