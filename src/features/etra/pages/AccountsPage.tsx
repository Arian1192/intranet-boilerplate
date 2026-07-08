import { useState } from 'react';
import { MasterDetailList, Badge, SegmentedControl } from '@/components/ui';
import { usePrAccounts } from '../hooks/usePrAccounts';
import type { PrAccount } from '@/types';

const STATUS_LABEL: Record<PrAccount['status'], string> = {
  active: 'Activa',
  paused: 'Pausada',
  inactive: 'Baja',
};

type AccountDetailTab = 'datos' | 'acciones' | 'obligaciones' | 'cobertura' | 'facturacion';

const DETAIL_TABS: { label: string; value: AccountDetailTab }[] = [
  { label: 'Datos', value: 'datos' },
  { label: 'Acciones', value: 'acciones' },
  { label: 'Obligaciones', value: 'obligaciones' },
  { label: 'Cobertura', value: 'cobertura' },
  { label: 'Facturación', value: 'facturacion' },
];

function AccountDetail({ account }: { account: PrAccount }) {
  const [tab, setTab] = useState<AccountDetailTab>('datos');

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">{account.name}</h2>
        <Badge variant="emerald">{STATUS_LABEL[account.status]}</Badge>
      </div>
      <div className="mb-4 border-b border-slate-100 pb-2">
        <SegmentedControl options={DETAIL_TABS} value={tab} onChange={setTab} />
      </div>
      {tab === 'datos' ? (
        <dl className="space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-slate-400">Resp.:</dt>
            <dd className="text-slate-700">{account.manager}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-400">Cliente CRM:</dt>
            <dd className="text-slate-700">{account.crmClient}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-400">Contacto:</dt>
            <dd className="text-slate-700">{account.contact}</dd>
          </div>
        </dl>
      ) : (
        <p className="py-8 text-center text-slate-400">Sin datos de ejemplo para esta pestaña.</p>
      )}
    </div>
  );
}

export function AccountsPage() {
  const { data, isLoading, error } = usePrAccounts();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Cuentas</h1>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Nueva cuenta
        </button>
      </div>
      <MasterDetailList
        items={data}
        emptyState="Selecciona una cuenta o crea una nueva."
        renderRow={(account) => (
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800">{account.name}</span>
            <Badge variant="emerald" size="sm">
              {STATUS_LABEL[account.status]}
            </Badge>
          </div>
        )}
        renderDetail={(account) => <AccountDetail key={account.id} account={account} />}
      />
    </div>
  );
}
