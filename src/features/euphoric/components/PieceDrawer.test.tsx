import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import { PieceDrawer } from './PieceDrawer';

test('shows fields when open and closes on Cerrar', async () => {
  const onClose = vi.fn();
  render(<PieceDrawer open onClose={onClose} />);
  expect(screen.getByText('Nueva pieza')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Ej: Reel lanzamiento v2')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
  expect(onClose).toHaveBeenCalled();
});

test('renders nothing when closed', () => {
  render(<PieceDrawer open={false} onClose={() => {}} />);
  expect(screen.queryByText('Nueva pieza')).toBeNull();
});
