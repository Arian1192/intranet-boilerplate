import { describe, it, expect } from 'vitest';
import { commissionSettings } from '@/features/configuracion/data/comisiones';
import {
  GRUPOS_AJUSTES,
  PANEL_POR_DEFECTO,
  seccionesFiscales,
  ocultarMovimientos,
  contratos,
  AGENTES_COMISION,
  ajustesComision,
  alertas,
  recordatorios,
  confirmacionShow,
  formularioOfertas,
  extrasLogistica,
  calendarioGoogle,
} from './ajustes-conceptone';

describe('el menú de los ajustes', () => {
  it('son cuatro grupos y DIEZ paneles, no los nueve del spec', () => {
    expect(GRUPOS_AJUSTES.map((g) => g.titulo)).toEqual([
      'Administración',
      'Alertas',
      'Configuración',
      'Conexiones',
    ]);
    expect(GRUPOS_AJUSTES.flatMap((g) => g.paneles)).toEqual([
      'Datos fiscales',
      'Ocultar movimientos',
      'Contratos',
      'Comisiones y exclusividad',
      'Alertas',
      'Recordatorios',
      'Confirmación de show',
      'Formulario de ofertas',
      'Extras de logística',
      'Calendario Google',
    ]);
  });

  it('el que falta en el spec es «Ocultar movimientos», y está en Administración', () => {
    expect(GRUPOS_AJUSTES[0].paneles).toContain('Ocultar movimientos');
  });

  it('abre por «Datos fiscales», como el live', () => {
    expect(PANEL_POR_DEFECTO).toBe('Datos fiscales');
  });
});

describe('panel Datos fiscales', () => {
  it('son cuatro secciones y quince campos', () => {
    expect(seccionesFiscales.map((s) => s.titulo)).toEqual([
      'Datos fiscales',
      'Dirección',
      'Contacto',
      'Datos bancarios',
    ]);
    expect(seccionesFiscales.flatMap((s) => s.campos)).toHaveLength(15);
  });

  it('trae los datos de la empresa del live', () => {
    const campos = seccionesFiscales.flatMap((s) => s.campos);
    expect(campos[0]).toMatchObject({ etiqueta: 'Razón social', valor: 'The Way You Grow SL' });
    expect(campos[1]).toMatchObject({ etiqueta: 'NIF', valor: 'ESB67606889' });
    expect(campos.find((c) => c.etiqueta === 'IBAN')?.valor).toBe('ES2301822918990202097219');
    expect(campos.find((c) => c.etiqueta === 'Teléfono')?.valor).toBe('');
  });

  it('la dirección lleva su buscador de Google, que no es un campo más', () => {
    const direccion = seccionesFiscales[1];
    expect(direccion.buscador).toEqual({
      etiqueta: 'Buscar dirección en Google',
      placeholder: 'Escribe la dirección y elige un resultado…',
    });
  });
});

describe('panel Ocultar movimientos', () => {
  it('el textarea y las píldoras dicen lo mismo', () => {
    expect(ocultarMovimientos.chips).toHaveLength(9);
    expect(ocultarMovimientos.valor.split(', ')).toEqual(ocultarMovimientos.chips);
    expect(ocultarMovimientos.chips[0]).toBe('Sadkiel Ledezma');
  });
});

describe('panel Contratos', () => {
  it('trae los dos plegables y las dos plantillas del live', () => {
    expect(contratos.plegables.map((p) => p.titulo)).toEqual([
      'Penalizaciones por cancelación del promotor',
      'Firma de la agencia (contrafirma)',
    ]);
    expect(contratos.plantillas.map((p) => [p.titulo, p.idioma])).toEqual([
      ['Booking Agreement · ConceptOne', 'en'],
      ['Contrato de actuación · ConceptOne', 'es'],
    ]);
  });
});

describe('panel Comisiones y exclusividad', () => {
  it('reutiliza los ajustes que ya teníamos en /configuracion', () => {
    expect(ajustesComision).toEqual(commissionSettings());
    expect(ajustesComision).toEqual({
      globalPercent: 25,
      exclusivityWindowDays: 30,
      exclusivityRadiusKm: 100,
      logisticJumpKm: 600,
    });
  });

  it('lista los 19 agentes del live, ninguno con % propio', () => {
    expect(AGENTES_COMISION).toHaveLength(19);
    expect(AGENTES_COMISION[0]).toBe('Alba G');
    expect(AGENTES_COMISION[AGENTES_COMISION.length - 1]).toBe('Yenifer Bernardo');
  });
});

describe('panel Alertas', () => {
  it('está en modo activo, no en prueba', () => {
    expect(alertas.banner).toBe('Activo — se están mandando avisos');
  });

  it('agrupa las nueve reglas por dueño', () => {
    expect(alertas.grupos.map((g) => [g.rol, g.reglas.length])).toEqual([
      ['Agente', 1],
      ['Logística', 3],
      ['Advancing', 5],
    ]);
  });

  it('cada regla dice a quién avisa, que es lo que el live subraya', () => {
    for (const grupo of alertas.grupos) {
      for (const regla of grupo.reglas) {
        expect(regla.avisa).toBeTruthy();
      }
    }
    expect(alertas.grupos[0].reglas[0]).toMatchObject({
      titulo: 'Oferta sin respuesta',
      dias: 7,
      avisa: 'el agente del show',
    });
  });
});

