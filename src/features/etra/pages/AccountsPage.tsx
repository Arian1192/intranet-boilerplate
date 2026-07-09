import { useState } from 'react';
import { MasterDetailList, Badge, Button, Card, Select, UnderlineTabs } from '@/components/ui';
import {
  AccountForm,
  AccountActionsTab,
  AccountObligationsTab,
  AccountCoverageTab,
  AccountBillingTab,
} from '../components';
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

function AccountDatosTab({ account }: { account: PrAccount }) {
  const rows: { label: string; value?: string }[] = [
    { label: 'Resp.', value: account.manager },
    { label: 'Cliente CRM', value: account.crmClient },
    { label: 'Contacto', value: account.contact },
    { label: 'Fecha de alta', value: account.signupDate },
    { label: 'Email', value: account.email },
    { label: 'Teléfono', value: account.phone },
    { label: 'Notas', value: account.notes },
  ];
  return (
    <dl className="space-y-1 text-sm">
      {rows
        .filter((row) => row.value)
        .map((row) => (
          <div key={row.label} className="flex gap-2">
            <dt className="text-slate-400">{row.label}:</dt>
            <dd className="text-slate-700">{row.value}</dd>
          </div>
        ))}
    </dl>
  );
}

function AccountDetail({ account }: { account: PrAccount }) {
  const [tab, setTab] = useState<AccountDetailTab>('datos');

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">{account.name}</h2>
        <Badge variant="emerald">{STATUS_LABEL[account.status]}</Badge>
      </div>
      <UnderlineTabs options={DETAIL_TABS} value={tab} onChange={setTab} className="mb-5" />
      {tab === 'datos' && <AccountDatosTab account={account} />}
      {tab === 'acciones' && <AccountActionsTab account={account} />}
      {tab === 'obligaciones' && <AccountObligationsTab account={account} />}
      {tab === 'cobertura' && <AccountCoverageTab account={account} />}
      {tab === 'facturacion' && <AccountBillingTab account={account} />}
    </div>
  );
}

export function AccountsPage() {
  const { data, isLoading, error } = usePrAccounts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'browse' | 'new'>('browse');

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Cuentas</h1>
        <p className="text-sm text-slate-500">
          Cuentas y marcas que gestiona el equipo: acciones de PR, cobertura y facturación.
        </p>
      </div>
      <MasterDetailList
        items={data}
        selectedId={mode === 'new' ? null : selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setMode('browse');
        }}
        listTop={
          <>
            <Button
              className="w-full"
              onClick={() => {
                setMode('new');
                setSelectedId(null);
              }}
            >
              + Nueva cuenta
            </Button>
            <Card className="p-4">
              <Select label="Estado">
                <option>Todas</option>
                <option>Activa</option>
                <option>Pausada</option>
                <option>Baja</option>
              </Select>
            </Card>
          </>
        }
        detailOverride={mode === 'new' ? <AccountForm onCancel={() => setMode('browse')} /> : undefined}
        emptyState="Selecciona una cuenta o crea una nueva."
        renderRow={(account) => (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">{account.name}</p>
              <p className="text-xs text-slate-400">{account.crmClient}</p>
            </div>
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
