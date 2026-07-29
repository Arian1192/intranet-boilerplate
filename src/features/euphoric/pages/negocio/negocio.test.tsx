import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { DireccionPage } from './DireccionPage';
import { PipelinePage } from './PipelinePage';
import { PresupuestosPage } from './PresupuestosPage';
import { TiemposPage } from './TiemposPage';

afterEach(cleanup);

function renderPage(page: React.ReactNode) {
  render(<MemoryRouter>{page}</MemoryRouter>);
}

describe('Negocio · Dirección (calco del live 2026-07-29)', () => {
  test('los 9 indicadores del live con sus pies', () => {
    renderPage(<DireccionPage />);
    const kpis = screen.getByRole('region', { name: 'Indicadores de dirección' });
    const kpi = (label: string) => within(kpis).getByText(label).closest('div') as HTMLElement;
    expect(within(kpi('FACTURACIÓN MENSUAL (MRR)')).getByText('2800,00 €')).toBeInTheDocument();
    expect(within(kpi('BENEFICIO ESTIMADO')).getByText('Coste horas 0,00 €')).toBeInTheDocument();
    expect(within(kpi('CLIENTES ACTIVOS')).getByText('de 3 cuentas')).toBeInTheDocument();
    expect(within(kpi('LEADS EN PIPELINE')).getByText('Forecast 115,00 €')).toBeInTheDocument();
    expect(within(kpi('HORAS DEL MES')).getByText('0.0 h')).toBeInTheDocument();
    expect(within(kpis).getByText('CAMPAÑAS ACTIVAS')).toBeInTheDocument();
    expect(within(kpis).getByText('CAMPAÑAS PENDIENTES')).toBeInTheDocument();
    expect(within(kpi('COBROS PENDIENTES')).getByText('pendiente / retraso')).toBeInTheDocument();
    expect(within(kpis).getByText('INCIDENCIAS ABIERTAS')).toBeInTheDocument();
  });

  test('carga del equipo y coste por departamento', () => {
    renderPage(<DireccionPage />);
    expect(screen.getByRole('heading', { name: /Carga del equipo/ })).toBeInTheDocument();
    expect(screen.getByText('Alba G')).toBeInTheDocument();
    expect(screen.getAllByText('2 h/mes · 25,00 €')).toHaveLength(2); // persona y departamento
    expect(
      screen.getByText(
        'Carga sobre una jornada de referencia de 160 h/mes. Suma la dedicación de todos los servicios activos.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  test('salud de la cartera y alertas', () => {
    renderPage(<DireccionPage />);
    const health = screen.getByRole('region', { name: 'Salud de la cartera' });
    expect(within(health).getByText('2')).toBeInTheDocument();
    expect(within(health).getByText('Toda la cartera está sana.')).toBeInTheDocument();
    const alerts = screen.getByRole('region', { name: 'Alertas' });
    expect(within(alerts).getByText('Opium Bcn')).toBeInTheDocument();
    expect(within(alerts).getByText('Sin publicaciones en los próximos 7 días')).toBeInTheDocument();
    expect(within(alerts).getByText('Contenido faltante')).toBeInTheDocument();
  });
});

describe('Negocio · Pipeline (calco del live 2026-07-29)', () => {
  test('totales del pipeline', () => {
    renderPage(<PipelinePage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Pipeline · Euphoric' })).toBeInTheDocument();
    expect(
      screen.getByText('Oportunidades comerciales en curso. Arrastra un lead a Activo cuando cierres.')
    ).toBeInTheDocument();
    const valorTotal = screen.getByText('VALOR TOTAL').closest('div') as HTMLElement;
    expect(within(valorTotal).getByText('1150,00 €')).toBeInTheDocument();
    expect(screen.getByText('Σ valor × probabilidad')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nuevo lead' })).toBeInTheDocument();
  });

  test('las 3 columnas por temperatura con el lead de Mogli', () => {
    renderPage(<PipelinePage />);
    const board = screen.getByRole('region', { name: 'Tablero de leads' });
    expect(within(board).getByText('Frío · <30%')).toBeInTheDocument();
    expect(within(board).getByText('Templado · 30–70%')).toBeInTheDocument();
    expect(within(board).getByText('Caliente · >70%')).toBeInTheDocument();
    expect(within(board).getAllByText('Sin leads')).toHaveLength(2);

    const card = within(board).getByText('Mogli Marbella').closest('div')?.parentElement as HTMLElement;
    expect(within(card).getByText('10%')).toBeInTheDocument();
    expect(within(card).getByText('1150,00 €')).toBeInTheDocument();
    expect(within(card).getByText('≈ 115,00 €')).toBeInTheDocument();
    expect(within(card).getByText('01 mar 2027')).toBeInTheDocument();
    expect(within(board).getByRole('button', { name: '→ Convertir a Activo' })).toBeInTheDocument();
  });
});

describe('Negocio · Presupuestos (calco del live 2026-07-29)', () => {
  test('las 3 sub-vistas del live', () => {
    renderPage(<PresupuestosPage />);
    const tabs = screen.getByRole('group', { name: 'Vistas de presupuestos' });
    expect(within(tabs).getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Presupuestos',
      'Catálogo',
      'Plantillas',
    ]);
    expect(screen.getByText('Sin presupuestos.')).toBeInTheDocument();
    expect(screen.getByText('Selecciona un presupuesto o crea uno nuevo.')).toBeInTheDocument();
  });

  test('el catálogo trae el Pack 10 Diseños con su margen', () => {
    renderPage(<PresupuestosPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Catálogo' }));
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((c) => c.textContent)).toEqual([
      'SERVICIO',
      'UNIDAD',
      'TARIFA EST.',
      'MÍNIMA',
      'COSTE',
      'MARGEN',
    ]);
    expect(within(table).getByText(/Pack 10 Diseños/)).toBeInTheDocument();
    expect(within(table).getByText('10 creativ./mes · extra 75,00 €')).toBeInTheDocument();
    expect(within(table).getByText('1000,00 € · 100%')).toBeInTheDocument();
  });

  test('plantillas está vacío', () => {
    renderPage(<PresupuestosPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Plantillas' }));
    expect(screen.getByRole('button', { name: '+ Nueva plantilla' })).toBeInTheDocument();
    expect(screen.getByText('Sin plantillas.')).toBeInTheDocument();
  });
});

describe('Negocio · Tiempos (calco del live 2026-07-29)', () => {
  test('tiempo medio por fase', () => {
    renderPage(<TiemposPage />);
    expect(screen.getByText('TIEMPO MEDIO POR FASE')).toBeInTheDocument();
    const phases = screen.getByRole('region', { name: 'Tiempo medio por fase' });
    expect(within(phases).getByText('Briefing')).toBeInTheDocument();
    expect(within(phases).getByText('2.0 d')).toBeInTheDocument();
    expect(within(phases).getByText('3 veces')).toBeInTheDocument();
    expect(within(phases).getByText('0 min')).toBeInTheDocument();
  });

  test('parado ahora, ordenado de más a menos tiempo', () => {
    renderPage(<TiemposPage />);
    const stalled = screen.getByRole('region', { name: 'Parado ahora' });
    const rows = within(stalled).getAllByRole('listitem');
    expect(rows).toHaveLength(15);
    expect(rows[0].textContent).toContain('Video Promo 26/07');
    expect(rows[0].textContent).toContain('Publicación · Idea · SIGHT');
    expect(rows[0].textContent).toContain('6.8 d');
  });

  test('el filtro Creatividad deja solo las creatividades', () => {
    renderPage(<TiemposPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Creatividad' }));
    const stalled = screen.getByRole('region', { name: 'Parado ahora' });
    const rows = within(stalled).getAllByRole('listitem');
    expect(rows).toHaveLength(7);
    rows.forEach((row) => expect(row.textContent).toContain('Creatividad ·'));
  });
});
