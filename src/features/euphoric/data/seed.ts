import type { Account, AgendaEntry, Campaign, Piece, EventItem, Publication, Artist } from './types';

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

/** Nombres largos de evento que se repiten en publicaciones y creatividades. */
const EV_CLAPTONE = 'SIGHT: Claptone, Vite b2b Miganova, Tomi & Kesh , Alexanders Som, Luka Kuhnow';
const EV_JAMES = 'SIGHT: James Hype, Alex Now, La Cintia, Pau Guilera';
const EV_SONNY = 'SIGHT: Sonny Fodera, Xandro, Marcel BS, Jose Fajardo';
const EV_ODEN = 'SIGHT: Oden & Fatzo, KOKO b2b Bizza, Jan, Caste';
const EV_PATRICK = 'SIGHT: Patrick Topping, ACA, Luca 606, Nicholls';
const EV_NICOLE = 'SIGHT: Nicole Moudaber, Miane, Galgo, Janse';

export const pieces: Piece[] = [
  { id: 'pz-flyer-sonny', title: `Flyer ${EV_SONNY}`, client: 'SIGHT', type: 'Estático', priority: 'media', isoDeadline: '2026-07-17', deadlineLabel: '17 jul 2026', status: 'briefing', owner: 'Sin asignar', version: 'v1', clientApproval: '—', checklistDone: 0, checklistTotal: 0 },
  { id: 'pz-settimes-sonny', title: `Set Times ${EV_SONNY}`, client: 'SIGHT', type: 'Estático', priority: 'media', isoDeadline: '2026-08-11', deadlineLabel: '11 ago 2026', status: 'briefing', owner: 'Sin asignar', version: 'v1', clientApproval: '—', checklistDone: 0, checklistTotal: 0 },
  { id: 'pz-settimes-james', title: `Set Times ${EV_JAMES}`, client: 'SIGHT', type: 'Estático', priority: 'media', isoDeadline: '2026-08-04', deadlineLabel: '04 ago 2026', status: 'briefing', owner: 'Alba', version: 'v1', clientApproval: '—', checklistDone: 0, checklistTotal: 0 },
  { id: 'pz-flyer-james', title: `Flyer ${EV_JAMES}`, client: 'SIGHT', type: 'Estático', priority: 'media', isoDeadline: '2026-07-10', deadlineLabel: '10 jul 2026', status: 'briefing', owner: 'Alba', version: 'v1', clientApproval: 'Pendiente cliente', checklistDone: 0, checklistTotal: 0 },
  { id: 'pz-claptone-opium', title: 'Claptone', client: 'Opium Bcn', type: 'Estático', priority: 'media', isoDeadline: '', deadlineLabel: '—', status: 'briefing', owner: 'Sin asignar', version: 'v1', clientApproval: '—', checklistDone: 0, checklistTotal: 0 },
  { id: 'pz-pack-sold-out', title: 'Pack Sold Out · Pack Sold Out', client: 'SIGHT', type: 'Estático', priority: 'media', isoDeadline: '2026-07-10', deadlineLabel: '10 jul 2026', status: 'en-produccion', owner: 'Carlos', version: 'v1', clientApproval: '—', checklistDone: 0, checklistTotal: 3 },
  { id: 'pz-settimes-claptone', title: `Set Times ${EV_CLAPTONE}`, client: 'SIGHT', type: 'Estático', priority: 'media', isoDeadline: '2026-07-28', deadlineLabel: '28 jul 2026', status: 'cambios', owner: 'Alba', version: 'v1', clientApproval: 'Pendiente cliente', checklistDone: 0, checklistTotal: 0 },
  { id: 'pz-video-pomo', title: 'Video Pomo 26/07', client: 'SIGHT', type: 'Vídeo', priority: 'media', isoDeadline: '2026-08-08', deadlineLabel: '08 ago 2026', status: 'aprobado', owner: 'Alba', version: 'v1', clientApproval: '—', checklistDone: 0, checklistTotal: 1 },
  { id: 'pz-flyer-claptone', title: `Flyer ${EV_CLAPTONE}`, client: 'SIGHT', type: 'Estático', priority: 'media', isoDeadline: '2026-07-03', deadlineLabel: '03 jul 2026', status: 'aprobado', owner: 'Sin asignar', version: 'v1', clientApproval: '—', checklistDone: 0, checklistTotal: 0 },
  { id: 'pz-flyer-claptone-0208', title: 'Flyer Claptone 02/08', client: 'SIGHT', type: 'Vídeo', priority: 'media', isoDeadline: '2026-07-22', deadlineLabel: '22 jul 2026', status: 'aprobado', owner: 'Carlos', version: 'v1', clientApproval: '—', checklistDone: 2, checklistTotal: 3 },
];

