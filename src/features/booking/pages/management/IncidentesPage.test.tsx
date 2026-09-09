import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { IncidentesPage } from './IncidentesPage';

function renderPage() {
  render(
    <MemoryRouter>
      <IncidentesPage />
    </MemoryRouter>
  );
}

describe('IncidentesPage — cabecera', () => {
  it('calca el h1, el subtítulo dinámico y las dos acciones', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Incidentes' })).toBeInTheDocument();
    expect(screen.getByText('6 de 7 incidentes')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Analítica' })).toHaveAttribute(
      'href',
      '/management/incidentes/analitica'
    );
    expect(screen.getByRole('button', { name: '+ Incidente' })).toBeInTheDocument();
  });
});

describe('IncidentesPage — filtros guardados', () => {
  it('pinta los 8 filtros guardados más «Limpiar filtros»', () => {
    renderPage();
    for (const etiqueta of [
      'Todas (sin cerrar)',
      'Mis abiertos',
      'Sin resolver +7 días',
      'Críticos y Altos',
      'Sin asignar',
      'Este mes',
      'Preventables 90 días',
      'Recurrentes',
      'Limpiar filtros',
    ]) {
      expect(screen.getByRole('button', { name: etiqueta })).toBeInTheDocument();
    }
  });

  it('arranca con «Todas (sin cerrar)» activo', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Todas (sin cerrar)' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Mis abiertos' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('«Críticos y Altos» deja sólo la incidencia de severidad alta', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Críticos y Altos' }));
    expect(screen.getByText('1 de 7 incidentes')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('«Limpiar filtros» saca la séptima, la resuelta, y apaga los guardados', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Críticos y Altos' }));
    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    // Medido en el live: sin filtros son 7 de 7, y aparece la resuelta #4.
    expect(screen.getByText('7 de 7 incidentes')).toBeInTheDocument();
    const filas = screen.getAllByRole('row');
    expect(filas).toHaveLength(8);
    const resuelta = filas.find((f) => within(f).queryByText('#4'));
    expect(resuelta).toBeDefined();
    expect(within(resuelta!).getByText('Sadkiel')).toBeInTheDocument();
    expect(within(resuelta!).getByText('Resuelta')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Todas (sin cerrar)' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});

describe('IncidentesPage — fila de filtros', () => {
  it('trae los ocho campos del live con sus etiquetas', () => {
    renderPage();
    expect(screen.getByLabelText('Estado')).toBeInTheDocument();
    expect(screen.getByLabelText('Severidad')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoría')).toBeInTheDocument();
    expect(screen.getByLabelText('Artista')).toHaveAttribute('placeholder', 'Buscar artista…');
    expect(screen.getByLabelText('Owner')).toBeInTheDocument();
    expect(screen.getByLabelText('Desde')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Hasta')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Buscar (título / contraparte)')).toHaveAttribute(
      'placeholder',
      'Texto…'
    );
  });

  it('el select de Estado lleva las siete opciones del live', () => {
    renderPage();
    const opciones = within(screen.getByLabelText('Estado')).getAllByRole('option');
    expect(opciones.map((o) => o.textContent)).toEqual([
      'Todos',
      'Abiertos (sin resolver)',
      'Abierta',
      'En curso',
      'Bloqueada',
      'Resuelta',
      'Cerrada',
    ]);
  });

  it('el select de Categoría lleva «Todas» y las 11 categorías', () => {
    renderPage();
    const opciones = within(screen.getByLabelText('Categoría')).getAllByRole('option');
    expect(opciones).toHaveLength(12);
    expect(opciones[0]).toHaveTextContent('Todas');
    expect(opciones[4]).toHaveTextContent('Pago');
  });

  it('el select de Owner lleva «Todos» y los 19 owners', () => {
    renderPage();
    expect(within(screen.getByLabelText('Owner')).getAllByRole('option')).toHaveLength(20);
  });

  it('filtrar por severidad recorta la tabla y el subtítulo', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.selectOptions(screen.getByLabelText('Severidad'), 'alta');
    expect(screen.getByText('1 de 7 incidentes')).toBeInTheDocument();
    expect(
      screen.getByText('La pareja de Jose Fajardo se ha peleado con la novia del promotor.')
    ).toBeInTheDocument();
    expect(screen.queryByText('Flyer sin aprobar se sube')).toBeNull();
  });

  it('el buscador de texto filtra por título', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByLabelText('Buscar (título / contraparte)'), 'flyer');
    expect(screen.getByText('1 de 7 incidentes')).toBeInTheDocument();
    expect(screen.getByText('Flyer sin aprobar se sube')).toBeInTheDocument();
  });
});

describe('IncidentesPage — «+ Más filtros»', () => {
  it('empieza plegado y despliega los cinco campos extra', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.queryByLabelText('Preventable')).toBeNull();

    await user.click(screen.getByRole('button', { name: '+ Más filtros' }));

    expect(screen.getByRole('button', { name: '− Menos filtros' })).toBeInTheDocument();
    for (const etiqueta of ['Preventable', 'Escalado', 'Confidencial', 'Con relacionados']) {
      expect(screen.getByLabelText(etiqueta)).toHaveAttribute('type', 'checkbox');
    }
    expect(screen.getByLabelText('Impacto económico ≥')).toHaveAttribute('type', 'number');
  });

  it('el interruptor «Confidencial» deja sólo el flyer', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: '+ Más filtros' }));
    await user.click(screen.getByLabelText('Confidencial'));
    expect(screen.getByText('1 de 7 incidentes')).toBeInTheDocument();
    expect(screen.getByText('Flyer sin aprobar se sube')).toBeInTheDocument();
  });
});

