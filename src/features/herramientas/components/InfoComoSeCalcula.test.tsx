import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoComoSeCalcula } from './InfoComoSeCalcula';

describe('InfoComoSeCalcula', () => {
  it('muestra el título y las 6 secciones; "×" cierra', () => {
    const onClose = vi.fn();
    render(<InfoComoSeCalcula onClose={onClose} />);
    expect(screen.getByText('¿Cómo se calcula?')).toBeInTheDocument();
    for (const titulo of [
      'ASISTENCIA', 'BRUTO Y NETO (IVA)', 'VIP: PROBABILIDAD VS ESCENARIO',
      'CONSUMO', 'PUNTO DE EQUILIBRIO (BREAKEVEN)', 'ACUERDO: BMG VS VENUE',
    ]) {
      expect(screen.getByText(titulo)).toBeInTheDocument();
    }
    fireEvent.click(screen.getByLabelText(/cerrar/i));
    expect(onClose).toHaveBeenCalled();
  });
});
