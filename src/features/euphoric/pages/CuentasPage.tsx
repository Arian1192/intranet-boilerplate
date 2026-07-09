import { useState } from 'react';
import { Button, MasterDetailList } from '@/components/ui';
import { AccountForm } from '../components/AccountForm';
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
              <p className="font-medium text-slate-900">{account.name}</p>
              <p className="text-sm text-slate-500">
                {account.kind} · {account.services.join(', ')}
              </p>
            </div>
            <StatusChip status={account.status} />
          </div>
        )}
        renderDetail={(account) => (
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{account.name}</h2>
            <p className="text-sm text-slate-500">
              {account.kind} · {account.services.join(', ')}
            </p>
          </div>
        )}
      />
    </div>
  );
}
