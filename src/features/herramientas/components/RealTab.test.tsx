import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RealTab } from './RealTab';
import { seedProyecciones } from '../data/seed';

describe('RealTab', () => {
  it('muestra los 5 KPIs reales del live (677,27 / -5470 / -4792,73 / -707.7% / 132)', () => {
    render(<RealTab proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    // varios valores se repiten (KPI + Resultado card + pie de tablas) → getAllByText; moneda NBSP → \s?
    expect(screen.getAllByText(/^677,27\s?€$/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^-4\.?792,73\s?€$/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('-707.7%').length).toBeGreaterThan(0);
    expect(screen.getByText('132 / 600')).toBeInTheDocument();
    expect(screen.getByText('22% ocupación')).toBeInTheDocument();
    expect(screen.getByText('Asistencia real')).toBeInTheDocument();
    // en Real no hay KPI "Punto de equilibrio" ni selector de escenario
    expect(screen.queryByText('Punto de equilibrio')).not.toBeInTheDocument();
    expect(screen.queryByText(/Pesimista · /)).not.toBeInTheDocument();
  });

  it('reusa "Gasto por categoría" (idéntico a Previsión) y muestra la Caja real vacía', () => {
    render(<RealTab proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    expect(screen.getByText('Gasto por categoría')).toBeInTheDocument();
    expect(screen.getByText('Caja real (barras, comida, extras)')).toBeInTheDocument();
  });
});
