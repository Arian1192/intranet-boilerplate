/**
 * Seed de `/liquidaciones`, calcado del live del 2026-09-09 (10:08-10:14 CEST).
 *
 * Evidencia: `docs/references/conceptone-v3-2026-09-09/f1-liquidaciones*.{png,txt,main.html}`.
 * Las 243 filas se extrajeron del DOM de la captura, sin retocar ningún importe.
 *
 * La tabla «Por artista» **no es un segundo seed**: se agrega de estas mismas
 * filas (verificado contra el live, 32 de 32 artistas cuadran) más el mapa de
 * deuda viva, que sí es un dato aparte.
 */

export type LiquidacionEstado =
  | 'Sin liquidar'
  | 'Parcialmente liquidado'
  | 'Pendiente liquidar'
  | 'Liquidado'
  | 'Incidencia';

export interface Liquidacion {
  artista: string;
  /** Código del show, `C1-2026-155`. El live lo usa como referencia visible. */
  codigo: string;
  /** `evento · venue · ciudad`, tal cual lo apila el live bajo el artista. */
  evento: string;
  /** ISO; null en el único show del live que no tiene fecha. */
  fecha: string | null;
  cobrado: number | null;
  pendCobrar: number | null;
  aRecuperar: number | null;
  netoArtista: number | null;
  liquidado: number | null;
  pendLiquidar: number | null;
  estado: LiquidacionEstado;
}

export const ESTADOS_LIQUIDACION: LiquidacionEstado[] = [
  'Sin liquidar',
  'Parcialmente liquidado',
  'Pendiente liquidar',
  'Liquidado',
  'Incidencia',
];

/** El desplegable del live: el «todos» primero y luego los cinco estados. */
export const OPCIONES_ESTADO = ['Todos los estados', ...ESTADOS_LIQUIDACION] as const;
export type OpcionEstado = (typeof OPCIONES_ESTADO)[number];

