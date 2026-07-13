import { GROUP_COMPANIES, type CrmOrg, type OrgRole } from './seed';

export const ROLE_OPTIONS = ['Todos', 'Clientes', 'Proveedores', 'Leads'] as const;
export const COMPANY_OPTIONS = ['Cualquiera', ...GROUP_COMPANIES] as const;

export interface CrmFilters {
  query: string;
  role: OrgRole | 'Todos';
  worksWith: string; // 'Cualquiera' | company
}

export function filterOrgs(list: CrmOrg[], filters: CrmFilters): CrmOrg[] {
  const q = filters.query.trim().toLowerCase();
  return list.filter((o) => {
    if (filters.role !== 'Todos' && !o.roles.includes(filters.role)) return false;
    if (filters.worksWith !== 'Cualquiera' && !o.worksWith.includes(filters.worksWith)) return false;
    if (q) {
      const hay = [
        o.name, o.legalName ?? '', o.nif ?? '',
        ...o.contacts.map((c) => c.name),
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
