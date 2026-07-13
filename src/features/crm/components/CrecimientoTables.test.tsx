import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CrossSellTable } from './CrossSellTable';
import { AtRiskTable } from './AtRiskTable';
import { orgs } from '../data/seed';
import { opportunities } from '../data/pipeline';
import { crossSell, atRisk } from '../data/crecimiento';

describe('Crecimiento tables', () => {
  it('CrossSellTable renders headers, the "Trabaja con" chip and offer chips', () => {
    const { rows } = crossSell(orgs);
    render(<CrossSellTable rows={rows} />);
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Trabaja con')).toBeInTheDocument();
    expect(screen.getByText('Oportunidad de ofrecer')).toBeInTheDocument();
    // at least one row + a company chip
    expect(rows.length).toBeGreaterThan(0);
  });

  it('AtRiskTable shows "Nunca" for clients without activity', () => {
    const rows = atRisk(orgs, opportunities, 6);
    render(<AtRiskTable rows={rows} />);
    expect(screen.getByText('Última actividad')).toBeInTheDocument();
    expect(screen.getByText('Empresas')).toBeInTheDocument();
    const nunca = screen.queryAllByText('Nunca');
    expect(nunca.length).toBeGreaterThan(0);
  });
});
