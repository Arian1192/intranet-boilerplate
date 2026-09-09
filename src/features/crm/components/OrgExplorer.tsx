import { useMemo, useState } from 'react';
import { Card } from '@/components/ui';
import { orgs as allOrgs } from '../data/seed';
import { filterOrgs, ROLE_OPTIONS, COMPANY_OPTIONS } from '../data/crm';
import type { OrgRole } from '../data/seed';
import { OrgListRow } from './OrgListRow';
import { OrgDetail } from './OrgDetail';
import { OrgForm } from './OrgForm';

const ROLE_VALUE: Record<(typeof ROLE_OPTIONS)[number], OrgRole | 'Todos'> = {
  Todos: 'Todos',
  Clientes: 'Cliente',
  Proveedores: 'Proveedor',
  Leads: 'Lead',
};

export const AVISO_BUSCAR = 'Busca por nombre, NIF o contacto, o usa los filtros.';
export const PLACEHOLDER_ORGS = 'Buscar por empresa, NIF o contacto…';

export interface OrgExplorerProps {
  /**
   * El buscador propio de la tarjeta de filtros.
   *
   * Lo lleva `/crm`, pero **no** la pestaña «Empresas» de `/contactos`: allí el
   * buscador es el global que hay encima de las pestañas. Medido en el live el
   * 2026-09-09. Es lo único que cambia entre los dos sitios, así que va como
   * prop en vez de duplicar la pantalla.
   */
  mostrarBuscador?: boolean;
}

/**
 * El explorador de organizaciones del CRM: filtros a la izquierda, ficha a la
 * derecha.
 *
 * Vive aquí, y no dentro de `ClientesPage`, porque el live lo enseña en **dos**
 * sitios: en `/crm` y empotrado en la pestaña «Empresas» de `/contactos`. El
 * dato es uno solo —el del CRM— y el cuerpo también.
 *
 * **Arranca vacío, en modo buscar-primero.** No es una decisión nuestra: es lo
 * que hace el live en los dos sitios. Hasta que no hay búsqueda o algún filtro
 * puesto, en vez de la lista se enseña el aviso con el total del CRM.
 */
export function OrgExplorer({ mostrarBuscador = true }: OrgExplorerProps) {
  const [query, setQuery] = useState('');
  const [roleLabel, setRoleLabel] = useState<(typeof ROLE_OPTIONS)[number]>('Todos');
  const [company, setCompany] = useState<string>('Cualquiera');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const sinBuscar = !query.trim() && roleLabel === 'Todos' && company === 'Cualquiera';

  const visible = useMemo(
    () => filterOrgs(allOrgs, { query, role: ROLE_VALUE[roleLabel], worksWith: company }),
    [query, roleLabel, company]
  );
  const selected = visible.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="min-w-0 lg:col-span-1">
        {/*
          La CLASE `btn-primary`, no el componente `Button`: la base de
          `index.css` da exactamente lo que mide el live fuera de la carcasa
          (8px 16px, radio 8px, 14px, carbón), y dentro de `.apx` la propia
          `apx.css` le pone el violeta con gradiente. `Button` no recibe nada de
          eso y además mide 40px de alto en vez de 36.
        */}
        <button
          type="button"
          className="btn-primary mb-3 w-full"
          onClick={() => {
            setCreating(true);
            setSelectedId(null);
          }}
        >
          + Nueva organización
        </button>

        <Card className="mb-3 space-y-2 border-slate-200 p-3">
          {mostrarBuscador && (
            <input
              className="input"
              placeholder={PLACEHOLDER_ORGS}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          <select
            className="select"
            value={roleLabel}
            onChange={(e) => setRoleLabel(e.target.value as (typeof ROLE_OPTIONS)[number])}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select className="select" value={company} onChange={(e) => setCompany(e.target.value)}>
            {COMPANY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c === 'Cualquiera' ? 'Cualquier empresa del grupo' : `Trabaja con ${c}`}
              </option>
            ))}
          </select>
        </Card>

        <Card className="divide-y divide-slate-100 overflow-hidden border-slate-200 p-0">
          {sinBuscar ? (
            <div className="px-4 py-16 text-center text-sm text-slate-400">
              <div className="mb-1 text-2xl">🔍</div>
              {AVISO_BUSCAR}
              <div className="mt-1 text-xs text-slate-300">
                {allOrgs.length} organizaciones en el CRM
              </div>
            </div>
          ) : visible.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              Sin resultados. Ajusta la búsqueda o los filtros.
            </p>
          ) : (
            visible.map((org) => (
              <OrgListRow
                key={org.id}
                org={org}
                selected={selectedId === org.id}
                onSelect={() => {
                  setSelectedId(org.id);
                  setCreating(false);
                }}
              />
            ))
          )}
        </Card>
      </section>

      <section className="min-w-0 lg:col-span-2">
        {creating ? (
          <OrgForm onClose={() => setCreating(false)} />
        ) : selected ? (
          <OrgDetail org={selected} />
        ) : (
          <Card className="flex min-h-[300px] items-center justify-center border-slate-200 p-5 text-sm text-slate-400">
            Selecciona una organización o crea una nueva.
          </Card>
        )}
      </section>
    </div>
  );
}
