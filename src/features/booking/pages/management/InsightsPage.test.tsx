import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router';
import { InsightsPage } from './InsightsPage';
import { INSIGHTS_ROSTER } from '@/features/booking/data/management-insights';

function renderInsights() {
  return render(
    <MemoryRouter initialEntries={['/management/insights']}>
      <Routes>
        <Route path="/management/insights" element={<InsightsPage />} />
        <Route path="/management/insights/:artistaId" element={<h1>Ficha</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

const nombresVisibles = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((f) => within(f).getAllByRole('cell')[0].textContent);

describe('InsightsPage — cabecera y KPI', () => {
  it('trae el botón de sincronizar y los 4 KPI de la captura', () => {
    renderInsights();
    expect(screen.getByRole('button', { name: 'Sincronizar Songstats' })).toBeInTheDocument();
    expect(screen.getByText('674.7K')).toBeInTheDocument();
    expect(screen.getByText('59.5K')).toBeInTheDocument();
    expect(screen.getByText('escalando / creciendo')).toBeInTheDocument();
    expect(screen.getByText('declive / inactivo')).toBeInTheDocument();
  });

  it('pinta los 5 chips con su recuento: 6 / 1 / 2 / 7 / 0', () => {
    renderInsights();
    for (const [estado, cuenta] of [
      ['Escalando', '6'],
      ['Creciendo', '1'],
      ['Estable', '2'],
      ['En declive', '7'],
      ['Inactivo', '0'],
    ]) {
      expect(screen.getByRole('button', { name: `${estado} ${cuenta}` })).toBeInTheDocument();
    }
  });

  it('el contador es el del live y no cambia al filtrar', async () => {
    const usuario = userEvent.setup();
    renderInsights();
    expect(screen.getByText('17 con datos · 17 artistas')).toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Escalando 6' }));
    expect(screen.getByText('17 con datos · 17 artistas')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(7); // 6 + cabecera
  });
});

describe('InsightsPage — la tabla', () => {
  it('lista los 17 artistas ordenados por oyentes descendente', () => {
    renderInsights();
    expect(INSIGHTS_ROSTER).toHaveLength(17);
    expect(nombresVisibles().slice(0, 3)).toEqual(['Janse', 'Londonground', 'DH Moon']);
  });

  it('marca la columna ordenada con la flecha, sin violeta a pelo', () => {
    renderInsights();
    const oyentes = screen.getByRole('columnheader', { name: /Oyentes/ });
    const flecha = within(oyentes).getByText('▼');
    expect(flecha).toHaveStyle({ color: 'var(--accent)' });
  });

  it('el texto ordena ascendente al primer clic y los números descendente', async () => {
    const usuario = userEvent.setup();
    renderInsights();
    await usuario.click(screen.getByRole('columnheader', { name: /Artista/ }));
    expect(nombresVisibles().slice(0, 3)).toEqual(['Aaron Martin', 'Abdon', 'ART NO LOGIA']);
    await usuario.click(screen.getByRole('columnheader', { name: /Artista/ }));
    expect(nombresVisibles()[0]).toBe('Vidaloca');

    await usuario.click(screen.getByRole('columnheader', { name: /TikTok/ }));
    expect(nombresVisibles().slice(0, 2)).toEqual(['Tony Guerra', 'Gaston Zani']);
  });

  it('la columna Estado sigue el orden medido en el live, no el alfabético', async () => {
    const usuario = userEvent.setup();
    renderInsights();
    await usuario.click(screen.getByRole('columnheader', { name: /Estado/ }));
    expect(nombresVisibles().slice(0, 4)).toEqual([
      'Aaron Martin',
      'Abdon',
      'ART NO LOGIA',
      'Freddy Bello',
    ]);
    await usuario.click(screen.getByRole('columnheader', { name: /Estado/ }));
    expect(nombresVisibles().slice(0, 2)).toEqual(['Sebastian Ledher', 'Bizza']);
  });

  it('el artista sin histórico va sin sparkline y con guiones', () => {
    renderInsights();
    const fila = screen
      .getByRole('cell', { name: 'Sebastian Ledher' })
      .closest('tr') as HTMLElement;
    expect(fila.querySelector('svg')).toBeNull();
    expect(within(fila).getByText('Sin datos')).toBeInTheDocument();
    expect(within(fila).getAllByText('—')).toHaveLength(6);
  });

  it('el buscador filtra por nombre', async () => {
    const usuario = userEvent.setup();
    renderInsights();
    await usuario.type(screen.getByPlaceholderText('Buscar artista…'), 'bizz');
    expect(nombresVisibles()).toEqual(['Bizza']);
  });
});

describe('InsightsPage — la promesa del pie', () => {
  it('pulsar una fila lleva a la ficha del artista', async () => {
    const usuario = userEvent.setup();
    renderInsights();
    expect(screen.getByText(/Pulsa un artista para su ficha completa/)).toBeInTheDocument();
    await usuario.click(screen.getByRole('cell', { name: 'Janse' }));
    expect(screen.getByRole('heading', { name: 'Ficha' })).toBeInTheDocument();
  });
});
