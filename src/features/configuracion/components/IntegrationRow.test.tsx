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
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10.6 s')).toBeInTheDocument();
    const porUsoHeader = screen.getByText('Por uso');
    expect(porUsoHeader.nextElementSibling?.textContent).toMatch(/42,89/);
    expect(screen.getByText('1 de 30.000 incluidas')).toBeInTheDocument();
  });

  it('ia: expande las 4 sub-funciones', () => {
    const integration = integrations().find((i) => i.id === 'ia')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('ia', '30d')} />);
    expect(screen.getByText('Triaje de incidencias')).toBeInTheDocument();
    expect(screen.getByText('Chat de ayuda')).toBeInTheDocument();
    expect(screen.getByText('copys')).toBeInTheDocument();
    expect(screen.getByText('mejorar')).toBeInTheDocument();
    expect(screen.getAllByText('gemini-flash-latest')).toHaveLength(4);
  });

  it('perfiles-artista: por uso "—" cuando perUse es null', () => {
    const integration = integrations().find((i) => i.id === 'perfiles-artista')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('perfiles-artista', '30d')} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('firma-contratos: sin snapshot, no revienta y no muestra métricas', () => {
    const integration = integrations().find((i) => i.id === 'firma-contratos')!;
    render(<IntegrationRow integration={integration} snapshot={undefined} />);
    expect(screen.getByText('Firma de contratos')).toBeInTheDocument();
    expect(screen.queryByText('Usos')).toBeNull();
  });
});
