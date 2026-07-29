import type { Account, Campaign, Piece, EventItem, Publication, Artist } from './types';

/** Fecha de referencia del calco (día de la captura del live). */
export const todayIso = '2026-07-29';

/** Coste interno por hora del espacio (Ajustes · Rentabilidad). */
export const hourlyCost = 25;

const accountDefaults = {
  health: 'Sana' as const,
  tier: '—',
  sector: '—',
  startDate: '',
  monthlyHours: '',
  contractSigned: false,
  paymentStatus: 'Al corriente' as const,
  crmClient: '',
  databases: [],
  publicationTemplates: [],
  creativeTemplates: [],
};

export const accounts: Account[] = [
  {
    ...accountDefaults,
    id: 'acc-mogli', name: 'Mogli Marbella', kind: 'Cliente', services: [], status: 'Pausada', retainer: 0,
    commercialStatus: 'Lead',
    // Enlace de aprobación con token de mentira: el del live es una URL real y no se copia.
    approvalLink: 'https://bookings.conceptoneagency.com/aprobar/mock-mogli-marbella',
  },
  {
    ...accountDefaults,
    id: 'acc-opium', name: 'Opium Bcn', kind: 'Cliente', services: ['Paid media'], status: 'Activa', retainer: 2000,
    commercialStatus: 'Activo',
    approvalLink: 'https://bookings.conceptoneagency.com/aprobar/mock-opium-bcn',
  },
  {
    ...accountDefaults,
    id: 'acc-sight', name: 'SIGHT', kind: 'Cliente', services: ['Redes sociales', 'Paid media', 'Contenido'],
    status: 'Activa', retainer: 800, commercialStatus: 'Activo',
    approvalLink: 'https://bookings.conceptoneagency.com/aprobar/mock-sight',
    databases: [
      {
        id: 'bdd-fourvenues', name: 'Fourvenues Tickets',
        eventName: 'SIGHT: Oden & Fatzo, KOKO b2b Bizza, Jan, Caste',
        cleanContacts: 258, totalContacts: 408, state: 'Listo',
      },
      {
        id: 'bdd-fv', name: 'fv',
        eventName: 'SIGHT: Nicole Moudaber, Miane, Galgo, Janse',
        cleanContacts: 84, totalContacts: 158, state: 'Listo',
      },
    ],
    publicationTemplates: [
      { id: 'tpl-pub-settimes', title: 'Set Times {evento}', offsetDays: -1, time: '12:00', channel: 'Instagram', format: 'Reel', active: true },
      { id: 'tpl-pub-salida', title: 'Salida {evento}', offsetDays: -30, time: '17:00', channel: 'Instagram', format: 'Reel', active: true },
    ],
    creativeTemplates: [
      { id: 'tpl-crv-flyer', name: 'Flyer {evento}', type: 'Estático', department: 'Diseño', deadlineOffsetDays: -30, linkedPublication: 'Salida {evento}', active: true },
      { id: 'tpl-crv-settimes', name: 'Set Times {evento}', type: 'Estático', department: 'Diseño', deadlineOffsetDays: -5, linkedPublication: 'Set Times {evento}', active: true },
    ],
  },
];

export const campaigns: Campaign[] = [
  { id: 'cmp-generico-julio', name: 'Genérico Julio', account: 'SIGHT', type: 'Paid media', startLabel: '10 jul 2026', endLabel: '31 ago 2026', status: 'finalizada', owner: 'Sin asignar', budget: 600, spent: 0 },
];

