/**
 * Espejo de /personal/usuarios del live (29 jul 2026), capturado read-only.
 * Es el editor de permisos del grupo: matriz Ver/Editar por seccion, cajas de
 * permisos por modulo y la tabla de cuentas de la intranet.
 * Evidencia: docs/references/config-usuarios/live-2026-07-29-*
 */

/** Una celda de la matriz: casilla marcable o «—» cuando el permiso no aplica. */
export type Celda = 'check' | 'na';

export interface FilaPermiso {
  nombre: string;
  /** Subtitulo explicativo que el live pinta bajo el nombre. */
  nota: string | null;
  ver: Celda;
  editar: Celda;
}

export interface BloqueMatriz {
  titulo: string;
  sub: string;
  filas: FilaPermiso[];
}

export const BLOQUES_MATRIZ: BloqueMatriz[] = [
  {
    titulo: 'CONCEPTONE · NAVEGACIÓN',
    sub: 'Qué páginas ve en el menú.',
    filas: [
      {
        nombre: 'Dashboard',
        nota: 'Las cajas del pipeline y lo que necesita atención.',
        ver: 'check',
        editar: 'na',
      },
      {
        nombre: 'Importes (€) en las cajas del Dashboard',
        nota: 'Sin esto ve el NÚMERO de shows en cada caja, no el dinero.',
        ver: 'check',
        editar: 'na',
      },
      {
        nombre: 'Shows',
        nota: 'El listado. Sin esto no llega a ninguna ficha.',
        ver: 'check',
        editar: 'na',
      },
      { nombre: 'Disponibilidad', nota: null, ver: 'check', editar: 'na' },
      { nombre: 'Contactos', nota: null, ver: 'check', editar: 'na' },
      {
        nombre: 'Artistas',
        nota: 'El listado de artistas. Lo que ve DENTRO se decide abajo.',
        ver: 'check',
        editar: 'na',
      },
      {
        nombre: 'Analítica',
        nota: 'Fees, bookers, comisiones. Es dinero.',
        ver: 'check',
        editar: 'na',
      },
      {
        nombre: 'Cobros',
        nota: 'Facturas y saldos de promotores. Editar = emitir/vincular facturas y «Facturar el mes».',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Gastos',
        nota: 'Movimientos de Holded. Editar = conciliar (asignar un movimiento a un show).',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Ajustes de ConceptOne',
        nota: 'Comisiones y exclusividad, plantillas de contrato, alertas, recordatorios de cobro.',
        ver: 'check',
        editar: 'check',
      },
    ],
  },
  {
    titulo: 'CONCEPTONE · FICHA DE SHOW',
    sub: 'Pestaña a pestaña. Lo que no marques, no lo ve: la pestaña ni aparece.',
    filas: [
      { nombre: 'Crear shows nuevos', nota: null, ver: 'check', editar: 'na' },
      { nombre: 'Evento', nota: 'Artista, fecha, venue, aforo.', ver: 'check', editar: 'check' },
      {
        nombre: 'Oferta',
        nota: 'El DEAL: fee, taquilla, IVA, comisión del booker. Es el dinero del show.',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Logística del deal',
        nota: 'Qué cubre el promotor (vuelos, hotel, ground, dietas) y el rider del show.',
        ver: 'check',
        editar: 'check',
      },
      { nombre: 'Set Times', nota: null, ver: 'check', editar: 'check' },
      { nombre: 'Artwork', nota: null, ver: 'check', editar: 'check' },
      {
        nombre: 'Contactos del show',
        nota: 'Signer, payer, promotor.',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Itinerario y gastos',
        nota: 'Vuelos, hotel, traslados… y los gastos del show (cerrarlos incluido).',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Contrato',
        nota: 'Generar, mandar a firmar y subir el firmado.',
        ver: 'check',
        editar: 'check',
      },
      { nombre: 'Pagos', nota: 'Plan de cobro al promotor.', ver: 'check', editar: 'check' },
      {
        nombre: 'Liquidación',
        nota: 'Cuentas finales y pagos al artista.',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Enviar el informe al artista',
        nota: 'El correo con la liquidación. Vive en la pestaña Liquidación.',
        ver: 'check',
        editar: 'na',
      },
      {
        nombre: 'Eliminar shows',
        nota: 'No hay botón en ninguna pantalla: hoy esto solo protege la API.',
        ver: 'check',
        editar: 'na',
      },
    ],
  },
  {
    titulo: 'CONCEPTONE · FICHA DE ARTISTA',
    sub: 'Un artista es un proyecto: aquí está desde su Spotify hasta su IBAN.',
    filas: [
      {
        nombre: 'Ficha artista',
        nota: 'Foto, redes, Spotify, estilos. La cara pública del proyecto.',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Ficha personal',
        nota: 'Miembros, nombres legales, DNI/pasaporte. Sin esto no se compra un vuelo.',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Condiciones económicas',
        nota: 'Booking fee %, management fee %, territorios, mail de liquidaciones.',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Rider técnico / hospitality',
        nota: 'Vive en la pestaña Condiciones, pero es OTRO permiso: lo necesita producción, no finanzas.',
        ver: 'check',
        editar: 'check',
      },
      { nombre: 'Documentación', nota: null, ver: 'check', editar: 'check' },
      { nombre: 'Contrato con el artista', nota: null, ver: 'check', editar: 'check' },
      {
        nombre: 'Roster',
        nota: 'Vista de tarjetas (foto + redes) de todo el roster, con acceso rápido a la Ficha artista.',
        ver: 'check',
        editar: 'check',
      },
    ],
  },
  {
    titulo: 'CONCEPTONE · MANAGEMENT',
    sub: 'Sadkiel y Patricia: incidentes de ConceptOne y estrategias de artista. Viven dentro del espacio ConceptOne.',
    filas: [
      {
        nombre: 'Incidencias',
        nota: 'Registro operativo de incidentes. Cada persona ve solo los suyos (reportados/owner/participante) salvo el permiso de dirección. Solo un admin puede borrarlos.',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Incidencias · Dirección (todas + confidenciales)',
        nota: 'Acceso total a todas e incidentes confidenciales (conducta, staff). Solo dirección/Management.',
        ver: 'check',
        editar: 'check',
      },
      {
        nombre: 'Estrategias de artista',
        nota: 'Estrategias de management por artista (shows, música, patrocinios, conexiones).',
        ver: 'check',
        editar: 'check',
      },
    ],
  },
];

