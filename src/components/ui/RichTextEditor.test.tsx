import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RichTextEditor } from './RichTextEditor';

const flush = () => new Promise((r) => setTimeout(r, 50));

describe('RichTextEditor', () => {
  it('renders the toolbar and an editable region; format buttons do not crash', async () => {
    const { container } = render(<RichTextEditor />);
    await flush();
    ['Negrita', 'Cursiva', 'Subrayado', 'Tachado', 'Quitar formato'].forEach((t) =>
      expect(screen.getByRole('button', { name: t })).toBeInTheDocument(),
    );
    expect(container.querySelector('.ProseMirror, [contenteditable="true"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Negrita' }));
    fireEvent.click(screen.getByRole('button', { name: 'Quitar formato' }));
  });
});
