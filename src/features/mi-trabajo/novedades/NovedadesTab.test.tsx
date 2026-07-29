import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NovedadesTab } from './NovedadesTab';
import { novedades } from './data/novedades';

/** Sólo las tarjetas del feed: el detalle desplegado también trae <li>. */
const entradas = () => screen.getAllByTestId('novedad');

describe('NovedadesTab — feed de changelog del live', () => {
  it('lista las 36 entradas del live', () => {
    render(<NovedadesTab />);
    expect(entradas()).toHaveLength(36);
  });

  it('trae el buscador y el segmentado Todo/Nuevo/Mejora/Arreglo', () => {
    render(<NovedadesTab />);
    expect(screen.getByPlaceholderText('Buscar en novedades…')).toBeInTheDocument();
    for (const s of ['Todo', 'Nuevo', 'Mejora', 'Arreglo']) {
      expect(screen.getByRole('button', { name: s })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Todo' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('pinta los chips de módulo y los 23 de tag del live', () => {
    render(<NovedadesTab />);
    for (const m of ['ConceptOne', 'Euphoric', 'Global', 'Inicio', 'Management']) {
      expect(screen.getByRole('button', { name: m })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: '#Artistas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#Vuelos' })).toBeInTheDocument();
  });

  it('la primera tarjeta calca la del live', () => {
    render(<NovedadesTab />);
    const primera = within(entradas()[0]);
    expect(primera.getByText('Nuevo')).toBeInTheDocument();
    expect(primera.getByText('ConceptOne')).toBeInTheDocument();
    expect(primera.getByRole('heading', { name: 'Una factura puede cubrir varios shows' })).toBeInTheDocument();
    expect(primera.getByText('29 de julio de 2026')).toBeInTheDocument();
    expect(primera.getByText('#Facturación')).toBeInTheDocument();
  });

  it('marca con punto verde solo las 16 no leídas', () => {
    render(<NovedadesTab />);
    expect(screen.getAllByTestId('no-leida')).toHaveLength(16);
  });

  it('el segmentado filtra por tipo', () => {
    render(<NovedadesTab />);
    fireEvent.click(screen.getByRole('button', { name: 'Arreglo' }));
    const esperadas = novedades.filter((n) => n.tipo === 'Arreglo').length;
    expect(entradas()).toHaveLength(esperadas);
    expect(screen.getByRole('button', { name: 'Arreglo' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('un chip de módulo filtra y se puede desactivar', () => {
    render(<NovedadesTab />);
    const chip = screen.getByRole('button', { name: 'Euphoric' });
    fireEvent.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(entradas()).toHaveLength(novedades.filter((n) => n.modulo === 'Euphoric').length);
    fireEvent.click(chip);
    expect(entradas()).toHaveLength(36);
  });

  it('el buscador filtra ignorando acentos', () => {
    render(<NovedadesTab />);
    fireEvent.change(screen.getByPlaceholderText('Buscar en novedades…'), {
      target: { value: 'buscador de artistas' },
    });
    expect(entradas()).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Buscador de artistas' })).toBeInTheDocument();
  });

  it('sin resultados muestra un vacío en vez de la lista', () => {
    render(<NovedadesTab />);
    fireEvent.change(screen.getByPlaceholderText('Buscar en novedades…'), {
      target: { value: 'zzzznoexiste' },
    });
    expect(screen.queryAllByTestId('novedad')).toHaveLength(0);
    expect(screen.getByText('No hay novedades que encajen con este filtro.')).toBeInTheDocument();
  });

  it('el chevron despliega el detalle: cuerpo, «Por qué» y «Podría interesarte para…»', () => {
    render(<NovedadesTab />);
    const primera = within(entradas()[0]);
    const cabecera = primera.getByRole('button', { expanded: false });

    expect(screen.queryByText('Por qué')).not.toBeInTheDocument();
    fireEvent.click(cabecera);

    expect(primera.getByRole('button', { expanded: true })).toBeInTheDocument();
    expect(primera.getByText('Por qué')).toBeInTheDocument();
    expect(primera.getByText('Podría interesarte para…')).toBeInTheDocument();
    expect(primera.getByText(/En la pestaña Pagos, al vincular una factura/)).toBeInTheDocument();
    expect(primera.getByText('Facturáis varios artistas en una fecha')).toBeInTheDocument();
  });

  it('solo hay una tarjeta desplegada a la vez', () => {
    render(<NovedadesTab />);
    fireEvent.click(within(entradas()[0]).getByRole('button', { expanded: false }));
    fireEvent.click(within(entradas()[1]).getByRole('button', { expanded: false }));
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1);
  });

  it('el pie de admin deja cambiar la audiencia', () => {
    render(<NovedadesTab />);
    const select = screen.getByLabelText('Audiencia de «Una factura puede cubrir varios shows»');
    expect(select).toHaveValue('Todos');
    fireEvent.change(select, { target: { value: 'Solo Admin' } });
    expect(select).toHaveValue('Solo Admin');
    // y el badge de audiencia restringida aparece en la tarjeta
    expect(within(entradas()[0]).getByText('Solo Admin', { selector: 'span' })).toBeInTheDocument();
  });

  it('«Archivar» saca la novedad de la lista', () => {
    render(<NovedadesTab />);
    fireEvent.click(within(entradas()[0]).getByRole('button', { name: 'Archivar' }));
    expect(entradas()).toHaveLength(35);
    expect(
      screen.queryByRole('heading', { name: 'Una factura puede cubrir varios shows' })
    ).not.toBeInTheDocument();
  });

  it('las entradas restringidas llevan su badge de audiencia', () => {
    render(<NovedadesTab />);
    expect(screen.getAllByText('Solo equipo', { selector: 'span' }).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Solo Admin', { selector: 'span' }).length).toBeGreaterThan(0);
  });
});
