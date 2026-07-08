import { MODULES } from '@/lib/constants';
import { MODULE_ICONS } from '@/lib/icons';
import { Link, useLocation } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ModuleSelector() {
  const location = useLocation();
  const activeModule = MODULES.find((m) => location.pathname.startsWith(`/${m.slug}`));

  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Módulos de negocio">
      {MODULES.filter((m) => m.category === 'business').map((module) => {
        const Icon = MODULE_ICONS[module.id];
        const isActive = activeModule?.id === module.id;
        return (
          <Link
            key={module.id}
            to={`/${module.slug}`}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {module.name}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}
