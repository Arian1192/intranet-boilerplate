import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import '@testing-library/jest-dom';
import { TourDetallePage } from './TourDetallePage';

const LATAM = 'c68ade2f-5f01-4686-869c-34e744cf445a';
const SPAIN = '5c5f62d8-83a3-422c-86de-733e1d8241e5';

function renderTour(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/tours/${id}`]}>
      <Routes>
        <Route path="/tours/:tourId" element={<TourDetallePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('TourDetallePage', () => {
  it('no tiene h1: el nombre de la gira es un campo editable, como en el live', () => {
    renderTour(LATAM);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('LATAM Sept 2026')).toBeInTheDocument();
  });

  it('lleva la vuelta al listado y el botón de exportar', () => {
    renderTour(LATAM);
    expect(screen.getByRole('link', { name: '← Volver a tours' })).toHaveAttribute(
      'href',
      '/tours'
    );
    expect(screen.getByRole('button', { name: 'Exportar PDF' })).toBeInTheDocument();
  });

  it('la cabecera resume shows, territorio y fecha', () => {
    renderTour(LATAM);
    expect(screen.getByText('3 shows')).toBeInTheDocument();
    expect(screen.getByText('· Latinoamérica')).toBeInTheDocument();
    expect(screen.getByText('· 17 sept 2026')).toBeInTheDocument();
  });

  it('el estado es un desplegable de cuatro opciones, no unos chips', () => {
    renderTour(LATAM);
    const select = screen.getByRole('combobox', { name: 'Estado del tour' });
    expect([...select.querySelectorAll('option')].map((o) => o.textContent)).toEqual([
      'Planificando',
      'Confirmado',
      'Cerrado',
      'Cancelado',
    ]);
    expect(select).toHaveValue('planificando');
  });

  it('pinta los cuatro KPI con las cifras exactas del live', () => {
    renderTour(LATAM);
    const resumen = screen.getByRole('group', { name: 'Resumen de la gira' });
    const kpi = (label: string) => within(resumen).getByText(label).parentElement!;
    expect(within(kpi('Neto del artista con la gira')).getByText('3520,00 US$')).toBeInTheDocument();
    expect(within(kpi('Neto del artista con la gira')).getByText('cachés netos de 3 shows')).toBeInTheDocument();
    expect(within(kpi('Margen de la agencia')).getByText('880,00 US$')).toBeInTheDocument();
    expect(within(kpi('Margen de la agencia')).getByText('booking fee 880,00 US$')).toBeInTheDocument();
    expect(within(kpi('Gastos de tour')).getByText('0,00 US$')).toBeInTheDocument();
    expect(within(kpi('Traslados')).getByText('2099 km')).toBeInTheDocument();
    expect(within(kpi('Traslados')).getByText('7.8 h en 2 tramos')).toBeInTheDocument();
  });

  it('el itinerario lista las paradas con su caché y su logística', () => {
    renderTour(LATAM);
    const itinerario = within(screen.getByRole('region', { name: 'Itinerario' }));
    expect(itinerario.getByText('18 sept')).toBeInTheDocument();
    expect(itinerario.getByRole('link', { name: /Pozos, Costa Rica/ })).toHaveAttribute(
      'href',
      '/shows/bd007a8d-328e-4a58-95fa-075e28380629'
    );
    expect(itinerario.getAllByText('1450,00 US$')).toHaveLength(2);
    expect(itinerario.getAllByRole('button', { name: '○ Vuelo' })).toHaveLength(3);
    expect(itinerario.getAllByRole('button', { name: '○ Visado' })).toHaveLength(3);
  });

  it('entre paradas pinta el tramo con km, millas, horas y hueco', () => {
    renderTour(LATAM);
    expect(screen.getByText('1055 km · 656 mi · ≈ 3.9 h')).toBeInTheDocument();
    expect(screen.getByText('· 1 día de hueco')).toBeInTheDocument();
    expect(screen.getByText('1044 km · 649 mi · ≈ 3.9 h')).toBeInTheDocument();
    expect(screen.getByText('· 7 días de hueco')).toBeInTheDocument();
  });

  it('la ruta enlaza a Google Maps con las coordenadas de las paradas', () => {
    renderTour(LATAM);
    expect(screen.getByRole('link', { name: 'Abrir en Google Maps ↗' })).toHaveAttribute(
      'href',
      'https://www.google.com/maps/dir/9.9632989,-84.1984541/6.1498368,-75.4195036/9.9324583,-84.1026894'
    );
  });

  it('el P&L detallado sale en dos bloques, artista y agencia', () => {
    renderTour(LATAM);
    expect(screen.getByText('Cachés netos (shows)')).toBeInTheDocument();
    expect(screen.getByText('− Gastos de tour (artista)')).toBeInTheDocument();
    expect(screen.getByText('Neto del artista')).toBeInTheDocument();
    expect(screen.getByText('Booking fee (shows)')).toBeInTheDocument();
    expect(screen.getByText('− Gastos de tour (agencia)')).toBeInTheDocument();
    expect(screen.getByText('Margen agencia')).toBeInTheDocument();
  });

  it('avisa del tipo de cambio sólo cuando la gira no va en euros', () => {
    const { unmount } = renderTour(LATAM);
    expect(
      screen.getByText(
        'En USD: 1 USD = 0.8583 EUR. Cachés = caché − booking fee (el management fee y los gastos de cada show se ven en su liquidación).'
      )
    ).toBeInTheDocument();
    unmount();

    renderTour(SPAIN);
    expect(screen.queryByText(/En USD/)).not.toBeInTheDocument();
  });

  it('una gira sin shows enseña los dos vacíos literales del live', () => {
    renderTour(SPAIN);
    expect(
      screen.getByText(
        'Itinerario vacío. Añade los shows del artista para ver fechas, traslados y logística.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Los shows aún no tienen coordenadas del venue (se toman de Google Places al fijar el sitio).'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('sin ruta calculada')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Abrir en Google Maps ↗' })).not.toBeInTheDocument();
  });

  it('una gira que no existe no revienta la pantalla', () => {
    renderTour('no-existe');
    expect(screen.getByText('Esta gira no existe.')).toBeInTheDocument();
  });
});
