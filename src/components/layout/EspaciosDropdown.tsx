import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { MODULES } from '@/lib/constants';
import { MODULE_ICONS } from '@/lib/icons';

export function EspaciosDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        Espacios
        <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 z-20 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            {MODULES.map((m) => {
              const Icon = MODULE_ICONS[m.id];
              return (
                <Link
                  key={m.id}
                  to={`/${m.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {Icon && <Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />}
                  {m.name}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
