/**
 * Datos de `/conceptone/ajustes`.
 *
 * Calcados de `f1-conceptone--ajustes` y de los diez paneles capturados uno a
 * uno (live del 2026-09-09, 10:09 CEST).
 *
 * **Son diez paneles, no los nueve del spec**: al inventario le faltaba
 * `Ocultar movimientos`.
 *
 * Un aviso sobre el vocabulario: el live dice **«agente»** donde en
 * `/configuracion` decimos «booker». Aquí se calca el literal del live, y
 * `/configuracion` se deja como está — el renombrado global es otra ronda.
 */

import { commissionSettings } from '@/features/configuracion/data/comisiones';

export interface GrupoAjustes {
  titulo: string;
  paneles: string[];
}

export const GRUPOS_AJUSTES: GrupoAjustes[] = [
  {
    titulo: 'Administración',
    paneles: ['Datos fiscales', 'Ocultar movimientos', 'Contratos', 'Comisiones y exclusividad'],
  },
  { titulo: 'Alertas', paneles: ['Alertas', 'Recordatorios'] },
  {
    titulo: 'Configuración',
    paneles: ['Confirmación de show', 'Formulario de ofertas', 'Extras de logística'],
  },
  { titulo: 'Conexiones', paneles: ['Calendario Google'] },
];

export const PANEL_POR_DEFECTO = 'Datos fiscales';

export interface CampoFiscal {
  etiqueta: string;
  valor: string;
  /** Los que el live pinta a doble ancho. */
  ancho?: 'completo';
  tipo?: 'email';
}

export interface SeccionFiscal {
  titulo: string;
  campos: CampoFiscal[];
  /** Sólo la sección `Dirección` lleva el autocompletado de Google. */
  buscador?: { etiqueta: string; placeholder: string };
}

export const seccionesFiscales: SeccionFiscal[] = [
  {
    titulo: 'Datos fiscales',
    campos: [
      { etiqueta: 'Razón social', valor: 'The Way You Grow SL' },
      { etiqueta: 'NIF', valor: 'ESB67606889' },
    ],
  },
  {
    titulo: 'Dirección',
    buscador: {
      etiqueta: 'Buscar dirección en Google',
      placeholder: 'Escribe la dirección y elige un resultado…',
    },
    campos: [
      {
        etiqueta: 'Dirección',
        valor: "Carrer d'Àlaba, 140-146 Sobreático 4, Sant Martí, 08018 Barcelona, España",
        ancho: 'completo',
      },
      { etiqueta: 'Población', valor: 'Barcelona' },
      { etiqueta: 'Código postal', valor: '08018' },
      { etiqueta: 'Provincia', valor: 'Catalunya' },
      { etiqueta: 'País', valor: 'España' },
    ],
  },
  {
    titulo: 'Contacto',
    campos: [
      { etiqueta: 'Email', valor: 'info@conceptoneagency.com', tipo: 'email' },
      { etiqueta: 'Teléfono', valor: '' },
      { etiqueta: 'Web', valor: 'https://conceptoneagency.com', ancho: 'completo' },
    ],
  },
  {
    titulo: 'Datos bancarios',
    campos: [
      { etiqueta: 'Banco', valor: 'Banco Bilbao Vizcaya Argentaria, S.A.' },
      { etiqueta: 'Titular de la cuenta', valor: 'The Way You Grow SL' },
      { etiqueta: 'IBAN', valor: 'ES2301822918990202097219' },
      { etiqueta: 'SWIFT/BIC', valor: 'BBVAESMMXXX' },
      {
        etiqueta: 'Firmante (representante legal)',
        valor: 'Jassi Alex Gonzalez Montes',
        ancho: 'completo',
      },
    ],
  },
];

