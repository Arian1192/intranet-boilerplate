import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidenciaList } from './IncidenciaList';
import { listIncidencias } from '../data/incidencias';

describe('IncidenciaList', () => {
  it('renderiza una fila por cada item', () => {
    render(<IncidenciaList items={listIncidencias()} />);
    expect(screen.getAllByRole('button')).toHaveLength(8);
    expect(screen.getByText('¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo?')).toBeInTheDocument();
  });

  it('lista vacía: muestra "Nada en este estado." sin filas ni icono', () => {
    render(<IncidenciaList items={[]} />);
    expect(screen.getByText('Nada en este estado.')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
