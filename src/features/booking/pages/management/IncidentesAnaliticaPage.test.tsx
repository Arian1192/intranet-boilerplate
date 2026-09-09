import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { IncidentesAnaliticaPage } from './IncidentesAnaliticaPage';

/**
 * Lo que el live escribe con `&nbsp;` antes del €. Testing Library normaliza el
 * espacio duro al consultar, así que las búsquedas van con espacio normal y el
 * byte se comprueba aparte, sobre el `textContent` crudo.
 */
const CERO_EUROS = '0,00 €';
const CERO_EUROS_CRUDO = '0,00\u00a0€';

function renderPage() {
  render(
    <MemoryRouter>
      <IncidentesAnaliticaPage />
    </MemoryRouter>
  );
}

describe('IncidentesAnaliticaPage — cabecera', () => {
  it('calca la vuelta, el h1 y la bajada', () => {
    renderPage();
    expect(screen.getByRole('link', { name: '← Volver al panel de incidentes' })).toHaveAttribute(
      'href',
      '/management/incidentes'
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Analítica de incidentes' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Patrones, tiempos de resolución, impacto económico y calidad del reporte.')
    ).toBeInTheDocument();
  });

  it('trae el rango de fechas', () => {
    renderPage();
    expect(screen.getByLabelText('Desde')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Hasta')).toHaveAttribute('type', 'date');
  });

  it('pinta los cuatro KPI con su pie', () => {
    renderPage();
    const kpis = screen.getAllByRole('group', { name: /^KPI/ });
    expect(kpis).toHaveLength(4);
    expect(kpis[0]).toHaveTextContent('Incidentes (rango)');
    expect(kpis[0]).toHaveTextContent('de 7 totales');
    expect(kpis[1]).toHaveTextContent('3 d');
    expect(kpis[2]).toHaveTextContent('1 de 1 con dato');
    expect(kpis[3]).toHaveTextContent(CERO_EUROS);
    expect(kpis[3].textContent).toContain(CERO_EUROS_CRUDO);
  });
});

describe('IncidentesAnaliticaPage — los diez bloques', () => {
  it('están todos, en el orden del live', () => {
    renderPage();
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Impacto económico',
      'Incidentes por categoría',
      'Incidentes por departamento',
      'Incidentes por mes (fecha de reporte)',
      'Resolución media por severidad',
      'Resolución media por departamento',
      'Preventables vs no preventables',
      'Counterparties recurrentes',
      'Abiertos con más de 14 días',
      'Lag medio de reporte por departamento',
    ]);
  });
});

describe('IncidentesAnaliticaPage — impacto económico', () => {
  it('pinta las cinco cifras a cero con el espacio duro del live', () => {
    renderPage();
    const cifras = screen.getAllByText(CERO_EUROS);
    expect(cifras).toHaveLength(5);
    for (const cifra of cifras) {
      expect(cifra.textContent).toBe(CERO_EUROS_CRUDO);
    }
    for (const etiqueta of ['Coste incurrido', 'Ingreso perdido', 'Recuperado']) {
      expect(screen.getByText(etiqueta)).toBeInTheDocument();
    }
    // «Neto» sale tres veces: la cifra y la última columna de las dos tablas.
    expect(screen.getAllByText('Neto')).toHaveLength(3);
  });

  it('sus dos tablas están vacías, con el literal del live', () => {
    renderPage();
    const vacios = screen.getAllByText('Sin impacto registrado.');
    expect(vacios).toHaveLength(2);
    expect(vacios[0].closest('td')).toHaveAttribute('colspan', '5');
    expect(screen.getByText('Por categoría')).toBeInTheDocument();
    expect(screen.getByText('Por departamento')).toBeInTheDocument();
  });

  it('las dos tablas llevan las cabeceras Coste/Perdido/Recup./Neto', () => {
    renderPage();
    const tablas = screen.getAllByRole('table');
    expect(tablas).toHaveLength(2);
    for (const tabla of tablas) {
      expect(
        within(tabla)
          .getAllByRole('columnheader')
          .map((c) => c.textContent)
      ).toEqual(['', 'Coste', 'Perdido', 'Recup.', 'Neto']);
    }
  });
});

