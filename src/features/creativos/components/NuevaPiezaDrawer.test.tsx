import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NuevaPiezaDrawer } from './NuevaPiezaDrawer';

describe('NuevaPiezaDrawer', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<NuevaPiezaDrawer open={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the form with "Media" priority active by default when open', () => {
    render(<NuevaPiezaDrawer open onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Nueva pieza' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Reel lanzamiento v2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Media' })).toHaveClass('bg-brand-50');
  });

  it('selects priority and toggles a ratio via local state', () => {
    render(<NuevaPiezaDrawer open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Alta' }));
    expect(screen.getByRole('button', { name: 'Alta' })).toHaveClass('bg-brand-50');
    expect(screen.getByRole('button', { name: 'Media' })).not.toHaveClass('bg-brand-50');
    const ratio = screen.getByRole('button', { name: '9:16' });
    expect(ratio).not.toHaveClass('bg-brand-50');
    fireEvent.click(ratio);
    expect(ratio).toHaveClass('bg-brand-50');
  });

  it('calls onClose from the ✕, Cerrar, Guardar and overlay', () => {
    const onClose = vi.fn();
    const { container } = render(<NuevaPiezaDrawer open onClose={onClose} />);
    // The ✕ button (aria-label="Cerrar") and the footer "Cerrar" button share the
    // accessible name "Cerrar" — there are exactly two, click both.
    const closers = screen.getAllByRole('button', { name: 'Cerrar' });
    expect(closers).toHaveLength(2);
    closers.forEach((btn) => fireEvent.click(btn));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(container.querySelector('[aria-hidden="true"]')!); // overlay
    expect(onClose).toHaveBeenCalledTimes(4);
  });
});