export const liquidaciones: Liquidacion[] = [
  { artista: 'Olivia Bass', codigo: 'C1-2026-155', evento: 'OASIS · Oasis · Maspalomas', fecha: '2026-12-24', cobrado: 0, pendCobrar: 960, aRecuperar: null, netoArtista: 800, liquidado: null, pendLiquidar: 800, estado: 'Sin liquidar' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-134', evento: 'Confirmed - Stuttgart - Waranga - Heiliger Morgen', fecha: '2026-12-24', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-121', evento: 'Oasis · Maspalomas', fecha: '2026-12-24', cobrado: 0, pendCobrar: 1800, aRecuperar: null, netoArtista: 1200, liquidado: null, pendLiquidar: 1200, estado: 'Sin liquidar' },
  { artista: 'Freddy Bello', codigo: 'C1-2026-144', evento: 'Sanpapaclub · LAB · Madrid', fecha: '2026-12-19', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 800, liquidado: null, pendLiquidar: 800, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-147', evento: 'Kopas', fecha: '2026-12-05', cobrado: 0, pendCobrar: 2160, aRecuperar: null, netoArtista: 1440, liquidado: null, pendLiquidar: 1440, estado: 'Sin liquidar' },
  { artista: 'Freddy Bello', codigo: 'C1-2026-073', evento: 'Klandestino · Independence Club · Madrid', fecha: '2026-11-27', cobrado: 1210, pendCobrar: 1210, aRecuperar: null, netoArtista: 1280, liquidado: null, pendLiquidar: 1280, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-153', evento: 'Industrial Copera · La Zubia', fecha: '2026-11-14', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-042', evento: 'CIRQ Club · Città Metropolitana di Venezia', fecha: '2026-10-31', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-071', evento: 'NON Disco · NON the Club · Bolunburu', fecha: '2026-10-31', cobrado: 630, pendCobrar: 3000, aRecuperar: null, netoArtista: 2500, liquidado: null, pendLiquidar: 2500, estado: 'Sin liquidar' },
  { artista: 'Vidaloca', codigo: 'C1-2026-221', evento: 'Lula Club · Madrid', fecha: '2026-10-30', cobrado: 0, pendCobrar: 871.2, aRecuperar: 87.15, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Claudia Tejeda', codigo: 'C1-2026-139', evento: 'Tormenta · El Sotano · Madrid', fecha: '2026-10-23', cobrado: 0, pendCobrar: 1742.4, aRecuperar: null, netoArtista: 960, liquidado: null, pendLiquidar: 960, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-182', evento: 'Zouk CR · Pozos', fecha: '2026-10-17', cobrado: 0, pendCobrar: 2200, aRecuperar: null, netoArtista: 1519.41, liquidado: null, pendLiquidar: 1519.41, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-162', evento: 'Confusión · Modo Caracas · Caracas', fecha: '2026-10-16', cobrado: 0, pendCobrar: 2000, aRecuperar: null, netoArtista: 1373.28, liquidado: null, pendLiquidar: 1373.28, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-219', evento: 'BRO MÁLAGA · Málaga', fecha: '2026-10-11', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 600, liquidado: null, pendLiquidar: 600, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-217', evento: 'BRO MÁLAGA · Málaga', fecha: '2026-10-11', cobrado: 0, pendCobrar: 1161.6, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-222', evento: 'Sala Sonora Bilbao · Bilbao', fecha: '2026-10-10', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 500, liquidado: null, pendLiquidar: 500, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-164', evento: 'Chili Taste · Sala Omnium · Las Condes', fecha: '2026-10-09', cobrado: 0, pendCobrar: 1725, aRecuperar: null, netoArtista: 1184.45, liquidado: null, pendLiquidar: 1184.45, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-156', evento: 'Confirmed - Valencia - Marina Beach Club', fecha: '2026-10-09', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Olivia Bass', codigo: 'C1-2026-220', evento: 'NIX · Barcelona', fecha: '2026-10-09', cobrado: 0, pendCobrar: 1742.4, aRecuperar: null, netoArtista: 1200, liquidado: null, pendLiquidar: 1200, estado: 'Sin liquidar' },
  { artista: 'Pau Guilera', codigo: 'C1-2026-030', evento: 'LA Guasa · Cova Santa · Eivissa', fecha: '2026-10-03', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-223', evento: 'Lost City · Lost City · Quito', fecha: '2026-10-03', cobrado: 0, pendCobrar: 480, aRecuperar: null, netoArtista: 344.24, liquidado: null, pendLiquidar: 344.24, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-041', evento: 'La Guasa · Cova Santa · Eivissa', fecha: '2026-10-03', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Bassel Darwish', codigo: 'C1-2026-157', evento: 'Palio Sabana · San José', fecha: '2026-10-03', cobrado: 0, pendCobrar: 1800, aRecuperar: null, netoArtista: 1235.95, liquidado: null, pendLiquidar: 1235.95, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-181', evento: 'Event Garden · Guayaquil', fecha: '2026-10-02', cobrado: 0, pendCobrar: 1000, aRecuperar: null, netoArtista: 690.64, liquidado: null, pendLiquidar: 690.64, estado: 'Sin liquidar' },
  { artista: 'Bassel Darwish', codigo: 'C1-2026-159', evento: 'Senses · Zouk · Pozos', fecha: '2026-10-02', cobrado: 0, pendCobrar: 1800, aRecuperar: null, netoArtista: 1235.95, liquidado: null, pendLiquidar: 1235.95, estado: 'Sin liquidar' },
  { artista: 'DH Moon', codigo: 'C1-2026-165', evento: '100 Room · 100 puerto madero · Buenos Aires', fecha: '2026-10-02', cobrado: 0, pendCobrar: 1300, aRecuperar: null, netoArtista: 716.77, liquidado: null, pendLiquidar: 716.77, estado: 'Sin liquidar' },
  { artista: 'Jose Fajardo', codigo: 'C1-2026-123', evento: 'Baila Ritmo · Goya · Madrid', fecha: '2026-10-02', cobrado: 0, pendCobrar: 2468.4, aRecuperar: null, netoArtista: 1700, liquidado: null, pendLiquidar: 1700, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-149', evento: 'Monkey Beach Club · Santa cruz de Tenerife', fecha: '2026-09-27', cobrado: 0, pendCobrar: 2280, aRecuperar: null, netoArtista: 1520, liquidado: null, pendLiquidar: 1520, estado: 'Sin liquidar' },
  { artista: 'Abdon', codigo: 'C1-2026-048', evento: 'SIGHT x Pantheon · Cova Santa · Eivissa', fecha: '2026-09-27', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Claudia Tejeda', codigo: 'C1-2026-200', evento: 'Morenos · Palio Sabana · San José', fecha: '2026-09-26', cobrado: 0, pendCobrar: 1450, aRecuperar: null, netoArtista: 801.14, liquidado: null, pendLiquidar: 801.14, estado: 'Sin liquidar' },
  { artista: 'Marian Ariss', codigo: 'C1-2026-017', evento: 'Kevin de Vries Buenos Aires · Mandarine Park · Buenos Aires', fecha: '2026-09-26', cobrado: 0, pendCobrar: 1400, aRecuperar: null, netoArtista: 981.57, liquidado: null, pendLiquidar: 981.57, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-011', evento: 'Jiwa · Boho Beer Garden · Birmingham', fecha: '2026-09-26', cobrado: 0, pendCobrar: 1800, aRecuperar: null, netoArtista: 1088, liquidado: null, pendLiquidar: 1088, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-138', evento: 'Nero Club · Chiclayo', fecha: '2026-09-26', cobrado: 0, pendCobrar: 850, aRecuperar: null, netoArtista: 583.71, liquidado: null, pendLiquidar: 583.71, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-152', evento: 'Raw · Raw · Antofagasta', fecha: '2026-09-25', cobrado: 0, pendCobrar: 500, aRecuperar: null, netoArtista: 342.76, liquidado: null, pendLiquidar: 342.76, estado: 'Sin liquidar' },
  { artista: 'Marian Ariss', codigo: 'C1-2026-016', evento: 'Kevin de Vries Cordoba · La Fábrica · Cordoba', fecha: '2026-09-25', cobrado: 0, pendCobrar: 1400, aRecuperar: null, netoArtista: 981.57, liquidado: null, pendLiquidar: 981.57, estado: 'Sin liquidar' },
  { artista: 'Sebastian Ledher', codigo: 'C1-2026-044', evento: 'Hi, I\'m Sci · Hi I\'m Sci · Bogotá', fecha: '2026-09-24', cobrado: 744.95, pendCobrar: 755.05, aRecuperar: null, netoArtista: 945.65, liquidado: null, pendLiquidar: 945.65, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-067', evento: 'WAA!!! · Opium Barcelona · Barcelona', fecha: '2026-09-23', cobrado: 0, pendCobrar: 2178, aRecuperar: null, netoArtista: 1200, liquidado: null, pendLiquidar: 1200, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-140', evento: 'Substance', fecha: '2026-09-20', cobrado: 0, pendCobrar: 300, aRecuperar: null, netoArtista: 206.02, liquidado: null, pendLiquidar: 206.02, estado: 'Sin liquidar' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-172', evento: 'Confirmed - São Paulo - We Are Sun', fecha: '2026-09-19', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Marcel BS', codigo: 'C1-2026-163', evento: 'L\'Aventure Paris · Hotel l\'Aventure · Paris', fecha: '2026-09-19', cobrado: 0, pendCobrar: 1000, aRecuperar: null, netoArtista: 528.3, liquidado: null, pendLiquidar: 528.3, estado: 'Sin liquidar' },
  { artista: 'Sebastian Ledher', codigo: 'C1-2026-143', evento: 'Sansa · Club Varadero · Las Palmas de Gran Canaria', fecha: '2026-09-19', cobrado: 0, pendCobrar: 1815, aRecuperar: null, netoArtista: 1080, liquidado: null, pendLiquidar: 1080, estado: 'Sin liquidar' },
  { artista: 'Marian Ariss', codigo: 'C1-2026-176', evento: 'Confirmed - - Sitio', fecha: '2026-09-19', cobrado: 0, pendCobrar: 2000, aRecuperar: null, netoArtista: 1600, liquidado: null, pendLiquidar: 1600, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-141', evento: 'Zona Groove · Piket’ando · Rionegro', fecha: '2026-09-19', cobrado: 0, pendCobrar: 1500, aRecuperar: null, netoArtista: 635.66, liquidado: null, pendLiquidar: 635.66, estado: 'Sin liquidar' },
  { artista: 'Claudia Tejeda', codigo: 'C1-2026-201', evento: 'Zona Groove · Piket’ando · Rionegro', fecha: '2026-09-19', cobrado: 861.1, pendCobrar: 638.9, aRecuperar: null, netoArtista: 828.77, liquidado: null, pendLiquidar: 828.77, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-180', evento: 'Confirmed - București - Medusa Universe · Medusa Universe · București', fecha: '2026-09-19', cobrado: 350, pendCobrar: 1465, aRecuperar: null, netoArtista: 960, liquidado: null, pendLiquidar: 960, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-081', evento: 'Pink Cloud · Hotel el Bruc · El Bruc', fecha: '2026-09-19', cobrado: 387.2, pendCobrar: 1548.8, aRecuperar: null, netoArtista: 1153.29, liquidado: null, pendLiquidar: 1153.29, estado: 'Sin liquidar' },
  { artista: 'Sergio Saffe', codigo: 'C1-2026-013', evento: 'el Tebo · el Tebo · Valparaiso', fecha: '2026-09-18', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 700, liquidado: null, pendLiquidar: 700, estado: 'Sin liquidar' },
  { artista: 'Claudia Tejeda', codigo: 'C1-2026-160', evento: 'Senses · Zouk · Pozos', fecha: '2026-09-18', cobrado: 0, pendCobrar: 1450, aRecuperar: null, netoArtista: 796.5, liquidado: null, pendLiquidar: 796.5, estado: 'Sin liquidar' },
  { artista: 'Bassel Darwish', codigo: 'C1-2026-158', evento: 'el Tebo · Valparaiso', fecha: '2026-09-18', cobrado: 0, pendCobrar: 2070, aRecuperar: null, netoArtista: 1544.94, liquidado: null, pendLiquidar: 1544.94, estado: 'Sin liquidar' },
  { artista: 'ACA', codigo: 'C1-2026-208', evento: 'Tentative - - Paradise UNVRS', fecha: '2026-09-16', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-065', evento: 'Elx al Carrer · Carpas de Elche · Elche de la Sierra', fecha: '2026-09-16', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 3000, liquidado: null, pendLiquidar: 3000, estado: 'Pendiente liquidar' },
  { artista: 'Londonground', codigo: 'C1-2026-167', evento: 'brunch', fecha: '2026-09-13', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Claudia Tejeda', codigo: 'C1-2026-175', evento: 'Pandora Sevilla · Sevilla', fecha: '2026-09-12', cobrado: 0, pendCobrar: 240, aRecuperar: null, netoArtista: 200, liquidado: null, pendLiquidar: 200, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-178', evento: 'Pandora Sevilla · Sevilla', fecha: '2026-09-12', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Abdon', codigo: 'C1-2026-179', evento: 'Bossa Playa · Torrox', fecha: '2026-09-12', cobrado: 0, pendCobrar: 700, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Bassel Darwish', codigo: 'C1-2026-133', evento: 'Art Gallery · Club Room · Recoleta', fecha: '2026-09-12', cobrado: 0, pendCobrar: 2000, aRecuperar: null, netoArtista: 1382.24, liquidado: null, pendLiquidar: 1382.24, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-173', evento: 'FITZ · Fitz Marbella · Marbella', fecha: '2026-09-12', cobrado: 0, pendCobrar: 2178, aRecuperar: 521.93, netoArtista: 1200, liquidado: null, pendLiquidar: 1200, estado: 'Sin liquidar' },
  { artista: 'ACA', codigo: 'C1-2026-216', evento: 'Alba Lulia · Alba Iulia', fecha: '2026-09-12', cobrado: 0, pendCobrar: 1200, aRecuperar: 372.32, netoArtista: 1000, liquidado: null, pendLiquidar: 1000, estado: 'Sin liquidar' },
  { artista: 'Claudia Tejeda', codigo: 'C1-2026-174', evento: 'POP CAAC · Sevilla', fecha: '2026-09-12', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Freddy Bello', codigo: 'C1-2026-154', evento: 'CACAO · Luz de Gas · Barcelona', fecha: '2026-09-12', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 960, liquidado: null, pendLiquidar: 960, estado: 'Pendiente liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-177', evento: 'POP CAAC · Sevilla', fecha: '2026-09-12', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'ACA', codigo: 'C1-2026-119', evento: 'Secret Sessions Eden', fecha: '2026-09-11', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Marcel BS', codigo: 'C1-2026-062', evento: 'Echo · King David\'s Hotel · T\'bilisi', fecha: '2026-09-11', cobrado: 0, pendCobrar: 600, aRecuperar: null, netoArtista: 384, liquidado: null, pendLiquidar: 384, estado: 'Sin liquidar' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-171', evento: 'Confirmed - Itagüí, Itagüi - VIUZ', fecha: '2026-09-11', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Pau Guilera', codigo: 'C1-2026-145', evento: 'La Guasa · Sea Sea Club · Barcelona', fecha: '2026-09-11', cobrado: 0, pendCobrar: 580.8, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Milan Torne', codigo: 'C1-2026-218', evento: 'Continental Bar Lounge Patio · San Jose', fecha: '2026-09-11', cobrado: 0, pendCobrar: 500, aRecuperar: null, netoArtista: 344.24, liquidado: null, pendLiquidar: 344.24, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-059', evento: 'Tentative - Playa de las Américas - Papagayo Tenerife - FOLLOW PRESENTA LOS CANARIOS', fecha: '2026-09-10', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Gaston Zani', codigo: 'C1-2026-117', evento: 'UNLOCKED XL · Terminal · Sabadell', fecha: '2026-09-10', cobrado: 0, pendCobrar: 2178, aRecuperar: null, netoArtista: 1200, liquidado: null, pendLiquidar: 1200, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-135', evento: 'Sunwaves · Roquetes de Mar · Roquetas de Mar', fecha: '2026-09-06', cobrado: 0, pendCobrar: 302.5, aRecuperar: null, netoArtista: 200, liquidado: null, pendLiquidar: 200, estado: 'Sin liquidar' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-124', evento: 'Confirmed - Cdad. Autónoma de Buenos Aires - The BOW - Rio electronic', fecha: '2026-09-06', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Milan Torne', codigo: 'C1-2026-151', evento: 'Secret Coffee Party + Afterparty at Whiskey Row · Larimer Square · Denver', fecha: '2026-09-06', cobrado: 0, pendCobrar: 1000, aRecuperar: null, netoArtista: 409.35, liquidado: null, pendLiquidar: 409.35, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-115', evento: 'Panorama · El Cortijo Cádiz · Vejer de la Frontera', fecha: '2026-09-05', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 960, liquidado: null, pendLiquidar: 960, estado: 'Pendiente liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-058', evento: 'Kodo · Lío Ibiza · Eivissa', fecha: '2026-09-05', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: -154.86, liquidado: null, pendLiquidar: null, estado: 'Pendiente liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-039', evento: 'KŌDŌ · Lío Ibiza · Eivissa', fecha: '2026-09-05', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Pendiente liquidar' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-169', evento: 'Santa Fe de la Vera Cruz - Hub', fecha: '2026-09-05', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-064', evento: 'Pandora · Sevilla', fecha: '2026-09-05', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 2000, liquidado: null, pendLiquidar: 2000, estado: 'Pendiente liquidar' },
  { artista: 'Rivellino', codigo: 'C1-2026-215', evento: 'After Brunch · INPUT High Fidelity · Barcelona', fecha: '2026-09-05', cobrado: 0, pendCobrar: 580.8, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Sebastian Ledher', codigo: 'C1-2026-084', evento: 'La Sagrada · CDLC · Barcelona', fecha: '2026-09-05', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: -27.84, liquidado: null, pendLiquidar: null, estado: 'Pendiente liquidar' },
  { artista: 'Abdon', codigo: 'C1-2026-146', evento: 'Kova Beach Club · Marbella', fecha: '2026-09-05', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 960, liquidado: null, pendLiquidar: 960, estado: 'Pendiente liquidar' },
  { artista: 'Londonground', codigo: 'C1-2026-166', evento: 'Confirmed - Eivissa - Tantra Ibiza', fecha: '2026-09-04', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Fran Hernandez', codigo: 'C1-2026-168', evento: 'Loop · Maya Benicassim · Benicasim', fecha: '2026-09-04', cobrado: 423.5, pendCobrar: 423.5, aRecuperar: null, netoArtista: 560, liquidado: null, pendLiquidar: 560, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-005', evento: 'Alcazar de San Juan · Alcazar de San Juan · Alcázar de San Juan', fecha: '2026-09-04', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 2500, liquidado: 1000, pendLiquidar: 1500, estado: 'Liquidado' },
  { artista: 'Milan Torne', codigo: 'C1-2026-130', evento: 'House of Ferns · Red Room · Santa Ana', fecha: '2026-09-03', cobrado: 0, pendCobrar: 500, aRecuperar: null, netoArtista: 345.68, liquidado: null, pendLiquidar: 345.68, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-057', evento: 'Tentative - Playa de las Américas - Papagayo Tenerife - FOLLOW PRESENTA LOS CANARIOS', fecha: '2026-09-03', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Marcel BS', codigo: 'C1-2026-066', evento: 'Pantheon · Cova Santa · Eivissa', fecha: '2026-08-30', cobrado: 0, pendCobrar: 907.5, aRecuperar: null, netoArtista: 600, liquidado: null, pendLiquidar: 600, estado: 'Sin liquidar' },
  { artista: 'Abdon', codigo: 'C1-2026-047', evento: 'DSCR · BRØ Málaga · Málaga', fecha: '2026-08-30', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 300, liquidado: null, pendLiquidar: 300, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-161', evento: 'Viuz medellin Colombia', fecha: '2026-08-30', cobrado: 0, pendCobrar: 700, aRecuperar: null, netoArtista: -836.87, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Rivellino', codigo: 'C1-2026-111', evento: 'Cova Santa - Pantheon · Cova Santa · Eivissa', fecha: '2026-08-30', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 408.02, liquidado: null, pendLiquidar: 408.02, estado: 'Pendiente liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-063', evento: 'DSCR · BRØ Málaga · Málaga', fecha: '2026-08-30', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1168.58, liquidado: 1168.58, pendLiquidar: null, estado: 'Parcialmente liquidado' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-131', evento: 'FUEGO · Playa Soleil · Sant Josep de sa Talaia', fecha: '2026-08-30', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 2240, liquidado: 2240, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-214', evento: 'Marina Beach Club · Valencia', fecha: '2026-08-30', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-125', evento: 'DSCR · BRØ Málaga · Málaga', fecha: '2026-08-30', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 300, liquidado: null, pendLiquidar: 300, estado: 'Sin liquidar' },
  { artista: 'Marian Ariss', codigo: 'C1-2026-113', evento: 'SIGHT · Ku Barcelona · Barcelona', fecha: '2026-08-30', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1000, liquidado: 1000, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-070', evento: 'Port Electronic · Cocoa Beach Club · Puerto de Sagunto', fecha: '2026-08-29', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 850, liquidado: 850, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-023', evento: 'The Coffe Party · Stackt Market · Toronto', fecha: '2026-08-29', cobrado: 0, pendCobrar: 1500, aRecuperar: null, netoArtista: 329.91, liquidado: null, pendLiquidar: 329.91, estado: 'Sin liquidar' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-110', evento: 'Pforzheim - Pirate Beach', fecha: '2026-08-29', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-109', evento: 'Colombia Bogotá Us & Them · Life Club · Bogotá', fecha: '2026-08-29', cobrado: 0, pendCobrar: 2500, aRecuperar: null, netoArtista: 1465.4, liquidado: null, pendLiquidar: 1465.4, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-142', evento: 'Boomerang Club · Palma', fecha: '2026-08-29', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 2400, liquidado: 2400, pendLiquidar: null, estado: 'Parcialmente liquidado' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-054', evento: 'Casas Ibañez · Carpa Trakatrá · Casas-Ibáñez', fecha: '2026-08-28', cobrado: 2371.6, pendCobrar: 677.6, aRecuperar: null, netoArtista: 1400, liquidado: 1400, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-024', evento: 'Lucia SDQ · Santo Domingo', fecha: '2026-08-28', cobrado: 2459.45, pendCobrar: 540.55, aRecuperar: null, netoArtista: 1078.01, liquidado: null, pendLiquidar: 1078.01, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-137', evento: 'Tantra · Eivissa', fecha: '2026-08-26', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Andrea Castells', codigo: 'C1-2026-170', evento: 'Burning Man + Las Vegas', fecha: '2026-08-25', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Vidaloca', codigo: 'C1-2026-127', evento: 'Tantra · Eivissa', fecha: '2026-08-25', cobrado: 0, pendCobrar: 900, aRecuperar: null, netoArtista: 576, liquidado: null, pendLiquidar: 576, estado: 'Sin liquidar' },
  { artista: 'Sebastian Ledher', codigo: 'C1-2026-136', evento: 'Tantra · Eivissa', fecha: '2026-08-23', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 286.2, liquidado: null, pendLiquidar: 286.2, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-038', evento: 'Pantheon · Cova Santa · Eivissa', fecha: '2026-08-23', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 800, liquidado: 800, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Rivellino', codigo: 'C1-2026-106', evento: 'SIGHT · Ku Barcelona · Barcelona', fecha: '2026-08-23', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 800, liquidado: 800, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Los Canarios', codigo: 'C1-2026-061', evento: 'Feria de Almeria · RECINTO FERIAL, ALMERÍA · Almería', fecha: '2026-08-22', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 991.26, liquidado: 991.26, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-068', evento: 'Feria de Almería · RECINTO FERIAL, ALMERÍA · Almería', fecha: '2026-08-22', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1280, liquidado: 1356.8, pendLiquidar: null, estado: 'Parcialmente liquidado' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-104', evento: 'Stuttgart - Waranga - 10 Years of Tomi & Kesh', fecha: '2026-08-22', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-082', evento: 'Festival La Palma · Recinto ferial La Palma', fecha: '2026-08-22', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 768, liquidado: null, pendLiquidar: 768, estado: 'Pendiente liquidar' },
  { artista: 'Milan Torne', codigo: 'C1-2026-129', evento: 'Resident Denver · Denver', fecha: '2026-08-22', cobrado: 0, pendCobrar: 1000, aRecuperar: null, netoArtista: 468.67, liquidado: null, pendLiquidar: 468.67, estado: 'Sin liquidar' },
  { artista: 'Andrea Castells', codigo: 'C1-2026-112', evento: 'Mas Sorrer', fecha: '2026-08-22', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'ACA', codigo: 'C1-2026-101', evento: 'E1 · E1 · London', fecha: '2026-08-21', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Milan Torne', codigo: 'C1-2026-122', evento: 'Bodywork · Palm Tree Club · Orlando', fecha: '2026-08-21', cobrado: 0, pendCobrar: 800, aRecuperar: null, netoArtista: 253.94, liquidado: null, pendLiquidar: 253.94, estado: 'Sin liquidar' },
  { artista: 'Sebastian Ledher', codigo: 'C1-2026-132', evento: 'Push Red Room · Ku Barcelona · Barcelona', fecha: '2026-08-20', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: -96.02, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-060', evento: 'Tentative - Playa de las Américas - Papagayo Tenerife - FOLLOW PRESENTA LOS CANARIOS', fecha: '2026-08-20', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-040', evento: 'Descaro x Follow · Papagayo Tenerife · Playa de las Américas', fecha: '2026-08-20', cobrado: 0, pendCobrar: 363, aRecuperar: null, netoArtista: 240, liquidado: null, pendLiquidar: 240, estado: 'Sin liquidar' },
  { artista: 'Sebastian Ledher', codigo: 'C1-2026-076', evento: 'Cocoa · Badhak · Málaga', fecha: '2026-08-19', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: -108.78, liquidado: null, pendLiquidar: null, estado: 'Pendiente liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-100', evento: 'Cocoa feria de Málaga', fecha: '2026-08-19', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Test Artist', codigo: 'C1-2026-150', evento: 'SIGHT · Bassment · Madrid', fecha: '2026-08-16', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 1000, liquidado: null, pendLiquidar: 1000, estado: 'Sin liquidar' },
  { artista: 'Marcel BS', codigo: 'C1-2026-056', evento: 'SIGHT · Ku Barcelona · Barcelona', fecha: '2026-08-16', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 500, liquidado: 500, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Jose Fajardo', codigo: 'C1-2026-114', evento: 'SIGHT · Ku Barcelona · Barcelona', fecha: '2026-08-16', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1000, liquidado: 1000, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Nacho Scoppa', codigo: 'C1-2026-102', evento: 'Tall Ship Boston - After Brunch · Tall Ship · Boston', fecha: '2026-08-16', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-074', evento: 'Medusa Festival · Cullera', fecha: '2026-08-16', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Nacho Scoppa', codigo: 'C1-2026-099', evento: 'ELIXIR ORLANDO · Orlando', fecha: '2026-08-15', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Florentia', codigo: 'C1-2026-098', evento: 'Fabric London · London', fecha: '2026-08-15', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-105', evento: 'Free Your Mind · Spaarnwoude Park · Spaarnwoude', fecha: '2026-08-15', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1500, liquidado: 1500, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Londonground', codigo: 'C1-2026-096', evento: 'Cecile · Playa Soleil · Sant Josep de sa Talaia', fecha: '2026-08-14', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 800, liquidado: 800, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Nacho Scoppa', codigo: 'C1-2026-090', evento: 'The Ruins at Knockdown Center', fecha: '2026-08-14', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-080', evento: 'Medusa Festival · Cullera', fecha: '2026-08-14', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Marcel BS', codigo: 'C1-2026-053', evento: 'Twiga Monte Carlo · Monaco', fecha: '2026-08-14', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 2051.02, liquidado: 4225.08, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Los Canarios', codigo: 'C1-2026-051', evento: 'Descaro · Papaya · VEJER DE LA FRONTERA', fecha: '2026-08-14', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1156.6, liquidado: null, pendLiquidar: 1156.6, estado: 'Pendiente liquidar' },
  { artista: 'ACA', codigo: 'C1-2026-086', evento: 'LOVEFEST · Vrnjačka Banja', fecha: '2026-08-14', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Dhuna', codigo: 'C1-2026-093', evento: 'Aquasella · Aquasella · Arriondas', fecha: '2026-08-14', cobrado: 242, pendCobrar: 1210, aRecuperar: null, netoArtista: 1000, liquidado: null, pendLiquidar: 1000, estado: 'Pendiente liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-097', evento: 'VISUALIZE · Nido · Estepona', fecha: '2026-08-14', cobrado: 0, pendCobrar: 484, aRecuperar: null, netoArtista: 320, liquidado: null, pendLiquidar: 320, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-079', evento: 'Peña Nogara San Roque', fecha: '2026-08-13', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Pau Guilera', codigo: 'C1-2026-029', evento: 'SIGHT · Ku Barcelona · Barcelona', fecha: '2026-08-09', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1000, liquidado: 1000, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-072', evento: 'RAEETH Goa · Vagator', fecha: '2026-08-09', cobrado: 0, pendCobrar: 500, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'LA CINTIA', codigo: 'C1-2026-083', evento: 'Ku Barcelona · Ku Barcelona · Barcelona', fecha: '2026-08-09', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 1000, liquidado: 1000, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Fran Hernandez', codigo: 'C1-2026-092', evento: 'Sounders · Panorama · Denia', fecha: '2026-08-09', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 960, liquidado: null, pendLiquidar: 960, estado: 'Sin liquidar' },
  { artista: 'ART NO LOGIA', codigo: 'C1-2026-091', evento: 'Dua - Cocoa Málaga · Malaga', fecha: '2026-08-09', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Brenda Serna', codigo: 'C1-2026-069', evento: 'SPAZIO · Spazio 900 · Roma', fecha: '2026-08-08', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 720, liquidado: 720, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Los Canarios', codigo: 'C1-2026-049', evento: 'Tentative - - LOS SANTOS', fecha: '2026-08-08', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Rivellino', codigo: 'C1-2026-095', evento: 'Puntapiedra · Alicante', fecha: '2026-08-08', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 800, liquidado: 968, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-089', evento: 'La Terrazza · San Benedetto del Tronto', fecha: '2026-08-08', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Sera De Villalta', codigo: 'C1-2026-088', evento: 'X Private Club · Madrid', fecha: '2026-08-08', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Pau Guilera', codigo: 'C1-2026-028', evento: 'Homies · Boris · Barcelona', fecha: '2026-08-07', cobrado: 0, pendCobrar: 1161.6, aRecuperar: null, netoArtista: 800, liquidado: null, pendLiquidar: 800, estado: 'Sin liquidar' },
  { artista: 'Tomi & Kesh', codigo: 'C1-2026-085', evento: 'Dubrovnik', fecha: '2026-08-06', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'ACA', codigo: 'C1-2026-087', evento: 'Martinez Bros Marina · Valencia', fecha: '2026-08-06', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-045', evento: 'Descaro · Papagayo Tenerife · Playa de las Américas', fecha: '2026-08-06', cobrado: 0, pendCobrar: 3206.5, aRecuperar: null, netoArtista: 1696, liquidado: null, pendLiquidar: 1696, estado: 'Sin liquidar' },
  { artista: 'Abdon', codigo: 'C1-2026-037', evento: 'Fitz Mallorca · Fitz Mallorca · Palma', fecha: '2026-08-02', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Pendiente liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-022', evento: 'Mamarela · Marmarela · Alicante', fecha: '2026-08-02', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1200, liquidado: 1200, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Pau Guilera', codigo: 'C1-2026-027', evento: 'LOAD · Sea Sea Club · Barcelona', fecha: '2026-08-01', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-020', evento: 'Solart Fest · Hangar 37 · San Bartolomé de Tirajana', fecha: '2026-08-01', cobrado: 0, pendCobrar: 2400, aRecuperar: 25.03, netoArtista: 1600, liquidado: null, pendLiquidar: 1600, estado: 'Sin liquidar' },
  { artista: 'Milan Torne', codigo: 'C1-2026-018', evento: 'Casa del Mar · Casa del Mar · Isla Santa Catalina', fecha: '2026-08-01', cobrado: 0, pendCobrar: 424.18, aRecuperar: null, netoArtista: 280.45, liquidado: null, pendLiquidar: 280.45, estado: 'Sin liquidar' },
  { artista: 'Sebastian Ledher', codigo: 'C1-2026-046', evento: 'FUEGO · Edén Ibiza · Sant Antoni de Portmany', fecha: '2026-08-01', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1488.29, liquidado: 1488.29, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Abdon', codigo: 'C1-2026-036', evento: 'LOAD · Sea Sea Club · Barcelona', fecha: '2026-08-01', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 600, liquidado: null, pendLiquidar: 600, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-050', evento: 'Solart Fest @ CARPA FUERTEVENTURA', fecha: '2026-07-30', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Marcel BS', codigo: 'C1-2026-052', evento: 'Zaia Costal Club · Zaia Costal Club · Yeni İskele', fecha: '2026-07-26', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 891.67, liquidado: null, pendLiquidar: 891.67, estado: 'Pendiente liquidar' },
  { artista: 'Pau Guilera', codigo: 'C1-2026-019', evento: 'The Next · Marina Beach Club · Valencia', fecha: '2026-07-26', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 400, liquidado: 400, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Bizza', codigo: 'C1-2026-033', evento: 'SIGHT · Ku Barcelona · Barcelona', fecha: '2026-07-26', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 800, liquidado: null, pendLiquidar: 800, estado: 'Pendiente liquidar' },
  { artista: 'Florentia', codigo: 'C1-2026-014', evento: 'Summer Opening Festival · Paseo de Santiago, Torreperogil · Torreperogil', fecha: '2026-07-25', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 1000, liquidado: 500, pendLiquidar: 500, estado: 'Liquidado' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-213', evento: 'Solarium', fecha: '2026-07-24', cobrado: 0, pendCobrar: 484, aRecuperar: null, netoArtista: 320, liquidado: null, pendLiquidar: 320, estado: 'Sin liquidar' },
  { artista: 'Pau Guilera', codigo: 'C1-2026-031', evento: 'Ohana · Ku Barcelona · Barcelona', fecha: '2026-07-20', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-212', evento: 'BRO MÁLAGA · Málaga', fecha: '2026-07-19', cobrado: 0, pendCobrar: 968, aRecuperar: null, netoArtista: 512, liquidado: null, pendLiquidar: 512, estado: 'Sin liquidar' },
  { artista: 'Los Canarios', codigo: 'C1-2026-006', evento: 'FUEGO · Edén Ibiza · Sant Antoni de Portmany', fecha: '2026-07-18', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1798.06, liquidado: 1798.06, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Bizza', codigo: 'C1-2026-035', evento: 'More Amor · Es Secret · Girona', fecha: '2026-07-18', cobrado: 0, pendCobrar: 1161.6, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Abdon', codigo: 'C1-2026-012', evento: 'FUNDAYS · Bassment · Madrid', fecha: '2026-07-18', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-199', evento: 'Playa Soleil · Sant Josep de sa Talaia', fecha: '2026-07-17', cobrado: 0, pendCobrar: 968, aRecuperar: null, netoArtista: 512, liquidado: null, pendLiquidar: 512, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-034', evento: 'Cecille · Playa Soleil · Sant Josep de sa Talaia', fecha: '2026-07-17', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 512, liquidado: null, pendLiquidar: 512, estado: 'Pendiente liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-004', evento: 'Paradise - Bunker · Hï · Illes Balears', fecha: '2026-07-15', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Liquidado' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-211', evento: 'Cerveceria costera · Trujillo', fecha: '2026-06-21', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-001', evento: 'BOTANIQ · Diverbosc · Cerdanyola del Vallès', fecha: '2026-06-21', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 512, liquidado: null, pendLiquidar: 512, estado: 'Pendiente liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-210', evento: 'WonderMusic 2026 · Centro Cultural Lima · Chorrillos', fecha: '2026-06-20', cobrado: 0, pendCobrar: 1331, aRecuperar: null, netoArtista: 880, liquidado: null, pendLiquidar: 880, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-198', evento: 'Cecille Showcase · Boris · Barcelona', fecha: '2026-06-17', cobrado: 0, pendCobrar: 968, aRecuperar: null, netoArtista: 512, liquidado: null, pendLiquidar: 512, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-209', evento: 'Bahia Invest Estepona S.L · Málaga', fecha: '2026-06-16', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 800, liquidado: null, pendLiquidar: 800, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-207', evento: 'Resaca Club · Dua Beach · Torremolinos', fecha: '2026-06-14', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 500, liquidado: null, pendLiquidar: 500, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-197', evento: 'Basement Club · Córdoba', fecha: '2026-06-10', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-196', evento: 'Boiler · underground · Rosario, Santa Fé', fecha: '2026-06-06', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 800, liquidado: null, pendLiquidar: 800, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-195', evento: 'Kompaz Crew · Boris Club', fecha: '2026-06-05', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-206', evento: 'Bambú · Santa Cruz de Tenerife', fecha: '2026-05-31', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-205', evento: 'Zar Society · Palma', fecha: '2026-05-24', cobrado: 0, pendCobrar: 1161.6, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-194', evento: 'Teatro Alicia · Lo Barnechea', fecha: '2026-05-24', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 690.64, liquidado: null, pendLiquidar: 690.64, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-193', evento: 'Raw · Raw club · Antofagasta', fecha: '2026-05-23', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-204', evento: 'Ayahuasca Marbella · LOV OLIVIA VALERE · Marbella', fecha: '2026-05-09', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-192', evento: 'Magnetic People · Tantra · Eivissa', fecha: '2026-05-08', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-191', evento: 'Big city jams', fecha: '2026-04-25', cobrado: 0, pendCobrar: 968, aRecuperar: null, netoArtista: 512, liquidado: null, pendLiquidar: 512, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-190', evento: 'DEXT GONNA GEOOVE · Chica Club Barcelona · Barcelona', fecha: '2026-04-18', cobrado: 0, pendCobrar: 508.2, aRecuperar: null, netoArtista: 350, liquidado: null, pendLiquidar: 350, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-189', evento: 'Marina Beach · Marina Beach Club · Valencia', fecha: '2026-04-17', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 800, liquidado: null, pendLiquidar: 800, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-188', evento: 'Carpe Diem · Barcelona', fecha: '2026-03-28', cobrado: 0, pendCobrar: 1161.6, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-010', evento: 'SIGHT · Ku Barcelona · Barcelona', fecha: '2026-03-08', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-203', evento: 'Treze Events · Maloa Club · Sabadell', fecha: '2026-02-27', cobrado: 0, pendCobrar: 1089, aRecuperar: null, netoArtista: 576, liquidado: null, pendLiquidar: 576, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-009', evento: 'MAGNETIC PEOPLE · INPUT High Fidelity · Barcelona', fecha: '2026-02-20', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 320, liquidado: null, pendLiquidar: 320, estado: 'Pendiente liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-186', evento: 'Marmarela · Alicante', fecha: '2026-02-14', cobrado: 0, pendCobrar: 1815, aRecuperar: null, netoArtista: 960, liquidado: null, pendLiquidar: 960, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-008', evento: 'House Club · Selva Club · Palma', fecha: '2026-01-31', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 520, liquidado: null, pendLiquidar: 520, estado: 'Pendiente liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-185', evento: 'Selva Mallorca · Selva Club · Palma', fecha: '2026-01-31', cobrado: 0, pendCobrar: 943.8, aRecuperar: null, netoArtista: 520, liquidado: null, pendLiquidar: 520, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-184', evento: 'Nero Club · Chiclayo', fecha: '2026-01-24', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 690.64, liquidado: null, pendLiquidar: 690.64, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2026-202', evento: 'Savana · Spazio Diaz · Milano', fecha: '2026-01-09', cobrado: 0, pendCobrar: 847, aRecuperar: null, netoArtista: 448, liquidado: null, pendLiquidar: 448, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2026-002', evento: 'SIGHT · Ku Barcelona · Barcelona', fecha: '2026-01-04', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-019', evento: 'MAR ELECTRONIC FESTIVAL SL · veles e vents · València', fecha: '2025-12-24', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 500, liquidado: null, pendLiquidar: 500, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-018', evento: 'MAR ELECTRONIC FESTIVAL · MAR ELECTRONIC FESTIVAL · València', fecha: '2025-12-20', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 500, liquidado: null, pendLiquidar: 500, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-033', evento: 'Infinity Segundo Aniversario · Plateruena · Durango', fecha: '2025-12-19', cobrado: 0, pendCobrar: 1016.4, aRecuperar: null, netoArtista: 560, liquidado: null, pendLiquidar: 560, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-032', evento: 'Roma Eventos · Nero Club · Chiclayo', fecha: '2025-11-29', cobrado: 0, pendCobrar: 1089, aRecuperar: null, netoArtista: 720, liquidado: null, pendLiquidar: 720, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-031', evento: 'After House · Puente Piedra', fecha: '2025-11-28', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 345.32, liquidado: null, pendLiquidar: 345.32, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-030', evento: 'HIDA OPEN AIR · Hida Open Air · Buenos Aires', fecha: '2025-11-23', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-029', evento: 'Botánica Sala · Montevideo', fecha: '2025-11-22', cobrado: 0, pendCobrar: 847, aRecuperar: null, netoArtista: 560, liquidado: null, pendLiquidar: 560, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-017', evento: 'Silver Room · ECS DOGANA · Catania', fecha: '2025-11-21', cobrado: 0, pendCobrar: 968, aRecuperar: null, netoArtista: 512, liquidado: null, pendLiquidar: 512, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-028', evento: 'Zona Zero South · Coronel', fecha: '2025-11-16', cobrado: 0, pendCobrar: 363, aRecuperar: null, netoArtista: 240, liquidado: null, pendLiquidar: 240, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-027', evento: 'Clubbing', fecha: '2025-11-15', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 384, liquidado: null, pendLiquidar: 384, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-016', evento: 'Dropset x Moya · Luz de Gas · Barcelona', fecha: '2025-11-15', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 500, liquidado: null, pendLiquidar: 500, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-026', evento: 'Day Off', fecha: '2025-11-14', cobrado: 0, pendCobrar: 847, aRecuperar: null, netoArtista: 448, liquidado: null, pendLiquidar: 448, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-015', evento: 'LOAD · Glitch Club · Cerdanyola del Valles', fecha: '2025-11-07', cobrado: 0, pendCobrar: 1161.6, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-014', evento: 'Good Taste · VIUZ · Itagüí', fecha: '2025-11-02', cobrado: 0, pendCobrar: 847, aRecuperar: null, netoArtista: 482.89, liquidado: null, pendLiquidar: 482.89, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-013', evento: 'Espacio Buena Vista · Talca', fecha: '2025-11-01', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 413.9, liquidado: null, pendLiquidar: 413.9, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-025', evento: 'Miama Dance Club · Santa Cruz de Tenerife', fecha: '2025-11-01', cobrado: 0, pendCobrar: 484, aRecuperar: null, netoArtista: 320, liquidado: null, pendLiquidar: 320, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-024', evento: 'True Torero · True Torero · Torremolinos', fecha: '2025-10-31', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-012', evento: 'Day Off', fecha: '2025-10-31', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 551.87, liquidado: null, pendLiquidar: 551.87, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-011', evento: 'KEDAVRA · Deeperclub', fecha: '2025-10-25', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 551.87, liquidado: null, pendLiquidar: 551.87, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-010', evento: 'THR33', fecha: '2025-10-11', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-023', evento: 'Bobbys Club Tenerife · Tenerife', fecha: '2025-10-11', cobrado: 0, pendCobrar: 1742.4, aRecuperar: null, netoArtista: 960, liquidado: null, pendLiquidar: 960, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-022', evento: 'The Garden · Ottimo Listening Bar · Vercelli', fecha: '2025-09-27', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 384, liquidado: null, pendLiquidar: 384, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-009', evento: 'PRYSM · Chicago', fecha: '2025-09-05', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 662.25, liquidado: null, pendLiquidar: 662.25, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-008', evento: 'Negroni Bistro & Sushi Bar · Miami', fecha: '2025-09-03', cobrado: 0, pendCobrar: 1210, aRecuperar: null, netoArtista: 551.87, liquidado: null, pendLiquidar: 551.87, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-021', evento: 'Kandy · Ardales', fecha: '2025-08-29', cobrado: 0, pendCobrar: 786.5, aRecuperar: null, netoArtista: 416, liquidado: null, pendLiquidar: 416, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-007', evento: 'DREAMBEACH FESTIVAL · DreamBeach Festival · Almería', fecha: '2025-08-09', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-006', evento: 'DreamBeach Festival · Almería', fecha: '2025-08-08', cobrado: 0, pendCobrar: 2178, aRecuperar: null, netoArtista: 1200, liquidado: null, pendLiquidar: 1200, estado: 'Sin liquidar' },
  { artista: 'Aaron Martin', codigo: 'C1-2025-020', evento: 'Temple Porto Rotondo · Porto Rotondo', fecha: '2025-08-04', cobrado: 0, pendCobrar: 847, aRecuperar: null, netoArtista: 448, liquidado: null, pendLiquidar: 448, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-005', evento: 'Makalali Beach · Varna', fecha: '2025-07-26', cobrado: 0, pendCobrar: 968, aRecuperar: null, netoArtista: 512, liquidado: null, pendLiquidar: 512, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-004', evento: 'Lift Club · Zagreb', fecha: '2025-04-25', cobrado: 0, pendCobrar: 1149.5, aRecuperar: null, netoArtista: 608, liquidado: null, pendLiquidar: 608, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-003', evento: 'IMPULSE · Tantra · Eivissa', fecha: '2025-04-22', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 400, liquidado: null, pendLiquidar: 400, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-002', evento: 'Trip Club · Miraflores', fecha: '2025-04-02', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 344.92, liquidado: null, pendLiquidar: 344.92, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2025-001', evento: 'SIGHT · Pacha Barcelona · Barcelona', fecha: '2025-03-30', cobrado: 0, pendCobrar: 1161.6, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-003', evento: 'Extremusika · Granada', fecha: '2024-09-26', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-010', evento: 'Magma · Costa Adeje', fecha: '2024-09-07', cobrado: 0, pendCobrar: 1161.6, aRecuperar: null, netoArtista: 640, liquidado: null, pendLiquidar: 640, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-009', evento: 'Ayuntamiento de Trigueros · Trigueros', fecha: '2024-09-04', cobrado: 0, pendCobrar: 1016.4, aRecuperar: null, netoArtista: 560, liquidado: null, pendLiquidar: 560, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-008', evento: 'Marina Valencia · Marina Beach Club · Valencia', fecha: '2024-06-09', cobrado: 0, pendCobrar: 1452, aRecuperar: null, netoArtista: 800, liquidado: null, pendLiquidar: 800, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-007', evento: 'Secret Sauce ft Avantgart Tabldot · Toy Room Malta · St. Julian\'s', fecha: '2024-06-06', cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 0, liquidado: null, pendLiquidar: null, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-006', evento: 'Pandora Sevilla · Sevilla', fecha: '2024-06-01', cobrado: 0, pendCobrar: 726, aRecuperar: null, netoArtista: 500, liquidado: null, pendLiquidar: 500, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-002', evento: 'Berlin Music Club · Granada', fecha: '2024-03-23', cobrado: 0, pendCobrar: 1016.4, aRecuperar: null, netoArtista: 560, liquidado: null, pendLiquidar: 560, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-005', evento: 'intro block · Inca', fecha: '2024-02-24', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-004', evento: 'The Boss Apress Ski · El Tarter', fecha: '2024-02-16', cobrado: 0, pendCobrar: 871.2, aRecuperar: null, netoArtista: 480, liquidado: null, pendLiquidar: 480, estado: 'Sin liquidar' },
  { artista: 'Bizza', codigo: 'C1-2024-001', evento: 'La Casona de Camaná · Lima', fecha: '2024-01-24', cobrado: 0, pendCobrar: 605, aRecuperar: null, netoArtista: 343.12, liquidado: null, pendLiquidar: 343.12, estado: 'Sin liquidar' },
  { artista: 'Andrea Castells', codigo: 'C1-2026-007', evento: 'Sephora Opening', fecha: null, cobrado: null, pendCobrar: null, aRecuperar: null, netoArtista: 1600, liquidado: null, pendLiquidar: 1600, estado: 'Sin liquidar' },];

/**
 * Deuda viva por artista: adelantos que la agencia le ha hecho y que se
 * descuentan de su posición neta. En el live de hoy sólo la arrastran dos.
 */
export const DEUDA_VIVA: Record<string, number> = {
  'Brenda Serna': 750,
  'Gaston Zani': 200,
};

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];

/** `2026-12-24` → `24 dic 2026`; sin fecha, la raya del live. */
export function formatFechaLiquidacion(iso: string | null): string {
  if (!iso) return '—';
  const [year, month, day] = iso.split('-');
  return `${day} ${MESES[Number(month) - 1]} ${year}`;
}

/**
 * Importes como los escribe esta pantalla: agrupación es-ES (que no separa los
 * millares de cuatro dígitos) y **espacio duro** antes del símbolo.
 *
 * El espacio está medido dos veces en el live —`&nbsp;` en el HTML y
 * `charCodeAt` = 160 en el DOM—, así que no se reutiliza el `formatImporte` de
 * `cobros.ts`, que mete un espacio normal.
 */
export function formatImporteLiquidacion(amount: number): string {
  const fijo = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${fijo}\u00A0€`;
}

/** La posición neta del artista va firmada, con el menos tipográfico del live. */
export function formatPosicionNeta(amount: number): string {
  if (amount > 0) return `+${formatImporteLiquidacion(amount)}`;
  if (amount < 0) return `−${formatImporteLiquidacion(Math.abs(amount))}`;
  return formatImporteLiquidacion(0);
}

const BADGES: Record<LiquidacionEstado, string> = {
  'Sin liquidar': 'badge bg-slate-100 text-slate-600',
  'Parcialmente liquidado': 'badge bg-amber-100 text-amber-700',
  'Pendiente liquidar': 'badge bg-blue-100 text-blue-700',
  Liquidado: 'badge bg-emerald-100 text-emerald-700',
  // El live ofrece «Incidencia» en el filtro pero hoy no pinta ninguna fila con
  // ese estado, así que su pastilla no está medida: se usa la de riesgo.
  Incidencia: 'badge bg-rose-100 text-rose-700',
};

export function badgeEstado(estado: LiquidacionEstado): string {
  return BADGES[estado];
}

export interface LiquidacionesKpis {
  pendienteCobrar: number;
  gastosPorRecuperar: number;
  pendienteLiquidar: number;
}

function suma(list: Liquidacion[], campo: keyof Liquidacion): number {
  return redondea(list.reduce((acc, fila) => acc + ((fila[campo] as number | null) ?? 0), 0));
}

function redondea(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Los tres KPI de cabecera, sumados de las filas visibles. */
export function liquidacionesKpis(list: Liquidacion[] = liquidaciones): LiquidacionesKpis {
  return {
    pendienteCobrar: suma(list, 'pendCobrar'),
    gastosPorRecuperar: suma(list, 'aRecuperar'),
    pendienteLiquidar: suma(list, 'pendLiquidar'),
  };
}

export interface FilaPorArtista {
  artista: string;
  shows: number;
  pendLiquidar: number;
  deudaViva: number | null;
  posicionNeta: number;
}

/** La tabla «Por artista»: un artista por fila, de mayor a menor pendiente. */
export function agruparPorArtista(list: Liquidacion[] = liquidaciones): FilaPorArtista[] {
  const porArtista = new Map<string, { shows: number; pendLiquidar: number }>();
  for (const fila of list) {
    const acc = porArtista.get(fila.artista) ?? { shows: 0, pendLiquidar: 0 };
    acc.shows += 1;
    acc.pendLiquidar += fila.pendLiquidar ?? 0;
    porArtista.set(fila.artista, acc);
  }

  return [...porArtista.entries()]
    .map(([artista, acc]) => {
      const deudaViva = DEUDA_VIVA[artista] ?? null;
      const pendLiquidar = redondea(acc.pendLiquidar);
      return {
        artista,
        shows: acc.shows,
        pendLiquidar,
        deudaViva,
        posicionNeta: redondea(pendLiquidar - (deudaViva ?? 0)),
      };
    })
    .sort((a, b) => b.pendLiquidar - a.pendLiquidar);
}

export function filtrarLiquidaciones(list: Liquidacion[], opcion: OpcionEstado): Liquidacion[] {
  if (opcion === 'Todos los estados') return list;
  return list.filter((fila) => fila.estado === opcion);
}

/** El buscador del live: «Buscar artista, show, código…». */
export function buscarLiquidaciones(list: Liquidacion[], texto: string): Liquidacion[] {
  const q = texto.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (fila) =>
      fila.artista.toLowerCase().includes(q) ||
      fila.evento.toLowerCase().includes(q) ||
      fila.codigo.toLowerCase().includes(q)
  );
}
