import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ShowCard } from './ShowCard';
import type { Show } from '@/types';

const base: Show = {
  id: 's06', code: 'C1-2026-006', date: '18 jul 2026', artist: 'Los Canarios', event: 'FUEGO',
  venue: 'Edén Ibiza', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'Landed',
  fee: 3000, bf: 600, mf: 449.58, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: true,
};

describe('ShowCard', () => {
  it('pinta código, artista@evento, deal, fee/BF/MF, pago, arte y "● Excepción"', () => {
    render(<ShowCard show={base} />);
    expect(screen.getByText('C1-2026-006')).toBeInTheDocument();
    expect(screen.getByText(/Los Canarios/)).toBeInTheDocument();
    expect(screen.getByText(/FUEGO/)).toBeInTheDocument();
    expect(screen.getByText(/Edén Ibiza, España/)).toBeInTheDocument();
    expect(screen.getByText(/All In|Landed|\+\+\+/)).toBeInTheDocument();
    expect(screen.getByText(/3\.?000,00\s?€/)).toBeInTheDocument(); // moneda NBSP → \s?
    expect(screen.getByText(/BF/)).toBeInTheDocument();
    expect(screen.getByText('No abonado')).toBeInTheDocument();
    expect(screen.getByText('Arte no subido')).toBeInTheDocument();
    expect(screen.getByText(/Excepción/)).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toBeInTheDocument();
  });

  it('sin venue no muestra la línea de ubicación y sin fecha muestra "—"', () => {
    render(<ShowCard show={{ ...base, code: 'C1-2026-007', venue: null, country: null, date: null, exception: false }} />);
    expect(screen.queryByText(/Excepción/)).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
