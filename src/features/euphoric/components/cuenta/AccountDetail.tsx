import { useState } from 'react';
import { cn } from '@/lib/utils';
import { GeneralTab } from './GeneralTab';
import { ServiciosTab, RentabilidadTab, SolicitudesTab, BrandingTab, BddTab } from './OtherTabs';
import { AutomatizacionesTab } from './AutomatizacionesTab';
import type { Account } from '../../data/types';

const TABS = [
  'General',
  'Servicios',
  'Rentabilidad',
  'Solicitudes',
  'Branding',
  'BDD',
  'Automatizaciones',
] as const;
type Tab = (typeof TABS)[number];

export function AccountDetail({ account }: { account: Account }) {
  const [tab, setTab] = useState<Tab>('General');

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-800">{account.name}</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {account.health}
          </span>
        </div>
        <button type="button" className="text-sm text-slate-400 hover:text-slate-600">
          Eliminar
        </button>
      </div>

      <nav aria-label="Pestañas de la cuenta" className="flex flex-wrap gap-6 border-b border-slate-200">
        {TABS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            className={cn(
              '-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors',
              tab === option
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            {option}
          </button>
        ))}
      </nav>

      {tab === 'General' && <GeneralTab key={account.id} account={account} />}
      {tab === 'Servicios' && <ServiciosTab />}
      {tab === 'Rentabilidad' && <RentabilidadTab />}
      {tab === 'Solicitudes' && <SolicitudesTab />}
      {tab === 'Branding' && <BrandingTab />}
      {tab === 'BDD' && <BddTab account={account} />}
      {tab === 'Automatizaciones' && <AutomatizacionesTab account={account} />}
    </div>
  );
}
