import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CrossSellTable } from './CrossSellTable';
import { AtRiskTable } from './AtRiskTable';
import { orgs, type CrmOrg } from '../data/seed';
import { opportunities } from '../data/pipeline';
import { crossSell, atRisk } from '../data/crecimiento';
import { formatDate } from '../data/pipeline';

describe('Crecimiento tables', () => {
  it('CrossSellTable renders headers, the "Trabaja con" chip and offer chips', () => {
    const { rows } = crossSell(orgs);
    render(<CrossSellTable rows={rows} />);
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Trabaja con')).toBeInTheDocument();
    expect(screen.getByText('Oportunidad de ofrecer')).toBeInTheDocument();
    // at least one row + a company chip
    expect(rows.length).toBeGreaterThan(0);
    // assert a real "Trabaja con" chip renders
    expect(screen.getAllByText('Etra Agency').length).toBeGreaterThan(0);
  });

  it('AtRiskTable shows "Nunca" for clients without activity', () => {
    const rows = atRisk(orgs, opportunities, 6);
    render(<AtRiskTable rows={rows} />);
    expect(screen.getByText('Última actividad')).toBeInTheDocument();
    expect(screen.getByText('Empresas')).toBeInTheDocument();
    const nunca = screen.queryAllByText('Nunca');
    expect(nunca.length).toBeGreaterThan(0);
  });

  it('renders a formatted date for a client with recent activity', () => {
    const org: CrmOrg = { id: 'x1', name: 'Cliente Activo', roles: ['Cliente'], worksWith: ['ConceptOne'], kind: 'Empresa', contacts: [], shippingAddresses: [] };
    const rows = [{
      org,
      lastActivity: '2026-05-10',
      companies: ['ConceptOne'],
    }];
    render(<AtRiskTable rows={rows} />);
    expect(screen.getByText('Cliente Activo')).toBeInTheDocument();
    expect(screen.getByText(formatDate('2026-05-10'))).toBeInTheDocument();
    expect(screen.queryByText('Nunca')).not.toBeInTheDocument();
  });
});
