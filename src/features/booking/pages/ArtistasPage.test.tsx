import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ArtistasPage } from './ArtistasPage';
import { artistasFicha } from '../data/artistas-ficha';

describe('ArtistasPage — cabecera', () => {
  it('calca el h1, los dos contadores y la bajada', () => {
    render(<ArtistasPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Artistas' })).toBeInTheDocument();
    expect(screen.getByTitle('Artistas con Booking')).toHaveTextContent('B41');
    expect(screen.getByTitle('Artistas con Management')).toHaveTextContent('M17');
    expect(
      screen.getByText(
        'Ficha completa del artista: condiciones, datos personales, contrato y documentos.'
      )
    ).toBeInTheDocument();
  });

  it('arranca en «Lista», con «Roster» apagado', () => {
    render(<ArtistasPage />);
    expect(screen.getByRole('button', { name: 'Lista' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Roster' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('ArtistasPage — vista Lista', () => {
  it('es un master-detail: lista a la izquierda y el vacío a la derecha', () => {
    render(<ArtistasPage />);
    expect(screen.getByRole('button', { name: '+ Nuevo artista' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar artista…')).toHaveAttribute('type', 'search');
    expect(screen.getByText('Selecciona un artista o crea uno nuevo.')).toBeInTheDocument();
  });

  it('lista los 41 artistas en el orden del live', () => {
    render(<ArtistasPage />);
    const filas = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(filas).toHaveLength(41);
    expect(filas[0]).toHaveTextContent('Aaron Martin');
    expect(filas[40]).toHaveTextContent('Vidaloca');
  });

  it('cada fila lleva sus insignias y el badge de contrato', () => {
    render(<ArtistasPage />);
    const filas = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(within(filas[0]).getByTitle('Booking')).toHaveTextContent('B');
    expect(within(filas[0]).getByTitle('Management')).toHaveTextContent('M');
    expect(filas[0]).toHaveTextContent('Sin contrato');
    // ACA sólo tiene Booking.
    expect(within(filas[2]).queryByTitle('Management')).toBeNull();
  });

  it('pinta las iniciales y nunca una foto de la CDN del live', () => {
    const { container } = render(<ArtistasPage />);
    expect(container.querySelectorAll('img')).toHaveLength(0);
    const filas = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(filas[0]).toHaveTextContent('AA');
  });

  it('el buscador recorta la lista', async () => {
    const user = userEvent.setup();
    render(<ArtistasPage />);
    await user.type(screen.getByPlaceholderText('Buscar artista…'), 'bizza');
    const filas = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(filas).toHaveLength(1);
    expect(filas[0]).toHaveTextContent('Bizza');
  });

  it('cierra la lista con el plegable de archivados del live', () => {
    render(<ArtistasPage />);
    expect(screen.getByRole('button', { name: /Archivados · 1/ })).toBeInTheDocument();
  });
});

describe('ArtistasPage — vista Roster', () => {
  it('cambia a una tarjeta por artista', async () => {
    const user = userEvent.setup();
    render(<ArtistasPage />);
    await user.click(screen.getByRole('button', { name: 'Roster' }));

    expect(screen.queryByPlaceholderText('Buscar artista…')).toBeNull();
    expect(screen.queryByText('Selecciona un artista o crea uno nuevo.')).toBeNull();
    expect(screen.getAllByRole('button', { name: /^Ficha de / })).toHaveLength(41);
  });

  it('cada tarjeta trae las nueve redes, enlazando sólo las que el live enlaza', async () => {
    const user = userEvent.setup();
    render(<ArtistasPage />);
    await user.click(screen.getByRole('button', { name: 'Roster' }));

    const tarjeta = screen.getByRole('button', { name: 'Ficha de Aaron Martin' });
    for (const red of [
      'Instagram',
      'Facebook',
      'TikTok',
      'Spotify',
      'Resident Advisor',
      'Beatport',
      'SoundCloud',
      'YouTube',
      'Apple Music',
    ]) {
      expect(within(tarjeta).getByText(red)).toBeInTheDocument();
    }
    expect(within(tarjeta).getAllByRole('link')).toHaveLength(7);
    expect(within(tarjeta).getByTitle('Facebook — sin enlace')).toBeInTheDocument();
    expect(within(tarjeta).getByTitle('Apple Music — sin enlace')).toBeInTheDocument();
  });

  it('los enlaces abren en pestaña nueva y sin filtrar el referente', async () => {
    const user = userEvent.setup();
    render(<ArtistasPage />);
    await user.click(screen.getByRole('button', { name: 'Roster' }));

    const instagram = within(
      screen.getByRole('button', { name: 'Ficha de Aaron Martin' })
    ).getByRole('link', { name: 'Instagram' });
    expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/aaronmartin.ofc/');
    expect(instagram).toHaveAttribute('target', '_blank');
    expect(instagram).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('suma los 192 enlaces de la foto, y ninguna imagen', async () => {
    const user = userEvent.setup();
    const { container } = render(<ArtistasPage />);
    await user.click(screen.getByRole('button', { name: 'Roster' }));

    expect(screen.getAllByRole('link')).toHaveLength(192);
    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(
      artistasFicha.reduce((total, artista) => total + Object.keys(artista.redes).length, 0)
    ).toBe(192);
  });
});
