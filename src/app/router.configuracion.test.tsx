import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AppRouter } from './router';

afterEach(cleanup);

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRouter />
    </MemoryRouter>
  );
}

describe('rutas de Configuración', () => {
  it('la ruta índice abre Plantillas de correo', async () => {
    renderRoute('/configuracion');
    expect(await screen.findByRole('heading', { level: 1, name: 'Plantillas de correo' })).toBeInTheDocument();
    expect(screen.getByText('Uso y coste')).toBeInTheDocument();
  });

  it.each([
    ['/configuracion/uso', 'Uso del sistema'],
    ['/configuracion/incidencias', 'Incidencias'],
    ['/configuracion/documentos', 'Documentos · tipografía'],
    ['/configuracion/notificaciones', 'Notificaciones'],
    ['/configuracion/comisiones', 'Comisiones de bookers'],
    ['/configuracion/comisiones-pagos', 'Control de comisiones'],
    ['/configuracion/contratos', 'Plantillas de contrato'],
    ['/configuracion/alertas', 'Alertas de producción'],
    ['/configuracion/rrhh', 'RRHH'],
    ['/configuracion/festivos', 'Festivos'],
  ])('%s abre %s', (path, heading) => {
    renderRoute(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });
});
