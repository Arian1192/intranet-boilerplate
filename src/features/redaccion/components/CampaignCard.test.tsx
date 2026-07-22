import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampaignCard } from './CampaignCard';
import { campaignsFor } from '../data/campanas';

describe('CampaignCard', () => {
  it('muestra nombre, cliente, importe y hasta', () => {
    render(<CampaignCard campaign={campaignsFor('mixmag')[0]} />);
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByText('Cold Cloud SL')).toBeInTheDocument();
    expect(screen.getByText(/1\.?500,00/)).toBeInTheDocument();
    expect(screen.getByText('hasta 29 jul')).toBeInTheDocument();
  });
});