export interface CajaPermisos {
  titulo: string;
  items: string[];
}

/** Las 11 cajas de checkboxes sueltos del grid, en el orden del live. */
export const CAJAS_PERMISOS: CajaPermisos[] = [
  {
    titulo: 'ETRA AGENCY',
    items: [
      'Ver Etra (cuentas, acciones, cobertura)',
      'Gestionar tareas (crear/editar acciones)',
      'Editar Etra (cuentas, cobertura, obligaciones)',
      'Ver facturación / retainer',
      'Editar facturación / retainer',
      'Ver Seeding (inventario, envíos, influencers)',
      'Editar Seeding (inventario, envíos, influencers)',
    ],
  },
  {
    titulo: 'TEAM · RRHH Y USUARIOS',
    items: [
      'Ver Team (equipo del grupo)',
      'Editar personas, empresas y horas',
      'Ver condiciones económicas',
      'Editar condiciones económicas',
      'Aprobar / rechazar vacaciones',
      'Gestionar usuarios de la intranet',
    ],
  },
  {
    titulo: 'CRM · CLIENTES',
    items: [
      'Ver CRM (clientes y contactos)',
      'Editar CRM (clientes y contactos)',
      'Ver pipeline de ventas',
      'Gestionar pipeline (oportunidades, etapas, objetivos)',
      'Ver KPIs comerciales',
    ],
  },
  {
    titulo: 'CRUDA · ROPA / MERCH',
    items: ['Ver CRUDA (pedidos y catálogo)', 'Editar CRUDA (pedidos, catálogo)'],
  },
  {
    titulo: 'PRODUCCIÓN · EVENTOS',
    items: [
      'Ver Producción (eventos, vídeo, foto)',
      'Editar Producción (eventos, tareas, presupuesto)',
    ],
  },
  {
    titulo: 'EUPHORIC MEDIA · MARKETING',
    items: [
      'Ver Euphoric (cuentas, campañas, calendario)',
      'Editar Euphoric (cuentas, campañas, contenido)',
    ],
  },
  {
    titulo: 'CREATIVOS · DISEÑO',
    items: ['Ver Creativos (tablero de piezas)', 'Editar Creativos (piezas, estados, adjuntos)'],
  },
  {
    titulo: 'MIXMAG',
    items: [
      'Ver Mixmag (contenidos, revistas)',
      'Editar Mixmag (escribir, maquetar, producir)',
      'PUBLICAR en Mixmag (web, revista, redes)',
      'Ver campañas de anunciantes e importes',
    ],
  },
  {
    titulo: 'TAGMAG',
    items: [
      'Ver TAGMAG (contenidos, revistas)',
      'Editar TAGMAG (escribir, maquetar, producir)',
      'PUBLICAR en TAGMAG',
      'Ver tarifas, campañas e importes',
    ],
  },
  {
    titulo: 'HERRAMIENTAS · UTILIDADES',
    items: ['Ver Proyecciones (P&L de eventos)', 'Crear y editar proyecciones'],
  },
  {
    titulo: 'BLACK MOOSE · GRUPO',
    items: ['Escribir novedades del grupo'],
  },
];

