import { useState } from 'react';
import { SegmentedControl, Card, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
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

      <SegmentedControl options={TABS} value={tab} onChange={setTab} />

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
        <div className="space-y-3">
          {deliveries.isLoading && <p className="text-slate-500">Cargando...</p>}
          {deliveries.data?.map((delivery) => (
            <Card key={delivery.id} className="p-4">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>
                  {delivery.date} · {delivery.account}
                </span>
                {delivery.method === 'internal' ? (
                  <Badge variant="amber" size="sm">Uso interno</Badge>
                ) : (
                  <Badge variant="sky" size="sm">Envío MRW</Badge>
                )}
                {delivery.method !== 'internal' && delivery.status === 'delivered' && (
                  <Badge variant="emerald" size="sm">Entregado</Badge>
                )}
                {delivery.published && <Badge variant="emerald" size="sm">Publicado</Badge>}
              </div>
              <p className="font-medium text-slate-800">{delivery.recipient}</p>
              <p className="text-sm text-slate-500">{delivery.itemsSummary}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === 'influencers' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {influencers.isLoading && <p className="text-slate-500">Cargando...</p>}
          {influencers.data?.map((influencer) => (
            <Card key={influencer.id} className="flex items-center gap-3 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-700">
                {influencer.initials}
              </div>
              <div>
                <p className="font-medium text-slate-800">{influencer.name}</p>
                <div className="flex gap-2 text-xs text-slate-500">
                  {influencer.instagramFollowers && (
                    <span>IG · {(influencer.instagramFollowers / 1000).toFixed(0)}K</span>
                  )}
                  {influencer.tiktokFollowers && (
                    <span>TT · {(influencer.tiktokFollowers / 1000).toFixed(1)}K</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'reporte' && (
        <div className="space-y-4">
          {report.isLoading && <p className="text-slate-500">Cargando...</p>}
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Influencer</th>
                  <th className="px-4 py-3 text-right">Piezas</th>
                  <th className="px-4 py-3 text-right">Coste prod.</th>
                  <th className="px-4 py-3 text-right">Envío</th>
                  <th className="px-4 py-3">Publicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.data?.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-slate-500">{row.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{row.influencer}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{row.pieces}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.productCost)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.shippingCost)}</td>
                    <td className="px-4 py-3 text-slate-500">{row.publicationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
