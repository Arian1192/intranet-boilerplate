import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RosterPage } from './RosterPage';
import { ROSTER_MANAGEMENT } from '@/features/booking/data/management-roster';

function fila(nombre: string) {
  return screen.getByRole('cell', { name: new RegExp(`^${nombre}`) }).closest('tr') as HTMLElement;
}

describe('RosterPage — calco del live', () => {
  it('trae los 41 artistas del roster y lo dice en el contador', () => {
    render(<RosterPage />);
    expect(ROSTER_MANAGEMENT).toHaveLength(41);
    expect(screen.getAllByRole('row')).toHaveLength(42); // 41 + cabecera
    expect(screen.getByText('41 artistas del roster')).toBeInTheDocument();
  });

  it('los dos KPI salen de los interruptores: 17 y 17', () => {
    render(<RosterPage />);
    const enManagement = screen.getByText('En Management', { selector: 'div' }).parentElement;
    const conSongstats = screen.getByText('Con Songstats activo').parentElement;
    expect(within(enManagement as HTMLElement).getByText('17')).toBeInTheDocument();
    expect(within(conSongstats as HTMLElement).getByText('17')).toBeInTheDocument();
    expect(screen.getByText('Solo estos hacen llamadas a la API')).toBeInTheDocument();
  });

  it('rotula las tres columnas como el live', () => {
    render(<RosterPage />);
    expect(screen.getByRole('columnheader', { name: 'Artista' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'En Management' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Songstats (API)' })).toBeInTheDocument();
  });

  it('pinta encendido con bg-brand-500 y apagado con bg-slate-300, sin hardcodear el violeta', () => {
    render(<RosterPage />);
    const [mgmt, songs] = within(fila('Aaron Martin')).getAllByRole('button');
    expect(mgmt).toHaveClass('bg-brand-500');
    expect(songs).toHaveClass('bg-brand-500');
    const [apagado] = within(fila('ACA')).getAllByRole('button');
    expect(apagado).toHaveClass('bg-slate-300');
  });

  it('mantiene el rótulo gris de los artistas sin Spotify vinculado', () => {
    render(<RosterPage />);
    expect(within(fila('Olivia Bass')).getByText('sin Spotify vinculado')).toBeInTheDocument();
    expect(screen.getAllByText('sin Spotify vinculado')).toHaveLength(4);
  });

  it('al apagar un interruptor baja el KPI correspondiente', async () => {
    const usuario = userEvent.setup();
    render(<RosterPage />);
    const [mgmt] = within(fila('Aaron Martin')).getAllByRole('button');
    await usuario.click(mgmt);
    expect(mgmt).toHaveClass('bg-slate-300');
    const enManagement = screen.getByText('En Management', { selector: 'div' }).parentElement;
    expect(within(enManagement as HTMLElement).getByText('16')).toBeInTheDocument();
    const conSongstats = screen.getByText('Con Songstats activo').parentElement;
    expect(within(conSongstats as HTMLElement).getByText('17')).toBeInTheDocument();
  });

  it('el buscador filtra por nombre y el contador cuenta lo filtrado', async () => {
    const usuario = userEvent.setup();
    render(<RosterPage />);
    await usuario.type(screen.getByPlaceholderText('Buscar artista…'), 'bizza');
    expect(screen.getAllByRole('row')).toHaveLength(2); // 1 + cabecera
    expect(screen.getByText('1 artistas del roster')).toBeInTheDocument();
  });

  it('el contador no pasa a singular: el live escribe «1 artistas del roster»', async () => {
    const usuario = userEvent.setup();
    render(<RosterPage />);
    await usuario.type(screen.getByPlaceholderText('Buscar artista…'), 'abd');
    // Medido tecleando en el live el 2026-09-09 a las 11:43 CEST. Sus hermanas
    // de Management II sí declinan («1 campaña»); ésta no. Se calca el literal.
    expect(screen.getByText('1 artistas del roster')).toBeInTheDocument();
    expect(screen.queryByText('1 artista del roster')).not.toBeInTheDocument();
  });

  it('los dos KPI NO se mueven al filtrar: siguen a 17 y 17', async () => {
    const usuario = userEvent.setup();
    render(<RosterPage />);
    await usuario.type(screen.getByPlaceholderText('Buscar artista…'), 'abd');
    expect(screen.getAllByRole('row')).toHaveLength(2);
    // Cuentan quién está en management, no cuántos se ven. Medido en el live,
    // donde con la tabla en una fila los dos siguen marcando 17.
    const enManagement = screen.getByText('En Management', { selector: 'div' }).parentElement;
    expect(within(enManagement as HTMLElement).getByText('17')).toBeInTheDocument();
    const conSongstats = screen.getByText('Con Songstats activo').parentElement;
    expect(within(conSongstats as HTMLElement).getByText('17')).toBeInTheDocument();
  });
});
