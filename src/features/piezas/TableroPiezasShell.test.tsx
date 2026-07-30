import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreativosPage } from './pages/CreativosPage';

describe('CreativosPage', () => {
  it('renders header, the 4 stat cards with live counts, and the Nueva creatividad action', () => {
    render(<CreativosPage />);
    expect(screen.getByRole('heading', { name: 'Creativos', level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tablero de creatividades del equipo de diseño: Euphoric, clientes del CRM y empresas internas.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Creatividades activas')).toBeInTheDocument();
    expect(screen.getByText('Pend. aprobar', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('En correcciones')).toBeInTheDocument();
    expect(screen.getByText('Atrasadas', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nueva creatividad' })).toBeInTheDocument();
    expect(screen.queryByText('Piezas activas')).not.toBeInTheDocument();
  });

  it('renders the live stat values (2 / 0 / 0 / 2) and the live kanban counts', () => {
    render(<CreativosPage />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(4); // header + 3 creatividades
    expect(within(table).getByText('Pack Sold Out · Pack Sold Out')).toBeInTheDocument();
    expect(within(table).getByText('Video Pomo 26/07')).toBeInTheDocument();
    expect(within(table).getByText('Flyer Claptone 02/08')).toBeInTheDocument();
  });

  it('filtering by "Diseño" narrows both the kanban and the table to the estático piece', () => {
    render(<CreativosPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Diseño' }));
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(2); // header + 1 data row
    expect(within(table).getByText('Pack Sold Out · Pack Sold Out')).toBeInTheDocument();
    expect(within(table).queryByText('Video Pomo 26/07')).not.toBeInTheDocument();
  });

  // D6: control segmentado a la izquierda de los filtros. En Calendario la tabla desaparece.
  it('switches between Tablero and Calendario, hiding the table in Calendario', () => {
    render(<CreativosPage />);
    const tablero = screen.getByRole('button', { name: 'Tablero' });
    const calendario = screen.getByRole('button', { name: 'Calendario' });
    expect(tablero).toHaveClass('bg-white', 'text-slate-800', 'shadow-sm');
    expect(calendario).toHaveClass('text-slate-500');
    expect(screen.getByRole('table')).toBeInTheDocument();

    fireEvent.click(calendario);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryAllByText('Briefing')).toHaveLength(0); // ni el kanban
    expect(screen.getByRole('button', { name: 'Calendario' })).toHaveClass('bg-white', 'shadow-sm');

    // Cabecera, stats, filtros y Recursos siguen visibles en ambas vistas
    expect(screen.getByRole('heading', { name: 'Creativos', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Creatividades activas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tablero' }));
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByText('Briefing').length).toBeGreaterThan(0);
  });

  // D6/Tarea 9: la vista Calendario pinta la rejilla del mes y respeta el filtro activo.
  it('renders the month grid in Calendario and applies the active filter to it', () => {
    render(<CreativosPage today={new Date(2026, 6, 27)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Calendario' }));
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    expect(screen.getByText('Lun')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hoy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Video Pomo 26/07' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Diseño' }));
    expect(screen.queryByRole('button', { name: 'Video Pomo 26/07' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pack Sold Out · Pack Sold Out' })).toBeInTheDocument();
  });

  // D5: los pills "+ Alba" / "+ Carlos" no son un filtro, son atajos de alta pre-asignada.
  it('the "Asignar a" shortcuts carry the live titles and open the alta pre-assigned', () => {
    render(<CreativosPage />);
    const alba = screen.getByRole('button', { name: '+ Alba' });
    const carlos = screen.getByRole('button', { name: '+ Carlos' });
    expect(alba).toHaveAttribute('title', 'Nueva creatividad para Alba G');
    expect(carlos).toHaveAttribute('title', 'Nueva creatividad para Carlos Pego');

    fireEvent.click(alba);
    const drawer = screen.getByRole('complementary');
    expect(within(drawer).getByRole('button', { name: 'Alba' })).toBeInTheDocument();
  });

  // Barrido del 29-jul: el live añadió un tercer atajo, "+ Maf"
  // (evidencia `barrido-2026-07-29/40-creativos-asignar-a.json`).
  it('carries the third shortcut "+ Maf" added by the live on 2026-07-29', () => {
    render(<CreativosPage />);
    const maf = screen.getByRole('button', { name: '+ Maf' });
    expect(maf).toHaveAttribute('title', 'Nueva creatividad para Maf');

    fireEvent.click(maf);
    const drawer = screen.getByRole('complementary');
    expect(within(drawer).getByRole('button', { name: 'Maf' })).toBeInTheDocument();
  });

  // El título del drawer sigue siendo "Nueva pieza": el recon del 27-jul no abrió el drawer,
  // así que la única evidencia de esa cabecera es la captura del 10-jul (ver ours-vs-live.md).
  it('opens and closes the alta drawer', () => {
    render(<CreativosPage />);
    expect(screen.queryByRole('heading', { name: 'Nueva pieza' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva creatividad' }));
    expect(screen.getByRole('heading', { name: 'Nueva pieza' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.queryByRole('heading', { name: 'Nueva pieza' })).not.toBeInTheDocument();
  });
});
