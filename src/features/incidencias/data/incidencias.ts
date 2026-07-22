export type IncidenciaEstado = 'nueva' | 'auto' | 'en_curso' | 'resuelta' | 'descartada';
export type IncidenciaTipo = 'idea';
/** Categoría que asigna el triaje automático (chip del bloque "Hipótesis del triaje"). */
export type TriajeCategoria = 'idea' | 'fallo' | 'duda';

/** Turno de la conversación con el asistente de Ayuda, adjunta al reporte. */
export interface IncidenciaMensaje {
  rol: 'usuario' | 'asistente';
  texto: string;
}

/**
 * Snapshot del entorno en el momento del reporte, tal cual lo serializa el widget de
 * Ayuda. En el live se muestra crudo, como JSON, dentro del `<details>` "Contexto técnico".
 */
export interface IncidenciaContexto {
  url: string;
  ruta: string;
  zoom: number;
  cuando: string;
  idioma: string;
  ventana: string;
  pantalla: string;
  navegador: string;
  conversacion: IncidenciaMensaje[];
  erroresConsola: string[];
}

/** Clasificación automática previa a que una persona conteste. */
export interface IncidenciaTriaje {
  categoria: TriajeCategoria;
  hipotesis: string;
  nota: string;
}

export interface Incidencia {
  id: string;
  estado: IncidenciaEstado;
  tipo?: IncidenciaTipo;
  /** Texto íntegro del reporte (puede ser multilínea; la fila lo colapsa a una línea). */
  texto: string;
  hasAttachment: boolean;
  routePath: string;
  reporterName?: string;
  reporterInitials?: string;
  reporterColor?: string;
  /**
   * Foto de perfil del reportante (bucket `avatares` de Supabase). Cuando está presente
   * sustituye a iniciales+color. En los seeds queda `undefined`: la URL del live apunta a
   * fotos reales de personas y no se replican (ver IncidenciaAvatar).
   */
  reporterAvatarUrl?: string;
  /**
   * Captura adjunta (bucket `incidencias` de Supabase). Sin valor en los seeds: la URL del
   * live es firmada y caduca, así que no se puede referenciar desde el calco.
   */
  attachmentUrl?: string;
  contexto?: IncidenciaContexto;
  triaje?: IncidenciaTriaje;
  /** Respuesta ya enviada al reportante; vacía mientras nadie ha contestado. */
  respuesta?: string;
}

export const INCIDENCIA_ESTADOS: { id: IncidenciaEstado; label: string }[] = [
  { id: 'nueva', label: 'NUEVAS' },
  { id: 'auto', label: 'AUTO' },
  { id: 'en_curso', label: 'EN CURSO' },
  { id: 'resuelta', label: 'RESUELTAS' },
  { id: 'descartada', label: 'DESCARTADAS' },
];

