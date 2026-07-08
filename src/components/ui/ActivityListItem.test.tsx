import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActivityListItem } from './ActivityListItem';

describe('ActivityListItem', () => {
  it('renders date, title, meta and an optional badge', () => {
    render(
      <ActivityListItem
        date="16 jul 2026"
        title="Acción de prensa Cliente A"
        meta="Cliente A · Evento"
        badge={{ label: 'En curso', variant: 'amber' }}
      />
    );

    expect(screen.getByText('16 jul 2026')).toBeInTheDocument();
    expect(screen.getByText('Acción de prensa Cliente A')).toBeInTheDocument();
    expect(screen.getByText('Cliente A · Evento')).toBeInTheDocument();
    expect(screen.getByText('En curso')).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('renders without a badge or meta', () => {
    render(<ActivityListItem date="08 jul 2026" title="Mención en medios" />);
    expect(screen.getByText('Mención en medios')).toBeInTheDocument();
  });
});
