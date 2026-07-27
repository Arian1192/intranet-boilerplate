import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsoPage } from './UsoPage';

describe('UsoPage', () => {
  it('renderiza la estructura live: 3 stat cards, 2 avisos, 7 integraciones y últimos fallos', () => {
    render(<UsoPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Uso del sistema' })).toBeInTheDocument();
    expect(screen.getByText(/53,89/)).toBeInTheDocument();
    expect(screen.getByText(/53,92/)).toBeInTheDocument();
    expect(screen.getAllByText('Errores')[0].parentElement).toHaveTextContent('7');
    expect(screen.getByText('3 suscripciones sin importe.')).toBeInTheDocument();
    expect(screen.getByText(/12 tarifas de IA sin verificar contra una factura real/)).toBeInTheDocument();
    expect(screen.queryByText('Estás pagando y no lo usas:')).toBeNull();
    expect(screen.getAllByText('Precio de vuelos')[0]).toBeInTheDocument();
    expect(screen.getByText('Perfiles de artista')).toBeInTheDocument();
    expect(screen.getAllByText('vat')[0]).toBeInTheDocument();
    expect(screen.getByText('Horarios de vuelos')).toBeInTheDocument();
    expect(screen.getByText('Triaje de incidencias')).toBeInTheDocument();
    expect(screen.getByText('Últimos fallos')).toBeInTheDocument();
    expect(screen.getAllByText('CONFIG_GB')).toHaveLength(2);
    expect(screen.getByText(/Falló la última vez · CONFIG_GB/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cuotas y tarifas' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Actualizar' })).toHaveAttribute('type', 'button');
  });

  it('el toggle de periodo por defecto está en 30 días', () => {
    render(<UsoPage />);
    expect(screen.getByRole('button', { name: '30 días' })).toHaveClass('bg-[#44444C]');
  });

  it('cambiar a "Un año" no revienta (reusa el mismo snapshot documentado)', async () => {
    render(<UsoPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Un año' }));
    expect(screen.getByRole('button', { name: 'Un año' })).toHaveClass('bg-[#44444C]');
    expect(screen.getByText('Gasto total (un año)')).toBeInTheDocument();
    expect(screen.getAllByText('Precio de vuelos')[0]).toBeInTheDocument();
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<UsoPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
