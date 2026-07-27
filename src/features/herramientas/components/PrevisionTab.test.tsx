import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { PrevisionTab } from './PrevisionTab';
import { seedProyecciones } from '../data/seed';
import type { Proyeccion } from '../data/types';

function Wrapper({ onUpdate }: { onUpdate: (patch: Partial<Proyeccion>) => void }) {
  const [p, setP] = useState<Proyeccion>(seedProyecciones[0]);
  return (
    <PrevisionTab
      proyeccion={p}
      onUpdate={(patch) => {
        setP((prev) => ({ ...prev, ...patch }));
        onUpdate(patch);
      }}
    />
  );
}

describe('PrevisionTab', () => {
  it('arranca en escenario Base con las cifras exactas del live', () => {
    render(<PrevisionTab proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Base · 75%' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Ingresos por acuerdo')).toBeInTheDocument();
    expect(screen.getAllByText(/^6\.?330,14\s?€$/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Total 33\.?515,00/)).toBeInTheDocument();
    expect(screen.getByText('Margen por acuerdo')).toBeInTheDocument();
    expect(screen.getAllByText('13.6%').length).toBeGreaterThan(0);
    expect(screen.getByText('Punto de equilibrio')).toBeInTheDocument();
    expect(screen.getByText('77%')).toBeInTheDocument();
    expect(screen.getByText(/461 entradas/)).toBeInTheDocument();
    expect(screen.getByText('Asistencia')).toBeInTheDocument();
    expect(screen.getByText('500 / 600')).toBeInTheDocument();
    expect(screen.getByText(/83% ocupación/)).toBeInTheDocument();
  });

  it('clicar Pesimista actualiza los KPIs a los valores exactos de ese escenario', async () => {
    render(<PrevisionTab proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Pesimista · 50%' }));
    expect(screen.getAllByText(/^-1\.?134,69\s?€$/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('-26.2%').length).toBeGreaterThan(0);
  });

  it('clicar Optimista actualiza los KPIs a los valores exactos de ese escenario', async () => {
    render(<PrevisionTab proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Optimista · 100%' }));
    expect(screen.getAllByText(/^2\.?604,97\s?€$/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('32.3%').length).toBeGreaterThan(0);
  });

  it('renders las secciones de Ticketing/MesasVip/BarrasComidaMerch/Gastos con sus totales', () => {
    render(<PrevisionTab proyeccion={seedProyecciones[0]} onUpdate={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Ticketing' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mesas VIP' })).toBeInTheDocument();
    expect(screen.getAllByText(/Barras, comida y merch/).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'Gastos' })).toBeInTheDocument();
  });

  it('editar un campo de Ticketing dispara onUpdate', async () => {
    const onUpdate = vi.fn();
    render(<Wrapper onUpdate={onUpdate} />);
    const entradasInputs = screen.getAllByLabelText('Entradas');
    await userEvent.clear(entradasInputs[0]);
    await userEvent.type(entradasInputs[0], '90');
    expect(onUpdate).toHaveBeenCalled();
  });
});
