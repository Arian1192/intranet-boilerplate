import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AjustesPage } from './AjustesPage';

async function abrir(panel: string) {
  const user = userEvent.setup();
  render(<AjustesPage />);
  await user.click(screen.getByRole('button', { name: panel }));
}

describe('AjustesPage — cabecera y menú', () => {
  it('calca el h1 y la bajada del live', () => {
    render(<AjustesPage />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Ajustes de ConceptOne' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Configuración del espacio de booking: administración, alertas, configuración y conexiones.'
      )
    ).toBeInTheDocument();
  });

  it('tiene los cuatro grupos y los DIEZ paneles', () => {
    render(<AjustesPage />);
    const menu = screen.getByRole('navigation');
    for (const grupo of ['Administración', 'Configuración', 'Conexiones']) {
      expect(within(menu).getByText(grupo)).toBeInTheDocument();
    }
    // «Alertas» sale dos veces en el menú: es grupo y es panel, como en el live.
    expect(within(menu).getAllByText('Alertas')).toHaveLength(2);
    expect(within(menu).getAllByRole('button')).toHaveLength(10);
    expect(within(menu).getByRole('button', { name: 'Ocultar movimientos' })).toBeInTheDocument();
  });

  it('abre por «Datos fiscales», que es el panel marcado', () => {
    render(<AjustesPage />);
    expect(screen.getByRole('button', { name: 'Datos fiscales' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    // Sale dos veces: es la razón social y el titular de la cuenta.
    expect(screen.getAllByDisplayValue('The Way You Grow SL')).toHaveLength(2);
  });

  it('cambiar de panel cambia el contenido y la marca del menú', async () => {
    const user = userEvent.setup();
    render(<AjustesPage />);
    await user.click(screen.getByRole('button', { name: 'Calendario Google' }));

    expect(screen.getByRole('button', { name: 'Calendario Google' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('button', { name: 'Datos fiscales' })).not.toHaveAttribute(
      'aria-current'
    );
    expect(screen.queryAllByDisplayValue('The Way You Grow SL')).toHaveLength(0);
  });
});

describe('AjustesPage — Datos fiscales', () => {
  it('es el único panel con la barra pegajosa de guardado', () => {
    render(<AjustesPage />);
    expect(screen.getByText('Guardado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  });

  it('trae las cuatro secciones y los quince campos', () => {
    render(<AjustesPage />);
    for (const seccion of ['Datos fiscales', 'Dirección', 'Contacto', 'Datos bancarios']) {
      expect(screen.getAllByText(seccion).length).toBeGreaterThan(0);
    }
    expect(screen.getByLabelText('NIF')).toHaveValue('ESB67606889');
    expect(screen.getByLabelText('IBAN')).toHaveValue('ES2301822918990202097219');
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('la dirección lleva el buscador de Google, sin valor', () => {
    render(<AjustesPage />);
    expect(screen.getByLabelText('Buscar dirección en Google')).toHaveAttribute(
      'placeholder',
      'Escribe la dirección y elige un resultado…'
    );
  });
});

describe('AjustesPage — Ocultar movimientos', () => {
  it('trae el textarea y las nueve píldoras', async () => {
    await abrir('Ocultar movimientos');
    expect(
      screen.getByRole('heading', { name: 'Ocultar movimientos en Gastos' })
    ).toBeInTheDocument();
    const textarea = screen.getByLabelText('Textos a ocultar (separa por comas)');
    expect(textarea).toHaveValue(
      'Sadkiel Ledezma, Joe Coe, Messina Gesualdo, Oscar Buch, Yenifer Bernardo, Patricia Pareja, Alejandro Gonzalez, Maria Fernanda, Borja Comino'
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(9);
  });
});

describe('AjustesPage — Contratos', () => {
  it('trae los dos plegables y las dos plantillas con su idioma', async () => {
    await abrir('Contratos');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Plantillas de contrato' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nueva plantilla' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Penalizaciones por cancelación del promotor/ })
    ).toBeInTheDocument();
    expect(screen.getByText('Booking Agreement · ConceptOne')).toBeInTheDocument();
    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('es')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(2);
  });
});

describe('AjustesPage — Comisiones y exclusividad', () => {
  it('dice «agente», que es el literal del live, no «booker»', async () => {
    await abrir('Comisiones y exclusividad');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Comisiones de agentes' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Cada agente tiene su propio %/)).toBeInTheDocument();
    expect(screen.queryByText(/booker/i)).toBeNull();
  });

  it('reutiliza los cuatro números de /configuracion', async () => {
    await abrir('Comisiones y exclusividad');
    expect(screen.getByLabelText('% sobre el Booking Fee')).toHaveValue(25);
    expect(screen.getByLabelText('Ventana (días)')).toHaveValue(30);
    expect(screen.getByLabelText('Radio de exclusividad (km)')).toHaveValue(100);
    expect(screen.getByLabelText('Salto logístico máx. (km)')).toHaveValue(600);
  });

  it('lista los 19 agentes, todos al porcentaje global', async () => {
    await abrir('Comisiones y exclusividad');
    const filas = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(filas).toHaveLength(19);
    expect(filas[0]).toHaveTextContent('Alba G');
    expect(screen.getAllByText('(global 25%)')).toHaveLength(19);
  });
});

describe('AjustesPage — Alertas', () => {
  it('trae el banner de activo y sus dos botones', async () => {
    await abrir('Alertas');
    expect(screen.getByText('Activo — se están mandando avisos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver a modo prueba' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Evaluar y avisar ahora' })).toBeInTheDocument();
  });

  it('agrupa las nueve reglas por dueño y dice a quién avisa cada una', async () => {
    await abrir('Alertas');
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Agente',
      'Logística',
      'Advancing',
    ]);
    const reglas = screen.getAllByRole('group', { name: /^Regla / });
    expect(reglas).toHaveLength(9);
    expect(reglas[0]).toHaveTextContent('Oferta sin respuesta');
    expect(reglas[0]).toHaveTextContent('Avisa a:');
    expect(reglas[0]).toHaveTextContent('el agente del show');
    // El live mete «Cambiar» dentro del propio botón de «Avisa a», no aparte.
    expect(screen.getAllByRole('button', { name: /^Avisa a:.*Cambiar$/ })).toHaveLength(9);
  });
});

describe('AjustesPage — Recordatorios', () => {
  it('está apagado, con su cadencia y su copia interna', async () => {
    await abrir('Recordatorios');
    expect(screen.getByLabelText('Enviar recordatorios automáticamente')).not.toBeChecked();
    expect(screen.getByLabelText('Cadencia (días entre recordatorios)')).toHaveValue(7);
    expect(screen.getByLabelText('Copia interna (CC)')).toHaveValue('administracion@blackmoose.es');
  });

  it('trae los cinco marcadores y el conmutador de idioma', async () => {
    await abrir('Recordatorios');
    for (const marcador of ['{cliente}', '{doc}', '{pendiente}', '{importe}', '{shows}']) {
      expect(screen.getByText(marcador)).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'ES' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('AjustesPage — Confirmación de show', () => {
  it('trae las siete variables con su explicación', async () => {
    await abrir('Confirmación de show');
    expect(screen.getByText('{codigo}')).toBeInTheDocument();
    expect(screen.getByText('Código del show')).toBeInTheDocument();
    expect(screen.getByText('{venue}')).toBeInTheDocument();
  });

  it('lista los 21 campos esenciales en seis secciones', async () => {
    await abrir('Confirmación de show');
    const campos = screen.getAllByRole('group', { name: /^Campo esencial / });
    expect(campos).toHaveLength(21);
    expect(within(campos[0]).getByLabelText('Obligatorio')).toBeChecked();
    expect(within(campos[1]).getByLabelText('Obligatorio')).not.toBeChecked();
    expect(
      within(campos[0])
        .getAllByRole('option')
        .map((o) => o.textContent)
    ).toEqual(['No aparece', 'Informativo', 'Amarillo']);
  });

  it('cierra sin mensajes personalizados', async () => {
    await abrir('Confirmación de show');
    expect(screen.getByRole('button', { name: '+ Añadir mensaje' })).toBeInTheDocument();
    expect(screen.getByText('Sin mensajes.')).toBeInTheDocument();
  });
});

describe('AjustesPage — Formulario de ofertas', () => {
  it('está activo y trae sus 30 campos con etiqueta ES y EN', async () => {
    await abrir('Formulario de ofertas');
    expect(screen.getByRole('button', { name: '✓ Activo' })).toBeInTheDocument();
    const filas = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(filas).toHaveLength(30);
    expect(within(filas[0]).getByDisplayValue('Fecha del evento')).toBeInTheDocument();
    expect(within(filas[0]).getByDisplayValue('Event Date')).toBeInTheDocument();
    expect(filas[0]).toHaveTextContent('evento_fecha · date');
  });

  it('trae los ocho colores, los del formulario y los del embed', async () => {
    const user = userEvent.setup();
    const { container } = render(<AjustesPage />);
    await user.click(screen.getByRole('button', { name: 'Formulario de ofertas' }));

    const colores = container.querySelectorAll('input[type="color"]');
    expect(colores).toHaveLength(8);
    expect(Array.from(colores).map((c) => (c as HTMLInputElement).value)).toEqual([
      '#170a24',
      '#7c3aed',
      '#f59e0b',
      '#0f172a',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#111111',
    ]);
    // El live escribe el hex al lado del selector, en minúscula.
    expect(screen.getAllByText('#170a24')).toHaveLength(1);
  });
});

describe('AjustesPage — Extras de logística', () => {
  it('son cuatro líneas y 31 extras, con etiqueta ES y EN', async () => {
    await abrir('Extras de logística');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Viaje',
      'Transporte terrestre',
      'Hospedaje',
      'Dietas / hospitality',
    ]);
    const filas = screen
      .getAllByRole('row')
      .filter((f) => within(f).queryAllByRole('textbox').length > 0);
    expect(filas).toHaveLength(31);
    expect(within(filas[0]).getByDisplayValue('Vuelos directos')).toBeInTheDocument();
    expect(within(filas[0]).getByDisplayValue('Direct flights only')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Añadir' })).toHaveLength(4);
  });
});

describe('AjustesPage — Calendario Google', () => {
  it('está apagado, con la plantilla y la ventana del live', async () => {
    await abrir('Calendario Google');
    expect(screen.getByLabelText('Sincronización activa')).not.toBeChecked();
    expect(screen.getByLabelText('Plantilla del título del evento')).toHaveValue(
      '{estado} - {venue}, {ciudad}'
    );
    expect(screen.getByLabelText('Días hacia atrás')).toHaveValue(90);
    expect(screen.getByLabelText('Días hacia delante')).toHaveValue(260);
  });

  it('trae las seis casillas de la descripción, cuatro marcadas', async () => {
    await abrir('Calendario Google');
    expect(screen.getByLabelText('Line up completo')).toBeChecked();
    expect(screen.getByLabelText('Dirección del venue')).not.toBeChecked();
    expect(screen.getByLabelText('Estado de pago (no recomendado)')).not.toBeChecked();
  });

  it('trae la cuenta de servicio y cuántos artistas están enlazados', async () => {
    await abrir('Calendario Google');
    expect(
      screen.getByText('google-calendar-api@abstract-stream-503019-a4.iam.gserviceaccount.com')
    ).toBeInTheDocument();
    expect(screen.getByText(/de 192 artistas con calendario enlazado/)).toHaveTextContent('38');
    expect(screen.getByRole('button', { name: 'Sincronizar ahora' })).toBeInTheDocument();
  });
});
