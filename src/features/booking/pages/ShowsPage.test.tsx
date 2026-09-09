import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { RepositoryProvider, MockRepository } from '@/repositories';
import { ShowsPage } from './ShowsPage';

function renderShows(path = '/shows') {
  return render(
    <RepositoryProvider repository={new MockRepository()}>
      <MemoryRouter initialEntries={[path]}>
        <ShowsPage />
      </MemoryRouter>
    </RepositoryProvider>
  );
}

describe('ShowsPage', () => {
  it('renderiza los 14 shows del live', async () => {
    renderShows();
    expect(await screen.findByText('C1-2026-006')).toBeInTheDocument();
    expect(screen.getByText('14 shows')).toBeInTheDocument();
    expect(screen.getByText('C1-2026-007')).toBeInTheDocument();
  });

  it('el deep-link ?status=confirmed muestra solo los shows de etapa confirmada', async () => {
    renderShows('/shows?status=confirmed');
    expect(await screen.findByText('6 shows')).toBeInTheDocument();
    expect(screen.getByText('C1-2026-006')).toBeInTheDocument();
    expect(screen.queryByText('C1-2026-012')).not.toBeInTheDocument(); // tentative queda fuera
  });

  it('el buscador filtra por artista/evento/venue', async () => {
    renderShows();
    await screen.findByText('C1-2026-006');
    fireEvent.change(screen.getByPlaceholderText('Buscar artista, evento, venue…'), {
      target: { value: 'Florentia' },
    });
    expect(screen.getByText('1 show')).toBeInTheDocument();
    expect(screen.getByText('C1-2026-014')).toBeInTheDocument();
    expect(screen.queryByText('C1-2026-006')).not.toBeInTheDocument();
  });

  it('el drawer de Filtros filtra por Fase y por Estado de pago', async () => {
    renderShows();
    await screen.findByText('C1-2026-006');
    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));
    fireEvent.change(screen.getByLabelText('Fase'), { target: { value: 'liquidado' } });
    expect(screen.getByText('2 shows')).toBeInTheDocument(); // 005 y 014
    fireEvent.change(screen.getByLabelText('Estado de pago'), {
      target: { value: 'Parcialmente abonado' },
    });
    expect(screen.getByText('1 show')).toBeInTheDocument(); // solo 005
  });

  it('deep-link ?status=confirmed pre-selecciona Etapa=Confirmado', async () => {
    renderShows('/shows?status=confirmed');
    await screen.findByText('6 shows');
    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }));
    expect((screen.getByLabelText('Etapa') as HTMLSelectElement).value).toBe('confirmed');
  });

  it('el rango por defecto muestra los 14 y "Hasta hoy" recorta a los no-futuros', async () => {
    renderShows();
    await screen.findByText('C1-2026-006');
    expect(screen.getByText('14 shows')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Última semana → Todo el futuro/ }));
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: 'hasta-hoy' } });
    // 18/18/21 jul dentro + el de fecha null; 25 jul en adelante fuera
    expect(screen.getByText('4 shows')).toBeInTheDocument();
    expect(screen.getByText('C1-2026-007')).toBeInTheDocument(); // date null se mantiene
    expect(screen.queryByText('C1-2026-014')).not.toBeInTheDocument(); // 25 jul fuera
  });
});

describe('ShowsPage — recalco de la toolbar (2026-09-09)', () => {
  it('trae el botón «Solo futuros», apagado de inicio', async () => {
    renderShows();
    const boton = await screen.findByRole('button', { name: /Solo futuros/ });
    expect(boton).toHaveAttribute('title', 'Ocultar los shows ya pasados');
    expect(boton).toHaveClass('border-slate-300', 'bg-white', 'text-slate-600');
  });

  it('pulsarlo enciende el botón, mueve el rango y recorta el contador', async () => {
    const usuario = userEvent.setup();
    renderShows();
    const boton = await screen.findByRole('button', { name: /Solo futuros/ });
    await usuario.click(boton);
    // `brand-*` tal cual: dentro de `.apx` el violeta lo pone `apx.css`.
    expect(boton).toHaveClass('border-brand-600', 'bg-brand-600', 'text-white');
    expect(
      screen.getByRole('button', { name: /Desde hoy \(solo futuros\) → Todo el futuro/ })
    ).toBeInTheDocument();
    // El contador cuenta lo filtrado: medido en el live, 87 → 70 al pulsarlo.
    expect(screen.queryByText('14 shows')).not.toBeInTheDocument();
  });

  it('vuelve a «Última semana» al apagarlo, que es el valor por defecto del live', async () => {
    const usuario = userEvent.setup();
    renderShows();
    const boton = await screen.findByRole('button', { name: /Solo futuros/ });
    await usuario.click(boton);
    await usuario.click(boton);
    expect(
      screen.getByRole('button', { name: /Última semana → Todo el futuro/ })
    ).toBeInTheDocument();
    expect(screen.getByText('14 shows')).toBeInTheDocument();
  });

  it('pinta la leyenda de estado, que son cuatro y no tres', async () => {
    renderShows();
    expect(await screen.findByText('Hecho')).toBeInTheDocument();
    expect(screen.getByText('En curso / pendiente')).toBeInTheDocument();
    expect(screen.getByText('Sin empezar')).toBeInTheDocument();
    expect(
      screen.getByText('Atención · avanzando con un requisito bloqueante sin resolver')
    ).toBeInTheDocument();
  });
});
