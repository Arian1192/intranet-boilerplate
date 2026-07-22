import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidenciaRow } from './IncidenciaRow';
import { listIncidencias } from '../data/incidencias';

const seed = listIncidencias();

describe('IncidenciaRow', () => {
  it('fila con tipo "idea", sin adjunto: badge DESCARTADAS, chip Idea, texto, ruta "/", guion, avatar con iniciales', () => {
    render(<IncidenciaRow incidencia={seed[0]} />);
    expect(screen.getByText('DESCARTADAS')).toHaveClass('w-24', 'bg-slate-100', 'text-slate-500');
    expect(screen.getByText('Idea')).toHaveClass('bg-violet-100', 'text-violet-700');
    expect(screen.getByText(seed[0].texto)).toBeInTheDocument();
    expect(screen.queryByText('📎')).toBeNull();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByLabelText('Fran Hinojosa Veredas')).toBeInTheDocument();
  });

  it('fila sin tipo, con adjunto: sin chip Idea, 📎 presente, badge RESUELTAS emerald', () => {
    render(<IncidenciaRow incidencia={seed[1]} />);
    expect(screen.queryByText('Idea')).toBeNull();
    expect(screen.getByText('📎')).toBeInTheDocument();
    expect(screen.getByText('RESUELTAS')).toHaveClass('bg-emerald-100', 'text-emerald-700');
    expect(screen.getByText('/euphoric/calendario')).toBeInTheDocument();
  });

  it('reportante con foto en el live: sin URL cae al placeholder, conservando su nombre', () => {
    render(<IncidenciaRow incidencia={seed[3]} />);
    expect(screen.getByLabelText('Carlos Pego')).toBeInTheDocument();
  });

  it('si hay foto de perfil se renderiza la imagen en vez de las iniciales', () => {
    render(
      <IncidenciaRow incidencia={{ ...seed[3], reporterAvatarUrl: 'https://example.test/carlos.png' }} />
    );
    expect(screen.getByAltText('Carlos Pego')).toHaveClass('rounded-full', 'object-cover');
  });

  it('la fila abre el detalle al hacer click', async () => {
    const onOpen = vi.fn();
    render(<IncidenciaRow incidencia={seed[0]} onOpen={onOpen} />);
    const row = screen.getByRole('button');
    expect(row).toHaveAttribute('type', 'button');
    await userEvent.click(row);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