/** Plantillas de «Para empezar rapido»: sellos que marcan casillas, no roles. */
export const PLANTILLAS = [
  'Booker',
  'Logística',
  'Advancing / Finanzas',
  'Marketing',
  'Project Manager',
] as const;

export type TipoCuenta = 'Admin' | 'Interno' | 'Portal';
export type EstadoCuenta = 'Activo' | 'Pendiente';

export interface Cuenta {
  nombre: string;
  email: string;
  tipo: TipoCuenta;
  /** Si la cuenta tiene ficha en Team o usa la intranet sin ella. */
  ficha: 'team' | 'sin-ficha';
  estado: EstadoCuenta;
}

export const cuentas: Cuenta[] = [
  { nombre: 'Maf', email: 'maf@blackmoose.es', tipo: 'Interno', ficha: 'team', estado: 'Activo' },
  {
    nombre: 'Patricia Pareja Casalí',
    email: 'patricia@blackmoose.es',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Alberto Egea',
    email: 'alberto@blackmoose.es',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Fran Hinojosa Veredas',
    email: 'fran@blackmoose.es',
    tipo: 'Admin',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Sadkiel',
    email: 'sadkiel@blackmoose.es',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Jack Howell',
    email: 'jack@blackmoose.es',
    tipo: 'Admin',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Tony Carrerira',
    email: 'tony@blackmoose.es',
    tipo: 'Admin',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Jassi Gonzalez Montes',
    email: 'jassi@blackmoose.es',
    tipo: 'Admin',
    ficha: 'team',
    estado: 'Pendiente',
  },
  {
    nombre: 'gelabertalba',
    email: 'gelabertalba@gmail.com',
    tipo: 'Portal',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Alba G',
    email: 'alba@blackmoose.es',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Aldo Messina',
    email: 'aldo@conceptoneagency.com',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Yenifer Bernardo',
    email: 'yenifer@conceptoneagency.com',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'hello',
    email: 'hello@carlospego.com',
    tipo: 'Portal',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Israel Cuenca',
    email: 'israel@blackmoose.es',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Juan (Staff Level Test)',
    email: 'cpegomunoz@gmail.com',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Oscar Buch',
    email: 'oscar@conceptoneagency.com',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Alex González',
    email: 'alex@conceptoneagency.com',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'Joe Coe',
    email: 'joe@conceptoneagency.com',
    tipo: 'Interno',
    ficha: 'team',
    estado: 'Activo',
  },
  {
    nombre: 'test',
    email: 'test@blackmoose.es',
    tipo: 'Admin',
    ficha: 'sin-ficha',
    estado: 'Activo',
  },
  {
    nombre: 'Carlos Pego',
    email: 'carlos@blackmoose.es',
    tipo: 'Admin',
    ficha: 'team',
    estado: 'Activo',
  },
];