describe('IncidentesAnaliticaPage — recuentos', () => {
  it('reparte las 7 incidencias por categoría', () => {
    renderPage();
    const bloque = screen.getByRole('region', { name: 'Incidentes por categoría' });
    expect(within(bloque).getByText('Sin categoría')).toBeInTheDocument();
    expect(within(bloque).getByText('3')).toBeInTheDocument();
    expect(within(bloque).getByText('Pago')).toBeInTheDocument();
    expect(within(bloque).getByText('2')).toBeInTheDocument();
    expect(within(bloque).getAllByText('1')).toHaveLength(2);
  });

  it('pone las 7 en ConceptOne (booking)', () => {
    renderPage();
    const bloque = screen.getByRole('region', { name: 'Incidentes por departamento' });
    expect(within(bloque).getByText('ConceptOne (booking)')).toBeInTheDocument();
    expect(within(bloque).getByText('7')).toBeInTheDocument();
  });

  it('el gráfico por mes lleva los tres meses y el eje hasta 8', () => {
    renderPage();
    const bloque = screen.getByRole('region', { name: 'Incidentes por mes (fecha de reporte)' });
    for (const mes of ['jul 26', 'ago 26', 'sep 26']) {
      expect(within(bloque).getByText(mes)).toBeInTheDocument();
    }
    for (const tick of ['0', '2', '4', '6', '8']) {
      expect(within(bloque).getByText(tick)).toBeInTheDocument();
    }
  });
});

describe('IncidentesAnaliticaPage — resolución y preventables', () => {
  it('escribe «—» en las severidades sin casos', () => {
    renderPage();
    const bloque = screen.getByRole('region', { name: 'Resolución media por severidad' });
    expect(within(bloque).getAllByText('—')).toHaveLength(3);
    expect(within(bloque).getByText('3 d')).toBeInTheDocument();
    expect(within(bloque).getAllByText('(0)')).toHaveLength(3);
    expect(within(bloque).getByText('(1)')).toBeInTheDocument();
  });

  it('cuenta el 100% de preventables sobre un clasificado', () => {
    renderPage();
    const bloque = screen.getByRole('region', { name: 'Preventables vs no preventables' });
    expect(bloque).toHaveTextContent('100% de 1 clasificados eran evitables.');
    expect(within(bloque).getByText('ago 26')).toBeInTheDocument();
    // «100%» sale dos veces: en la bajada y como marca de arriba del eje.
    expect(within(bloque).getAllByText('100%')).toHaveLength(2);
  });
});

describe('IncidentesAnaliticaPage — colas y counterparties', () => {
  it('lista las dos counterparties con su tipo', () => {
    renderPage();
    const bloque = screen.getByRole('region', { name: 'Counterparties recurrentes' });
    expect(bloque).toHaveTextContent('Marina Beach Club · Venue');
    expect(bloque).toHaveTextContent('Joe Coe · Staff');
  });

  it('lista la cola de abiertos por owner, con su badge y sus días', () => {
    renderPage();
    const bloque = screen.getByRole('region', { name: 'Abiertos con más de 14 días' });
    expect(bloque).toHaveTextContent('Cola viva, por owner. Ignora el filtro de fechas.');
    expect(within(bloque).getByText('Sin owner')).toBeInTheDocument();
    expect(within(bloque).getByText('4')).toBeInTheDocument();
    const filas = within(bloque).getAllByRole('listitem');
    expect(filas).toHaveLength(4);
    expect(filas[0]).toHaveTextContent('#2');
    expect(filas[0]).toHaveTextContent('46 d');
    expect(filas[3]).toHaveTextContent('29 d');
  });

  it('cierra con el lag medio de reporte', () => {
    renderPage();
    const bloque = screen.getByRole('region', {
      name: 'Lag medio de reporte por departamento',
    });
    expect(bloque).toHaveTextContent('Días entre que ocurre y que se reporta.');
    expect(within(bloque).getByText('0 d')).toBeInTheDocument();
    expect(within(bloque).getByText('(3)')).toBeInTheDocument();
  });
});
