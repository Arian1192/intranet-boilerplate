import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultadoAcuerdoCard } from './ResultadoAcuerdoCard';
import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import { seedProyecciones } from '../data/seed';

describe('ResultadoAcuerdoCard', () => {
  it('renders the exact live figures for the seed', () => {
    const p = seedProyecciones[0];
    const resultado = calcularResultadoAcuerdo(p.acuerdo, p.acuerdoBrutos, p.eventoAforo, p.gastos);
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
});