// Seed exacto del live (orden de llegada, sin filtrar), capturado abriendo el detalle de
// las 8 filas. reporterName/Initials/Color denormalizados desde una futura tabla `users`
// (FK conceptual reporterId); `contexto`/`triaje`/`respuesta` viven en la propia fila.
const incidencias: Incidencia[] = [
  {
    id: 'inc-1',
    estado: 'descartada',
    tipo: 'idea',
    texto:
      'viendo como crear un cliente y pone una dirección de correo. Puede haber más de un contacto, si es Marketing, Dirección o administración?',
    hasAttachment: false,
    routePath: '/',
    reporterName: 'Fran Hinojosa Veredas',
    reporterInitials: 'FV',
    reporterColor: '#EA580C',
    contexto: {
      url: 'https://workspace.blackmoose.es/#',
      ruta: '/',
      zoom: 1,
      cuando: '2026-07-21T15:56:28.757Z',
      idioma: 'es-ES',
      ventana: '1920×992',
      pantalla: '1920×1080',
      navegador:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      conversacion: [
        {
          rol: 'usuario',
          texto:
            'viendo como crear un cliente y pone una dirección de correo. Puede haber más de un contacto, si es Marketing, Dirección o administración?',
        },
      ],
      erroresConsola: [],
    },
  },
  {
    id: 'inc-2',
    estado: 'resuelta',
    texto:
      "Me gustaría hacer la solicitud de 2 cosas:\n1. Que se pudiera crear un nuevo evento haciendo clic en el calendario el día que quieras el evento.\n2. Que hi hagues l'opció de poder canviar l'dioma al català també, ja que som una empresa basada a Barcelona\n3. No funciona la generción de copys por iA",
    hasAttachment: true,
    routePath: '/euphoric/calendario',
    reporterName: 'Alba Gelabert',
    reporterInitials: 'AG',
    reporterColor: '#16A34A',
    contexto: {
      url: 'https://workspace.blackmoose.es/euphoric/calendario',
      ruta: '/euphoric/calendario',
      zoom: 1,
      cuando: '2026-07-20T13:27:22.685Z',
      idioma: 'es-ES',
      ventana: '1783×896',
      pantalla: '1920×1080',
      navegador:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      conversacion: [
        {
          rol: 'usuario',
          texto:
            "Me gustaría hacer la solicitud de 2 cosas:\n1. Que se pudiera crear un nuevo evento haciendo clic en el calendario el día que quieras el evento.\n2. Que hi hagues l'opció de poder canviar l'dioma al català també, ja que som una empresa basada a Barcelona",
        },
        {
          rol: 'asistente',
          texto:
            'Quedan anotadas tus dos sugerencias: la de crear eventos directamente haciendo clic en el calendario y la de añadir el catalán como idioma de la intranet. Se lo paso al equipo de desarrollo para que lo tengan en cuenta.',
        },
        {
          rol: 'usuario',
          texto:
            'Solicitud 3: crear publicaciones y piezas de creatividades automáticas para eventos de SIGHT. También que se puedan crear desde la card del evento.',
        },
        { rol: 'asistente', texto: 'No he podido procesar eso. Te lo paso a una persona.' },
      ],
      erroresConsola: [],
    },
    triaje: {
      categoria: 'fallo',
      hipotesis:
        'El usuario reporta tres cosas: dos son ideas de mejora (crear evento desde calendario y traducción al catalán) y la tercera es un fallo técnico (no funciona la generación de copys por IA). Al incluir un fallo de sistema que no está contemplado en el manual, se clasifica como fallo y se deja la respuesta al usuario en null para que lo revise un técnico.',
      nota: 'Especulación: el triaje no lee el código, solo el manual y el contexto.',
    },
    respuesta:
      "1. Ya puedes crear un evento haciendo click en un día del calendario, más rápido imposible!\n2. Sens dubte! Ho deixem per futures actualitzacions, primer és necessari tenir l'Àngles pels companys que no parlen ni Català ni Castellà.\n3. Ya está arreglado y mejorado, ahora no solo te genera copys sino que puedes escoger qué contexto utiliza y pedirle que haga una creación desde cero, una modificación, una traducción o que te acorte un texto. Tanto en castellano como en inglés. Cogerá el @ de los artistas si lo tiene en su ficha de artista, sino te pondrá el nombre para que lo sustituyas al subir el post. Por eso es muy importante mantener las fichas de los artistas actualizadas.",
  },
  {
    id: 'inc-3',
    estado: 'descartada',
    tipo: 'idea',
    texto:
      "Me gustaría hacer la solicitud de 2 cosas:\n1. Que se pudiera crear un nuevo evento haciendo clic en el calendario el día que quieras el evento.\n2. Que hi hagues l'opció de poder canviar l'dioma al català també, ja que som una empresa basada a Barcelona",
    hasAttachment: false,
    routePath: '/',
    reporterName: 'Alba Gelabert',
    reporterInitials: 'AG',
    reporterColor: '#16A34A',
    contexto: {
      url: 'https://workspace.blackmoose.es/',
      ruta: '/',
      zoom: 1,
      cuando: '2026-07-20T13:12:11.842Z',
      idioma: 'es-ES',
      ventana: '1783×896',
      pantalla: '1920×1080',
      navegador:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      conversacion: [
        {
          rol: 'usuario',
          texto:
            "Me gustaría hacer la solicitud de 2 cosas:\n1. Que se pudiera crear un nuevo evento haciendo clic en el calendario el día que quieras el evento.\n2. Que hi hagues l'opció de poder canviar l'dioma al català també, ja que som una empresa basada a Barcelona",
        },
      ],
      erroresConsola: [],
    },
    triaje: {
      categoria: 'idea',
      hipotesis:
        'El usuario propone dos mejoras de usabilidad e internacionalización: creación rápida de eventos desde el calendario y traducción de la intranet al catalán. No están contempladas en el manual actual, por lo que se clasifica como idea y se marca fuera_de_manual=true.',
      nota: 'Especulación: el triaje no lee el código, solo el manual y el contexto.',
    },
  },
  {
    id: 'inc-4',
    estado: 'descartada',
    texto: 'Esto debería estar enlazado con no...',
    hasAttachment: true,
    routePath: '/euphoric/campanas',
    reporterName: 'Carlos Pego',
    contexto: {
      url: 'https://workspace.blackmoose.es/euphoric/campanas',
      ruta: '/euphoric/campanas',
      zoom: 2,
      cuando: '2026-07-20T10:56:24.412Z',
      idioma: 'es-ES',
      ventana: '1710×986',
      pantalla: '1710×1112',
      navegador:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      conversacion: [],
      erroresConsola: [],
    },
    triaje: {
      categoria: 'fallo',
      hipotesis:
        "El reporte del usuario está cortado ('Esto debería estar enlazado con no...') y no aporta suficiente información sobre qué elemento o funcionalidad está fallando en la sección de campañas de Euphoric. Al estar clasificado como fallo por el usuario y no disponer de contexto suficiente en el manual para determinar si es un comportamiento esperado, se marca como fuera de manual para que lo revise un técnico.",
      nota: 'Especulación: el triaje no lee el código, solo el manual y el contexto.',
    },
  },
  {
    id: 'inc-5',
    estado: 'nueva',
    tipo: 'idea',
    texto: 'En el apartat de contactes del Signer/Buyer molaria afegir la opcio de posar TEL',
    hasAttachment: false,
    routePath: '/shows/nuevo',
    reporterName: 'Joe Coe',
    reporterInitials: 'JC',
    reporterColor: '#2563EB',
    contexto: {
      url: 'https://workspace.blackmoose.es/shows/nuevo',
      ruta: '/shows/nuevo',
      zoom: 1.25,
      cuando: '2026-07-20T10:07:41.757Z',
      idioma: 'es-ES',
      ventana: '1536×826',
      pantalla: '1536×960',
      navegador:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      conversacion: [
        {
          rol: 'usuario',
          texto: 'En el apartat de contactes del Signer/Buyer molaria afegir la opcio de posar TEL',
        },
      ],
      erroresConsola: [],
    },
    triaje: {
      categoria: 'idea',
      hipotesis:
        'El usuario propone añadir un campo de teléfono en la sección de contactos del firmante/comprador (Signer/Buyer) dentro de la creación de shows. Actualmente el manual no detalla los campos de contacto de esa sección, por lo que es una sugerencia de mejora de interfaz para. No hay errores de consola.',
      nota: 'Especulación: el triaje no lee el código, solo el manual y el contexto.',
    },
  },
  {
    id: 'inc-6',
    estado: 'descartada',
    tipo: 'idea',
    texto: 'Esto podrías darle color por favor, en cada pestaña igual.',
    hasAttachment: true,
    routePath: '/shows/95a152d1-d546-400b-904d-195f84400c66',
    reporterName: 'Carlos Pego',
    contexto: {
      url: 'https://workspace.blackmoose.es/shows/95a152d1-d546-400b-904d-195f84400c66',
      ruta: '/shows/95a152d1-d546-400b-904d-195f84400c66',
      zoom: 1,
      cuando: '2026-07-14T12:34:45.592Z',
      idioma: 'es-ES',
      ventana: '2560×1323',
      pantalla: '2560×1440',
      navegador:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      conversacion: [],
      erroresConsola: [],
    },
    triaje: {
      categoria: 'idea',
      hipotesis:
        'El usuario está sugiriendo una mejora visual (darle color) en las pestañas de la vista de un show en ConceptOne. No es un fallo de funcionamiento ni una duda sobre el manual, sino una propuesta estética para la interfaz.',
      nota: 'Especulación: el triaje no lee el código, solo el manual y el contexto.',
    },
  },
  {
    id: 'inc-7',
    estado: 'resuelta',
    tipo: 'idea',
    texto:
      'En logística del deal si se selecciona traslados internos tiene que salir siempre predefinido coche privado. Y luego, debería salir automáticamente la cantidad de pasajeros dependiendo de cuantos "miembros" haya en la ficha de ese artista. Lo mismo con la cantidad de habitaciones, por defecto los artistas quieren una habitación para cada uno de ellos y lo mismo con los billetes de vuelo / tren, etc.',
    hasAttachment: true,
    routePath: '/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
    reporterName: 'Carlos Pego',
    contexto: {
      url: 'https://workspace.blackmoose.es/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
      ruta: '/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
      zoom: 2,
      cuando: '2026-07-12T15:20:20.129Z',
      idioma: 'es-ES',
      ventana: '1710×986',
      pantalla: '1710×1112',
      navegador:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      conversacion: [],
      erroresConsola: [],
    },
    triaje: {
      categoria: 'idea',
      hipotesis:
        'El usuario propone automatizar la asignación de traslados internos (coche privado por defecto) y calcular automáticamente pasajeros, habitaciones y billetes según los miembros de la ficha del artista. Es una propuesta de mejora para la sección de Logística del deal en ConceptOne.',
      nota: 'Especulación: el triaje no lee el código, solo el manual y el contexto.',
    },
    respuesta:
      'Una muy buena propuesta, te confirmamos que ya se ha implementado y puedes disfrutar de esta función.',
  },
  {
    id: 'inc-8',
    estado: 'auto',
    tipo: 'idea',
    texto: '¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo?',
    hasAttachment: false,
    routePath: '/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
    reporterName: 'Carlos Pego',
    contexto: {
      url: 'https://workspace.blackmoose.es/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
      ruta: '/shows/08ea3304-af17-4722-84d5-d3b63347fe74',
      zoom: 2,
      cuando: '2026-07-12T15:14:56.644Z',
      idioma: 'es-ES',
      ventana: '1710×986',
      pantalla: '1710×1112',
      navegador:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      conversacion: [
        {
          rol: 'usuario',
          texto: '¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo?',
        },
      ],
      erroresConsola: [],
    },
    triaje: {
      categoria: 'duda',
      hipotesis:
        'El usuario pregunta por una característica deshabilitada deliberadamente. No es un fallo, está documentado en los pendientes conocidos del manual.',
      nota: 'Especulación: el triaje no lee el código, solo el manual y el contexto.',
    },
  },
];

export function listIncidencias(): Incidencia[] {
  return incidencias.map((i) => ({ ...i }));
}

export function countByEstado(list: Incidencia[]): Record<IncidenciaEstado, number> {
  const out: Record<IncidenciaEstado, number> = {
    nueva: 0,
    auto: 0,
    en_curso: 0,
    resuelta: 0,
    descartada: 0,
  };
  list.forEach((i) => {
    out[i.estado] += 1;
  });
  return out;
}

export function filterByEstado(list: Incidencia[], estado: IncidenciaEstado | null): Incidencia[] {
  if (estado === null) return [...list];
  return list.filter((i) => i.estado === estado);
}
