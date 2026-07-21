import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom';
import { EspaciosDropdown } from './EspaciosDropdown';

describe('EspaciosDropdown', () => {
  it('abre el menú y lista los 12 módulos con enlaces', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><EspaciosDropdown /></MemoryRouter>);
    expect(screen.queryByRole('link', { name: /ConceptOne/ })).toBeNull();
    await user.click(screen.getByRole('button', { name: /Espacios/ }));
    expect(screen.getByRole('link', { name: /ConceptOne/ })).toHaveAttribute('href', '/conceptone');
    expect(screen.getAllByRole('link')).toHaveLength(12);
  });
});
