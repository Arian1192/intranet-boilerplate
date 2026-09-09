import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactosPage } from './ContactosPage';
import { venues } from '../data/contactos';
import { eventosPromotoras } from '../data/contactos-eventos';
import { personasContacto } from '../data/contactos-personas';

const BUSCADOR_GLOBAL = 'Buscar en venues, empresas y personas…';

describe('ContactosPage — cabecera y pestañas', () => {
  it('calca el h1 y la bajada', () => {
    render(<ContactosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Contactos' })).toBeInTheDocument();
    expect(
      screen.getByText('Venues y empresas con las que trabaja ConceptOne.')
    ).toBeInTheDocument();
  });

  it('tiene UN buscador global encima de las pestañas, no uno por pestaña', () => {
    render(<ContactosPage />);
    const global = screen.getByPlaceholderText(BUSCADOR_GLOBAL);
    expect(global).toHaveAttribute('type', 'search');
    // En Venues el live no pone ningún buscador local.
    expect(screen.queryByPlaceholderText('Buscar venue o ciudad…')).toBeNull();
  });

  it('son CUATRO pestañas, no dos', () => {
    render(<ContactosPage />);
    const pestanas = screen.getAllByRole('tab');
    expect(pestanas.map((p) => p.textContent)).toEqual([
      'Venues',
      'Eventos / Promotoras',
      'Empresas',
      'Personas',
    ]);
    expect(pestanas[0]).toHaveAttribute('aria-selected', 'true');
  });
});

describe('ContactosPage — Venues', () => {
  it('pinta una tarjeta por venue, con su CTA a la derecha', () => {
    render(<ContactosPage />);
    expect(screen.getByRole('button', { name: '+ Nuevo venue' })).toHaveClass('btn-primary');
    expect(screen.getAllByRole('button', { name: /^Ficha de / })).toHaveLength(venues.length);
  });

  it('la tarjeta lleva nombre, dirección · ciudad · país y sus badges', () => {
    render(<ContactosPage />);
    const casa = screen.getByRole('button', { name: /^Ficha de Casa del Mar/ });
    expect(within(casa).getByText('Casa del Mar')).toBeInTheDocument();
    expect(
      within(casa).getByText('Two Harbors, CA 90704-2530, USA · Isla Santa Catalina · USA')
    ).toBeInTheDocument();
    expect(within(casa).getByText('Aforo 600')).toBeInTheDocument();
    expect(within(casa).queryByText(/Ubicado/)).toBeNull();
  });

  it('el aforo va ANTES que el «Ubicado», como en el live', () => {
    render(<ContactosPage />);
    const ku = screen.getByRole('button', { name: /^Ficha de Ku Barcelona/ });
    const badges = within(ku).getAllByText(/Aforo 1500|📍 Ubicado/);
    expect(badges.map((b) => b.textContent)).toEqual(['Aforo 1500', '📍 Ubicado']);
    expect(badges[0]).toHaveClass('badge', 'bg-slate-100', 'text-slate-600');
    expect(badges[1]).toHaveClass('badge', 'bg-emerald-100', 'text-emerald-700');
  });

  it('el venue sin ciudad ni país sale sólo con su dirección y sin badges', () => {
    render(<ContactosPage />);
    const fab = screen.getByRole('button', { name: /^Ficha de La Fábrica/ });
    expect(within(fab).getByText('Ruta E64km, X5151 La Calera')).toBeInTheDocument();
    expect(within(fab).queryByText(/Ubicado|Aforo/)).toBeNull();
  });

  it('el buscador global filtra los venues por ciudad', () => {
    render(<ContactosPage />);
    fireEvent.change(screen.getByPlaceholderText(BUSCADOR_GLOBAL), {
      target: { value: 'Valencia' },
    });
    expect(screen.getAllByRole('button', { name: /^Ficha de / })).toHaveLength(1);
    expect(screen.getByRole('button', { name: /Marina Beach Club/ })).toBeInTheDocument();
  });
});

describe('ContactosPage — Eventos / Promotoras', () => {
  it('lista las 23 fichas con su badge y su buscador propio', () => {
    render(<ContactosPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Eventos / Promotoras' }));

    expect(screen.getByPlaceholderText('Buscar evento o promotora…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nuevo' })).toHaveClass('btn-primary');
    const filas = screen.getAllByRole('button', { name: /^Evento / });
    expect(filas).toHaveLength(eventosPromotoras.length);
    expect(filas[0]).toHaveTextContent('After Brunch');
    expect(within(filas[0]).getByText('Evento')).toHaveClass('badge', 'bg-indigo-100');
  });

  it('su buscador propio recorta la lista', () => {
    render(<ContactosPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Eventos / Promotoras' }));
    fireEvent.change(screen.getByPlaceholderText('Buscar evento o promotora…'), {
      target: { value: 'boiler' },
    });
    expect(screen.getAllByRole('button', { name: /^Evento / })).toHaveLength(1);
  });
});

describe('ContactosPage — Empresas', () => {
  it('es el explorador del CRM, no una lista plana', () => {
    render(<ContactosPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Empresas' }));

    expect(screen.getByRole('button', { name: '+ Nueva organización' })).toBeInTheDocument();
    expect(
      screen.getByText('Busca por nombre, NIF o contacto, o usa los filtros.')
    ).toBeInTheDocument();
    expect(screen.getByText('Selecciona una organización o crea una nueva.')).toBeInTheDocument();
  });

  it('aquí el explorador va SIN su buscador propio: el de arriba es el que manda', () => {
    render(<ContactosPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Empresas' }));
    expect(screen.queryByPlaceholderText('Buscar por empresa, NIF o contacto…')).toBeNull();
    expect(screen.getByPlaceholderText(BUSCADOR_GLOBAL)).toBeInTheDocument();
  });
});

describe('ContactosPage — Personas', () => {
  it('lista las 109 con nombre, rol y email', () => {
    render(<ContactosPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Personas' }));

    expect(screen.getByRole('button', { name: '+ Nueva persona' })).toHaveClass('btn-primary');
    const filas = screen.getAllByRole('listitem');
    expect(filas).toHaveLength(personasContacto.length);
    expect(filas[0]).toHaveTextContent('Aaron Martin');
    expect(filas[0]).toHaveTextContent('Signer');
    expect(filas[0]).toHaveTextContent('visualize.label@gmail.com');
  });

  it('sólo unas pocas llevan la píldora de organización a la derecha', () => {
    render(<ContactosPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Personas' }));
    expect(screen.getByText('Casa De Mar LLC · Signer')).toBeInTheDocument();
    expect(screen.getAllByText(/·/).length).toBeGreaterThan(0);
  });

  it('el buscador global también filtra las personas', () => {
    render(<ContactosPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Personas' }));
    fireEvent.change(screen.getByPlaceholderText(BUSCADOR_GLOBAL), {
      target: { value: 'neweracap' },
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
