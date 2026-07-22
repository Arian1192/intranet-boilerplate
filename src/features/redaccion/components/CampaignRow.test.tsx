import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampaignRow } from './CampaignRow';
import { campaignsFor, stagesFor } from '../data/campanas';

const c = campaignsFor('mixmag')[0];
const stage = stagesFor('mixmag').find((s) => s.id === c.stageId);

describe('CampaignRow', () => {
  it('muestra etapa, nombre, cliente, hasta e importe', () => {
    render(<CampaignRow campaign={c} stage={stage} />);
    expect(screen.getByText('ACEPTADA')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByText('Cold Cloud SL')).toBeInTheDocument();
    expect(screen.getByText('hasta 29 jul')).toBeInTheDocument();
    expect(screen.getByText(/1\.?500,00/)).toBeInTheDocument();
  });

  it('aplica tinte emerald cuando la etapa es emerald', () => {
    const { container } = render(<CampaignRow campaign={c} stage={stage} />);
    expect(container.querySelector('[class*="emerald"]')).not.toBeNull();
  });
});
