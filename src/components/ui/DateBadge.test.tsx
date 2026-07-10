import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DateBadge } from './DateBadge';

describe('DateBadge', () => {
  it('renders the day and uppercase month', () => {
    render(<DateBadge date="18 jul 2026" />);
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('JUL')).toBeInTheDocument();
  });

  it('renders the day and uppercase month for a different date', () => {
    render(<DateBadge date="15 jul 2026" />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('JUL')).toBeInTheDocument();
  });
});
