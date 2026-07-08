import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('highlights the active option and calls onChange on click', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={[
          { label: 'Listado', value: 'list' },
          { label: 'Kanban', value: 'kanban' },
        ]}
        value="list"
        onChange={onChange}
      />
    );
    expect(screen.getByRole('button', { name: 'Listado' })).toHaveClass('bg-white');
    expect(screen.getByRole('button', { name: 'Kanban' })).not.toHaveClass('bg-white');

    fireEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(onChange).toHaveBeenCalledWith('kanban');
  });
});