describe('panel Recordatorios', () => {
  it('está apagado, con cadencia de 7 días y copia interna', () => {
    expect(recordatorios.activo).toBe(false);
    expect(recordatorios.cadencia).toBe(7);
    expect(recordatorios.cc).toBe('administracion@blackmoose.es');
  });

  it('trae los cinco marcadores de la plantilla', () => {
    expect(recordatorios.marcadores).toEqual([
      '{cliente}',
      '{doc}',
      '{pendiente}',
      '{importe}',
      '{shows}',
    ]);
  });
});

describe('panel Confirmación de show', () => {
  it('trae las siete variables con su explicación', () => {
    expect(confirmacionShow.variables).toHaveLength(7);
    expect(confirmacionShow.variables[0]).toEqual({
      clave: '{codigo}',
      explicacion: 'Código del show',
    });
  });

  it('son seis secciones y 21 campos esenciales', () => {
    expect(confirmacionShow.secciones.map((s) => s.titulo)).toEqual([
      'Evento',
      'Set Times',
      'Oferta',
      'Logística',
      'Contactos',
      'Pagos',
    ]);
    expect(confirmacionShow.secciones.flatMap((s) => s.campos)).toHaveLength(21);
  });

  it('sólo cuatro campos son obligatorios', () => {
    const obligatorios = confirmacionShow.secciones
      .flatMap((s) => s.campos)
      .filter((c) => c.obligatorio);
    expect(obligatorios.map((c) => c.nombre)).toEqual([
      'Artista',
      'Fecha',
      'Deal',
      'Plan de pagos',
    ]);
  });

  it('arranca sin mensajes personalizados', () => {
    expect(confirmacionShow.mensajes).toEqual([]);
  });
});

describe('panel Formulario de ofertas', () => {
  it('está activo y trae los 30 campos con sus dos etiquetas', () => {
    expect(formularioOfertas.activo).toBe(true);
    expect(formularioOfertas.campos).toHaveLength(30);
    expect(formularioOfertas.campos[0]).toEqual({
      clave: 'evento_fecha',
      tipo: 'date',
      es: 'Fecha del evento',
      en: 'Event Date',
      visible: true,
      obligatorio: true,
    });
  });

  it('trae los cuatro colores del formulario y los cuatro del embed', () => {
    expect(formularioOfertas.colores.map((c) => c.valor)).toEqual([
      '#170a24',
      '#7c3aed',
      '#f59e0b',
      '#0f172a',
    ]);
    expect(formularioOfertas.coloresEmbed.map((c) => c.valor)).toEqual([
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#111111',
    ]);
  });
});

describe('panel Extras de logística', () => {
  it('son cuatro líneas y 31 extras', () => {
    expect(extrasLogistica.map((l) => [l.linea, l.filas.length])).toEqual([
      ['Viaje', 6],
      ['Transporte terrestre', 5],
      ['Hospedaje', 15],
      ['Dietas / hospitality', 5],
    ]);
    expect(extrasLogistica.reduce((t, l) => t + l.filas.length, 0)).toBe(31);
  });

  it('cada extra lleva su etiqueta en los dos idiomas', () => {
    for (const linea of extrasLogistica) {
      for (const fila of linea.filas) {
        expect(fila.es).not.toBe('');
        expect(fila.en).not.toBe('');
      }
    }
    expect(extrasLogistica[0].filas[0]).toMatchObject({
      es: 'Vuelos directos',
      en: 'Direct flights only',
      activo: true,
    });
  });
});

describe('panel Calendario Google', () => {
  it('está apagado, con la plantilla y la ventana del live', () => {
    expect(calendarioGoogle.sincronizacionActiva).toBe(false);
    expect(calendarioGoogle.plantilla).toBe('{estado} - {venue}, {ciudad}');
    expect(calendarioGoogle.diasAtras).toBe(90);
    expect(calendarioGoogle.diasDelante).toBe(260);
  });

  it('trae las seis casillas de la descripción, cuatro marcadas', () => {
    expect(calendarioGoogle.incluir).toHaveLength(6);
    expect(calendarioGoogle.incluir.filter((i) => i.marcado)).toHaveLength(4);
    expect(calendarioGoogle.incluir[5]).toEqual({
      texto: 'Estado de pago (no recomendado)',
      marcado: false,
    });
  });

  it('trae la cuenta de servicio y los artistas enlazados', () => {
    expect(calendarioGoogle.email).toBe(
      'google-calendar-api@abstract-stream-503019-a4.iam.gserviceaccount.com'
    );
    expect(calendarioGoogle.enlazados).toEqual({ conCalendario: 38, total: 192 });
  });
});
