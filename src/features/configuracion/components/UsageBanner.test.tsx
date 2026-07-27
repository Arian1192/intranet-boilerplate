import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageBanner } from './UsageBanner';

describe('UsageBanner', () => {
  it('renderiza texto en negrita + texto plano + link opcional', () => {
    render(<UsageBanner boldText="3 suscripciones sin importe." text="Salen a 0 €." linkLabel="Rellenar precios" />);
    expect(screen.getByText('3 suscripciones sin importe.').tagName).toBe('STRONG');
    expect(screen.getByText(/Salen a 0/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Rellenar precios' })).toBeInTheDocument();
  });

  it('sin boldText ni linkLabel, solo pinta el texto', () => {
    render(<UsageBanner text="12 tarifas de IA sin verificar." />);
    expect(screen.getByText('12 tarifas de IA sin verificar.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
