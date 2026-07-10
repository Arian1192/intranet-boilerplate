import { describe, it, expect } from 'vitest';
import { orgs } from './seed';
import { filterOrgs, ROLE_OPTIONS, COMPANY_OPTIONS } from './crm';

describe('crm helpers', () => {
  it('exposes role and company options', () => {
    expect(ROLE_OPTIONS).toEqual(['Todos', 'Clientes', 'Proveedores', 'Leads']);
    expect(COMPANY_OPTIONS[0]).toBe('Cualquiera');
    expect(COMPANY_OPTIONS).toContain('Etra Agency');
  });

  it('filters by query on name, nif and contact', () => {
    expect(filterOrgs(orgs, { query: 'bmg', role: 'Todos', worksWith: 'Cualquiera' }).map(o => o.id)).toEqual(['o1']);
    expect(filterOrgs(orgs, { query: 'B21932975', role: 'Todos', worksWith: 'Cualquiera' }).map(o => o.id)).toEqual(['o4']);
    expect(filterOrgs(orgs, { query: 'nil prat', role: 'Todos', worksWith: 'Cualquiera' }).map(o => o.id)).toEqual(['o10']);
  });

  it('filters by role (singular UI plural mapped)', () => {
    const clientes = filterOrgs(orgs, { query: '', role: 'Cliente', worksWith: 'Cualquiera' });
    expect(clientes.every(o => o.roles.includes('Cliente'))).toBe(true);
    expect(clientes.map(o => o.id)).toContain('o1');
    const leads = filterOrgs(orgs, { query: '', role: 'Lead', worksWith: 'Cualquiera' });
    expect(leads.map(o => o.id).sort()).toEqual(['o7', 'o9']);
  });

  it('filters by company (worksWith)', () => {
    const etra = filterOrgs(orgs, { query: '', role: 'Todos', worksWith: 'Etra Agency' });
    expect(etra.map(o => o.id)).toEqual(expect.arrayContaining(['o1', 'o2', 'o3', 'o10']));
    expect(etra.map(o => o.id)).not.toContain('o4');
  });
});
