import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreativosStatCard } from './CreativosStatCard';

describe('CreativosStatCard', () => {
  it('renders value above label and applies the value color class', () => {
    render(<CreativosStatCard value={1} label="Atrasadas" valueClassName="text-rose-600" />);
    expect(screen.getByText('1')).toHaveClass('text-2xl', 'font-semibold', 'text-rose-600');
    expect(screen.getByText('Atrasadas')).toHaveClass('text-xs', 'text-slate-500');
  });
});
