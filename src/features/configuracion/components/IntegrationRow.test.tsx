import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntegrationRow } from './IntegrationRow';
import { integrations, snapshotFor } from '../data/uso';

describe('IntegrationRow', () => {
  it('precio-vuelos: cuota, provider/estado, usos/tarda/por-uso y nota incluida', () => {
    const integration = integrations().find((i) => i.id === 'precio-vuelos')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('precio-vuelos', '30d')} />);
    expect(screen.getByText('Precio de vuelos')).toBeInTheDocument();
    expect(screen.getByText(/FlightAPI/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('5.9 s')).toBeInTheDocument();
    expect(screen.getByText('Errores').nextElementSibling?.textContent).toBe('3');
    const porUsoHeader = screen.getByText('Por uso');
    expect(porUsoHeader.nextElementSibling?.textContent).toMatch(/8,58/);
    expect(screen.getByText('5 de 30.000 incluidas')).toBeInTheDocument();
    expect(screen.getByText('estimar')).toBeInTheDocument();
    expect(screen.getByText('estimar_roundtrip')).toBeInTheDocument();
  });

  it('ia: expande las 4 sub-funciones', () => {
    const integration = integrations().find((i) => i.id === 'ia')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('ia', '30d')} />);
    expect(screen.getByText('Triaje de incidencias')).toBeInTheDocument();
    expect(screen.getByText('Chat de ayuda')).toBeInTheDocument();
    expect(screen.getByText('copys')).toBeInTheDocument();
    expect(screen.getByText('mejorar')).toBeInTheDocument();
    expect(screen.getAllByText('gemini-flash-latest')).toHaveLength(4);
    expect(screen.getByText(/0,0300/)).toBeInTheDocument();
    expect(screen.getByText(/0,0154/)).toBeInTheDocument();
    expect(screen.getByText(/0,0150/)).toBeInTheDocument();
  });

  it('perfiles-artista: refleja uso, por uso y subfilas live', () => {
    const integration = integrations().find((i) => i.id === 'perfiles-artista')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('perfiles-artista', '30d')} />);
    expect(screen.getByText('58')).toBeInTheDocument();
    expect(screen.getByText('0.7 s')).toBeInTheDocument();
    expect(screen.getByText(/0,1900/)).toBeInTheDocument();
    expect(screen.getByText('refrescar')).toBeInTheDocument();
    expect(screen.getByText('perfil')).toBeInTheDocument();
    expect(screen.getByText('buscar')).toBeInTheDocument();
  });

  it('firma-contratos: snapshot con cero usos y gasto cero', () => {
    const integration = integrations().find((i) => i.id === 'firma-contratos')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('firma-contratos', '30d')} />);
    expect(screen.getByText('Firma de contratos')).toBeInTheDocument();
    expect(screen.getByText('Usos').nextElementSibling?.textContent).toBe('0');
    expect(screen.getByText('Gasto').nextElementSibling?.textContent).toMatch(/0,00/);
  });
});
