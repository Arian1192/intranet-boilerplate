import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when closed and content when open', () => {
    const { rerender } = render(
      <Modal open={false} title="Nueva entrega" onClose={() => {}}>
        <p>Contenido</p>
      </Modal>
    );
    expect(screen.queryByText('Nueva entrega')).not.toBeInTheDocument();

    rerender(
      <Modal open title="Nueva entrega" onClose={() => {}}>
        <p>Contenido</p>
      </Modal>
    );
    expect(screen.getByText('Nueva entrega')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('calls onClose when the overlay is clicked but not the panel', () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Nueva entrega" onClose={onClose}>
        <p>Contenido</p>
      </Modal>
    );
    fireEvent.click(screen.getByText('Contenido'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('presentation'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
