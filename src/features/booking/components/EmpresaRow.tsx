import type { Empresa } from '../data/contactos';

export interface EmpresaRowProps {
  empresa: Empresa;
}

export function EmpresaRow({ empresa }: EmpresaRowProps) {
  const contacto = empresa.email ?? empresa.phone ?? null;
  const meta = empresa.sinDatos
    ? 'Sin datos de contacto'
    : [empresa.city, contacto].filter(Boolean).join(' · ');

  return (
    <div
      role="listitem"
      className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800">{empresa.name}</p>
        {meta && <p className="truncate text-xs text-slate-500">{meta}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs text-slate-400">
        {empresa.contactCount !== null && (
          <span>
            {empresa.contactCount} {empresa.contactCount === 1 ? 'contacto' : 'contactos'}
          </span>
        )}
        {/* Chevron ▼ inerte (spec D3: expansión no capturada en el live → no se implementa) */}
        <span aria-hidden>▼</span>
      </div>
    </div>
  );
}
