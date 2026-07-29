/**
 * Novedades de Mi trabajo — calco literal del feed del live (29 jul 2026).
 * Capturado read-only con Playwright: 36 entradas con su tipo, módulo, audiencia,
 * fecha, tags y el detalle expandible (cuerpo + «Por qué» + «Podría interesarte para…»).
 */

export const TIPOS_NOVEDAD = ['Nuevo', 'Mejora', 'Arreglo'] as const;
export type TipoNovedad = (typeof TIPOS_NOVEDAD)[number];

export const AUDIENCIAS = ['Todos', 'Solo equipo', 'Solo Admin'] as const;
export type Audiencia = (typeof AUDIENCIAS)[number];

export interface DetalleNovedad {
  cuerpo: string | null;
  porQue: string | null;
  paraQuien: string[];
}

export interface Novedad {
  id: string;
  tipo: TipoNovedad;
  modulo: string;
  audiencia: Audiencia;
  titulo: string;
  resumen: string;
  fecha: string;
  tags: string[];
  noLeida: boolean;
  detalle: DetalleNovedad;
}

export const novedades: Novedad[] = [
  {
    id: 'n01',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Una factura puede cubrir varios shows',
    resumen:
      'Cuando os contratan varios artistas la misma fecha, o facturáis a un cliente varias fechas del mes, una misma factura de Holded se vincula a todos los shows y el cobro se reparte solo entre ellos.',
    fecha: '29 de julio de 2026',
    tags: ['Facturación', 'Bookings'],
    noLeida: true,
    detalle: {
      cuerpo:
        'En la pestaña Pagos, al vincular una factura ya existente en Holded puedes indicar la «parte de este show»; el mismo documento queda enlazado a cada show con su porción y aparece marcado como «Compartida con» los demás. El cobro real de Holded se reparte de forma proporcional a cada show y marca solo sus tramos del plan de pagos: sin ajustes a mano. En Cobros hay una vista nueva «Por factura» para ver cada factura con su cliente, importe, cobrado, pendiente y los shows que incluye.',
      porQue:
        'Antes cada documento de Holded solo podía vivir en un show, así que las facturas conjuntas (dos artistas un día, o la mensual de un cliente) no cuadraban el cobro.',
      paraQuien: [
        'Facturáis varios artistas en una fecha',
        'Pasáis factura mensual a un cliente por varias fechas',
      ],
    },
  },
  {
    id: 'n02',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Solo equipo',
    titulo: '«Facturar el mes» de un cliente',
    resumen:
      'Desde Cobros, un asistente que junta los shows de un cliente en un periodo y emite una sola factura en Holded con una línea por show.',
    fecha: '29 de julio de 2026',
    tags: ['Facturación', 'Bookings'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Eliges cliente y rango de fechas (por defecto el mes en curso), marcas los shows a incluir —los ya facturados salen desmarcados— y se emite un único documento (proforma o factura) con su total e IVA por línea, vinculado a cada show. A partir de ahí el cobro se reparte y sincroniza solo.',
      porQue:
        'Preparar la factura mensual de un cliente que trabaja varias fechas era ir show a show; ahora es un clic.',
      paraQuien: ['Facturáis clientes que cogen artistas todo el mes'],
    },
  },
  {
    id: 'n03',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Solo Admin',
    titulo: 'Recordatorios de cobro automáticos al cliente',
    resumen:
      'El sistema puede escribir solo al cliente por las facturas vencidas y sin cobrar, con copia interna.',
    fecha: '29 de julio de 2026',
    tags: ['Facturación', 'Bookings'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Un aviso diario revisa las facturas con saldo pendiente y vencimiento pasado y manda un email al cliente (en español o inglés según su ficha), respetando una cadencia para no repetir y con opción de silenciar por factura. Va desactivado de fábrica: administración lo enciende cuando quiera.',
      porQue: 'Reclamar el pago a tiempo sin depender de que alguien se acuerde de escribir.',
      paraQuien: ['Llevas los cobros de los promotores'],
    },
  },
  {
    id: 'n04',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'La ficha del show, por pasos',
    resumen:
      'Las pestañas del show se leen como una secuencia numerada (Evento → Liquidación); las de antes del contrato van marcadas como «preparación», y en móvil hay un selector con pasos.',
    fecha: '29 de julio de 2026',
    tags: ['Bookings', 'Navegación', 'UI'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Las pestañas pasan a tipo carpeta, numeradas y en orden temporal, con Pagos antes de Contrato (el acuerdo de pago se fija antes de que salga en el contrato). Guardar y Offer Sheet quedan siempre a la vista dentro del panel. En móvil aparece un selector desplegable con flechas para avanzar y la lista agrupada.',
      porQue:
        'Es la pantalla donde más trabaja el equipo; tenía que leerse de un vistazo y funcionar bien en móvil.',
      paraQuien: ['Trabajas fichas de show a diario'],
    },
  },
  {
    id: 'n05',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Ficha de empresa del CRM renovada',
    resumen:
      'Más compacta, con las personas de contacto dentro, el comprobador de VAT en la propia caja y la dirección de Google que se reparte sola en sus campos.',
    fecha: '29 de julio de 2026',
    tags: ['CRM', 'UI'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Tipo (empresa/persona) y los dos nombres en una fila; Cliente/Proveedor/Lead arriba; NIF y VAT juntos con un check que pasa a verde al validar. La caja de dirección busca en Google y se queda solo con la calle y el número, repartiendo población, código postal, provincia y país en sus cajas. Las personas de contacto de la empresa se ven y se editan desde la propia ficha, también con la empresa ya seteada. Ya no se cierra al hacer clic fuera sin querer.',
      porQue:
        'Se perdían cambios al cerrarse sin querer, no se veían los contactos y la dirección entraba entera en un campo.',
      paraQuien: [
        'Das de alta o editas empresas del CRM',
        'Vinculas contactos, venue o dirección a una empresa',
      ],
    },
  },
  {
    id: 'n06',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Contactos del show con la ficha de la empresa a mano',
    resumen:
      'Bajo el Signer y el Payer aparece un resumen de la empresa (NIF, VAT, dirección, banco…) con botón de copiar en cada dato.',
    fecha: '29 de julio de 2026',
    tags: ['Bookings', 'CRM'],
    noLeida: false,
    detalle: {
      cuerpo: null,
      porQue:
        'Se entra a Contactos sobre todo a copiar datos para el contrato o la factura; tenerlos ahí ahorra abrir la ficha.',
      paraQuien: ['Preparas contratos o facturas del show'],
    },
  },
  {
    id: 'n07',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Fichas a revisar: todo lo que falta de cada artista',
    resumen:
      'El panel del dashboard lista, ordenado por artista y por miembro, los datos personales vacíos y los documentos que faltan (mínimo un ID y un pasaporte por persona).',
    fecha: '29 de julio de 2026',
    tags: ['Artistas', 'Documentos'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Además de las bios y las caducidades, ahora señala por cada miembro los campos sin rellenar (rol, nacionalidad, fecha de nacimiento, teléfono, dirección…) y si le falta el documento de ID (DNI/NIE) o el pasaporte. Tiene filtro por tipo (datos, documentos, bios) para el empuje de documentación.',
      porQue:
        'Estamos dando de alta y migrando artistas y el equipo necesitaba una lista para no dejarse nada.',
      paraQuien: ['Completas las fichas personales de los artistas', 'Gestionas la documentación'],
    },
  },
  {
    id: 'n08',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Set times y line-up más listos',
    resumen:
      'Sala como desplegable con todas las salas, B2B/B3B en un set time, el artista se elige del cartel del evento, y los nombres del line-up se abren en su ficha.',
    fecha: '29 de julio de 2026',
    tags: ['Bookings', 'Spotify'],
    noLeida: false,
    detalle: {
      cuerpo:
        'La sala se elige de una lista (Main Room por defecto). En un mismo set time puedes poner dos o tres artistas tocando a la vez (b2b/b3b) eligiéndolos del cartel. El desplegable de artista en set times solo muestra los del line-up del evento, no toda la base de datos. Los nombres del cartel con ficha se pueden clicar para ver el perfil del artista (foto de Spotify, redes, próximos shows) y editarlo. Y al crear un artista externo desde el cartel puedes vincularlo a Spotify ahí mismo.',
      porQue:
        'Poner set times era lento y no reflejaba los b2b ni bebía del cartel; y crear un artista obligaba a ir luego a vincular Spotify.',
      paraQuien: ['Montas set times y line-ups', 'Trabajas fiestas con varios artistas o b2b'],
    },
  },
  {
    id: 'n09',
    tipo: 'Arreglo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'La fecha de cierre del show ya se guarda',
    resumen: 'Elegir la fecha de cierre ya no se descartaba cuando no había hora de curfew.',
    fecha: '29 de julio de 2026',
    tags: ['Bookings', 'Estabilidad'],
    noLeida: false,
    detalle: {
      cuerpo: null,
      porQue:
        'El campo estaba atado a la hora de cierre: sin hora, la fecha que elegías no se quedaba.',
      paraQuien: ['Fijas la fecha de fin de un show'],
    },
  },
  {
    id: 'n10',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Extras de logística configurables (y habitación DUI / Doble)',
    resumen:
      'Cada línea de logística (viaje, transporte, hotel, dietas) tiene extras que se marcan con un clic y salen en el contrato; algunos vienen ya seleccionados.',
    fecha: '27 de julio de 2026',
    tags: ['Bookings', 'Condiciones'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Los extras (p. ej. «50€ Room Credit», «Free Wifi», «Conductor sobrio») se configuran una vez para todos en Ajustes → Extras de logística, con etiqueta en español e inglés, y se pueden marcar «por defecto» para que aparezcan preseleccionados en cada show. En hotel se indica ahora si la habitación es de ocupación doble o de uso individual (DUI) —doble por defecto, para que quepa el acompañante aunque el promotor solo pague por el artista—. Viaje y transporte incluyen la opción Ferry.',
      porQue:
        'Pedíamos siempre lo mismo escrito a mano y a veces no cuadraba con el idioma del contrato; ahora es parte del sistema.',
      paraQuien: [
        'Negocias logística con promotores',
        'Mandas contratos con condiciones de hotel o transporte',
      ],
    },
  },
  {
    id: 'n11',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'El contrato entero sale en el idioma de la plantilla',
    resumen:
      'Si eliges la plantilla en inglés, todo el contenido —logística, estructura del deal, plan de pagos, fechas, tabla y firmas— sale en inglés, no solo el texto fijo.',
    fecha: '27 de julio de 2026',
    tags: ['Bookings', 'Facturación'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Antes el molde era ES/EN pero los datos rellenados salían siempre en español. Ahora también se traducen según la plantilla: medio de viaje, categoría de hotel y tipo de habitación, estructura del deal, plan de pagos, IVA, quién cobra, la cabecera de la tabla económica, las fechas y las firmas.',
      porQue:
        'Un contrato en inglés con la logística y las fechas en español no daba buena imagen.',
      paraQuien: ['Mandas contratos a promotores internacionales'],
    },
  },
  {
    id: 'n12',
    tipo: 'Arreglo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Liquidaciones: estado correcto y sin dobles 100%',
    resumen:
      'Un show solo pasa a «Liquidado» cuando se ha liquidado el 100%; al añadir una liquidación se propone el importe que queda, no otro total.',
    fecha: '27 de julio de 2026',
    tags: ['Liquidaciones', 'Bookings'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Antes un anticipo parcial pagado ya pintaba el show como «Liquidado» en verde. Ahora esa fase entra solo con la liquidación total o final pagada y sin tramos pendientes (y se corrige sola si deja de estar completa). «Añadir liquidación» precarga el importe restante, y «Liquidación total» desaparece como opción cuando ya hay tramos. El estado se llama ahora «Parcialmente liquidado» / «Sin liquidar» (antes «abonado»).',
      porQue:
        'El verde de «Liquidado» tiene que significar pagado del todo, y no dejar meter un 100% sobre algo ya cobrado a medias.',
      paraQuien: ['Llevas las liquidaciones a los artistas'],
    },
  },
  {
    id: 'n13',
    tipo: 'Arreglo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'El territorio del show se deduce bien del país del venue',
    resumen:
      'Al elegir un venue en el extranjero, el territorio se fija correctamente aunque el país venga con otro nombre (p. ej. «República Dominicana»), y aplica sus reglas.',
    fecha: '27 de julio de 2026',
    tags: ['Condiciones', 'Calculadora'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Un show en Santo Domingo se quedaba en territorio España y no entraba la regla de LATAM (sin management fee). Ahora el país del venue se reconoce aunque su nombre no coincida exactamente con la lista, y las condiciones del territorio se aplican solas.',
      porQue: 'Estábamos aplicando condiciones equivocadas a shows de fuera de España.',
      paraQuien: ['Presupuestas shows fuera de España', 'Trabajas plazas de LATAM'],
    },
  },
  {
    id: 'n14',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Aviso de bios y documentos que hay que refrescar',
    resumen:
      'El sistema avisa cuando la bio de un artista lleva mucho sin actualizarse o cuando un documento de identidad está por caducar.',
    fecha: '27 de julio de 2026',
    tags: ['Artistas', 'Documentos'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Se guarda cuándo se actualizó por última vez cada bio y se avisa cuando pasa de unos 4 meses (o si falta), junto con los documentos próximos a caducar, en un panel de «Fichas a revisar» pensado para los project managers.',
      porQue: 'Las bios se quedan viejas y las caducidades se escapan si nadie las vigila.',
      paraQuien: ['Llevas el roster y el material de artistas', 'Gestionas la documentación'],
    },
  },
  {
    id: 'n15',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Los textos del rider salen en el PDF (ES / EN)',
    resumen:
      'Los textos genéricos del Tech Rider, Hospitality y Media aparecen en el PDF que se manda al club, traducidos según el idioma elegido.',
    fecha: '27 de julio de 2026',
    tags: ['Bookings', 'Documentos'],
    noLeida: false,
    detalle: {
      cuerpo: null,
      porQue: 'Esos textos estaban en el rider pero no se exportaban al PDF.',
      paraQuien: ['Mandas el rider a las salas'],
    },
  },
  {
    id: 'n16',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Formulario de ofertas: versión completa y a un clic en la ficha',
    resumen:
      'El formulario embebible pide ahora todo (estilo Gigwell), con la marca ConceptOne, autorrelleno de direcciones y captación de contactos a medias.',
    fecha: '27 de julio de 2026',
    tags: ['Bookings', 'CRM', 'Marketing'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Campos completos agrupados (evento, sala, contacto), buscador de Google en la sala y en la dirección de empresa, banner con la foto del artista y punto de foco configurable. Si alguien empieza y no envía, queda como «abandonada» en Bookings → Ofertas para poder perseguirle. El enlace y el código para embeber están a un clic desde la ficha del artista (botón «Form de ofertas»); qué campos se piden se configura una vez para todos en Ajustes → Formulario de ofertas.',
      porQue:
        'Recoger las ofertas por un canal único, bonito y con la marca, y no perder a quien se queda a mitad.',
      paraQuien: [
        'Recibes propuestas de promotores',
        'Embebes el formulario en la web del artista',
      ],
    },
  },
  {
    id: 'n17',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Contratos ES / EN con el dinero en una tabla',
    resumen:
      'Dos plantillas de contrato (español e inglés) que se rellenan solas con los datos del show y muestran el desglose económico en una tabla clara.',
    fecha: '27 de julio de 2026',
    tags: ['Bookings', 'Facturación'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Incluyen desglose económico en tabla (caché, booking fee, IVA, total), plan de pagos, logística detallada por bloque, rider y los datos fiscales/bancarios de la sociedad. Al cargar un plan de pago se propone uno por defecto: 50% a la firma (máx. 3 días después) y 50% máximo 20 días antes del show.',
      porQue:
        'Mandar un contrato serio y completo sin rehacerlo a mano, con las cuentas claras para el promotor.',
      paraQuien: ['Mandas contratos a promotores', 'Quieres el desglose económico presentable'],
    },
  },
  {
    id: 'n18',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Fichas de artista y personal, listas para consultar y copiar',
    resumen:
      'Las fichas se abren en modo lectura, con botón de copiar en cada dato; se edita solo al pulsar «Editar».',
    fecha: '27 de julio de 2026',
    tags: ['Artistas', 'Documentos'],
    noLeida: false,
    detalle: {
      cuerpo:
        'La documentación va por persona, con lectura automática (OCR) del número, las fechas de expedición y caducidad y la fecha de nacimiento, que se rellenan solas en la ficha. Puedes subir anverso y reverso en un mismo documento. La nacionalidad es un desplegable, el campo pasa a «ID» (no «DNI») para artistas extranjeros, y la bio admite texto enriquecido (negrita, enlaces, ES/EN). El aviso de caducidad del pasaporte se adelanta a 4 meses (para viajar suele exigirse 3 meses de validez).',
      porQue:
        'La mayoría de veces se entra a estas fichas para copiar datos a vuelos, hoteles o visados, no para editar.',
      paraQuien: [
        'Preparas vuelos, hoteles o visados',
        'Consultas los datos de un artista o su equipo',
      ],
    },
  },
  {
    id: 'n19',
    tipo: 'Nuevo',
    modulo: 'Euphoric',
    audiencia: 'Solo equipo',
    titulo: 'Euphoric: packs de servicios, consumo y rentabilidad con equipo',
    resumen:
      'El catálogo pasa a productos con packs (p. ej. 10 creatividades/mes), se contratan en la cuenta con su consumo, y la rentabilidad incluye el equipo y su coste real.',
    fecha: '27 de julio de 2026',
    tags: ['Negocio', 'Facturación', 'Equipo'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Servicios por modalidad: pack (unidades incluidas + precio del extra), recurrente y proyecto. Al contratarlos en una cuenta se ve el consumo del periodo (7/10) y los extras facturables. Se asigna equipo con su dedicación estimada y el coste sale de RRHH (solo lo ve quien puede ver condiciones económicas). En Dirección hay carga por miembro y coste por departamento.',
      porQue:
        'Montar acuerdos con marcas con productos claros y saber la rentabilidad real, no a ojo.',
      paraQuien: [
        'Montas presupuestos o acuerdos con marcas',
        'Llevas la rentabilidad de las cuentas',
      ],
    },
  },
  {
    id: 'n20',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Página pública del artista, ahora con shows y booker',
    resumen:
      'La página compartible del artista muestra sus próximos shows y un botón para escribir al booker, con la bio en inglés por defecto.',
    fecha: '27 de julio de 2026',
    tags: ['Artistas', 'Marketing', 'Bookings'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Los próximos shows salen con fecha, fiesta, venue/ciudad y line-up. La bio tiene selector ES/EN (arranca en EN). Aparece el booker con un botón que abre el email con un asunto ya escrito, personalizable por artista desde Condiciones de la ficha ("Asunto del email de booking").',
      porQue:
        'Convertir el enlace público en una herramienta de venta, no solo una foto y una bio.',
      paraQuien: [
        'Mandas el perfil del artista a promotores',
        'Quieres que te lleguen bien las peticiones de booking',
      ],
    },
  },
  {
    id: 'n21',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Formulario de ofertas para la web',
    resumen:
      'Un formulario embebible en la web con el artista preseleccionado; las ofertas entran directas al sistema.',
    fecha: '27 de julio de 2026',
    tags: ['Bookings', 'CRM', 'Negocio'],
    noLeida: true,
    detalle: {
      cuerpo:
        'En Ajustes → Formulario de ofertas eliges qué campos se piden y cuáles son obligatorios, y copias el código para embeber en cada artista. Cuando un promotor lo envía, el booker recibe aviso y la oferta aparece en Bookings → Ofertas, donde se puede convertir en show con los datos ya rellenados.',
      porQue: 'Dejar de recoger ofertas por email suelto y perder el hilo.',
      paraQuien: ['Recibes propuestas de promotores', 'Quieres un canal único de entrada de bolos'],
    },
  },
  {
    id: 'n22',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Cobros en efectivo de shows',
    resumen:
      'Marca los shows que se cobran en mano en sala y no se te olvida pedirlo antes de actuar.',
    fecha: '27 de julio de 2026',
    tags: ['Bookings', 'Liquidaciones'],
    noLeida: true,
    detalle: {
      cuerpo:
        'En la pestaña Pagos marcas "Cobro en efectivo" con importe y nota. Salta alerta en el dashboard y en la ficha del show, sale destacado en el itinerario, y se crea una alarma en el Google Calendar del artista el día del show. Al marcar "Ya cobrado" se apaga todo.',
      porQue: 'El cash que no se pide en el momento no se cobra nunca.',
      paraQuien: ['Trabajas shows con parte en efectivo', 'Llevas el itinerario del artista'],
    },
  },
  {
    id: 'n23',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Posibles gigs desde el calendario del artista',
    resumen:
      'Las fechas que el artista mete en su Google Calendar y aún no son shows aparecen para que decidas si perseguirlas.',
    fecha: '27 de julio de 2026',
    tags: ['Bookings', 'Roster'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Bloque "Posibles gigs" en el dashboard de Bookings: por cada fecha, "Crear show" (la pasa a show directamente) o "Ignorar" (se recuerda y no vuelve a salir).',
      porQue: 'No dejar escapar bolos que el artista ya tiene apuntados.',
      paraQuien: ['Llevas roster con calendarios sincronizados', 'Buscas oportunidades de booking'],
    },
  },
  {
    id: 'n24',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Perfil de artista con Spotify y página pública',
    resumen:
      'Una vista maquetada del artista con su foto, géneros, discografía y bio, compartible por enlace público.',
    fecha: '26 de julio de 2026',
    tags: ['Artistas', 'Spotify', 'Marketing'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Botón "Perfil" en la ficha del artista y apertura directa al hacer clic en una tarjeta del Roster. Trae de Spotify la foto oficial, los géneros y los últimos lanzamientos (discografía), junto a la bio ES/EN. Desde ahí, "Compartir" copia un enlace público (blackmoose.es/a/…) que puedes enviar a un promotor sin que necesite entrar a la intranet. (Nota: Spotify eliminó en 2026 el listado de canciones más escuchadas y el nº de seguidores de su API.)',
      porQue:
        'Teníamos los datos de música vinculados pero solo se veían por dentro y sin gracia. Un enlace bonito y actualizado ahorra montar un one-pager a mano cada vez.',
      paraQuien: [
        'Mandas perfiles de artistas a promotores o salas',
        'Quieres ver de un vistazo la actividad musical de un artista',
        'Preparas propuestas de booking',
      ],
    },
  },
  {
    id: 'n25',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Caducidad de documentos con lectura automática',
    resumen:
      'Al subir un DNI, NIE, pasaporte o visado, se lee sola la fecha de caducidad y el número, y avisa 3 meses antes de que caduque.',
    fecha: '26 de julio de 2026',
    tags: ['Artistas', 'Documentos', 'IA'],
    noLeida: true,
    detalle: {
      cuerpo:
        'En Documentación de la ficha del artista, al subir un documento de identidad se extrae automáticamente la caducidad y el número (revísalos: si la lectura fue dudosa aparece la etiqueta "revisar"). La ficha marca en ámbar los que caducan en ≤3 meses y en rojo los caducados, con un aviso destacado. Todo es editable a mano.',
      porQue:
        'Una caducidad que se nos pasa es un billete que no se puede emitir. El aviso a 3 meses da margen para renovar.',
      paraQuien: [
        'Reservas billetes y necesitas el nº y la validez del documento',
        'Gestionas la documentación de los artistas',
      ],
    },
  },
  {
    id: 'n26',
    tipo: 'Nuevo',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Reparto de fee con otra agencia y su liquidación',
    resumen:
      'Permite partir el Booking o Management Fee con una agencia colaboradora y llevar el seguimiento de lo que le corresponde.',
    fecha: '26 de julio de 2026',
    tags: ['Condiciones', 'Liquidaciones', 'CRM'],
    noLeida: true,
    detalle: {
      cuerpo:
        'En Condiciones puedes indicar que el fee se reparte con otra agencia (vinculada al CRM, se da de alta al vuelo) y su porcentaje. Debajo, un libro de "Liquidación de colaboración" donde apuntas lo que le toca por cada show —se autocalcula desde el fee bruto y el %— y lo marcas pendiente o liquidado, con totales a la vista.',
      porQue:
        'Con algunos artistas (ej. Florentia con NGE) el booking se trabaja a medias y hay que dejar constancia del reparto y no perder el rastro de lo que se debe.',
      paraQuien: [
        'Llevas bookings en colaboración con otra agencia',
        'Cuadras liquidaciones y necesitas saber qué se ha pagado ya',
      ],
    },
  },
  {
    id: 'n27',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Buscador de artistas',
    resumen: 'Campo de búsqueda por nombre en la lista de artistas (ignora acentos).',
    fecha: '26 de julio de 2026',
    tags: ['Artistas', 'Búsqueda'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Escribe parte del nombre y la lista se filtra al instante, activos y archivados. No afecta a los recuentos B/M de arriba.',
      porQue: null,
      paraQuien: ['Llevas muchos artistas y quieres encontrar uno rápido'],
    },
  },
  {
    id: 'n28',
    tipo: 'Mejora',
    modulo: 'Global',
    audiencia: 'Todos',
    titulo: 'Etiquetado de personas unificado',
    resumen:
      'El mismo selector con foto y buscador para asignar personas en toda la app; ya no se corta el texto.',
    fecha: '26 de julio de 2026',
    tags: ['Equipo', 'UI'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Donde antes había un desplegable que recortaba los nombres (booker, responsables, aprobadores…), ahora está el selector con avatar y búsqueda de Euphoric, igual en todas las pantallas.',
      porQue: 'La caja de Booker cortaba el nombre y cada pantalla lo hacía distinto.',
      paraQuien: ['Asignas responsables, bookers o aprobadores'],
    },
  },
  {
    id: 'n29',
    tipo: 'Mejora',
    modulo: 'Inicio',
    audiencia: 'Todos',
    titulo: 'Espacio "Inicio" con aterrizaje en Pendientes',
    resumen:
      '"Mi espacio" pasa a llamarse Inicio, saluda según la hora y siempre abre en Pendientes.',
    fecha: '26 de julio de 2026',
    tags: ['Navegación', 'Tareas'],
    noLeida: false,
    detalle: {
      cuerpo:
        'La pestaña "Lo que me toca" ahora es "Pendientes" y es lo primero que ves al entrar, con el número de cosas pendientes. Layout más limpio.',
      porQue:
        'Al entrar por la mañana quieres ver qué te toca, no la última pantalla en la que te quedaste.',
      paraQuien: ['Empiezas el día revisando lo que tienes pendiente'],
    },
  },
  {
    id: 'n30',
    tipo: 'Arreglo',
    modulo: 'Inicio',
    audiencia: 'Todos',
    titulo: 'Tareas de documentos, ahora visibles',
    resumen:
      'Las tareas colgadas de un documento se ven agrupadas por documento, sin tener que abrir justo ese documento.',
    fecha: '26 de julio de 2026',
    tags: ['Tareas', 'Documentos'],
    noLeida: false,
    detalle: {
      cuerpo: null,
      porQue:
        'Antes una tarea vinculada a un documento era casi invisible: solo aparecía al abrir exactamente ese documento.',
      paraQuien: ['Usas documentos con tareas colgando de ellos'],
    },
  },
  {
    id: 'n31',
    tipo: 'Nuevo',
    modulo: 'Management',
    audiencia: 'Todos',
    titulo: 'Panel de Incidencias',
    resumen:
      'Registro y seguimiento de incidencias de ConceptOne, con ficha completa, analítica e impacto económico.',
    fecha: '24 de julio de 2026',
    tags: ['Incidencias', 'Management'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Se accede desde el icono del triángulo ⚠ en ConceptOne. Registro rápido en 2 campos o ficha completa: notas en hilo, resolución, contraparte, relacionados, participantes e impacto en coste/ingresos. Incluye analítica. El departamento está fijado a ConceptOne por ahora; el borrado es solo para Admin.',
      porQue:
        'Sadkiel y el equipo de Management necesitaban un sitio único para no perder el rastro de lo que sale mal y aprender de ello.',
      paraQuien: [
        'Gestionas incidencias o project management',
        'Quieres medir la fricción operativa por artista o proveedor',
      ],
    },
  },
  {
    id: 'n32',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Nueva navegación de ConceptOne',
    resumen:
      'Barra reorganizada: Bookings · Management · Calendario · Contactos, con sub-barra rápida en Bookings.',
    fecha: '24 de julio de 2026',
    tags: ['Navegación'],
    noLeida: false,
    detalle: {
      cuerpo:
        'Bookings despliega una sub-barra siempre visible (Dashboard · Shows · Disponibilidad) para que el equipo trabaje a un clic, sin menús. Artistas e Incidencias tienen su propio icono a la derecha.',
      porQue: 'Cada equipo necesita llegar a lo suyo rápido, sin pelearse con desplegables.',
      paraQuien: ['Trabajas a diario en Bookings o Management'],
    },
  },
  {
    id: 'n33',
    tipo: 'Nuevo',
    modulo: 'Euphoric',
    audiencia: 'Todos',
    titulo: 'ERP de Euphoric (Negocio)',
    resumen:
      'Pipeline de leads, presupuestos con catálogo, control de horas, rentabilidad por cliente, salud del cliente y dashboard de dirección, agrupados bajo "Negocio".',
    fecha: '22 de julio de 2026',
    tags: ['Negocio', 'Facturación', 'Tiempos'],
    noLeida: true,
    detalle: {
      cuerpo:
        'Toda la parte de gestión de Euphoric vive ahora bajo el grupo "Negocio", separada de la operativa del día a día. Incluye el registro de "Tiempos" (cuánto tarda cada fase) para saber dónde se atasca el trabajo.',
      porQue:
        'Fran necesitaba llevar el negocio de la agencia (ventas, presupuestos, horas y rentabilidad) dentro de la misma herramienta.',
      paraQuien: [
        'Llevas la parte comercial o financiera de Euphoric',
        'Quieres saber la rentabilidad real por cliente',
      ],
    },
  },
  {
    id: 'n34',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Roster mejorado: B/M, bio y Beatport',
    resumen:
      'La vista Roster muestra si llevamos Booking y/o Management de cada artista, y las fichas añaden bio ES/EN y enlace a Beatport.',
    fecha: '20 de julio de 2026',
    tags: ['Artistas', 'Roster'],
    noLeida: false,
    detalle: {
      cuerpo: null,
      porQue: null,
      paraQuien: ['Consultas el roster', 'Preparas material de marketing de artistas'],
    },
  },
  {
    id: 'n35',
    tipo: 'Mejora',
    modulo: 'ConceptOne',
    audiencia: 'Todos',
    titulo: 'Cálculo de vuelos ida y vuelta y origen/destino manual',
    resumen:
      'La calculadora ya permite estimar vuelos de ida y vuelta y forzar a mano la ciudad de origen y destino.',
    fecha: '18 de julio de 2026',
    tags: ['Calculadora', 'Vuelos'],
    noLeida: false,
    detalle: {
      cuerpo: null,
      porQue: null,
      paraQuien: ['Presupuestas shows con logística de vuelos'],
    },
  },
  {
    id: 'n36',
    tipo: 'Arreglo',
    modulo: 'Global',
    audiencia: 'Todos',
    titulo: 'Navegación más estable tras cada despliegue',
    resumen:
      'Se acabó el tener que refrescar a mano cuando una pantalla no cargaba tras una actualización.',
    fecha: '16 de julio de 2026',
    tags: ['Estabilidad', 'Navegación'],
    noLeida: false,
    detalle: {
      cuerpo:
        'La app se recupera sola de los errores de carga que aparecían justo después de publicar una versión nueva.',
      porQue: null,
      paraQuien: ['Usas la intranet a diario'],
    },
  },
];

/** Módulos que aparecen como chip de filtro, en el orden del live. */
export const MODULOS_NOVEDAD: string[] = [
  'ConceptOne',
  'Euphoric',
  'Global',
  'Inicio',
  'Management',
];

/** Tags de filtro: orden del live (sort por punto de código: «CRM» antes que «Calculadora»). */
export const TAGS_NOVEDAD: string[] = [
  'Artistas',
  'Bookings',
  'Búsqueda',
  'CRM',
  'Calculadora',
  'Condiciones',
  'Documentos',
  'Equipo',
  'Estabilidad',
  'Facturación',
  'IA',
  'Incidencias',
  'Liquidaciones',
  'Management',
  'Marketing',
  'Navegación',
  'Negocio',
  'Roster',
  'Spotify',
  'Tareas',
  'Tiempos',
  'UI',
  'Vuelos',
];
