import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UnderlineTabs } from './UnderlineTabs';

describe('UnderlineTabs', () => {
  it('underlines the active tab and calls onChange on click', () => {
    const onChange = vi.fn();
    render(
      <UnderlineTabs
        options={[
          { label: 'Inventario', value: 'inventario' },
          { label: 'Entregas', value: 'entregas' },
        ]}
        value="inventario"
        onChange={onChange}
      />
    );
    expect(screen.getByRole('button', { name: 'Inventario' })).toHaveClass('border-brand-600');
    expect(screen.getByRole('button', { name: 'Entregas' })).not.toHaveClass('border-brand-600');

    fireEvent.click(screen.getByRole('button', { name: 'Entregas' }));
    expect(onChange).toHaveBeenCalledWith('entregas');
  });
});
