import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes value and max and sizes the fill proportionally', () => {
    render(<ProgressBar value={3540} max={8000} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '3540');
    expect(bar).toHaveAttribute('aria-valuemax', '8000');
    expect(bar.firstElementChild).toHaveStyle({ width: '44.25%' });
  });

  it('clamps to 0% when max is 0', () => {
    render(<ProgressBar value={5} max={0} />);
    expect(screen.getByRole('progressbar').firstElementChild).toHaveStyle({ width: '0%' });
  });
});
