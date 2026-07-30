import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedButtons } from './SegmentedButtons';

describe('SegmentedButtons', () => {
  it('marks the single active option and reports clicks', () => {
    const onChange = vi.fn();
    render(<SegmentedButtons options={['Baja', 'Media', 'Alta']} value="Media" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Media' })).toHaveClass('border-brand-500', 'bg-brand-50', 'text-brand-700');
    expect(screen.getByRole('button', { name: 'Baja' })).toHaveClass('border-slate-300', 'text-slate-600');
    fireEvent.click(screen.getByRole('button', { name: 'Alta' }));
    expect(onChange).toHaveBeenCalledWith('Alta');
  });

  it('supports a multi-select value (array)', () => {
    const onChange = vi.fn();
    render(<SegmentedButtons options={['1:1', '4:5', '9:16']} value={['1:1', '9:16']} onChange={onChange} />);
    expect(screen.getByRole('button', { name: '1:1' })).toHaveClass('bg-brand-50');
    expect(screen.getByRole('button', { name: '4:5' })).toHaveClass('border-slate-300');
    fireEvent.click(screen.getByRole('button', { name: '4:5' }));
    expect(onChange).toHaveBeenCalledWith('4:5');
  });
});