export const events: EventItem[] = [
  { id: 'ev-nicole', name: EV_NICOLE, dateLabel: '05 jul 2026', isoDate: '2026-07-05', city: 'Barcelona', account: 'SIGHT', kind: 'marketing' },
  { id: 'ev-patrick', name: EV_PATRICK, dateLabel: '12 jul 2026', isoDate: '2026-07-12', city: 'Barcelona', account: 'SIGHT', kind: 'marketing' },
  { id: 'ev-mixmag', name: 'Mixmag Intimate Sessions: BLOND:ISH', dateLabel: '15 jul 2026', isoDate: '2026-07-15', city: 'Ibiza', account: '', kind: 'produccion' },
  { id: 'ev-quiet', name: 'Please Quiet x SIGHT', dateLabel: '18 jul 2026', isoDate: '2026-07-18', city: 'Barcelona', account: 'SIGHT', kind: 'produccion' },
  { id: 'ev-levi', name: 'Levi', dateLabel: '19 jul 2026', isoDate: '2026-07-19', city: 'Barcelona', account: 'SIGHT', kind: 'marketing' },
  { id: 'ev-oden', name: EV_ODEN, dateLabel: '26 jul 2026', isoDate: '2026-07-26', city: 'Barcelona', account: 'SIGHT', kind: 'marketing' },
  { id: 'ev-claptone', name: EV_CLAPTONE, dateLabel: '02 ago 2026', isoDate: '2026-08-02', city: 'Barcelona', account: 'SIGHT', kind: 'marketing' },
  { id: 'ev-james', name: EV_JAMES, dateLabel: '09 ago 2026', isoDate: '2026-08-09', city: 'Barcelona', account: 'SIGHT', kind: 'marketing' },
  { id: 'ev-sonny', name: EV_SONNY, dateLabel: '16 ago 2026', isoDate: '2026-08-16', city: '', account: 'SIGHT', kind: 'marketing' },
];