export const ocultarMovimientos = {
  titulo: 'Ocultar movimientos en Gastos',
  descripcion:
    'Los movimientos cuya descripción contenga alguno de estos textos NO aparecerán en la página de Gastos, para nadie. Útil para pagos internos (nóminas, facturas de trabajadores) que no debe ver quien concilia vuelos y demás.',
  etiqueta: 'Textos a ocultar (separa por comas)',
  placeholder: 'nómina, seguros sociales, The Way You Grow, Claudia Garcia, Yeray Javier…',
  nota: 'No distingue mayúsculas ni acentos parciales; se busca el texto dentro de la descripción del movimiento.',
  valor:
    'Sadkiel Ledezma, Joe Coe, Messina Gesualdo, Oscar Buch, Yenifer Bernardo, Patricia Pareja, Alejandro Gonzalez, Maria Fernanda, Borja Comino',
  chips: [
    'Sadkiel Ledezma',
    'Joe Coe',
    'Messina Gesualdo',
    'Oscar Buch',
    'Yenifer Bernardo',
    'Patricia Pareja',
    'Alejandro Gonzalez',
    'Maria Fernanda',
    'Borja Comino',
  ],
};

export interface PlantillaContrato {
  titulo: string;
  /** El live lo escribe en minúscula y lo sube el CSS. */
  idioma: string;
  descripcion: string;
}

export const contratos = {
  titulo: 'Plantillas de contrato',
  descripcion:
    'Escribe el contrato con variables {{grupo.campo}}; se rellenan con los datos del show al generarlo.',
  plegables: [
    {
      titulo: 'Penalizaciones por cancelación del promotor',
      texto:
        'Cláusula estándar que se inserta con la variable {{contrato.penalizaciones}}. Ajústala aquí si quieres.',
    },
    {
      titulo: 'Firma de la agencia (contrafirma)',
      texto:
        'Se estampa automáticamente en el contrato antes de enviarlo a firmar. Hay una firma cargada.',
    },
  ],
  plantillas: [
    {
      titulo: 'Booking Agreement · ConceptOne',
      idioma: 'en',
      descripcion:
        'Contrato de actuación completo: desglose económico en tabla, plan de pagos, logística y rider.',
    },
    {
      titulo: 'Contrato de actuación · ConceptOne',
      idioma: 'es',
      descripcion:
        'Contrato de actuación completo: desglose económico en tabla, plan de pagos, logística y rider.',
    },
  ] as PlantillaContrato[],
};

/**
 * Los cuatro números de este panel son **exactamente** los que ya teníamos en
 * `/configuracion/comisiones`, así que se reutilizan en vez de copiarse.
 */
export const ajustesComision = commissionSettings();

/** Los 19 agentes del live. Ninguno tiene % propio: todos van al global. */
export const AGENTES_COMISION: string[] = [
  'Alba G',
  'Alberto Egea',
  'Aldo Messina',
  'Alex González',
  'Carlos Pego',
  'Fran Hinojosa Veredas',
  'Israel Cuenca',
  'Jack Howell',
  'Jassi Gonzalez Montes',
  'Joe Coe',
  'Juan (Staff Level Test)',
  'Maf',
  'Meritxell Pareja Casalí',
  'Oscar Buch',
  'Patricia Pareja Casalí',
  'Sadkiel',
  'test',
  'Tony Carrerira',
  'Yenifer Bernardo',
];

export interface ReglaAlerta {
  titulo: string;
  descripcion: string;
  /** Días del disparo; `null` cuando el live lo deja vacío. */
  dias: number | null;
  activa: boolean;
  email: boolean;
  /** El dueño del aviso, que es de lo que va este panel. */
  avisa: string;
  /** El punto de color de la izquierda del título. */
  punto: string;
}

export interface GrupoAlertas {
  rol: string;
  texto: string;
  reglas: ReglaAlerta[];
}

