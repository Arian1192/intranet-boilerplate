import { useState } from 'react';
import { Button, MasterDetailList } from '@/components/ui';
import { AccountForm } from '../components/AccountForm';
import { AccountDetail } from '../components/cuenta/AccountDetail';
import { StatusChip } from '../components/StatusChip';
import { accounts } from '../data/seed';

export function CuentasPage() {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Cuentas</h1>
        <p className="text-slate-500">
          Clientes y marcas que gestiona Euphoric. Los clientes externos se enlazan al CRM del grupo.
        </p>
      </div>

      <MasterDetailList
        items={accounts}
        emptyState="Selecciona una cuenta o crea una nueva."
        detailOverride={creating ? <AccountForm onSave={() => setCreating(false)} /> : undefined}
        listTop={
          <Button className="w-full" onClick={() => setCreating(true)}>
            + Nueva cuenta
          </Button>
        }
        renderRow={(account) => (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 font-medium text-slate-900">
                {account.status === 'Activa' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                {account.name}
              </p>
              <p className="text-sm text-slate-500">
                {[account.kind, account.services.join(', ')].filter(Boolean).join(' · ')}
              </p>
            </div>
            <StatusChip status={account.status} />
          </div>
        )}
        renderDetail={(account) => <AccountDetail account={account} />}
      />
    </div>
  );
}
