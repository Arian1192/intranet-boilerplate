import type { Account, Campaign, Piece, EventItem, Publication } from './types';

export const accounts: Account[] = [
  { id: 'acc-sight', name: 'SIGHT', kind: 'Cliente', services: ['Redes sociales', 'Paid media', 'Contenido'], status: 'Activa', retainer: 800 },
];

export const campaigns: Campaign[] = [
  { id: 'cmp-generico-julio', name: 'Genérico Julio', account: 'SIGHT', type: 'Paid media', startLabel: '10 jul 2026', endLabel: '31 ago 2026', status: 'en-curso', owner: 'Sin asignar', budget: 600, spent: 0 },
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