export const alertas = {
  titulo: 'Alertas de shows',
  descripcion:
    'Lo que vigila que un show no se caiga por un hueco. Cada aviso tiene un dueño: si le llega a tres personas, no lo atiende ninguna.',
  banner: 'Activo — se están mandando avisos',
  nota: 'Cada día a las 07:15 se avisa a los destinatarios de cada regla. Una alerta se manda una vez; si el problema se arregla y reaparece, vuelve a saltar.',
  grupos: [
    {
      rol: 'Agente',
      texto: 'Su lead, su llamada. Nadie más puede perseguir una oferta.',
      reglas: [
        {
          titulo: 'Oferta sin respuesta',
          descripcion:
            'Se emitió una oferta y el show sigue en tentativa. O el promotor no contesta, o nadie ha vuelto a llamarle.',
          dias: 7,
          activa: true,
          email: true,
          avisa: 'el agente del show',
          punto: 'bg-amber-400',
        },
      ],
    },
    {
      rol: 'Logística',
      texto: 'Lo que hay que cerrar antes de que el artista se suba a un avión.',
      reglas: [
        {
          titulo: 'Itinerario sin cerrar',
          descripcion:
            'A una semana del show el itinerario (vuelos, hoteles...) sigue sin cerrar. A partir de aquí cuestan el doble.',
          dias: 10,
          activa: true,
          email: false,
          avisa: 'Alex González, Oscar Buch',
          punto: 'bg-amber-400',
        },
        {
          titulo: 'Logística sin definir en contrato',
          descripcion:
            'Quedan bloques de logística en «sin decidir»: no es que no se cubran, es que nadie los ha mirado.',
          dias: 7,
          activa: true,
          email: false,
          avisa: 'el agente del show',
          punto: 'bg-amber-400',
        },
        {
          titulo: 'Gastos sin cerrar',
          descripcion:
            'Quedan gastos sin cerrar y el show es esta semana. Deberían estar cerrados ANTES: sin ellos no se puede liquidar, y cada día que pasa se recuerda peor lo que se gastó.',
          dias: 3,
          activa: true,
          email: false,
          avisa: 'Alex González, Oscar Buch',
          punto: 'bg-amber-400',
        },
      ],
    },
    {
      rol: 'Advancing',
      texto: 'El papel y el dinero: contrato, cobro y liquidación.',
      reglas: [
        {
          titulo: 'Confirmado y sin contrato firmado',
          descripcion:
            'El show está confirmado pero el contrato no está firmado. Sin contrato no hay a quién reclamar si el promotor se cae.',
          dias: 21,
          activa: true,
          email: false,
          avisa: 'Joe Coe',
          punto: 'bg-rose-500',
        },
        {
          titulo: 'Contrato firmado y sin plan de cobro',
          descripcion:
            'El contrato está firmado pero no hay ni una fila de cobro. Sin plan de pago el show NO avanza solo a Liquidación.',
          dias: 14,
          activa: true,
          email: false,
          avisa: 'Joe Coe',
          punto: 'bg-amber-400',
        },
        {
          titulo: 'Show sin liquidar',
          descripcion:
            'Pasó hace un mes y el dinero sigue sin liquidarse. Esto es caja que no ha entrado o un artista al que no se ha pagado.',
          dias: 5,
          activa: true,
          email: false,
          avisa: 'Joe Coe',
          punto: 'bg-rose-500',
        },
        {
          titulo: 'Cobro en efectivo pendiente',
          descripcion:
            'Este show tiene un cobro en efectivo que hay que pedir en sala antes de actuar. Si no se cobra en el momento, no se cobra.',
          dias: 3,
          activa: true,
          email: false,
          avisa: 'Alex González, Joe Coe, Oscar Buch',
          punto: 'bg-rose-500',
        },
        {
          titulo: 'Cobro vencido',
          descripcion:
            'Hay un tramo del plan de pagos vencido y sin cobrar: el promotor va tarde. Cada día que pasa es dinero fuera de plazo.',
          dias: 0,
          activa: true,
          email: true,
          avisa: 'el agente del show',
          punto: 'bg-rose-500',
        },
      ],
    },
  ] as GrupoAlertas[],
};

export const recordatorios = {
  titulo: 'Recordatorios de cobro',
  descripcion:
    'Emails automáticos a los clientes por las facturas vencidas y sin cobrar. Se envía uno por factura, respetando la cadencia.',
  activo: false,
  cadencia: 7,
  cc: 'administracion@blackmoose.es',
  idiomas: ['ES', 'EN'],
  marcadores: ['{cliente}', '{doc}', '{pendiente}', '{importe}', '{shows}'],
};

export interface CampoEsencial {
  nombre: string;
  obligatorio: boolean;
}

export interface SeccionEsencial {
  titulo: string;
  campos: CampoEsencial[];
}

