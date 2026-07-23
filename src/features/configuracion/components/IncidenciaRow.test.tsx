import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidenciaRow } from './IncidenciaRow';
import { listIncidencias } from '@/features/incidencias/data/incidencias';

const list = listIncidencias();

describe('IncidenciaRow', () => {
  it('con autor: muestra chip de estado, tipo, texto, origen e iniciales', () => {
    const row = list.find((i) => i.reporterInitials === 'FV')!;
    render(<IncidenciaRow incidencia={row} />);
    expect(screen.getByText('DESCARTADA')).toBeInTheDocument();
    expect(screen.getByText('Idea')).toBeInTheDocument();
    expect(screen.getByText(row.texto)).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('FV')).toBeInTheDocument();
  });

  it('sin autor: icono genérico en vez de iniciales', () => {
    const row = list.find((i) => !i.reporterInitials)!;
    render(<IncidenciaRow incidencia={row} />);
    expect(screen.queryByText('FV')).toBeNull();
  });

  it('estado nueva se pinta en rojo, resuelta en verde', () => {
    const nueva = list.find((i) => i.estado === 'nueva')!;
    const { container: c1 } = render(<IncidenciaRow incidencia={nueva} />);
    expect(c1.querySelector('.bg-red-100')).not.toBeNull();

    const resuelta = list.find((i) => i.estado === 'resuelta')!;
    const { container: c2 } = render(<IncidenciaRow incidencia={resuelta} />);
    expect(c2.querySelector('.bg-emerald-100')).not.toBeNull();
  });
});
