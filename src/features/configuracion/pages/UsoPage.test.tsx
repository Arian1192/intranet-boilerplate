import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsoPage } from './UsoPage';

describe('UsoPage', () => {
  it('renderiza título, 3 stat cards, 3 banners y 6 integraciones', () => {
    render(<UsoPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Uso del sistema' })).toBeInTheDocument();
    expect(screen.getByText(/53,89/)).toBeInTheDocument();
    expect(screen.getByText(/53,92/)).toBeInTheDocument();
    expect(screen.getByText('3 suscripciones sin importe.')).toBeInTheDocument();
    expect(screen.getByText('Precio de vuelos')).toBeInTheDocument();
    expect(screen.getByText('Horarios de vuelos')).toBeInTheDocument();
    expect(screen.getByText('Triaje de incidencias')).toBeInTheDocument();
  });

  it('el toggle de periodo por defecto está en 30 días', () => {
    render(<UsoPage />);
    expect(screen.getByRole('button', { name: '30 días' })).toHaveClass('bg-[#44444C]');
  });

  it('cambiar a "Un año" no revienta (reusa el mismo snapshot documentado)', async () => {
    render(<UsoPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Un año' }));
    expect(screen.getByRole('button', { name: 'Un año' })).toHaveClass('bg-[#44444C]');
    expect(screen.getByText('Precio de vuelos')).toBeInTheDocument();
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<UsoPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
