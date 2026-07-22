import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentRow } from './ContentRow';
import { piecesFor, statusesFor } from '../data/contenidos';

const p = piecesFor('mixmag');
const statuses = statusesFor('mixmag');
const byId = (id: string) => statuses.find((s) => s.id === id);

describe('ContentRow', () => {
  it('muestra estado, título, tipo, campaña y fecha', () => {
    const piece = p.find((x) => x.id === 'c1')!;
    render(<ContentRow piece={piece} status={byId(piece.statusId)} />);
    expect(screen.getByText('IDEA')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1 · Story')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1')).toBeInTheDocument();
    expect(screen.getByText('29 jul 2026')).toBeInTheDocument();
  });

  it('muestra avatar cuando la pieza tiene owner (orgánica)', () => {
    const piece = p.find((x) => x.id === 'c5')!; // Soho, orgánico, con owner
    render(<ContentRow piece={piece} status={byId(piece.statusId)} />);
    expect(screen.getByText('hoy')).toBeInTheDocument();
    expect(screen.getByTestId('row-avatar')).toBeInTheDocument();
    // orgánica: no muestra nombre de campaña
    expect(screen.queryByText('Campaña Test 1')).toBeNull();
  });
});
