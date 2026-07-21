import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { InboxZero } from './InboxZero';

describe('InboxZero', () => {
  it('muestra el estado sin pendientes', () => {
    render(<InboxZero />);
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
    expect(screen.getByText(/Está todo al día/)).toBeInTheDocument();
  });
});
