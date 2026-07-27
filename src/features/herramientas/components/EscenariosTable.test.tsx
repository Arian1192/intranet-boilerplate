import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EscenariosTable } from './EscenariosTable';
import { calcularEscenariosComparativa } from '../data/calculos-escenarios';
import { seedProyecciones } from '../data/seed';

describe('EscenariosTable', () => {
  it('renders la cabecera y las 3 filas exactas del seed', () => {
    const filas = calcularEscenariosComparativa(seedProyecciones[0]);
    render(<EscenariosTable filas={filas} />);
    expect(screen.getByText('Escenarios')).toBeInTheDocument();
    expect(screen.getByText('ESCENARIO')).toBeInTheDocument();
    expect(screen.getByText('Bº POR ACUERDO')).toBeInTheDocument();
    expect(screen.getByText('MARGEN')).toBeInTheDocument();

    expect(screen.getByText('Pesimista')).toBeInTheDocument();
    expect(screen.getByText(/-1\.?134,69/)).toBeInTheDocument();
    expect(screen.getByText('-26.2%')).toBeInTheDocument();

    expect(screen.getByText('Base')).toBeInTheDocument();
    expect(screen.getByText(/860,14/)).toBeInTheDocument();
    expect(screen.getByText('13.6%')).toBeInTheDocument();

    expect(screen.getByText('Optimista')).toBeInTheDocument();
    expect(screen.getByText(/2\.?604,97/)).toBeInTheDocument();
    expect(screen.getByText('32.3%')).toBeInTheDocument();
  });
});
