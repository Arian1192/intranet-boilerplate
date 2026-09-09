import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CampanasPage } from './CampanasPage';
import { CAMPANAS } from '@/features/booking/data/management-campanas';
import { ARTISTAS_MANAGEMENT } from '@/features/booking/data/management-roster';

/** Devuelve el valor de un KPI por su rótulo. */
function kpi(rotulo: string) {
  const tarjeta = screen.getByText(rotulo).parentElement as HTMLElement;
  return tarjeta.querySelector('.text-2xl')?.textContent;
}

async function elegir(filtro: string, opcion: string) {
  const usuario = userEvent.setup();
  await usuario.click(screen.getByRole('button', { name: filtro }));
  await usuario.click(screen.getByRole('option', { name: opcion }));
}

describe('CampanasPage — calco del live', () => {
  it('trae las 11 campañas de la captura y lo dice en el contador', () => {
    render(<CampanasPage />);
    expect(CAMPANAS).toHaveLength(11);
    expect(screen.getAllByRole('row')).toHaveLength(12); // 11 + cabecera
    expect(screen.getByText('11 campañas')).toBeInTheDocument();
  });

  it('los tres KPI cuadran al céntimo con los de la foto', () => {
    render(<CampanasPage />);
    expect(kpi('Inversión del artista')).toBe('1150,00 €');
    expect(kpi('Presupuesto activo')).toBe('450,00 €');
    expect(kpi('Campañas activas')).toBe('1');
  });

  it('rotula las cinco columnas como el live', () => {
    render(<CampanasPage />);
    expect(screen.getAllByRole('columnheader').map((c) => c.textContent)).toEqual([
      'Campaña',
      'Canal',
      'Estado',
      'Paga',
      'Gasto / Presupuesto',
    ]);
  });

  it('pinta Aprobada en brand-*, sin hardcodear el violeta que pone apx.css', () => {
    render(<CampanasPage />);
    const [aprobada] = screen.getAllByText('Aprobada');
    expect(aprobada).toHaveClass('badge', 'bg-brand-100', 'text-brand-700');
    expect(screen.getByText('Activa')).toHaveClass('bg-emerald-100', 'text-emerald-700');
    expect(screen.getAllByText('Propuesta')[0]).toHaveClass('bg-slate-100', 'text-slate-600');
  });

  it('el filtro de artistas lista los 17 del roster de management', async () => {
    const usuario = userEvent.setup();
    render(<CampanasPage />);
    await usuario.click(screen.getByRole('button', { name: 'Todos los artistas' }));
    expect(ARTISTAS_MANAGEMENT).toHaveLength(17);
    const opciones = screen.getAllByRole('option').map((o) => o.textContent);
    expect(opciones).toEqual(['Todos los artistas', ...ARTISTAS_MANAGEMENT]);
  });

  it('al filtrar por Abdon el contador y los tres KPI se recalculan, como en el live', async () => {
    render(<CampanasPage />);
    await elegir('Todos los artistas', 'Abdon');
    expect(screen.getByText('3 campañas')).toBeInTheDocument();
    expect(kpi('Inversión del artista')).toBe('0,00 €');
    expect(kpi('Presupuesto activo')).toBe('250,00 €');
    expect(kpi('Campañas activas')).toBe('0');
  });

  it('sin resultados escribe el vacío literal del live, a cinco columnas', async () => {
    render(<CampanasPage />);
    await elegir('Todos los artistas', 'Aaron Martin');
    expect(screen.getByText('0 campañas')).toBeInTheDocument();
    const vacio = screen.getByText('Sin campañas.');
    expect(vacio).toHaveAttribute('colspan', '5');
  });

  it('en singular el contador dice «1 campaña»', async () => {
    render(<CampanasPage />);
    await elegir('Todos los artistas', 'Bizza');
    expect(screen.getByText('1 campaña')).toBeInTheDocument();
  });

  it('las campañas sin fecha pintan sólo el artista', () => {
    render(<CampanasPage />);
    const fila = screen
      .getByText('Hey Mami - Spotify Streams + YouTube Views')
      .closest('tr') as HTMLElement;
    expect(within(fila).getByText('DH Moon')).toBeInTheDocument();
    const conFecha = screen.getByText('Campaña general Bizza').closest('tr') as HTMLElement;
    expect(within(conFecha).getByText('Bizza · 02 sept 2026')).toBeInTheDocument();
  });

  it('la barra de gasto va a 0 % cuando no hay presupuesto contra el que medir', () => {
    render(<CampanasPage />);
    const fila = screen.getByText("Campaña lanzamiento 'Favela'").closest('tr') as HTMLElement;
    const barra = fila.querySelector('.bg-brand-400') as HTMLElement;
    expect(barra.style.width).toBe('0%');
  });
});