export const pieces: Piece[] = [
  { id: 'pz-1', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT', type: 'Estático', priority: 'media', deadlineLabel: '10 jul 2026', status: 'revision', owner: 'Carlos', clientApproval: '—', checklistDone: 0, checklistTotal: 3 },
  { id: 'pz-2', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT', type: 'Vídeo', priority: 'media', deadlineLabel: '10 jul 2026', status: 'briefing', owner: 'Carlos', clientApproval: '—', checklistDone: 0, checklistTotal: 3 },
  { id: 'pz-3', title: 'Test', client: 'SIGHT', type: 'Estático', priority: 'alta', deadlineLabel: '09 jul 2026', status: 'en-produccion', owner: 'Carlos', clientApproval: '—', checklistDone: 0, checklistTotal: 0 },
];

export const events: EventItem[] = [
  { id: 'ev-oden', name: 'SIGHT: Oden & Fatzo, KOKO b2b Bizza, Jan, Caste', dateLabel: '19 jul 2026', isoDate: '2026-07-19', city: 'Barcelona', kind: 'marketing', euphoricCount: 1 },
  { id: 'ev-quiet', name: 'Please Quiet x SIGHT', dateLabel: '18 jul 2026', isoDate: '2026-07-18', city: 'Barcelona', kind: 'produccion' },
  { id: 'ev-mixmag', name: 'Mixmag Intimate Sessions: BLOND:ISH', dateLabel: '15 jul 2026', isoDate: '2026-07-15', city: 'Ibiza', kind: 'produccion' },
  { id: 'ev-patrick', name: 'SIGHT: Patrick Topping, ACA, Luca 606, Nicholls', dateLabel: '12 jul 2026', isoDate: '2026-07-12', city: 'Barcelona', kind: 'marketing', euphoricCount: 3 },
];

export const publications: Publication[] = [
  {
    id: 'pub-settimes', name: 'Set Times', dateLabel: '10 jul 2026', isoDate: '2026-07-10', channel: 'Instagram',
    account: 'SIGHT', status: 'En producción', type: 'Post', eventName: 'SIGHT: Patrick Topping, ACA, Luca 606, Nicholls',
    time: '12:00', textApproval: 'Aprobado', imageApproval: 'Pendiente', kanbanColumn: 'falta-arte',
  },
  {
    id: 'pub-settimes-claptone',
    name: 'Set Times SIGHT: Claptone, Vite b2b Miganova, Tomi & Kesh , Alexanders Som, Luka Kuhnow',
    dateLabel: '01 ago 2026', isoDate: '2026-08-01', channel: 'Instagram', account: 'SIGHT', status: 'Idea', type: 'Reel',
    eventName: 'SIGHT: Claptone, Vite b2b Miganova, Tomi & Kesh , Alexanders Som, Luka Kuhnow',
    time: '', textApproval: 'Pendiente', imageApproval: 'Pendiente', kanbanColumn: 'falta-copy',
  },
];

export const artists: Artist[] = [
  { id: 'aaron-martin', name: 'Aaron Martin', kind: 'Agencia' },
  { id: 'abdon', name: 'Abdon', kind: 'Agencia' },
  { id: 'aca', name: 'ACA', kind: 'Agencia' },
  { id: 'andrea-castells', name: 'Andrea Castells', kind: 'Agencia' },
  { id: 'art-no-logia', name: 'ART NO LOGIA', kind: 'Agencia' },
  { id: 'bassel-darwish', name: 'Bassel Darwish', kind: 'Agencia' },
  { id: 'bizza', name: 'Bizza', kind: 'Agencia' },
  { id: 'brenda-serna', name: 'Brenda Serna', kind: 'Agencia' },
  { id: 'claudia-tejeda', name: 'Claudia Tejeda', kind: 'Agencia' },
  { id: 'dh-moon', name: 'DH Moon', kind: 'Agencia' },
  { id: 'dhuna', name: 'Dhuna', kind: 'Agencia' },
  { id: 'florentia', name: 'Florentia', kind: 'Agencia' },
  { id: 'fran-hernandez', name: 'Fran Hernandez', kind: 'Agencia' },
  { id: 'freddy-bello', name: 'Freddy Bello', kind: 'Agencia' },
  { id: 'galgo', name: 'Galgo', kind: 'Externo' },
  { id: 'gaston-zani', name: 'Gaston Zani', kind: 'Agencia' },
  { id: 'janse', name: 'Janse', kind: 'Agencia' },
  { id: 'jose-fajardo', name: 'Jose Fajardo', kind: 'Agencia' },
  { id: 'koleto', name: 'Koleto', kind: 'Agencia' },
  { id: 'la-cintia', name: 'LA CINTIA', kind: 'Agencia' },
  { id: 'londonground', name: 'Londonground', kind: 'Agencia' },
  { id: 'los-canarios', name: 'Los Canarios', kind: 'Agencia' },
  { id: 'marcel-bs', name: 'Marcel BS', kind: 'Agencia' },
  { id: 'marian-ariss', name: 'Marian Ariss', kind: 'Agencia' },
  { id: 'miane', name: 'Miane', kind: 'Externo' },
  { id: 'milan', name: 'Milan', kind: 'Agencia' },
  { id: 'nacho-scoppa', name: 'Nacho Scoppa', kind: 'Agencia' },
  { id: 'nicole-moudaber', name: 'Nicole Moudaber', kind: 'Externo' },
  { id: 'olivia-bass', name: 'Olivia Bass', kind: 'Agencia' },
  { id: 'parsa-jafari', name: 'Parsa Jafari', kind: 'Agencia' },
  { id: 'pau-guilera', name: 'Pau Guilera', kind: 'Agencia' },
  { id: 'prophecy', name: 'Prophecy', kind: 'Agencia' },
  { id: 'rivellino', name: 'Rivellino', kind: 'Agencia' },
  { id: 'roleh', name: 'Rooléh', kind: 'Externo' },
  { id: 'rubenus', name: 'Rubenus', kind: 'Agencia' },
  { id: 'saldivar', name: 'Saldivar', kind: 'Agencia' },
  { id: 'sebastian-ledher', name: 'Sebastian Ledher', kind: 'Agencia' },
  { id: 'sera-de-villalta', name: 'Sera De Villalta', kind: 'Agencia' },
  { id: 'sergio-saffe', name: 'Sergio Saffe', kind: 'Agencia' },
  { id: 'sumia', name: 'SUMIA', kind: 'Agencia' },
  { id: 'tomi-kesh', name: 'Tomi & Kesh', kind: 'Agencia' },
  { id: 'vidaloca', name: 'Vidaloca', kind: 'Agencia' },
];

export const analytics = {
  mrr: 800,
  activeAccounts: 1,
  totalAccounts: 1,
  campaignBudget: 600,
  campaignSpent: 0,
  contentByStatus: [
    { label: 'Idea', count: 0 }, { label: 'En producción', count: 1 }, { label: 'Revisión', count: 0 },
    { label: 'Aprobado', count: 0 }, { label: 'Programado', count: 0 }, { label: 'Publicado', count: 0 },
  ],
  contentByChannel: [{ label: 'Instagram', count: 1 }],
};
