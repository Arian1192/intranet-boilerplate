import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MiEspacioPage, PESTANAS } from './MiEspacioPage';

// Aísla BlockNote: la pestaña Documentos monta el editor de la Fase 7.
vi.mock('@blocknote/react', () => ({ useCreateBlockNote: () => ({}) }));
vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => <div data-testid="bn-canvas" /> }));

const tablist = () => screen.getByRole('tablist', { name: 'Secciones de Mi trabajo' });
const tab = (name: string) => within(tablist()).getByRole('tab', { name: new RegExp(name) });

describe('MiEspacioPage — conmutador de 4 pestañas', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 29, 9, 0));
  });
  afterEach(() => vi.useRealTimers());

  it('saluda al usuario según la hora, con el nombre de pila', () => {
    render(<MiEspacioPage usuario="Test User" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Buenos días, Test');
  });

  it('muestra las 4 pestañas del live en orden', () => {
    render(<MiEspacioPage usuario="Test" />);
    const nombres = within(tablist())
      .getAllByRole('tab')
      .map((b) => b.textContent);
    expect(nombres).toEqual([...PESTANAS]);
  });

  it('aterriza en Pendientes, no en el editor', () => {
    render(<MiEspacioPage usuario="Test" />);
    expect(tab('Pendientes')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
    // el editor de documentos NO se monta de entrada
    expect(screen.queryByTestId('bn-canvas')).not.toBeInTheDocument();
  });

  it('marca Novedades con el punto verde de aviso', () => {
    render(<MiEspacioPage usuario="Test" />);
    expect(within(tab('Novedades')).getByTestId('novedades-dot')).toBeInTheDocument();
  });

  it('cambia a Mis creatividades y muestra su cabecera y su vacío', () => {
    render(<MiEspacioPage usuario="Test" />);
    fireEvent.click(tab('Mis creatividades'));
    expect(tab('Mis creatividades')).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByText(
        'Tus creatividades por fecha de entrega. El color marca lo cerca que está el deadline.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('No tienes creatividades asignadas ahora mismo.')).toBeInTheDocument();
  });

  it('el botón «+ Nueva tarea» solo vive en Pendientes', () => {
    render(<MiEspacioPage usuario="Test" />);
    expect(screen.getByRole('button', { name: '+ Nueva tarea' })).toBeInTheDocument();
    fireEvent.click(tab('Mis creatividades'));
    expect(screen.queryByRole('button', { name: '+ Nueva tarea' })).not.toBeInTheDocument();
  });

  it('solo hay una pestaña activa a la vez', () => {
    render(<MiEspacioPage usuario="Test" />);
    fireEvent.click(tab('Novedades'));
    const activas = within(tablist())
      .getAllByRole('tab')
      .filter((b) => b.getAttribute('aria-selected') === 'true');
    expect(activas).toHaveLength(1);
    expect(activas[0]).toHaveTextContent('Novedades');
  });
});
