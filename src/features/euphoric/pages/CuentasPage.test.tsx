import '@testing-library/jest-dom';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, test, expect } from 'vitest';
import { CuentasPage } from './CuentasPage';

afterEach(cleanup);

function renderPage() {
  render(
    <MemoryRouter>
      <CuentasPage />
    </MemoryRouter>
  );
}

async function openSight() {
  renderPage();
  await userEvent.click(screen.getByRole('button', { name: /SIGHT/ }));
}

describe('listado de cuentas (calco del live 2026-07-29)', () => {
  test('cabecera y estado vacío del panel', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Cuentas' })).toBeInTheDocument();
    expect(
      screen.getByText('Clientes y marcas que gestiona Euphoric. Los clientes externos se enlazan al CRM del grupo.')
    ).toBeInTheDocument();
    expect(screen.getByText('Selecciona una cuenta o crea una nueva.')).toBeInTheDocument();
  });

  test.each([
    ['Mogli Marbella', 'Cliente', 'Pausada'],
    ['Opium Bcn', 'Cliente · Paid media', 'Activa'],
    ['SIGHT', 'Cliente · Redes sociales, Paid media, Contenido', 'Activa'],
  ])('la fila de %s muestra "%s" y el estado %s', async (name, subtitle, status) => {
    renderPage();
    const row = screen.getByRole('button', { name: new RegExp(name) });
    expect(within(row).getByText(subtitle)).toBeInTheDocument();
    expect(within(row).getByText(status)).toBeInTheDocument();
  });

  test('+ Nueva cuenta abre el formulario de alta', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: '+ Nueva cuenta' }));
    expect(screen.getByText('Cuenta interna del grupo (no es cliente externo)')).toBeInTheDocument();
  });
});

describe('ficha de cuenta (7 pestañas del live)', () => {
  test('cabecera con salud de la cuenta y acción de eliminar', async () => {
    await openSight();
    expect(screen.getByRole('heading', { level: 2, name: 'SIGHT' })).toBeInTheDocument();
    expect(screen.getByText('Sana')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
  });

  test('las 7 pestañas están en el orden del live', async () => {
    await openSight();
    const tabs = screen.getByRole('navigation', { name: 'Pestañas de la cuenta' });
    expect(within(tabs).getAllByRole('button').map((b) => b.textContent)).toEqual([
      'General',
      'Servicios',
      'Rentabilidad',
      'Solicitudes',
      'Branding',
      'BDD',
      'Automatizaciones',
    ]);
  });

  test('General es la pestaña por defecto y trae los datos de la cuenta', async () => {
    await openSight();
    expect(screen.getByLabelText('Nombre de la cuenta *')).toHaveValue('SIGHT');
    expect(screen.getByLabelText('Retainer mensual (€)')).toHaveValue('800');
    expect(screen.getByText('Manual por ahora; se automatizará al integrar Holded.')).toBeInTheDocument();
    expect(screen.getByText('ENLACE DE APROBACIÓN DEL CLIENTE')).toBeInTheDocument();
    expect(screen.getByText('PORTAL DE CLIENTE')).toBeInTheDocument();
  });

  test('Servicios: sin servicios contratados', async () => {
    await openSight();
    await userEvent.click(screen.getByRole('button', { name: 'Servicios' }));
    expect(screen.getByRole('heading', { name: 'Servicios contratados' })).toBeInTheDocument();
    expect(
      screen.getByText('Packs, recurrentes y proyectos de esta cuenta. Los packs muestran el consumo del periodo.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Contratar servicio' })).toBeInTheDocument();
    expect(screen.getByText('Sin servicios contratados.')).toBeInTheDocument();
  });

  test('Rentabilidad: 4 KPIs a cero y coste/hora del espacio', async () => {
    await openSight();
    await userEvent.click(screen.getByRole('button', { name: 'Rentabilidad' }));
    expect(screen.getByText('Facturación (aprox.)')).toBeInTheDocument();
    expect(screen.getByText('Margen')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Facturación estimada por retainer × meses; se afinará con Holded. Total imputado: 0m · coste/hora 25 €.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Sin horas imputadas todavía.')).toBeInTheDocument();
  });

  test('Solicitudes: bandeja vacía', async () => {
    await openSight();
    await userEvent.click(screen.getByRole('button', { name: 'Solicitudes' }));
    expect(screen.getByText('PETICIONES E INCIDENCIAS')).toBeInTheDocument();
    expect(screen.getByText('Sin solicitudes.')).toBeInTheDocument();
  });

  test('Branding: kit de marca con sus bloques vacíos', async () => {
    await openSight();
    await userEvent.click(screen.getByRole('button', { name: 'Branding' }));
    expect(screen.getByText('BRANDING · KIT DE MARCA')).toBeInTheDocument();
    expect(screen.getByText('Sin logos.')).toBeInTheDocument();
    expect(screen.getByText('Sin colores.')).toBeInTheDocument();
    expect(screen.getByText('Sin recursos.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar branding' })).toBeInTheDocument();
  });

  test('BDD: las dos listas limpiadas del live', async () => {
    await openSight();
    await userEvent.click(screen.getByRole('button', { name: 'BDD' }));
    expect(screen.getByText('BASES DE DATOS (CSV/EXCEL)')).toBeInTheDocument();
    expect(
      screen.getByText('— · SIGHT: Oden & Fatzo, KOKO b2b Bizza, Jan, Caste · 258 contactos limpios (de 408)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('— · SIGHT: Nicole Moudaber, Miane, Galgo, Janse · 84 contactos limpios (de 158)')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Listo')).toHaveLength(2);
  });

  test('Automatizaciones: 2 plantillas de publicación y 2 de creatividad', async () => {
    await openSight();
    await userEvent.click(screen.getByRole('button', { name: 'Automatizaciones' }));
    expect(screen.getByRole('heading', { name: 'Plantillas de publicación' })).toBeInTheDocument();
    expect(screen.getAllByLabelText('Título').map((input) => (input as HTMLInputElement).value)).toEqual([
      'Set Times {evento}',
      'Salida {evento}',
    ]);
    expect(screen.getByRole('heading', { name: 'Plantillas de creatividad' })).toBeInTheDocument();
    expect(screen.getAllByLabelText('Nombre').map((input) => (input as HTMLInputElement).value)).toEqual([
      'Flyer {evento}',
      'Set Times {evento}',
    ]);
    expect(screen.getAllByText('Offset (días) · D-1')).toHaveLength(1);
    expect(screen.getAllByText('Deadline (días) · D-30')).toHaveLength(1);
  });

  test('Mogli Marbella no arrastra los datos de SIGHT', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /Mogli Marbella/ }));
    await userEvent.click(screen.getByRole('button', { name: 'BDD' }));
    expect(screen.getByText('Sin bases de datos.')).toBeInTheDocument();
  });
});