export const confirmacionShow = {
  titulo: 'Confirmación de show · correo al promotor',
  descripcion:
    'Define qué datos son esenciales y cómo aparecen en el correo automático al confirmar un show. Obligatorio bloquea el envío si está vacío; el correo decide cómo se muestra al promotor.',
  /** Las tres formas en que un campo puede salir en el correo. */
  presentacion: ['No aparece', 'Informativo', 'Amarillo'],
  variables: [
    { clave: '{codigo}', explicacion: 'Código del show' },
    { clave: '{artista}', explicacion: 'Artista' },
    { clave: '{evento}', explicacion: 'Evento (fiesta)' },
    { clave: '{fecha}', explicacion: 'Fecha' },
    { clave: '{ciudad}', explicacion: 'Ciudad' },
    { clave: '{pais}', explicacion: 'País' },
    { clave: '{venue}', explicacion: 'Venue' },
  ],
  secciones: [
    {
      titulo: 'Evento',
      campos: [
        { nombre: 'Artista', obligatorio: true },
        { nombre: 'Evento', obligatorio: false },
        { nombre: 'Fecha', obligatorio: true },
        { nombre: 'Ciudad', obligatorio: false },
        { nombre: 'País', obligatorio: false },
        { nombre: 'Venue', obligatorio: false },
        { nombre: 'Dirección del venue', obligatorio: false },
        { nombre: 'Aforo', obligatorio: false },
        { nombre: 'Horarios (doors, curfew)', obligatorio: false },
        { nombre: 'Line-up', obligatorio: false },
        { nombre: 'Billing (cartel)', obligatorio: false },
        { nombre: 'Duración del set', obligatorio: false },
      ],
    },
    {
      titulo: 'Set Times',
      campos: [{ nombre: 'Set times', obligatorio: false }],
    },
    {
      titulo: 'Oferta',
      campos: [{ nombre: 'Deal', obligatorio: true }],
    },
    {
      titulo: 'Logística',
      campos: [
        { nombre: 'Viaje', obligatorio: false },
        { nombre: 'Traslados internos (ground)', obligatorio: false },
        { nombre: 'Alojamiento', obligatorio: false },
        { nombre: 'Buyout', obligatorio: false },
      ],
    },
    {
      titulo: 'Contactos',
      campos: [
        { nombre: 'Firmante (nombre + email)', obligatorio: false },
        {
          nombre: 'Empresa + datos fiscales (NIF, razón social, dirección de facturación)',
          obligatorio: false,
        },
      ],
    },
    {
      titulo: 'Pagos',
      campos: [{ nombre: 'Plan de pagos', obligatorio: true }],
    },
  ] as SeccionEsencial[],
  /** El live no tiene ninguno todavía: «Sin mensajes.». */
  mensajes: [] as string[],
  vacioMensajes: 'Sin mensajes.',
};

export interface CampoFormulario {
  clave: string;
  tipo: string;
  es: string;
  en: string;
  visible: boolean;
  obligatorio: boolean;
}

