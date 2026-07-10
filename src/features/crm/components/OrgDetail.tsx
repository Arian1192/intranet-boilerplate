import { Badge, Button, Card } from '@/components/ui';
import type { CrmContact, CrmOrg } from '../data/seed';

function SectionCard({ title, action, children }: { title: string; action: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
        {action}
      </div>
      {children}
    </Card>
  );
}

export interface OrgDetailProps {
  org: CrmOrg;
}

export function OrgDetail({ org }: OrgDetailProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="truncate text-lg font-semibold text-slate-800">{org.name}</h2>
          <Button variant="secondary" size="sm" className="shrink-0 border-slate-300">
            Modificar
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <Badge variant="neutral">{org.roles[0] ?? 'Lead'}</Badge>
          <span>{org.kind}</span>
          {org.nif && <span>NIF: {org.nif}</span>}
        </div>
        {org.legalName && <p className="mt-2 text-sm text-slate-500">Razón social: {org.legalName}</p>}
        {org.email && <p className="mt-1 text-sm text-slate-600">{org.email}</p>}
        {org.address && <p className="mt-1 text-sm text-slate-600">{org.address}</p>}
        {org.worksWith.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Trabaja con:</span>
            {org.worksWith.map((c) => (
              <span key={c} className="inline-flex items-center rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                {c}
              </span>
            ))}
          </div>
        )}
      </Card>

      <SectionCard
        title="PERSONAS DE CONTACTO"
        action={<Button variant="secondary" size="sm" className="border-slate-300">+ Añadir persona</Button>}
      >
        {org.contacts.length === 0 ? (
          <p className="text-sm text-slate-400">Sin personas de contacto.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {org.contacts.map((c: CrmContact) => (
              <li key={c.id} className="py-2">
                <p className="text-sm font-medium text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-400">
                  {[c.role, c.email, c.phone].filter(Boolean).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="DIRECCIONES DE ENVÍO"
        action={<Button variant="secondary" size="sm" className="border-slate-300">+ Añadir dirección</Button>}
      >
        {org.shippingAddresses.length === 0 ? (
          <p className="text-sm text-slate-400">Sin direcciones de envío.</p>
        ) : (
          <ul className="space-y-1 text-sm text-slate-600">
            {org.shippingAddresses.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}
      </SectionCard>

      <Card className="border-slate-200 p-5">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          PORTAL DE REPOSICIONES (CRUDA)
        </h3>
        <p className="mb-3 text-sm text-slate-500">
          Da acceso a este cliente para que pida sus reposiciones de forma autónoma. Verá solo su catálogo y sus pedidos.
        </p>
        <div className="flex items-center gap-2">
          <input className="input" placeholder="email@cliente.com" />
          <Button variant="secondary" className="shrink-0 border-slate-300">Invitar</Button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Se le enviará un email para crear su contraseña. Requiere permiso de gestión de usuarios.
        </p>
      </Card>
    </div>
  );
}
