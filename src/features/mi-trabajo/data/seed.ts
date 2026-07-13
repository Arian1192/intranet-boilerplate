import type { PartialBlock } from '@blocknote/core';

export type DocVisibility = 'privado' | 'compartido' | 'equipo';

export interface DocNode {
  id: string;
  emoji: string;
  title: string;
  visibility: DocVisibility;
  parentId: string | null;
  content: PartialBlock[];
  updatedLabel: string;
}

export interface DocTask {
  id: string;
  docId: string;
  text: string;
  done: boolean;
  owner: string;
  dueLabel?: string;
  scope: 'mias' | 'creadas' | 'todas';
}

export const WELCOME_ID = 'd-welcome';

// Contenido calcado del doc "Bienvenido a Documentos" del live.
const welcomeContent: PartialBlock[] = [
  { type: 'heading', props: { level: 1 }, content: 'Bienvenido' },
  { type: 'paragraph', content: 'Esto sustituye a Notion. Todo lo que hacías allí, lo puedes hacer aquí — y algunas cosas que allí no podías. Este documento es una chuleta: tócalo, rómpelo, escribe encima.' },

  { type: 'heading', props: { level: 2 }, content: 'Lo primero: la tecla /' },
  { type: 'paragraph', content: 'Escribe una barra (/) en una línea vacía y se abre el menú de bloques. Ahí está todo: títulos, listas, tablas, código, imágenes, citas. No hay que memorizar nada, solo la barra.' },
  { type: 'paragraph', content: 'El otro gesto que importa: arrastra el asa que aparece a la izquierda de cada bloque para moverlo. Puedes reordenar el documento entero sin cortar y pegar.' },

  { type: 'heading', props: { level: 2 }, content: 'Texto' },
  { type: 'paragraph', content: [
    { type: 'text', text: 'Puedes poner texto en ', styles: {} },
    { type: 'text', text: 'negrita', styles: { bold: true } },
    { type: 'text', text: ', en ', styles: {} },
    { type: 'text', text: 'cursiva', styles: { italic: true } },
    { type: 'text', text: ', ', styles: {} },
    { type: 'text', text: 'subrayado', styles: { underline: true } },
    { type: 'text', text: ', ', styles: {} },
    { type: 'text', text: 'tachado', styles: { strike: true } },
    { type: 'text', text: ' o como código. Selecciona el texto y sale la barra de formato.', styles: {} },
  ] },

  { type: 'heading', props: { level: 2 }, content: 'Listas' },
  { type: 'paragraph', content: 'Con viñetas, para cosas que no llevan orden:' },
  { type: 'bulletListItem', content: 'Rider técnico del artista' },
  { type: 'bulletListItem', content: 'Hospitality' },
  { type: 'bulletListItem', content: 'Alojamiento y vuelos' },
  { type: 'paragraph', content: 'Numeradas, cuando el orden importa:' },
  { type: 'numberedListItem', content: 'El promotor confirma la fecha' },
  { type: 'numberedListItem', content: 'Se manda la oferta' },
  { type: 'numberedListItem', content: 'Se firma el contrato' },
  { type: 'numberedListItem', content: 'Se pide el depósito' },
  { type: 'paragraph', content: 'Y de tareas, con su casilla:' },
  { type: 'checkListItem', props: { checked: true }, content: 'Confirmar hora de soundcheck' },
  { type: 'checkListItem', props: { checked: false }, content: 'Mandar rider al venue' },
  { type: 'checkListItem', props: { checked: false }, content: 'Reservar hotel' },

  { type: 'heading', props: { level: 2 }, content: 'Citas' },
  { type: 'quote', content: 'Lo importante no es lo que dice el contrato, sino lo que pasa cuando el promotor no lo lee.' },

  { type: 'heading', props: { level: 2 }, content: 'Tablas' },
  { type: 'paragraph', content: 'Para lo que es tabla y no debería ser una lista:' },
  { type: 'table', content: {
    type: 'tableContent',
    rows: [
      { cells: ['Concepto', 'Importe', 'Estado'] },
      { cells: ['Caché artista', '3.500 €', 'Confirmado'] },
      { cells: ['Vuelos', '420 €', 'Pendiente'] },
      { cells: ['Hotel', '180 €', 'Pagado'] },
    ],
  } },

  { type: 'heading', props: { level: 2 }, content: 'Código' },
  { type: 'paragraph', content: 'Por si alguna vez hay que pegar algo técnico:' },
  { type: 'codeBlock', props: { language: 'javascript' }, content: 'const beneficio = ingresos - gastos\nif (beneficio < 0) avisar("Este show pierde dinero")' },

  { type: 'heading', props: { level: 2 }, content: 'El asistente de escritura' },
  { type: 'paragraph', content: 'Arriba del editor hay un botón ≡ Asistente. Selecciona un párrafo y puedes pedirle que lo mejore, lo corrija, lo acorte, lo desarrolle o lo traduzca. Sin nada seleccionado, puede resumirte el documento entero o escribir algo nuevo a partir de una instrucción.' },
  { type: 'paragraph', content: [
    { type: 'text', text: 'Nunca machaca el texto: primero te enseña lo que ha escrito y tú decides si lo insertas.', styles: { bold: true } },
  ] },

  { type: 'heading', props: { level: 2 }, content: 'Quién ve esto' },
  { type: 'paragraph', content: 'Arriba a la derecha eliges la visibilidad, y conviene entenderla bien:' },
  { type: 'table', content: {
    type: 'tableContent',
    rows: [
      { cells: ['Visibilidad', 'Quién lo ve'] },
      { cells: ['Privado', 'SOLO tú. Ni los administradores.'] },
      { cells: ['Compartido', 'Tú y las personas que elijas, una a una.'] },
      { cells: ['Todo el equipo', 'Cualquiera del equipo interno.'] },
    ],
  } },
  { type: 'paragraph', content: [
    { type: 'text', text: 'Lo de ', styles: {} },
    { type: 'text', text: 'privado es privado de verdad', styles: { bold: true } },
    { type: 'text', text: ': está garantizado en la base de datos, no es una promesa que te hagamos. Si no fuera así, nadie usaría esto para pensar.', styles: {} },
  ] },

  { type: 'heading', props: { level: 2 }, content: 'Lo que Notion no hacía' },
  { type: 'paragraph', content: 'Al pie de cada documento tienes «Tareas de este documento». De una reunión salen cosas que hay que hacer: cuélgalas ahí y aparecen en tu carril de tareas de la derecha, con su fecha y su responsable. El documento y el trabajo que sale de él viven juntos.' },

  { type: 'heading', props: { level: 2 }, content: 'Si te equivocas' },
  { type: 'paragraph', content: [
    { type: 'text', text: '«Archivar» lo quita de la lista sin borrarlo. «Eliminar» lo manda a la papelera, y tienes ', styles: {} },
    { type: 'text', text: '15 días', styles: { bold: true } },
    { type: 'text', text: ' para recuperarlo. La papelera está al final de la columna izquierda, pequeñita y a propósito: no queremos que borrar sea cómodo.', styles: {} },
  ] },

  { type: 'heading', props: { level: 2 }, content: 'Ahora prueba tú' },
  { type: 'paragraph', content: 'Borra esta línea, escribe / y mira lo que sale.' },
];

export const docs: DocNode[] = [
  { id: WELCOME_ID, emoji: '📘', title: 'Bienvenido a Documentos', visibility: 'equipo', parentId: null, content: welcomeContent, updatedLabel: 'Editado hoy' },
  { id: 'd-riders', emoji: '📄', title: 'Plantilla de rider técnico', visibility: 'equipo', parentId: WELCOME_ID, content: [
    { type: 'heading', props: { level: 1 }, content: 'Rider técnico' },
    { type: 'paragraph', content: 'Pega aquí el rider del artista y se convierte en filas automáticamente.' },
  ], updatedLabel: 'Editado hace 2 d' },
];

export const tasks: DocTask[] = [];
