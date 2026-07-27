import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { CreativosShell } from './CreativosShell';

function renderShell() {
  return render(
    <MemoryRouter initialEntries={['/creativos']}>
      <Routes>
        <Route path="/creativos" element={<CreativosShell />}>
          <Route index element={<div data-testid="creativos-page">Tablero</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('CreativosShell', () => {
  it('rotula la única pestaña como "Creatividades" apuntando a /creativos', () => {
    renderShell();
    const tab = screen.getByRole('link', { name: 'Creatividades' });
    expect(tab).toBeInTheDocument();
    expect(tab).toHaveAttribute('href', '/creativos');
    expect(screen.queryByRole('link', { name: 'Piezas' })).not.toBeInTheDocument();
  });

  it('renderiza el outlet', () => {
    renderShell();
    expect(screen.getByTestId('creativos-page')).toBeInTheDocument();
  });
});
