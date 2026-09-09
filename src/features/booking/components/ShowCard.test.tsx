import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, it, expect } from 'vitest';
import { ShowCard } from './ShowCard';
import type { Show } from '@/types';

const base: Show = {
  id: 's06',
  code: 'C1-2026-006',
  date: '18 jul 2026',
  artist: 'Los Canarios',
  event: 'FUEGO',
  venue: 'Edén Ibiza',
  country: 'España',
  etapa: 'confirmed',
  fase: 'confirmed',
  dealType: 'Landed',
  fee: 3000,
  bf: 600,
  mf: 449.58,
  paymentStatus: 'No abonado',
  artStatus: 'Arte no subido',
  exception: true,
};

/** La fila navega, así que necesita un router alrededor. */
function pintar(show: Show = base) {
  return render(
    <MemoryRouter initialEntries={['/shows']}>
      <ShowCard show={show} />
    </MemoryRouter>
  );
}

describe('ShowCard — la fila `srow` del live', () => {
  it('pinta fecha, artista@evento, píldora de fase, código, ubicación e importe', () => {
    pintar();
    expect(screen.getByText('18')).toHaveClass('d');
    expect(screen.getByText('jul')).toHaveClass('m');
    expect(screen.getByText(/Los Canarios @ FUEGO/)).toBeInTheDocument();
    expect(screen.getByText('Confirmado')).toHaveClass('fpill', 'p-accent');
    expect(screen.getByText('C1-2026-006')).toHaveClass('co');
    expect(screen.getByText('· Edén Ibiza, España')).toHaveClass('cty');
    expect(screen.getByText(/3\.?000,00\s?€/)).toHaveClass('v');
    expect(screen.getByText('No abonado')).toHaveClass('s');
    expect(screen.getByText(/Excepción/)).toHaveClass('exc');
  });

  /*
   * Recalco del 2026-09-09: la fila del live **no** enseña el tipo de deal, ni
   * el desglose BF/MF, ni el estado del arte. Su `rinfo` lleva nombre, píldora
   * de fase, código y ciudad, y su `ramt` el importe y el chip de dinero. Esos
   * tres los pintábamos nosotros de más, así que el test se da la vuelta en vez
   * de borrarse.
   */
  it('ya no pinta el deal, el desglose BF/MF ni el estado del arte', () => {
    pintar();
    expect(screen.queryByText('Landed')).not.toBeInTheDocument();
    expect(screen.queryByText(/BF/)).not.toBeInTheDocument();
    expect(screen.queryByText('Arte no subido')).not.toBeInTheDocument();
  });

  it('el avatar son iniciales, no la foto de la CDN de Spotify', () => {
    pintar();
    expect(screen.getByTitle('Los Canarios')).toHaveTextContent('LC');
    expect(document.querySelector('img')).toBeNull();
  });

  it('trae los seis segmentos del track con su rótulo en castellano', () => {
    pintar();
    const segmentos = document.querySelectorAll('.track .seg');
    expect(segmentos).toHaveLength(6);
    expect([...segmentos].map((s) => s.querySelector('.lab')?.textContent)).toEqual([
      'Confirm.',
      'Contrato',
      'Cobro',
      'Itiner.',
      'Gastos',
      'Liquid.',
    ]);
    expect(segmentos[0]).toHaveAttribute('title', 'Confirm.: Hecho');
  });

  it('sin importe deja el bloque de dinero vacío, como el live', () => {
    pintar({ ...base, fee: 0 });
    expect(document.querySelector('.ramt')).toBeEmptyDOMElement();
  });

  it('sin venue no muestra la línea de ubicación y sin fecha muestra "—"', () => {
    pintar({
      ...base,
      code: 'C1-2026-007',
      venue: null,
      country: null,
      date: null,
      exception: false,
    });
    expect(screen.queryByText(/Excepción/)).not.toBeInTheDocument();
    expect(document.querySelector('.cty')).toBeNull();
    expect(screen.getByText('—')).toHaveClass('d');
  });
});

describe('ShowCard — la fila navega al detalle', () => {
  it('pulsarla lleva a /shows/:showId, como en el live', async () => {
    const usuario = userEvent.setup();
    function Sonda() {
      const { pathname } = useLocation();
      return <span data-testid="ruta">{pathname}</span>;
    }
    render(
      <MemoryRouter initialEntries={['/shows']}>
        <ShowCard show={base} />
        <Sonda />
      </MemoryRouter>
    );
    await usuario.click(screen.getByRole('button'));
    expect(screen.getByTestId('ruta')).toHaveTextContent('/shows/s06');
  });
});
