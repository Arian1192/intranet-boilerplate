import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrgListRow } from './OrgListRow';
import type { CrmOrg } from '../data/seed';

const org: CrmOrg = {
  id: 'o1', name: 'BMG', nif: 'B64730187', kind: 'Empresa', roles: ['Cliente'],
  worksWith: [], contacts: [], shippingAddresses: [],
};

describe('OrgListRow', () => {
  it('shows name, nif and the first role badge; calls onSelect; reflects selection', () => {
    const onSelect = vi.fn();
    const { rerender } = render(<OrgListRow org={org} selected={false} onSelect={onSelect} />);
    expect(screen.getByText('BMG')).toHaveClass('font-medium', 'text-slate-800');
    expect(screen.getByText('B64730187')).toHaveClass('text-xs', 'text-slate-400');
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalled();
    rerender(<OrgListRow org={org} selected onSelect={onSelect} />);
    expect(screen.getByRole('button')).toHaveClass('bg-slate-50');
  });
});