/**
 * Que casillas marca cada plantilla, capturado del live pulsando cada sello.
 * La clave es `${fila}|${columna}` (los 33 nombres de fila son unicos entre bloques).
 */
export const PERMISOS_PLANTILLA: Record<string, string[]> = {
  Booker: [
    'Dashboard|ver',
    'Importes (€) en las cajas del Dashboard|ver',
    'Shows|ver',
    'Disponibilidad|ver',
    'Contactos|ver',
    'Artistas|ver',
    'Crear shows nuevos|ver',
    'Evento|ver',
    'Evento|editar',
    'Oferta|ver',
    'Oferta|editar',
    'Logística del deal|ver',
    'Logística del deal|editar',
    'Set Times|ver',
    'Set Times|editar',
    'Artwork|ver',
    'Artwork|editar',
    'Contactos del show|ver',
    'Contactos del show|editar',
    'Itinerario y gastos|ver',
    'Ficha artista|ver',
    'Rider técnico / hospitality|ver',
  ],
  Logística: [
    'Dashboard|ver',
    'Shows|ver',
    'Disponibilidad|ver',
    'Contactos|ver',
    'Artistas|ver',
    'Gastos|ver',
    'Gastos|editar',
    'Evento|ver',
    'Logística del deal|ver',
    'Set Times|ver',
    'Contactos del show|ver',
    'Itinerario y gastos|ver',
    'Itinerario y gastos|editar',
    'Ficha artista|ver',
    'Ficha personal|ver',
    'Rider técnico / hospitality|ver',
    'Rider técnico / hospitality|editar',
  ],
  'Advancing / Finanzas': [
    'Dashboard|ver',
    'Importes (€) en las cajas del Dashboard|ver',
    'Shows|ver',
    'Artistas|ver',
    'Analítica|ver',
    'Cobros|ver',
    'Cobros|editar',
    'Gastos|ver',
    'Gastos|editar',
    'Evento|ver',
    'Oferta|ver',
    'Contactos del show|ver',
    'Itinerario y gastos|ver',
    'Contrato|ver',
    'Contrato|editar',
    'Pagos|ver',
    'Pagos|editar',
    'Liquidación|ver',
    'Liquidación|editar',
    'Enviar el informe al artista|ver',
    'Ficha artista|ver',
    'Condiciones económicas|ver',
    'Condiciones económicas|editar',
    'Documentación|ver',
  ],
  Marketing: [
    'Dashboard|ver',
    'Shows|ver',
    'Artistas|ver',
    'Evento|ver',
    'Set Times|ver',
    'Artwork|ver',
    'Artwork|editar',
    'Ficha artista|ver',
    'Ficha artista|editar',
  ],
  'Project Manager': [
    'Dashboard|ver',
    'Shows|ver',
    'Disponibilidad|ver',
    'Contactos|ver',
    'Artistas|ver',
    'Evento|ver',
    'Set Times|ver',
    'Contactos del show|ver',
    'Itinerario y gastos|ver',
    'Ficha artista|ver',
    'Ficha artista|editar',
    'Ficha personal|ver',
    'Ficha personal|editar',
    'Rider técnico / hospitality|ver',
    'Documentación|ver',
    'Documentación|editar',
  ],
};