export const formularioOfertas = {
  activo: true,
  descripcion: 'Si lo desactivas, el formulario embebido deja de aceptar propuestas.',
  campos: [
    {
      clave: 'evento_fecha',
      tipo: 'date',
      es: 'Fecha del evento',
      en: 'Event Date',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'importe',
      tipo: 'number',
      es: 'Presupuesto',
      en: 'Budget',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'moneda',
      tipo: 'select',
      es: 'Moneda',
      en: 'Currency',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'booking_fee_on_top',
      tipo: 'radio_si_no',
      es: 'Booking fee aparte',
      en: 'Booking Fee On Top',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'retencion_pct',
      tipo: 'number',
      es: '% Retención (si aplica)',
      en: '% Withholding Tax if applicable',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'lineup',
      tipo: 'tags',
      es: 'Line up confirmado',
      en: 'Confirmed Line Up',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'set_duracion_min',
      tipo: 'number',
      es: 'Duración del set (min)',
      en: 'Set Duration (In Minutes)',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'paga_viaje',
      tipo: 'toggle',
      es: 'También paga el viaje (vuelos, tren, bus)',
      en: 'Will also pay for travel (Flights, Train, Bus)',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'paga_alojamiento',
      tipo: 'toggle',
      es: 'También paga alojamiento',
      en: 'Will also pay for accommodation',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'paga_transporte',
      tipo: 'toggle',
      es: 'También paga transporte terrestre',
      en: 'Will also pay for ground transportation',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'evento_nombre',
      tipo: 'text',
      es: 'Nombre del evento',
      en: 'Event Name',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'venue',
      tipo: 'text',
      es: 'Sala / venue',
      en: 'Venue Name',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'aforo',
      tipo: 'number',
      es: 'Aforo',
      en: 'Venue Capacity',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'ciudad',
      tipo: 'text',
      es: 'Ciudad',
      en: 'Venue City',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'venue_direccion',
      tipo: 'text',
      es: 'Dirección',
      en: 'Venue Address',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'pais',
      tipo: 'text',
      es: 'País',
      en: 'Venue Country',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'venue_web',
      tipo: 'text',
      es: 'Web del venue',
      en: 'Venue Website',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'promotor_nombre',
      tipo: 'text',
      es: 'Nombre',
      en: 'First Name',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'promotor_apellido',
      tipo: 'text',
      es: 'Apellidos',
      en: 'Last Name',
      visible: true,
      obligatorio: true,
    },
    { clave: 'email', tipo: 'email', es: 'Email', en: 'Email', visible: true, obligatorio: true },
    {
      clave: 'telefono',
      tipo: 'tel',
      es: 'Teléfono',
      en: 'Phone',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'promotor_empresa',
      tipo: 'text',
      es: 'Empresa / promotora',
      en: 'Company/Organization',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'promotor_vat',
      tipo: 'text',
      es: 'VAT / CIF / Tax Number',
      en: 'Organization VAT / CNPJ / Tax Number',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'promotor_direccion',
      tipo: 'text',
      es: 'Dirección',
      en: 'Address',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'promotor_ciudad',
      tipo: 'text',
      es: 'Ciudad',
      en: 'City',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'promotor_region',
      tipo: 'text',
      es: 'Provincia / Estado',
      en: 'State / Province',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'promotor_cp',
      tipo: 'text',
      es: 'Código postal',
      en: 'Zip Code',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'promotor_pais',
      tipo: 'text',
      es: 'País',
      en: 'Country',
      visible: true,
      obligatorio: true,
    },
    {
      clave: 'mensaje',
      tipo: 'textarea',
      es: 'Mensaje para el agente',
      en: 'Message to Agent',
      visible: true,
      obligatorio: false,
    },
    {
      clave: 'set_times',
      tipo: 'text',
      es: 'Horario de actuación (set times)',
      en: 'Set times',
      visible: true,
      obligatorio: false,
    },
  ] as CampoFormulario[],
  colores: [
    { etiqueta: 'Fondo base', valor: '#170a24' },
    { etiqueta: 'Degradado 1', valor: '#7c3aed' },
    { etiqueta: 'Degradado 2', valor: '#f59e0b' },
    { etiqueta: 'Botón (acento)', valor: '#0f172a' },
  ],
  coloresEmbed: [
    { etiqueta: 'Texto', valor: '#ffffff' },
    { etiqueta: 'Líneas campos', valor: '#ffffff' },
    { etiqueta: 'Botón', valor: '#ffffff' },
    { etiqueta: 'Texto botón', valor: '#111111' },
  ],
};

export interface ExtraLogistica {
  es: string;
  en: string;
  porDefecto: boolean;
  activo: boolean;
}

export interface LineaExtras {
  linea: string;
  filas: ExtraLogistica[];
}

