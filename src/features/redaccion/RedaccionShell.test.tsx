import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { RedaccionShell } from './RedaccionShell';
import { ResumenPage } from './pages/ResumenPage';
import { RevistasPage } from './pages/RevistasPage';
import { MIXMAG } from './data/seed';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/mixmag" element={<RedaccionShell magazine={MIXMAG} />}>
          <Route index element={<ResumenPage />} />
          <Route path="revistas" element={<RevistasPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('RedaccionShell', () => {
  it('renderiza las 4 pestañas y el Resumen en el index', () => {
    renderAt('/mixmag');
    for (const tab of ['Resumen', 'Contenidos', 'Campañas', 'Revistas']) {
      expect(screen.getByRole('link', { name: tab })).toBeInTheDocument();
    }
    expect(screen.getByText('Publicaciones')).toBeInTheDocument();
  });

  it('la pestaña Revistas apunta a basePath/revistas y renderiza esa página', () => {
    renderAt('/mixmag/revistas');
    expect(screen.getByRole('link', { name: 'Revistas' })).toHaveAttribute('href', '/mixmag/revistas');
    expect(screen.queryByText('Ninguna edición todavía.')).toBeNull();
    expect(screen.getByText('Patrick Topping')).toBeInTheDocument();
  });
});
