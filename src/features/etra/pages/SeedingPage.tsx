import { useState } from 'react';
import { UnderlineTabs, Card, Badge } from '@/components/ui';
import { SeedingDeliveriesTab, SeedingInfluencersTab, SeedingReportTab } from '../components';
import { useInventory } from '../hooks/useInventory';
import { useDeliveries } from '../hooks/useDeliveries';
import { useInfluencers } from '../hooks/useInfluencers';
import { useSeedingReport } from '../hooks/useSeedingReport';

type SeedingTab = 'inventario' | 'entregas' | 'influencers' | 'reporte';

const TABS: { label: string; value: SeedingTab }[] = [
  { label: 'Inventario', value: 'inventario' },
  { label: 'Entregas', value: 'entregas' },
  { label: 'Influencers', value: 'influencers' },
  { label: 'Reporte', value: 'reporte' },
];

export function SeedingPage() {
  const [tab, setTab] = useState<SeedingTab>('inventario');
  const inventory = useInventory();
  const deliveries = useDeliveries();
  const influencers = useInfluencers();
  const report = useSeedingReport();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Seeding</h1>
        <p className="text-sm text-slate-500">
          Inventario de producto de cliente, envíos a influencers y directorio.
        </p>
      </div>

      <UnderlineTabs options={TABS} value={tab} onChange={setTab} />

      {tab === 'inventario' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventory.isLoading && <p className="text-slate-500">Cargando...</p>}
          {inventory.data?.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.variant}</p>
                  <p className="text-xs text-slate-400">Ref. {item.ref}</p>
                </div>
                <Badge variant="emerald">{item.quantity} uds.</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'entregas' && (
        <>
          {deliveries.isLoading && <p className="text-slate-500">Cargando...</p>}
          {deliveries.data && <SeedingDeliveriesTab deliveries={deliveries.data} />}
        </>
      )}

      {tab === 'influencers' && (
        <>
          {influencers.isLoading && <p className="text-slate-500">Cargando...</p>}
          {influencers.data && <SeedingInfluencersTab influencers={influencers.data} />}
        </>
      )}

      {tab === 'reporte' && (
        <>
          {report.isLoading && <p className="text-slate-500">Cargando...</p>}
          {report.data && <SeedingReportTab rows={report.data} />}
        </>
      )}
    </div>
  );
}
