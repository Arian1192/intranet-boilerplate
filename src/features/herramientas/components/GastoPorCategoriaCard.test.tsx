import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GastoPorCategoriaCard } from './GastoPorCategoriaCard';
import { seedProyecciones } from '../data/seed';

describe('GastoPorCategoriaCard', () => {
  it('renders las 4 categorías del seed con importe y %, ordenadas descendente', () => {
    render(<GastoPorCategoriaCard gastos={seedProyecciones[0].gastos} />);
    expect(screen.getByText('Gasto por categoría')).toBeInTheDocument();
    expect(screen.getByText('Artística')).toBeInTheDocument();
    expect(screen.getByText(/2\.?400,00/)).toBeInTheDocument();
    expect(screen.getByText(/44\s?%/)).toBeInTheDocument();
    expect(screen.getByText('Promoción')).toBeInTheDocument();
    expect(screen.getByText('Publicidad')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(4);
  });

  it('con lista vacía no rompe', () => {
    render(<GastoPorCategoriaCard gastos={[]} />);
    expect(screen.getByText('Gasto por categoría')).toBeInTheDocument();
    expect(screen.queryAllByRole('progressbar')).toHaveLength(0);
  });
});
