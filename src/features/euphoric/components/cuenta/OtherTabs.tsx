import { Button, Input, Textarea } from '@/components/ui';
import { Badge } from '@/components/ui';
import { hourlyCost } from '../../data/seed';
import type { Account } from '../../data/types';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold tracking-wide text-slate-400">{children}</p>;
}

export function ServiciosTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Servicios contratados</h3>
          <p className="text-sm text-slate-500">
            Packs, recurrentes y proyectos de esta cuenta. Los packs muestran el consumo del periodo.
          </p>
        </div>
        <Button variant="secondary">+ Contratar servicio</Button>
      </div>
      <p className="text-sm text-slate-400">Sin servicios contratados.</p>
    </div>
  );
}

export function RentabilidadTab() {
  const kpis = [
    { label: 'Facturación (aprox.)', value: '0 €', className: 'text-slate-800' },
    { label: 'Coste (horas)', value: '0 €', className: 'text-slate-800' },
    { label: 'Beneficio', value: '0 €', className: 'text-emerald-600' },
    { label: 'Margen', value: '0%', className: 'text-amber-600' },
  ];
  return (
    <div className="space-y-5">
      <SectionTitle>RENTABILIDAD</SectionTitle>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{kpi.label}</p>
            <p className={`text-xl font-semibold ${kpi.className}`}>{kpi.value}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        {`Facturación estimada por retainer × meses; se afinará con Holded. Total imputado: 0m · coste/hora ${hourlyCost} €.`}
      </p>

      <div className="space-y-4 rounded-xl border border-slate-200 p-4">
        <SectionTitle>IMPUTAR HORAS</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Fecha" type="date" defaultValue="2026-07-29" />
          <Input label="Horas" placeholder="p. ej. 1,5" />
        </div>
        <Input label="Descripción" placeholder="En qué se ha trabajado…" />
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700">Persona</p>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-sm text-slate-700">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              T
            </span>
            test
          </span>
        </div>
        <div className="flex justify-end">
          <Button>Imputar</Button>
        </div>
      </div>

      <div className="space-y-2">
        <SectionTitle>IMPUTACIONES RECIENTES</SectionTitle>
        <p className="text-sm text-slate-400">Sin horas imputadas todavía.</p>
      </div>
    </div>
  );
}

export function SolicitudesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>PETICIONES E INCIDENCIAS</SectionTitle>
        <Button variant="secondary" size="sm">
          + Nueva
        </Button>
      </div>
      <p className="text-sm text-slate-400">Sin solicitudes.</p>
    </div>
  );
}

function BrandingList({ title, empty }: { title: string; empty: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <button type="button" className="text-sm text-slate-500 hover:text-slate-700">
          + Añadir
        </button>
      </div>
      <p className="text-sm text-slate-400">{empty}</p>
    </div>
  );
}

export function BrandingTab() {
  return (
    <div className="space-y-5">
      <SectionTitle>BRANDING · KIT DE MARCA</SectionTitle>
      <Textarea label="Tono de voz" />
      <Textarea label="Valores / do's &amp; don'ts" />
      <BrandingList title="Logos" empty="Sin logos." />
      <BrandingList title="Paleta de colores" empty="Sin colores." />
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-700">Tipografías</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Titulares" />
          <Input label="Cuerpo" />
        </div>
      </div>
      <BrandingList title="Recursos (guías, drive…)" empty="Sin recursos." />
      <Input label="Enlace a la guía de marca" />
      <BrandingList title="Contactos" empty="Sin contactos." />
      <Textarea label="Notas / contenido de interés" />
      <div className="flex justify-end">
        <Button>Guardar branding</Button>
      </div>
    </div>
  );
}

export function BddTab({ account }: { account: Account }) {
  return (
    <div className="space-y-4">
      <SectionTitle>BASES DE DATOS (CSV/EXCEL)</SectionTitle>
      <div className="space-y-3 rounded-xl bg-slate-50 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input placeholder="Nombre de la lista" aria-label="Nombre de la lista" />
          <select
            aria-label="Evento de la base de datos"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800"
            defaultValue=""
          >
            <option value="">Sin evento</option>
            {account.databases.map((database) => (
              <option key={database.id} value={database.eventName}>
                {database.eventName}
              </option>
            ))}
          </select>
          <input type="file" aria-label="Fichero de contactos" className="text-sm text-slate-600" />
        </div>
        <Button variant="secondary" disabled>
          Subir y limpiar
        </Button>
      </div>

      {account.databases.length === 0 ? (
        <p className="text-sm text-slate-400">Sin bases de datos.</p>
      ) : (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
          {account.databases.map((database) => (
            <div key={database.id} className="space-y-2 p-4">
              <p className="font-medium text-slate-900">{database.name}</p>
              <p className="text-sm text-slate-500">
                {`— · ${database.eventName} · ${database.cleanContacts} contactos limpios (de ${database.totalContacts})`}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">{database.state}</Badge>
                <button type="button" className="text-sm font-medium text-slate-700 hover:underline">
                  Descargar limpio
                </button>
                <button type="button" className="text-sm text-slate-500 hover:underline">
                  Original
                </button>
                <button type="button" className="text-sm text-slate-500 hover:underline">
                  Volver a limpiar
                </button>
                <button type="button" className="text-sm text-slate-500 hover:underline">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
