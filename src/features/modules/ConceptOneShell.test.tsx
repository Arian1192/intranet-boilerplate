import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { ConceptOneShell } from './ConceptOneShell';
import { RAIL_GROUPS } from '@/features/booking/shell/nav';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ConceptOneShell />
    </MemoryRouter>
  );
}

function rail() {
  return screen.getByRole('navigation');
}

beforeEach(() => {
  localStorage.clear();
});

describe('ConceptOneShell — carcasa apx', () => {
  it('envuelve el módulo en .apx y desplaza el contenido con .apx-shift', () => {
    const { container } = renderAt('/conceptone');
    const apx = container.querySelector('.apx');
    expect(apx).toBeInTheDocument();
    expect(within(apx as HTMLElement).getByRole('main')).toBeInTheDocument();
    expect(apx?.querySelector('.apx-shift')).toContainElement(screen.getByRole('main'));
  });

  it('ya no usa la cabecera compartida', () => {
    renderAt('/conceptone');
    expect(screen.queryByRole('banner')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Mi trabajo' })).toBeNull();
  });
});

describe('ApxRail — cabecera', () => {
  it('pinta el logo antlers y la marca, enlazando al dashboard', () => {
    renderAt('/conceptone');
    const marca = within(rail()).getByRole('link', { name: 'ConceptOne' });
    expect(marca).toHaveAttribute('href', '/conceptone');
    expect(marca.querySelector('img')).toHaveAttribute('src', '/logo_antlers.svg');
    expect(marca.querySelector('.brandtxt')).toHaveTextContent('ConceptOne');
  });

  it('trae el CTA «Añadir show» como botón', () => {
    renderAt('/conceptone');
    const cta = within(rail()).getByRole('button', { name: 'Añadir show' });
    expect(cta).toHaveClass('apx-cta');
  });
});

describe('ApxRail — los tres grupos', () => {
  it('rotula los grupos tal cual están en el DOM del live', () => {
    const { container } = renderAt('/conceptone');
    expect([...container.querySelectorAll('.apx-nav-cap')].map((e) => e.textContent)).toEqual([
      'Bookings',
      'Management',
      'Más',
    ]);
  });

  it('pinta los 21 ítems con sus rutas', () => {
    renderAt('/conceptone');
    for (const item of RAIL_GROUPS.flatMap((g) => g.items)) {
      const enlaces = within(rail()).getAllByRole('link', { name: item.label });
      expect(enlaces.some((e) => e.getAttribute('href') === item.href)).toBe(true);
    }
  });

  it('no pone title ni aria-label en ningún ítem: el live no los tiene', () => {
    const { container } = renderAt('/conceptone');
    for (const item of container.querySelectorAll('.apx-nav-item')) {
      expect(item).not.toHaveAttribute('title');
      expect(item).not.toHaveAttribute('aria-label');
    }
  });

  it('marca el ítem activo sin pastilla de fondo: sólo la clase .on', () => {
    const { container } = renderAt('/cobros');
    const activo = container.querySelector('.apx-nav-item.on');
    expect(activo).toHaveTextContent('Cobros');
    expect(activo).toHaveAttribute('href', '/cobros');
    expect(container.querySelectorAll('.apx-nav-item.on')).toHaveLength(1);
  });

  it('mantiene Incidencias encendida en su subruta de analítica', () => {
    const { container } = renderAt('/management/incidentes/analitica');
    expect(container.querySelector('.apx-nav-item.on')).toHaveTextContent('Incidencias');
  });

  it('no enciende Dashboard en las subrutas de /conceptone', () => {
    const { container } = renderAt('/conceptone/ajustes');
    expect(container.querySelector('.apx-nav-item.on')).toHaveTextContent('Ajustes');
  });
});

describe('ApxRail — el pie', () => {
  it('enlaza a la intranet y a Pendientes', () => {
    renderAt('/conceptone');
    expect(within(rail()).getByRole('link', { name: 'Black Moose' })).toHaveAttribute('href', '/');
    expect(within(rail()).getByRole('link', { name: 'Pendientes' })).toHaveAttribute(
      'href',
      '/conceptone/pendientes'
    );
  });

  it('trae la campana con su badge 9+ dentro de una fila inerte', () => {
    const { container } = renderAt('/conceptone');
    const campana = within(rail()).getByRole('button', { name: 'Notificaciones' });
    expect(campana).toHaveTextContent('9+');
    const fila = campana.closest('.apx-nav-item') as HTMLElement;
    expect(fila.style.cursor).toBe('default');
    expect(within(fila).getByText('Notificaciones')).toHaveClass('apx-nav-lab');
    expect(container.querySelector('.apx-side-foot')).toContainElement(fila);
  });

  it('lleva al perfil con nombre y rol', () => {
    renderAt('/conceptone');
    const perfil = within(rail()).getByRole('link', { name: /test/ });
    expect(perfil).toHaveClass('apx-prof');
    expect(perfil).toHaveAttribute('href', '/perfil');
    expect(perfil.querySelector('.nm')).toHaveTextContent('test');
    expect(perfil.querySelector('.rl')).toHaveTextContent('admin');
  });

  it('abre el panel de Ayuda desde el pie', async () => {
    const usuario = userEvent.setup();
    renderAt('/conceptone');
    await usuario.click(screen.getByRole('button', { name: 'Cerrar ayuda' }));
    expect(screen.queryByRole('button', { name: 'Cerrar ayuda' })).toBeNull();

    await usuario.click(within(rail()).getByRole('button', { name: 'Ayuda' }));
    expect(screen.getByRole('button', { name: 'Cerrar ayuda' })).toBeInTheDocument();
  });
});

describe('ApxShell — el tema', () => {
  it('en claro no pone el atributo data-theme: el claro es su ausencia', () => {
    const { container } = renderAt('/conceptone');
    expect(container.querySelector('.apx')).not.toHaveAttribute('data-theme');
    expect(localStorage.getItem('apx-tema')).toBeNull();
  });

  it('el botón «Modo noche» pone data-theme=dark y lo persiste', async () => {
    const usuario = userEvent.setup();
    const { container } = renderAt('/conceptone');

    await usuario.click(within(rail()).getByRole('button', { name: 'Modo noche' }));
    expect(container.querySelector('.apx')).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('apx-tema')).toBe('dark');

    await usuario.click(within(rail()).getByRole('button', { name: 'Modo noche' }));
    expect(container.querySelector('.apx')).not.toHaveAttribute('data-theme');
    expect(localStorage.getItem('apx-tema')).toBe('light');
  });

  it('arranca en oscuro si eso es lo guardado', () => {
    localStorage.setItem('apx-tema', 'dark');
    const { container } = renderAt('/conceptone');
    expect(container.querySelector('.apx')).toHaveAttribute('data-theme', 'dark');
  });
});
