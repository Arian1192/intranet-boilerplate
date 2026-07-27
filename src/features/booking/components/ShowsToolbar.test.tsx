import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ShowsToolbar } from './ShowsToolbar';

describe('ShowsToolbar', () => {
  it('muestra el header "Shows", el contador y el buscador', () => {
    render(
      <ShowsToolbar
        count={14}
        query=""
        onQueryChange={() => {}}
        rangoLabel="Última semana → Todo el futuro"
        onToggleRango={() => {}}
        onOpenFiltros={() => {}}
      />
    );
    expect(screen.getByRole('heading', { name: 'Shows' })).toBeInTheDocument();
    expect(screen.getByText('14 shows')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar artista, evento, venue…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filtros' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Última semana → Todo el futuro/ })).toBeInTheDocument();
  });

  it('el contador usa singular con 1 resultado y emite onQueryChange al escribir', () => {
    const onQueryChange = vi.fn();
    render(
      <ShowsToolbar
        count={1}
        query=""
        onQueryChange={onQueryChange}
        rangoLabel="Última semana → Todo el futuro"
        onToggleRango={() => {}}
        onOpenFiltros={() => {}}
      />
    );
    expect(screen.getByText('1 show')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Buscar artista, evento, venue…'), { target: { value: 'Flor' } });
    expect(onQueryChange).toHaveBeenCalledWith('Flor');
  });
});
