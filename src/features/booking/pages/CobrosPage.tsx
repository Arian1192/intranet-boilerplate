import { useMemo, useState } from 'react';
import { Button, Card, StatCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { SegmentedCount } from '../components/SegmentedCount';
import {
  cobros as todosLosCobros,
  cobrosKpis,
  filterCobros,
  agruparPorFactura,
  formatFechaCorta,
  formatImporte,
  diaRelativo,
  pendiente,
  estaVencido,
  type CobrosFiltro,
  type CobrosVista,
} from '../data/cobros';

function DiaChip({ fechaShow }: { fechaShow: string }) {
  const etiqueta = diaRelativo(fechaShow);
  const pasado = etiqueta.startsWith('D+');
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 text-[11px] font-semibold',
        pasado ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
      )}
    >
      {etiqueta}
    </span>
  );
}

export function CobrosPage() {
  const [vista, setVista] = useState<CobrosVista>('show');
  const [filtro, setFiltro] = useState<CobrosFiltro>('Todos');

  const kpis = useMemo(() => cobrosKpis(todosLosCobros), []);
  const facturas = useMemo(() => agruparPorFactura(todosLosCobros), []);
  const filas = useMemo(() => filterCobros(todosLosCobros, filtro), [filtro]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Cobros</h1>
          <p className="text-sm text-slate-500">
            Lo que deben los promotores. Total y vencimientos salen del plan de pagos; lo cobrado, de
            las facturas conciliadas en Holded.
          </p>
        </div>
        <Button className="shrink-0">Facturar el mes…</Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="SHOWS POR COBRAR" value={String(kpis.showsPorCobrar)} />
        <StatCard label="PENDIENTE TOTAL" value={formatImporte(kpis.pendienteTotal)} />
        <StatCard
          label="FUERA DE PLAZO"
          value={formatImporte(kpis.fueraDePlazoImporte)}
          valueClassName="text-rose-600"
          caption={`${kpis.fueraDePlazoShows} show(s)`}
        />
        <StatCard
          label="VENCE ESTA SEMANA"
          value={formatImporte(kpis.venceSemanaImporte)}
          caption={`${kpis.venceSemanaShows} show(s)`}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <SegmentedCount
          aria-label="Agrupación de cobros"
          value={vista}
          onChange={setVista}
          options={[
            { value: 'show', label: 'Por show', count: todosLosCobros.length },
            { value: 'factura', label: 'Por factura', count: facturas.length },
          ]}
        />
        <SegmentedCount
          aria-label="Filtro de cobros"
          value={filtro}
          onChange={setFiltro}
          options={[
            { value: 'Todos', label: 'Todos', count: filterCobros(todosLosCobros, 'Todos').length },
            {
              value: 'Vencidos',
              label: 'Vencidos',
              count: filterCobros(todosLosCobros, 'Vencidos').length,
            },
          ]}
        />
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          {vista === 'show' ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="px-4 py-3 text-left font-medium">Show</th>
                  <th className="px-4 py-3 text-left font-medium">ARTISTA</th>
                  <th className="px-4 py-3 text-right font-medium">TOTAL</th>
                  <th className="px-4 py-3 text-right font-medium">PAGADO</th>
                  <th className="px-4 py-3 text-right font-medium">Pendiente</th>
                  <th className="px-4 py-3 text-left font-medium">Vencimiento</th>
                  <th className="px-4 py-3 text-left font-medium">CLIENTE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filas.map((cobro) => {
                  const vencido = estaVencido(cobro);
                  return (
                    <tr key={cobro.id} className={cn(vencido && 'bg-rose-50/40')}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{cobro.show}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          {formatFechaCorta(cobro.fechaShow)}
                          <DiaChip fechaShow={cobro.fechaShow} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{cobro.artista}</td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatImporte(cobro.total)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">
                        {formatImporte(cobro.pagado)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">
                        {formatImporte(pendiente(cobro))}
                      </td>
                      <td className="px-4 py-3">
                        {cobro.vencimiento ? (
                          <span className="flex flex-wrap items-center gap-2 text-slate-600">
                            {formatFechaCorta(cobro.vencimiento)}
                            {vencido && (
                              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                                Vencido · {formatImporte(pendiente(cobro))}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {cobro.cliente ?? <span className="text-slate-400">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="px-4 py-3 text-left font-medium">FACTURA</th>
                  <th className="px-4 py-3 text-left font-medium">SHOWS</th>
                  <th className="px-4 py-3 text-right font-medium">TOTAL</th>
                  <th className="px-4 py-3 text-right font-medium">PAGADO</th>
                  <th className="px-4 py-3 text-right font-medium">Pendiente</th>
                  <th className="px-4 py-3 text-left font-medium">Vencimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facturas.map((factura) => (
                  <tr key={factura.factura}>
                    <td className="px-4 py-3 font-medium text-slate-800">{factura.factura}</td>
                    <td className="px-4 py-3 text-slate-600">{factura.shows.join(', ')}</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatImporte(factura.total)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {formatImporte(factura.pagado)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {formatImporte(factura.total - factura.pagado)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {factura.vencimiento ? (
                        formatFechaCorta(factura.vencimiento)
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