describe('IncidentesPage — vista Tabla', () => {
  it('es la vista por defecto y pinta las ocho columnas del live', () => {
    renderPage();
    const cabeceras = screen.getAllByRole('columnheader');
    expect(cabeceras.map((c) => c.textContent)).toEqual([
      'Código',
      'Título',
      'Departamento',
      'Categoría',
      'Severidad ↓',
      'Estado',
      'Owner',
      'Edad',
    ]);
  });

  it('ordena las seis filas por severidad, como el live', () => {
    renderPage();
    const filas = screen.getAllByRole('row').slice(1);
    expect(filas).toHaveLength(6);
    expect(filas.map((f) => within(f).getAllByRole('cell')[0].textContent)).toEqual([
      '#5',
      '#9',
      '#8',
      '#7',
      '#6',
      '#2',
    ]);
  });

  it('la primera fila trae los ocho valores del live', () => {
    renderPage();
    const celdas = within(screen.getAllByRole('row')[1]).getAllByRole('cell');
    expect(celdas.map((c) => c.textContent)).toEqual([
      '#5',
      'La pareja de Jose Fajardo se ha peleado con la novia del promotor.',
      'ConceptOne (booking)',
      'Conducta del artista',
      'Alta',
      'Abierta',
      'Sin asignar',
      '37d',
    ]);
  });

  it('escribe «—» en la categoría vacía y marca la confidencial con candado', () => {
    renderPage();
    const filas = screen.getAllByRole('row').slice(1);
    expect(within(filas[1]).getAllByRole('cell')[3]).toHaveTextContent('—');
    expect(within(filas[3]).getByTitle('Confidencial')).toBeInTheDocument();
  });

  it('pinta en rojo las edades de más de 14 días', () => {
    renderPage();
    const filas = screen.getAllByRole('row').slice(1);
    expect(within(filas[0]).getByText('37d')).toHaveClass('text-rose-600');
    expect(within(filas[2]).getByText('14d')).not.toHaveClass('text-rose-600');
  });
});

describe('IncidentesPage — vista Tablero', () => {
  it('pinta las cinco columnas con su contador y «Vacío» en las que no tienen', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'tablero' }));

    expect(screen.queryByRole('table')).toBeNull();
    const columnas = screen.getAllByRole('group', { name: /columna/i });
    expect(columnas).toHaveLength(5);
    expect(within(columnas[0]).getByText('Abierta')).toBeInTheDocument();
    expect(within(columnas[0]).getByText('6')).toBeInTheDocument();
    expect(within(columnas[0]).queryByText('Vacío')).toBeNull();
    expect(within(columnas[1]).getByText('Vacío')).toBeInTheDocument();
    expect(screen.getAllByText('Vacío')).toHaveLength(4);
  });

  it('cada tarjeta lleva título, severidad, owner y edad', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'tablero' }));
    const tarjeta = screen.getByRole('button', {
      name: /La pareja de Jose Fajardo/,
    });
    expect(tarjeta).toHaveTextContent('Alta');
    expect(tarjeta).toHaveTextContent('Sin asignar');
    expect(tarjeta).toHaveTextContent('37d');
  });
});

describe('IncidentesPage — vista Timeline', () => {
  it('agrupa por mes de reporte, del más reciente al más antiguo', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'timeline' }));

    const meses = screen.getAllByRole('heading', { level: 3 });
    expect(meses.map((m) => m.textContent)).toEqual([
      'septiembre de 2026 · 1',
      'agosto de 2026 · 4',
      'julio de 2026 · 1',
    ]);
  });

  it('cada entrada lleva fecha, título, departamento y estado', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'timeline' }));
    const entrada = screen.getByRole('button', { name: /Vidaloca TIKTOK/ });
    expect(entrada).toHaveTextContent('08 sept 2026');
    expect(entrada).toHaveTextContent('ConceptOne (booking)');
    expect(entrada).toHaveTextContent('Abierta');
  });

  it('sólo aquí aparece el desplegable de Departamento, y filtra', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.queryByLabelText('Departamento')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'timeline' }));
    const departamento = screen.getByLabelText('Departamento');
    expect(within(departamento).getAllByRole('option')).toHaveLength(11);

    await user.selectOptions(departamento, 'SIGHT');
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
  });
});
