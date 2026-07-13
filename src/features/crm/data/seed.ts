export type OrgKind = 'Empresa' | 'Persona';
export type OrgRole = 'Cliente' | 'Proveedor' | 'Lead';

export interface CrmContact {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface CrmOrg {
  id: string;
  name: string;
  legalName?: string;
  tradeName?: string;
  nif?: string;
  vat?: string;
  kind: OrgKind;
  roles: OrgRole[];
  email?: string;
  website?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  worksWith: string[];
  contacts: CrmContact[];
  shippingAddresses: string[];
}

export const GROUP_COMPANIES = [
  'ConceptOne', 'CRUDA', 'Etra Agency', 'Euphoric Media', 'Mixmag Spain', 'TAGMAG',
];

export const orgs: CrmOrg[] = [
  {
    id: 'o1', name: 'BMG', legalName: 'BMG RIGHTS MANAGEMENT AND ADMINISTRATION (SPAIN) SL',
    nif: 'B64730187', kind: 'Empresa', roles: ['Cliente'],
    email: 'laura.martin@bmg.com',
    address: "C/ O'DONNELL 10 1º IZQ, Madrid, 28009, Madrid, España",
    worksWith: ['Etra Agency'], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o2', name: 'Foot District', legalName: 'FOOT DISTRICT SL', nif: 'B66112233',
    kind: 'Empresa', roles: ['Cliente'], email: 'hola@footdistrict.com', website: 'footdistrict.com',
    address: 'C/ Tallers 42, Barcelona, 08001, Barcelona, España',
    worksWith: ['Etra Agency'],
    contacts: [
      { id: 'c1', name: 'Marta Ruiz', role: 'Marketing', email: 'marta@footdistrict.com' },
    ],
    shippingAddresses: ['Almacén central · Pol. Ind. Zona Franca, Barcelona'],
  },
  {
    id: 'o3', name: 'New Era', legalName: 'NEW ERA CAP EUROPE', nif: 'W1234567H',
    kind: 'Empresa', roles: ['Cliente', 'Proveedor'], email: 'eu@neweracap.com',
    address: 'Amsterdam, Países Bajos', worksWith: ['CRUDA', 'Etra Agency'],
    contacts: [], shippingAddresses: [],
  },
  {
    id: 'o4', name: '1A PROJECTS 1802 SL', nif: 'B21932975', kind: 'Empresa', roles: ['Proveedor'],
    worksWith: ['ConceptOne'], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o5', name: 'ALQUIEVENTS SL', nif: 'B87650446', kind: 'Empresa', roles: ['Proveedor'],
    email: 'info@alquievents.es', worksWith: ['ConceptOne', 'Mixmag Spain'],
    contacts: [], shippingAddresses: [],
  },
  {
    id: 'o6', name: 'Alvaro Costa España', nif: '71953601X', kind: 'Persona', roles: ['Proveedor'],
    worksWith: ['Euphoric Media'], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o7', name: 'DSKONNECT', legalName: 'DSKONNECT SL', nif: 'B99887766', kind: 'Empresa',
    roles: ['Lead'], email: 'sales@dskonnect.com', worksWith: [], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o8', name: 'HILTON OF SPAIN SL', nif: 'B12093844', kind: 'Empresa', roles: ['Cliente'],
    email: 'events@hilton.es', address: 'Madrid, España', worksWith: ['ConceptOne'],
    contacts: [], shippingAddresses: [],
  },
  {
    id: 'o9', name: 'Oso Polita', nif: '39532340D', kind: 'Persona', roles: ['Lead'],
    worksWith: [], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o10', name: 'TAGMAG', legalName: 'TAGMAG MEDIA SL', nif: 'B55512347', kind: 'Empresa',
    roles: ['Cliente'], email: 'hey@tagmag.es', website: 'tagmag.es',
    address: 'Barcelona, España', worksWith: ['Etra Agency', 'Euphoric Media'],
    contacts: [{ id: 'c2', name: 'Nil Prat', role: 'Editor', email: 'nil@tagmag.es' }],
    shippingAddresses: [],
  },
];
