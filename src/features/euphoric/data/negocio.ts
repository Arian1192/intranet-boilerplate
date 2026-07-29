import { accounts, campaigns, hourlyCost, publications } from './seed';
import type { BusinessAlert, CatalogService, Dedication, Lead, PhaseTime, StalledItem } from './types';

/** Jornada de referencia con la que el live calcula la carga del equipo. */
export const referenceHoursPerMonth = 160;

export const leads: Lead[] = [
  {
    id: 'lead-mogli', name: 'Mogli Marbella', probability: 10, value: 1150,
    owner: 'Fran', ownerInitials: 'FV', closeDateLabel: '01 mar 2027', stage: 'frio',
  },
];

export const catalogServices: CatalogService[] = [
  {
    id: 'svc-pack-10', name: 'Pack 10 Diseños', department: 'Diseño',
    detail: '10 creativ./mes · extra 75,00 €', unit: 'mes', rate: 1000, minimum: 0, cost: 0,
  },
];

export const teamLoad: Dedication[] = [{ id: 'ded-alba', label: 'Alba G', hoursPerMonth: 2, cost: 25 }];

export const departmentCost: Dedication[] = [
  { id: 'dep-marketing', label: 'Marketing', hoursPerMonth: 2, cost: 25 },
];

export const businessAlerts: BusinessAlert[] = [
  {
    id: 'alert-opium', account: 'Opium Bcn',
    message: 'Sin publicaciones en los próximos 7 días', tag: 'Contenido faltante',
  },
];

export const phaseTimes: PhaseTime[] = [
  { id: 'pt-briefing', entity: 'Creatividad', phase: 'Briefing', average: '2.0 d', times: '3 veces' },
  { id: 'pt-aprobado', entity: 'Creatividad', phase: 'Aprobado', average: '9.3 h', times: '2 veces' },
  { id: 'pt-cambios', entity: 'Creatividad', phase: 'Cambios', average: '0 min', times: '1 vez' },
];

const EV_CLAPTONE = 'SIGHT: Claptone, Vite b2b Miganova, Tomi & Kesh , Alexanders Som, Luka Kuhnow';
const EV_JAMES = 'SIGHT: James Hype, Alex Now, La Cintia, Pau Guilera';
const EV_SONNY = 'SIGHT: Sonny Fodera, Xandro, Marcel BS, Jose Fajardo';

export const stalledItems: StalledItem[] = [
  { id: 'st-1', title: 'Video Promo 26/07', entity: 'Publicación', status: 'Idea', account: 'SIGHT', age: '6.8 d' },
  { id: 'st-2', title: 'Pack Sold Out · Pack Sold Out', entity: 'Creatividad', status: 'En producción', account: 'SIGHT', age: '5.4 d' },
  { id: 'st-3', title: 'Set Times', entity: 'Publicación', status: 'En producción', account: 'SIGHT', age: '5.3 d' },
  { id: 'st-4', title: 'Claptone', entity: 'Creatividad', status: 'Briefing', account: 'Opium Bcn', age: '1.7 d' },
  { id: 'st-5', title: `Set Times ${EV_CLAPTONE}`, entity: 'Publicación', status: 'Idea', account: 'SIGHT', age: '1.7 d' },
  { id: 'st-6', title: `Salida ${EV_CLAPTONE}`, entity: 'Publicación', status: 'Idea', account: 'SIGHT', age: '1.7 d' },
  { id: 'st-7', title: `Set Times ${EV_JAMES}`, entity: 'Publicación', status: 'Idea', account: 'SIGHT', age: '22 h' },
  { id: 'st-8', title: `Salida ${EV_JAMES}`, entity: 'Publicación', status: 'Idea', account: 'SIGHT', age: '22 h' },
  { id: 'st-9', title: `Flyer ${EV_JAMES}`, entity: 'Creatividad', status: 'Briefing', account: 'SIGHT', age: '22 h' },
  { id: 'st-10', title: `Set Times ${EV_JAMES}`, entity: 'Creatividad', status: 'Briefing', account: 'SIGHT', age: '22 h' },
  { id: 'st-11', title: `Set Times ${EV_CLAPTONE}`, entity: 'Creatividad', status: 'Cambios', account: 'SIGHT', age: '21 h' },
  { id: 'st-12', title: `Set Times ${EV_SONNY}`, entity: 'Publicación', status: 'Idea', account: 'SIGHT', age: '21 h' },
  { id: 'st-13', title: `Salida ${EV_SONNY}`, entity: 'Publicación', status: 'Idea', account: 'SIGHT', age: '21 h' },
  { id: 'st-14', title: `Flyer ${EV_SONNY}`, entity: 'Creatividad', status: 'Briefing', account: 'SIGHT', age: '21 h' },
  { id: 'st-15', title: `Set Times ${EV_SONNY}`, entity: 'Creatividad', status: 'Briefing', account: 'SIGHT', age: '21 h' },
];

const activeAccounts = accounts.filter((account) => account.status === 'Activa');

/** Cifras de la portada de Negocio, derivadas del espejo del live. */
export const direccion = {
  mrr: activeAccounts.reduce((total, account) => total + account.retainer, 0),
  hoursCost: 0,
  activeClients: activeAccounts.length,
  totalAccounts: accounts.length,
  leadsInPipeline: leads.length,
  forecast: leads.reduce((total, lead) => total + (lead.value * lead.probability) / 100, 0),
  monthHours: 0,
  activeCampaigns: campaigns.filter((campaign) => campaign.status === 'en-curso').length,
  pendingCampaigns: campaigns.filter((campaign) => campaign.status === 'planificada').length,
  pendingPayments: accounts.filter((account) => account.paymentStatus !== 'Al corriente').length,
  openIncidents: 0,
  healthy: activeAccounts.filter((account) => account.health === 'Sana').length,
  atRisk: activeAccounts.filter((account) => account.health === 'Riesgo').length,
  critical: activeAccounts.filter((account) => account.health === 'Crítica').length,
};

export const pipelineTotals = {
  leads: leads.length,
  value: leads.reduce((total, lead) => total + lead.value, 0),
  forecast: leads.reduce((total, lead) => total + (lead.value * lead.probability) / 100, 0),
};

export const analiticaTotals = {
  publicationsByAccount: (name: string) => publications.filter((publication) => publication.account === name).length,
  hourlyCost,
};
