/**
 * Copy exacto del panel "¿Cómo se calcula?" del live (transcrito de
 * `docs/references/herramientas/live-info-como-se-calcula.png`). Datos puros para que
 * `InfoComoSeCalcula` sea presentacional.
 */
export const seccionesInfo: { titulo: string; texto: string }[] = [
  {
    titulo: 'ASISTENCIA',
    texto:
      'Se calcula sumando las entradas vendidas + las invitaciones. Puedes forzarla a mano si ya conoces el dato real. El aforo máximo solo sirve para el % de ocupación.',
  },
  {
    titulo: 'BRUTO Y NETO (IVA)',
    texto:
      'El bruto es la caja con IVA incluido. El neto = bruto ÷ (1 + IVA%). El beneficio y los márgenes se calculan siempre sobre el NETO. Un gasto definido como % se aplica sobre el neto de su base (ticketing, barras…).',
  },
  {
    titulo: 'VIP: PROBABILIDAD VS ESCENARIO',
    texto:
      'La "Prob. %" de cada zona es la probabilidad de que SUS mesas se vendan (mesas vendidas = mesas × prob). El escenario (Pesimista/Base/Optimista) es una palanca GLOBAL que multiplica a la vez todo el volumen de venta —entradas, probabilidad VIP y consumo—. Es decir: la prob. VIP es tu expectativa base y el escenario la estresa arriba o abajo.',
  },
  {
    titulo: 'CONSUMO',
    texto:
      'Barras = consumiciones/hora × duración × precio medio × asistencia. Comida = % que consume × ticket medio × asistencia. Merch = % de conversión × precio medio × asistencia.',
  },
  {
    titulo: 'PUNTO DE EQUILIBRIO (BREAKEVEN)',
    texto:
      'Es el % de la venta proyectada (solo de las vías que elijas) necesario para que el beneficio sea 0. Con acuerdo activo se calcula sobre NUESTRO beneficio y solo cuenta los gastos que asumimos.',
  },
  {
    titulo: 'ACUERDO: BMG VS VENUE',
    texto:
      'Nuestro ingreso por vía = nuestro % sobre (bruto o neto) tras descontar la deducción previa (fija + %). Un gasto marcado BMG lo pagamos nosotros y resta de nuestro beneficio; uno marcado Venue lo cubre el local y NO resta de lo nuestro.',
  },
];
