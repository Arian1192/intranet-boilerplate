import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ContentPage } from './ContentPage';
import { PROYECTOS_CONTENT } from '@/features/booking/data/management-content';

const TITULO = '8bit Release promo video "LIFESTYLE"';

/** La columna del tablero cuyo encabezado es `fase`. */
function columna(fase: string) {
  return screen.getByText(fase, { selector: 'span' }).closest('.w-64') as HTMLElement;
}

function tarjeta() {
  return screen.getByText(TITULO).closest('.card') as HTMLElement;
}

describe('ContentPage — calco del live', () => {
  it('pinta las cinco columnas del tablero en el orden del live', () => {
    render(<ContentPage />);
    const encabezados = screen
      .getAllByText(/^(Idea|Briefado|Producción|Revisión|Entregado)$/)
      .map((e) => e.textContent);
    expect(encabezados).toEqual(['Idea', 'Briefado', 'Producción', 'Revisión', 'Entregado']);
  });

  it('el único proyecto está en Idea y el contador dice «1 proyecto»', () => {
    render(<ContentPage />);
    expect(PROYECTOS_CONTENT).toHaveLength(1);
    expect(screen.getByText('1 proyecto')).toBeInTheDocument();
    expect(within(columna('Idea')).getByText(TITULO)).toBeInTheDocument();
    expect(within(columna('Idea')).getByText('1')).toBeInTheDocument();
  });

  it('las cuatro columnas vacías pintan su guion sobre borde discontinuo', () => {
    render(<ContentPage />);
    const guiones = screen.getAllByText('—');
    expect(guiones).toHaveLength(4);
    expect(guiones[0]).toHaveClass('border-dashed');
    for (const fase of ['Briefado', 'Producción', 'Revisión', 'Entregado']) {
      expect(within(columna(fase)).getByText('0')).toBeInTheDocument();
    }
  });

  it('la tarjeta trae el tipo y «artista · producido por»', () => {
    render(<ContentPage />);
    expect(within(tarjeta()).getByText('Vídeo')).toHaveClass('badge');
    expect(within(tarjeta()).getByText('Londonground · ConceptOne')).toBeInTheDocument();
  });

  it('la flecha de retroceso está deshabilitada en la primera columna', () => {
    render(<ContentPage />);
    expect(within(tarjeta()).getByRole('button', { name: '◄' })).toBeDisabled();
    expect(within(tarjeta()).getByRole('button', { name: '►' })).toBeEnabled();
  });

  it('la flecha de avance mueve la tarjeta a la columna siguiente', async () => {
    const usuario = userEvent.setup();
    render(<ContentPage />);
    await usuario.click(within(tarjeta()).getByRole('button', { name: '►' }));
    expect(within(columna('Briefado')).getByText(TITULO)).toBeInTheDocument();
    expect(within(columna('Idea')).getByText('—')).toBeInTheDocument();
    expect(within(tarjeta()).getByRole('button', { name: '◄' })).toBeEnabled();
  });

  it('«Eliminar» quita la tarjeta y el contador pasa a «0 proyectos»', async () => {
    const usuario = userEvent.setup();
    render(<ContentPage />);
    await usuario.click(within(tarjeta()).getByRole('button', { name: 'Eliminar' }));
    expect(screen.queryByText(TITULO)).not.toBeInTheDocument();
    expect(screen.getByText('0 proyectos')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(5);
  });

  it('filtrar por otro artista vacía el tablero, como en el live', async () => {
    const usuario = userEvent.setup();
    render(<ContentPage />);
    await usuario.click(screen.getByRole('button', { name: 'Todos los artistas' }));
    await usuario.click(screen.getByRole('option', { name: 'Abdon' }));
    expect(screen.getByText('0 proyectos')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(5);
  });
});
