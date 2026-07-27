import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultadoAcuerdoCard } from './ResultadoAcuerdoCard';
import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import { calcularBrutosEscenario } from '../data/calculos-escenarios';
import { calcularResultadoReal } from '../data/calculos-real';
import { seedProyecciones } from '../data/seed';

describe('ResultadoAcuerdoCard', () => {
  it('renders the exact live figures for the seed', () => {
    const p = seedProyecciones[0];
    const resultado = calcularResultadoAcuerdo(p.acuerdo, calcularBrutosEscenario(p, 'base'), p.eventoAforo, p.gastos);
    render(<ResultadoAcuerdoCard resultado={resultado} />);
    expect(screen.getByText('Resultado por acuerdo')).toBeInTheDocument();
    // Nota: Intl.NumberFormat('es-ES') en este runtime usa minimumGroupingDigits=2,
    // así que los importes de 4 cifras no llevan separador de miles (mismo comportamiento
    // ya observado y tolerado en el test de ProyeccionRow, Tarea 7).
    expect(screen.getByText(/6\.?330,14/)).toBeInTheDocument();
    expect(screen.getByText(/-5\.?470,00/)).toBeInTheDocument();
    expect(screen.getByText(/860,14/)).toBeInTheDocument();
    expect(screen.getByText('13.6%')).toBeInTheDocument();
    expect(screen.getByText(/Evento completo: 24\.998,18\s?€ \(82%\)\./)).toBeInTheDocument();
  });

  it('presenta las 4 métricas en lista vertical (label + valor por fila), fiel al live', () => {
    const p = seedProyecciones[0];
    const resultado = calcularResultadoAcuerdo(p.acuerdo, calcularBrutosEscenario(p, 'base'), p.eventoAforo, p.gastos);
    const { container } = render(<ResultadoAcuerdoCard resultado={resultado} />);
    ['Nuestros ingresos', 'Gastos que asumimos', 'Beneficio por acuerdo', 'Margen s/ ingresos'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    // vertical: NO usa el grid de columnas del layout anterior
    expect(container.querySelector('.sm\\:grid-cols-4')).toBeNull();
  });

  it('resalta el BENEFICIO negativo en una caja roja (como la tab Real del live)', () => {
    const p = seedProyecciones[0];
    // resultado real del seed: beneficio -4792,73€ (negativo) → caja roja
    const real = calcularResultadoReal(p)!;
    render(<ResultadoAcuerdoCard resultado={real} />);
    const fila = screen.getByText('Beneficio por acuerdo').closest('div');
    expect(fila?.className).toMatch(/bg-red/);
    expect(screen.getByText(/^-4\.?792,73\s?€$/)).toBeInTheDocument();
  });

  it('resalta el BENEFICIO positivo en una caja verde (tab Previsión base)', () => {
    const p = seedProyecciones[0];
    const resultado = calcularResultadoAcuerdo(p.acuerdo, calcularBrutosEscenario(p, 'base'), p.eventoAforo, p.gastos);
    render(<ResultadoAcuerdoCard resultado={resultado} />);
    const fila = screen.getByText('Beneficio por acuerdo').closest('div');
    expect(fila?.className).toMatch(/bg-emerald/);
  });
});