export const extrasLogistica: LineaExtras[] = [
  {
    linea: 'Viaje',
    filas: [
      { es: 'Vuelos directos', en: 'Direct flights only', porDefecto: false, activo: true },
      {
        es: 'Equipaje facturado incluido',
        en: 'Checked baggage included',
        porDefecto: false,
        activo: true,
      },
      {
        es: 'Billete flexible / reembolsable',
        en: 'Flexible / refundable ticket',
        porDefecto: false,
        activo: true,
      },
      { es: 'Priority boarding', en: 'Priority boarding', porDefecto: true, activo: true },
      { es: 'Salida por la mañana', en: 'Morning departure', porDefecto: false, activo: true },
      { es: 'Maleta de mano incluída', en: 'Cabin bag included', porDefecto: true, activo: true },
    ],
  },
  {
    linea: 'Transporte terrestre',
    filas: [
      {
        es: 'Conductor de habla inglesa',
        en: 'English Speaking Driver',
        porDefecto: false,
        activo: true,
      },
      { es: 'Conductor sobrio', en: 'Sober Driver', porDefecto: false, activo: true },
      { es: 'No Uber / Taxi', en: 'No Uber / Taxi', porDefecto: true, activo: true },
      { es: 'Agua a bordo', en: 'Water on board', porDefecto: false, activo: true },
      { es: 'Vehículo de gama alta', en: 'Premium vehicle', porDefecto: false, activo: true },
    ],
  },
  {
    linea: 'Hospedaje',
    filas: [
      { es: 'Crédito de 50€ en habitación', en: '50€ Room Credit', porDefecto: true, activo: true },
      { es: 'Wifi gratis', en: 'Free Wifi', porDefecto: true, activo: true },
      { es: 'Desayuno incluido', en: 'Free Breakfast', porDefecto: true, activo: true },
      { es: 'Check-in anticipado', en: 'Early check-in', porDefecto: true, activo: true },
      { es: 'Check-out tardío', en: 'Late check-out', porDefecto: true, activo: true },
      { es: 'Aire acondicionado', en: 'Air Conditioning', porDefecto: true, activo: true },
      { es: 'Calefacción', en: 'Heat', porDefecto: false, activo: true },
      { es: 'Parking gratis', en: 'Free Parking', porDefecto: false, activo: true },
      { es: 'Gimnasio gratis', en: 'Free Gym', porDefecto: false, activo: true },
      {
        es: 'Servicio de habitaciones 24h',
        en: '24hr Room Service',
        porDefecto: true,
        activo: true,
      },
      { es: 'Cafetera en habitación', en: 'Coffee Pot / Machine', porDefecto: false, activo: true },
      { es: 'Minibar', en: 'Mini Bar', porDefecto: false, activo: true },
      { es: 'Caja fuerte', en: 'Safe', porDefecto: false, activo: true },
      { es: 'Comida incluida', en: 'Lunch included', porDefecto: false, activo: true },
      { es: 'Cena incluida', en: 'Dinner included', porDefecto: false, activo: true },
    ],
  },
  {
    linea: 'Dietas / hospitality',
    filas: [
      { es: 'Agua embotellada', en: 'Bottled water', porDefecto: false, activo: true },
      { es: 'Comida caliente', en: 'Hot meal', porDefecto: false, activo: true },
      {
        es: 'Opciones vegetarianas / veganas',
        en: 'Vegetarian / vegan options',
        porDefecto: false,
        activo: true,
      },
      { es: 'Toallas de backstage', en: 'Backstage towels', porDefecto: false, activo: true },
      { es: 'Catering en backstage', en: 'Backstage catering', porDefecto: false, activo: true },
    ],
  },
];

export const calendarioGoogle = {
  titulo: 'Sincronización con Google Calendar',
  descripcion:
    'Empuja los shows y los holds de cada artista a SU calendario de Google (una vía: la Intranet manda). El nombre del artista y cualquier dato económico nunca viajan — es su propio calendario y no hace falta.',
  sincronizacionActiva: false,
  plantilla: '{estado} - {venue}, {ciudad}',
  incluir: [
    { texto: 'Line up completo', marcado: true },
    { texto: 'Dirección del venue', marcado: false },
    { texto: 'Doors / curfew', marcado: true },
    { texto: 'Su set time', marcado: true },
    { texto: 'Nota pública', marcado: true },
    { texto: 'Estado de pago (no recomendado)', marcado: false },
  ],
  diasAtras: 90,
  diasDelante: 260,
  email: 'google-calendar-api@abstract-stream-503019-a4.iam.gserviceaccount.com',
  enlazados: { conCalendario: 38, total: 192 },
};
