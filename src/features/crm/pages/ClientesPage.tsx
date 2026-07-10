import { useMemo, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { orgs as allOrgs } from '../data/seed';
import { filterOrgs, ROLE_OPTIONS, COMPANY_OPTIONS } from '../data/crm';
import type { OrgRole } from '../data/seed';
import { OrgListRow } from '../components/OrgListRow';
import { OrgDetail } from '../components/OrgDetail';
import { OrgForm } from '../components/OrgForm';

const ROLE_VALUE: Record<(typeof ROLE_OPTIONS)[number], OrgRole | 'Todos'> = {
  Todos: 'Todos', Clientes: 'Cliente', Proveedores: 'Proveedor', Leads: 'Lead',
};

export function ClientesPage() {
  const [query, setQuery] = useState('');
  const [roleLabel, setRoleLabel] = useState<(typeof ROLE_OPTIONS)[number]>('Todos');
  const [company, setCompany] = useState<string>('Cualquiera');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const visible = useMemo(
    () => filterOrgs(allOrgs, { query, role: ROLE_VALUE[roleLabel], worksWith: company }),
    [query, roleLabel, company],
  );
  const selected = visible.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Clientes</h1>
        <p className="text-sm text-slate-500">
          CRM del grupo: organizaciones (clientes, proveedores, leads) y sus contactos.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="min-w-0 lg:col-span-1">
          <Button
            variant="primary"
            className="mb-3 w-full"
            onClick={() => { setCreating(true); setSelectedId(null); }}
          >
            + Nueva organización
          </Button>

          <Card className="mb-3 space-y-2 border-slate-200 p-3">
            <input
              className="input"
              placeholder="Busca por empresa, NIF o contacto…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="select" value={roleLabel} onChange={(e) => setRoleLabel(e.target.value as (typeof ROLE_OPTIONS)[number])}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r === 'Todos' ? 'Todos' : r}</option>
              ))}
            </select>
            <select className="select" value={company} onChange={(e) => setCompany(e.target.value)}>
              {COMPANY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c === 'Cualquiera' ? 'Cualquier empresa del grupo' : `Trabaja con ${c}`}</option>
              ))}
            </select>
          </Card>

          <Card className="divide-y divide-slate-100 overflow-hidden border-slate-200 p-0">
            {visible.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">
                Sin resultados. Ajusta la búsqueda o los filtros.
              </p>
            ) : (
              visible.map((org) => (
                <OrgListRow
                  key={org.id}
                  org={org}
                  selected={selectedId === org.id}
                  onSelect={() => { setSelectedId(org.id); setCreating(false); }}
                />
              ))
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="min-w-0 lg:col-span-2">
          {creating ? (
            <OrgForm onClose={() => setCreating(false)} />
          ) : selected ? (
            <OrgDetail org={selected} />
          ) : (
            <Card className="flex min-h-[300px] items-center justify-center border-slate-200 p-5 text-sm text-slate-400">
              Selecciona una organización o crea una nueva.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
