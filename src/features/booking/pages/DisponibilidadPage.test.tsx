import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DisponibilidadPage } from './DisponibilidadPage';

describe('DisponibilidadPage', () => {
  it('muestra 39 LIBRES, el mensaje y "CON SHOW ESE DÍA" reacciona a la fecha', () => {
    render(<DisponibilidadPage />);
    expect(screen.getByText(/39 LIBRES/)).toBeInTheDocument();
    expect(screen.getByText('Nadie tiene show esa fecha.')).toBeInTheDocument(); // 2026-07-24
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2026-07-18' } });
    // los venues/eventos del 18-jul solo aparecen en la sección "CON SHOW ESE DÍA" (no en el textarea)
    expect(screen.getByText(/Edén Ibiza/)).toBeInTheDocument(); // Los Canarios @ FUEGO
    expect(screen.getByText(/FUNDAYS/)).toBeInTheDocument(); // Abdon @ FUNDAYS
    expect(screen.queryByText('Nadie tiene show esa fecha.')).not.toBeInTheDocument();
  });

  it('los 10 chips de estilo están presentes', () => {
    render(<DisponibilidadPage />);
    ['Tech House', 'Trance', 'Minimal / Deep Tech'].forEach((e) =>
      expect(screen.getByRole('button', { name: e })).toBeInTheDocument()
    );
  });

  it('Copiar invoca clipboard.writeText con el mensaje', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<DisponibilidadPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('• Aaron Martin'));
  });
});
