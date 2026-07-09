import { useState } from 'react';
import { Card, Button, Select, SegmentedControl, MasterDetailList } from '@/components/ui';
import { CampaignBoard } from '../components/CampaignBoard';
import { StatusChip } from '../components/StatusChip';
import { campaigns } from '../data/seed';
import { campaignStatusLabel } from '../data/labels';
import type { Campaign, CampaignStatus } from '../data/types';

type CampanasView = 'tablero' | 'cronograma' | 'gestion';

const VIEW_OPTIONS: { label: string; value: CampanasView }[] = [
  { label: 'Tablero', value: 'tablero' },
  { label: 'Cronograma', value: 'cronograma' },
  { label: 'Gestión', value: 'gestion' },
];

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function parseSpanishDate(label: string): Date | null {
  const parts = label.trim().toLowerCase().split(/\s+/);
  if (parts.length !== 3) return null;
  const day = Number.parseInt(parts[0], 10);
  const monthIndex = MONTHS_ES.indexOf(parts[1]);
  const year = Number.parseInt(parts[2], 10);
  if (Number.isNaN(day) || monthIndex === -1 || Number.isNaN(year)) return null;
  return new Date(year, monthIndex, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatMarkerLabel(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS_ES[date.getMonth()]}`;
}

function diffInDays(a: Date, b: Date): number {
  return (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

type WeekRange = '1' | '2' | '3' | '4';
const WEEK_RANGE_OPTIONS: { label: string; value: WeekRange }[] = [
  { label: '1 sem', value: '1' },
  { label: '2 sem', value: '2' },
  { label: '3 sem', value: '3' },
  { label: '4 sem', value: '4' },
];

const RULER_WEEKS = 3;

function CampaignGantt({ campaigns: allCampaigns }: { campaigns: Campaign[] }) {
  const [range, setRange] = useState<WeekRange>('3');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = RULER_WEEKS * 7;
  const markers = Array.from({ length: RULER_WEEKS }, (_, index) => addDays(today, index * 7));
  const activeCampaigns = allCampaigns.filter((campaign) => campaign.status === 'en-curso');

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">Campañas activas · próximas 3 semanas</p>
        <SegmentedControl options={WEEK_RANGE_OPTIONS} value={range} onChange={setRange} />
      </div>
      <div className="flex">
        <div className="w-[200px] shrink-0" />
        <div className="flex flex-1">
          {markers.map((marker) => (
            <div
              key={marker.toISOString()}
              className="flex-1 border-l border-slate-100 pl-2 text-xs text-slate-400"
            >
              {formatMarkerLabel(marker)}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 space-y-3">
        {activeCampaigns.length === 0 ? (
          <p className="py-6 text-center text-slate-300">—</p>
        ) : (
          activeCampaigns.map((campaign) => {
            const start = parseSpanishDate(campaign.startLabel);
            const end = parseSpanishDate(campaign.endLabel);
            const left = start ? clamp(diffInDays(start, today) / totalDays, 0, 1) * 100 : 0;
            const right = end ? clamp(diffInDays(end, today) / totalDays, 0, 1) * 100 : 100;
            return (
              <div key={campaign.id} className="flex items-center">
                <div className="w-[200px] shrink-0 truncate text-sm text-slate-700">{campaign.name}</div>
                <div className="relative h-7 flex-1">
                  <div
                    className="absolute h-7 rounded-md bg-sky-500"
                    style={{ left: `${left}%`, width: `${Math.max(right - left, 2)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Las barras van de la fecha de inicio a la de fin de cada campaña. Clic para abrir.
      </p>
    </Card>
  );
}

function CampanasGestion({ campaigns: allCampaigns }: { campaigns: Campaign[] }) {
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'todas'>('todas');
  const filtered =
    statusFilter === 'todas' ? allCampaigns : allCampaigns.filter((campaign) => campaign.status === statusFilter);

  return (
    <MasterDetailList
      items={filtered}
      emptyState="Selecciona una campaña o crea una nueva."
      listTop={
        <>
          <Button className="w-full">+ Nueva campaña</Button>
          <Card className="p-4">
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as CampaignStatus | 'todas')}
            >
              <option value="todas">Todos los estados</option>
              {(Object.keys(campaignStatusLabel) as CampaignStatus[]).map((status) => (
                <option key={status} value={status}>
                  {campaignStatusLabel[status]}
                </option>
              ))}
            </Select>
          </Card>
        </>
      }
      renderRow={(campaign) => (
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-slate-900">{campaign.name}</p>
            <p className="text-sm text-slate-500">
              {campaign.account} · {campaign.type} · {campaign.startLabel}
            </p>
          </div>
          <StatusChip status={campaignStatusLabel[campaign.status]} />
        </div>
      )}
      renderDetail={(campaign) => (
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{campaign.name}</h2>
          <p className="text-sm text-slate-500">
            {campaign.account} · {campaign.type}
          </p>
        </div>
      )}
    />
  );
}

function CampaignsTable({ campaigns: allCampaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">CAMPAÑA</th>
            <th className="px-4 py-3">CUENTA</th>
            <th className="px-4 py-3">TIPO</th>
            <th className="px-4 py-3">FECHAS</th>
            <th className="px-4 py-3">ESTADO</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {allCampaigns.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">{campaign.name}</td>
              <td className="px-4 py-3 text-slate-500">{campaign.account}</td>
              <td className="px-4 py-3 text-slate-500">{campaign.type}</td>
              <td className="px-4 py-3 text-slate-500">
                {campaign.startLabel} → {campaign.endLabel}
              </td>
              <td className="px-4 py-3">
                <StatusChip status={campaignStatusLabel[campaign.status]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CampanasPage() {
  const [view, setView] = useState<CampanasView>('tablero');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Campañas</h1>
          <p className="text-slate-500">
            Campañas y proyectos de marketing: RRSS, paid media, contenido y lanzamientos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button>+ Nueva campaña</Button>
          <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />
        </div>
      </div>

      {view === 'tablero' && (
        <div className="space-y-6">
          <CampaignBoard campaigns={campaigns} />
          <CampaignsTable campaigns={campaigns} />
        </div>
      )}
      {view === 'cronograma' && <CampaignGantt campaigns={campaigns} />}
      {view === 'gestion' && <CampanasGestion campaigns={campaigns} />}
    </div>
  );
}
