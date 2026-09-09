import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { AppRouter } from './router';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRouter />
    </MemoryRouter>
  );
}

describe('rutas de ConceptOne v3 — las que ya teníamos', () => {
  it.each([
    ['/ofertas', 'Ofertas entrantes'],
    ['/cobros', 'Cobros'],
    ['/gastos', 'Gastos'],
    ['/management/estrategias', 'Estrategias · Management'],
  ])('%s renderiza la pantalla %s dentro de la carcasa', async (path, heading) => {
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ConceptOne' })).toBeInTheDocument();
  });
});

describe('rutas de ConceptOne v3 — las 14 nuevas', () => {
  it.each([
    ['/tours', 'Tours'],
    ['/liquidaciones', 'Liquidaciones'],
    ['/conceptone/pendientes', 'Pendientes'],
    ['/management/roster', 'Roster de Management'],
    ['/management/insights', 'Insights'],
    ['/management/contratos', 'Contratos'],
    ['/management/activaciones', 'Activaciones'],
    ['/management/campanas', 'Campañas'],
    ['/management/content', 'Content'],
    ['/management/incidentes', 'Incidentes'],
    ['/management/incidentes/analitica', 'Analítica de incidentes'],
    ['/artistas', 'Artistas'],
    ['/reporte', 'Analítica'],
    ['/conceptone/ajustes', 'Ajustes de ConceptOne'],
  ])('%s está registrada y pinta el h1 «%s» dentro de la carcasa', async (path, heading) => {
    const { container } = renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(container.querySelector('.apx-side')).toBeInTheDocument();
  });

  it.each([
    ['/tours', 'viabilidad económica'],
    ['/liquidaciones', 'cobros del promotor'],
    ['/conceptone/pendientes', 'arte por aprobar'],
    ['/management/roster', 'Songstats'],
    ['/management/insights', 'nada se introduce a mano'],
    ['/management/contratos', 'preaviso'],
    ['/management/activaciones', 'rodajes'],
    ['/management/campanas', 'Inversión en marketing por canal'],
    ['/management/content', 'del brief a la entrega'],
    ['/management/incidentes/analitica', 'impacto económico'],
    ['/reporte', 'Importes en EUR'],
    ['/conceptone/ajustes', 'espacio de booking'],
  ])('%s trae la bajada del live', async (path, trozo) => {
    renderAt(path);
    expect(await screen.findByText(new RegExp(trozo))).toBeInTheDocument();
  });
});
