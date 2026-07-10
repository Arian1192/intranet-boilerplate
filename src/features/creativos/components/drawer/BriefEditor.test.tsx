import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BriefEditor } from './BriefEditor';

describe('BriefEditor', () => {
  it('renders the toolbar buttons and the contenteditable body with placeholder', () => {
    const { container } = render(<BriefEditor />);
    ['Negrita', 'Cursiva', 'Subrayado', 'Tachado', 'Quitar formato'].forEach((t) =>
      expect(screen.getByRole('button', { name: t })).toBeInTheDocument(),
    );
    const body = container.querySelector('[contenteditable="true"]');
    expect(body).not.toBeNull();
    expect(body).toHaveAttribute('data-placeholder', expect.stringContaining('Qué necesita la pieza'));
  });
});
