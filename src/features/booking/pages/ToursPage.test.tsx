import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom';
import { ToursPage } from './ToursPage';

function renderPage() {
  return render(
    <MemoryRouter>
      <ToursPage />
    </MemoryRouter>
  );
}

describe('ToursPage', () => {
  it('calca cabecera, bajada y CTA del live', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Tours' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Agrupa shows de un artista en una gira: viabilidad económica (P&L), gastos de tour (vuelos, hospedaje, per diems) y agenda de promo.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nuevo tour' })).toBeInTheDocument();
  });

  it('lista las tres giras del live, en orden', () => {
    renderPage();
    const tarjetas = screen.getAllByRole('link');
    expect(tarjetas.map((t) => within(t).getByRole('heading', { level: 2 }).textContent)).toEqual([
      'Spain Sept 2026',
      'LATAM Sept 2026',
      'ART NO LOGIA Sept 2026',
    ]);
  });

  it('cada tarjeta enlaza a /tours/:tourId con el UUID del live', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /LATAM Sept 2026/ })).toHaveAttribute(
      'href',
      '/tours/c68ade2f-5f01-4686-869c-34e744cf445a'
    );
  });

  it('cada tarjeta lleva estado, artista, territorio, fechas y número de shows', () => {
    renderPage();
    const spain = screen.getByRole('link', { name: /Spain Sept 2026/ });
    expect(within(spain).getByText('Planificando')).toBeInTheDocument();
    expect(
      within(spain).getByText('Milan Torne · Spain · 30 oct 2026 → 11 nov 2026')
    ).toBeInTheDocument();
    expect(within(spain).getByText('0 shows')).toBeInTheDocument();

    const artnologia = screen.getByRole('link', { name: /ART NO LOGIA Sept 2026/ });
    // Esta gira no tiene fechas en el live: el subtítulo se queda sin el tramo final.
    expect(within(artnologia).getByText('ART NO LOGIA · Latinoamérica')).toBeInTheDocument();
    expect(within(artnologia).getByText('3 shows')).toBeInTheDocument();
  });
});
