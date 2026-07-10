import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DateBadge, parseDateBadge } from './DateBadge';

describe('parseDateBadge', () => {
  it('splits a "15 jul 2026" date into day and uppercase month', () => {
    expect(parseDateBadge('15 jul 2026')).toEqual({ day: '15', month: 'JUL' });
  });
});

describe('DateBadge', () => {
  it('renders the day and uppercase month', () => {
    render(<DateBadge date="18 jul 2026" />);
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('JUL')).toBeInTheDocument();
  });
});
