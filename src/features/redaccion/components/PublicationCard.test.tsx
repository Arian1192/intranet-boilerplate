import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PublicationCard } from './PublicationCard';
import { MIXMAG, TAGMAG } from '../data/seed';

describe('PublicationCard', () => {
  it('muestra spaceName, en curso y revista abierta (Mixmag)', () => {
    render(<PublicationCard magazine={MIXMAG} />);
    expect(screen.getByText('Mixmag Spain')).toBeInTheDocument();
    expect(screen.getByText('España · con revista')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Revista abierta: Patrick Topping (Agosto 2026)')).toBeInTheDocument();
  });

  it('sin revista abierta (TAGMAG) no muestra esa línea', () => {
    render(<PublicationCard magazine={TAGMAG} />);
    expect(screen.getByText('TAGMAG')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText(/Revista abierta:/)).toBeNull();
  });
});