export const publications: Publication[] = [
  { id: 'pub-salida-claptone', name: `Salida ${EV_CLAPTONE}`, dateLabel: '03 jul 2026', isoDate: '2026-07-03', channel: 'Instagram', account: 'SIGHT', status: 'Idea', type: 'Reel', eventName: EV_CLAPTONE, time: '17:00', textApproval: 'Pendiente', imageApproval: 'Pendiente', kanbanColumn: 'falta-copy' },
  { id: 'pub-settimes', name: 'Set Times', dateLabel: '10 jul 2026', isoDate: '2026-07-10', channel: 'Instagram', account: 'SIGHT', status: 'En producción', type: 'Post', eventName: EV_PATRICK, time: '12:00', textApproval: 'Aprobado', imageApproval: 'Pendiente', kanbanColumn: 'falta-copy' },
  { id: 'pub-salida-james', name: `Salida ${EV_JAMES}`, dateLabel: '10 jul 2026', isoDate: '2026-07-10', channel: 'Instagram', account: 'SIGHT', status: 'Idea', type: 'Reel', eventName: EV_JAMES, time: '17:00', textApproval: 'Pendiente', imageApproval: 'Pendiente', kanbanColumn: 'falta-copy' },
  { id: 'pub-salida-sonny', name: `Salida ${EV_SONNY}`, dateLabel: '17 jul 2026', isoDate: '2026-07-17', channel: 'Instagram', account: 'SIGHT', status: 'Idea', type: 'Reel', eventName: EV_SONNY, time: '17:00', textApproval: 'Pendiente', imageApproval: 'Pendiente', kanbanColumn: 'falta-copy' },
  { id: 'pub-video-promo-0208', name: 'Video Promo SIGHT 02/08', dateLabel: '21 jul 2026', isoDate: '2026-07-21', channel: 'Instagram', account: 'SIGHT', status: 'Publicado', type: 'Reel', time: '11:00', textApproval: 'Aprobado', imageApproval: 'Pendiente', kanbanColumn: 'publicado' },
  { id: 'pub-video-promo-2607', name: 'Video Promo 26/07', dateLabel: '22 jul 2026', isoDate: '2026-07-22', channel: 'Instagram', account: 'SIGHT', status: 'Idea', type: 'Reel', eventName: EV_ODEN, time: '12:00', textApproval: 'Pendiente', imageApproval: 'Pendiente', kanbanColumn: 'falta-arte' },
  { id: 'pub-settimes-claptone', name: `Set Times ${EV_CLAPTONE}`, dateLabel: '01 ago 2026', isoDate: '2026-08-01', channel: 'Instagram', account: 'SIGHT', status: 'Idea', type: 'Reel', eventName: EV_CLAPTONE, time: '12:00', textApproval: 'Pendiente', imageApproval: 'Aprobado', kanbanColumn: 'falta-aprobacion' },
  { id: 'pub-settimes-james', name: `Set Times ${EV_JAMES}`, dateLabel: '08 ago 2026', isoDate: '2026-08-08', channel: 'Instagram', account: 'SIGHT', status: 'Idea', type: 'Reel', eventName: EV_JAMES, time: '12:00', textApproval: 'Pendiente', imageApproval: 'Pendiente', kanbanColumn: 'falta-copy' },
  { id: 'pub-settimes-sonny', name: `Set Times ${EV_SONNY}`, dateLabel: '15 ago 2026', isoDate: '2026-08-15', channel: 'Instagram', account: 'SIGHT', status: 'Idea', type: 'Reel', eventName: EV_SONNY, time: '12:00', textApproval: 'Pendiente', imageApproval: 'Pendiente', kanbanColumn: 'falta-copy' },
];

export const agendaEntries: AgendaEntry[] = [
  { id: 'ag-board', title: 'Board Meeting', isoDate: '2026-07-29', time: '11:00', kind: 'Reunión', account: '' },
];

/** Umbrales de color del deadline y coste/hora del espacio (Ajustes). */
export const spaceSettings = {
  deadlineYellowDays: 7,
  deadlineRedDays: 2,
  hourlyCost,
};

export const artists: Artist[] = [
  { id: 'aaron-martin', name: 'Aaron Martin', kind: 'Agencia' },
  { id: 'abdon', name: 'Abdon', kind: 'Agencia' },
  { id: 'aca', name: 'ACA', kind: 'Agencia' },
  { id: 'addmor', name: 'ADDMOR', kind: 'Externo' },
  { id: 'aiiviik', name: 'AIIVIIK', kind: 'Externo' },
  { id: 'alex-now', name: 'Alex Now', kind: 'Externo' },
  { id: 'alexanders-som', name: 'Alexanders Som', kind: 'Externo' },
  { id: 'andrea-castells', name: 'Andrea Castells', kind: 'Agencia' },
  { id: 'andrew-azara', name: 'Andrew Azara', kind: 'Externo' },
  { id: 'art-no-logia', name: 'ART NO LOGIA', kind: 'Agencia' },
  { id: 'ballesteros', name: 'Ballesteros', kind: 'Externo' },
  { id: 'bassel-darwish', name: 'Bassel Darwish', kind: 'Agencia' },
  { id: 'bianca-lif', name: 'Bianca Lif', kind: 'Externo' },
  { id: 'bizza', name: 'Bizza', kind: 'Agencia' },
  { id: 'brenda-serna', name: 'Brenda Serna', kind: 'Agencia' },
  { id: 'caal', name: 'CAAL', kind: 'Externo' },
  { id: 'caste', name: 'Caste', kind: 'Externo' },
  { id: 'claptone', name: 'Claptone', kind: 'Externo' },
  { id: 'claudia-tejeda', name: 'Claudia Tejeda', kind: 'Agencia' },
  { id: 'cuartero', name: 'Cuartero', kind: 'Externo' },
  { id: 'de-la-swing', name: 'De La Swing', kind: 'Externo' },
  { id: 'dh-moon', name: 'DH Moon', kind: 'Agencia' },
  { id: 'dhuna', name: 'Dhuna', kind: 'Agencia' },
  { id: 'dontbedaft', name: 'Dontbedaft', kind: 'Externo' },
  { id: 'florentia', name: 'Florentia', kind: 'Agencia' },
  { id: 'fran-hernandez', name: 'Fran Hernandez', kind: 'Agencia' },
  { id: 'francisco-valentin', name: 'Francisco Valentín', kind: 'Externo' },
  { id: 'freddy-bello', name: 'Freddy Bello', kind: 'Agencia' },
  { id: 'funk-off', name: 'Funk Off', kind: 'Externo' },
  { id: 'galgo', name: 'Galgo', kind: 'Externo' },
  { id: 'gaston-zani', name: 'Gaston Zani', kind: 'Agencia' },
  { id: 'gordo', name: 'Gordo', kind: 'Externo' },
  { id: 'guille-placencia', name: 'Guille Placencia', kind: 'Externo' },
  { id: 'harvy-valencia', name: 'Harvy Valencia', kind: 'Externo' },
  { id: 'hector', name: 'Hector', kind: 'Externo' },
  { id: 'james-hype', name: 'James Hype', kind: 'Externo' },
  { id: 'jan', name: 'Jan', kind: 'Externo' },
  { id: 'janse', name: 'Janse', kind: 'Agencia' },
  { id: 'joey-daniel', name: 'Joey Daniel', kind: 'Externo' },
  { id: 'jorgesyn', name: 'JORGESYN', kind: 'Externo' },
  { id: 'jose-fajardo', name: 'Jose Fajardo', kind: 'Agencia' },
  { id: 'kaeru', name: 'Kaeru', kind: 'Externo' },
  { id: 'kele', name: 'Kele', kind: 'Externo' },
  { id: 'kevin-de-vries', name: 'Kevin de Vries', kind: 'Externo' },
  { id: 'kidoo', name: 'Kidoo', kind: 'Externo' },
  { id: 'koko', name: 'KOKO', kind: 'Externo' },
  { id: 'koleto', name: 'Koleto', kind: 'Agencia' },
  { id: 'la-cintia', name: 'LA CINTIA', kind: 'Agencia' },
  { id: 'levi', name: 'Levi', kind: 'Externo' },
  { id: 'linxes', name: 'Linxes', kind: 'Externo' },
  { id: 'local-support', name: 'Local Support', kind: 'Externo' },
  { id: 'londonground', name: 'Londonground', kind: 'Agencia' },
  { id: 'los-canarios', name: 'Los Canarios', kind: 'Agencia' },
  { id: 'luka-kuhnow', name: 'Luka Kuhnow', kind: 'Externo' },
  { id: 'luke-vose', name: 'Luke Vose', kind: 'Externo' },
  { id: 'marcel-bs', name: 'Marcel BS', kind: 'Agencia' },
  { id: 'marian', name: 'Marian', kind: 'Externo' },
  { id: 'marian-ariss', name: 'Marian Ariss', kind: 'Agencia' },
  { id: 'mazius-cale', name: 'MAZIUS&CALE', kind: 'Externo' },
  { id: 'miane', name: 'Miane', kind: 'Externo' },
  { id: 'miganova', name: 'Miganova', kind: 'Externo' },
  { id: 'milan', name: 'Milan', kind: 'Agencia' },
  { id: 'nacho-scoppa', name: 'Nacho Scoppa', kind: 'Agencia' },
  { id: 'nick-curly', name: 'Nick Curly', kind: 'Externo' },
  { id: 'nicole-moudaber', name: 'Nicole Moudaber', kind: 'Externo' },
  { id: 'oden-fatzo', name: 'Oden & Fatzo', kind: 'Externo' },
  { id: 'olivia-bass', name: 'Olivia Bass', kind: 'Agencia' },
  { id: 'omy-cid', name: 'Omy Cid', kind: 'Externo' },
  { id: 'oscar-buch', name: 'Oscar Buch', kind: 'Externo' },
  { id: 'parsa-jafari', name: 'Parsa Jafari', kind: 'Agencia' },
  { id: 'patrick-topping', name: 'Patrick Topping', kind: 'Externo' },
  { id: 'pau-guilera', name: 'Pau Guilera', kind: 'Agencia' },
  { id: 'paul-woolford', name: 'Paul Woolford', kind: 'Externo' },
  { id: 'prophecy', name: 'Prophecy', kind: 'Agencia' },
  { id: 'rivellino', name: 'Rivellino', kind: 'Agencia' },
  { id: 'rooleh', name: 'Rooléh', kind: 'Externo' },
  { id: 'rubenus', name: 'Rubenus', kind: 'Agencia' },
  { id: 's-a-m', name: 'S.A.M.', kind: 'Externo' },
  { id: 'saldivar', name: 'Saldivar', kind: 'Agencia' },
  { id: 'sebastian-ledher', name: 'Sebastian Ledher', kind: 'Agencia' },
  { id: 'sera-de-villalta', name: 'Sera De Villalta', kind: 'Agencia' },
  { id: 'sergio-saffe', name: 'Sergio Saffe', kind: 'Agencia' },
  { id: 'shakti', name: 'Shakti', kind: 'Externo' },
  { id: 'shoke', name: 'SHOKË', kind: 'Externo' },
  { id: 'sonny-fodera', name: 'Sonny Fodera', kind: 'Externo' },
  { id: 'sumia', name: 'SUMIA', kind: 'Agencia' },
  { id: 'tba', name: 'TBA', kind: 'Externo' },
  { id: 'test-artist', name: 'Test Artist', kind: 'Agencia' },
  { id: 'thinkpink', name: 'Thinkpink', kind: 'Externo' },
  { id: 'tom-nolan', name: 'Tom Nolan', kind: 'Externo' },
  { id: 'tomi-kesh', name: 'Tomi & Kesh', kind: 'Agencia' },
  { id: 'tony-guerra', name: 'Tony Guerra', kind: 'Agencia' },
  { id: 'vidaloca', name: 'Vidaloca', kind: 'Agencia' },
  { id: 'vite', name: 'Vite', kind: 'Externo' },
  { id: 'wes-colstock', name: 'Wes Colstock', kind: 'Externo' },
  { id: 'xandro', name: 'Xandro', kind: 'Externo' },
];

export const analytics = {
  mrr: accounts.filter((account) => account.status === 'Activa').reduce((total, account) => total + account.retainer, 0),
  activeAccounts: accounts.filter((account) => account.status === 'Activa').length,
  totalAccounts: accounts.length,
  campaignBudget: campaigns.reduce((total, campaign) => total + campaign.budget, 0),
  campaignSpent: campaigns.reduce((total, campaign) => total + campaign.spent, 0),
  contentByStatus: ['Idea', 'En producción', 'Revisión', 'Aprobado', 'Programado', 'Publicado'].map((label) => ({
    label,
    count: publications.filter((publication) => publication.status === label).length,
  })),
  contentByChannel: [{ label: 'Instagram', count: publications.filter((p) => p.channel === 'Instagram').length }],
};
