import { useMemo, useState } from 'react';
import { Input, Textarea, Select, UnderlineTabs } from '@/components/ui';
import type { Ficha, Person } from '../data/types';
import { allPeople } from '../data/people';

const TABS = [
  { label: 'Datos personales', value: 'datos' },
  { label: 'Acceso y permisos', value: 'acceso' },
  { label: 'Condiciones económicas', value: 'condiciones' },
  { label: 'Vacaciones', value: 'vacaciones' },
  { label: 'Registro de horas', value: 'horas' },
];

function isoToDisplay(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function displayToIso(display?: string): string | undefined {
  if (!display) return undefined;
  const [d, m, y] = display.split('/');
  if (!d || !m || !y) return undefined;
  return `${y}-${m}-${d}`;
}

export interface FichaDetailPanelProps {
  person: Person;
  ficha: Ficha;
}

export function FichaDetailPanel({ person, ficha }: FichaDetailPanelProps) {
  const [tab, setTab] = useState('datos');
  const [form, setForm] = useState({
    name: person.name,
    positions: person.positions.join(', '),
    managerId: person.managerId ?? '',
    email: person.email ?? '',
    phone: person.phone ?? '',
    dni: ficha.dni ?? '',
    ssNumber: ficha.ssNumber ?? '',
    employmentType: ficha.employmentType,
    birthDate: isoToDisplay(ficha.birthDate),
    address: ficha.address ?? '',
    city: ficha.city ?? '',
    country: ficha.country ?? '',
    startDate: isoToDisplay(ficha.startDate),
    endDate: isoToDisplay(ficha.endDate),
    vacationDaysPerYear: ficha.vacationDaysPerYear?.toString() ?? '',
    probationEndDate: isoToDisplay(ficha.probationEndDate),
    ssPercent: ficha.ssPercent?.toString() ?? '',
    active: ficha.active,
    notes: ficha.notes ?? '',
  });

  const isDirty = useMemo(() => {
    return (
      form.name !== person.name ||
      form.positions !== person.positions.join(', ') ||
      form.managerId !== (person.managerId ?? '') ||
      form.email !== (person.email ?? '') ||
      form.phone !== (person.phone ?? '') ||
      form.dni !== (ficha.dni ?? '') ||
      form.ssNumber !== (ficha.ssNumber ?? '') ||
      form.employmentType !== ficha.employmentType ||
      form.birthDate !== isoToDisplay(ficha.birthDate) ||
      form.address !== (ficha.address ?? '') ||
      form.city !== (ficha.city ?? '') ||
      form.country !== (ficha.country ?? '') ||
      form.startDate !== isoToDisplay(ficha.startDate) ||
      form.endDate !== isoToDisplay(ficha.endDate) ||
      form.vacationDaysPerYear !== (ficha.vacationDaysPerYear?.toString() ?? '') ||
      form.probationEndDate !== isoToDisplay(ficha.probationEndDate) ||
      form.ssPercent !== (ficha.ssPercent?.toString() ?? '') ||
      form.active !== ficha.active ||
      form.notes !== (ficha.notes ?? '')
    );
  }, [form, person, ficha]);

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const people = useMemo(() => allPeople().filter((p) => p.id !== person.id), [person.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">{person.name}</h2>
          <div className="mt-1 flex gap-2">
            {ficha.hasAccount && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Con cuenta</span>}
            {ficha.active && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Activa</span>}
          </div>
        </div>
        {isDirty && (
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#44444C] px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Guardar
          </button>
        )}
      </div>
      {isDirty && (
        <div className="rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
          Cambios sin guardar
        </div>
      )}
      <UnderlineTabs options={TABS} value={tab} onChange={setTab} />
      {tab === 'datos' ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nombre" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <Input label="Puestos" value={form.positions} onChange={(e) => update('positions', e.target.value)} />
          <Select label="Reporta a" value={form.managerId} onChange={(e) => update('managerId', e.target.value)}>
            <option value="">Nadie (raíz del organigrama)</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
          <Input label="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          <Input label="Teléfono" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          <Input label="DNI / NIE" value={form.dni} onChange={(e) => update('dni', e.target.value)} />
          <Input label="Nº Seguridad Social" value={form.ssNumber} onChange={(e) => update('ssNumber', e.target.value)} />
          <Select label="Tipo" value={form.employmentType} onChange={(e) => update('employmentType', e.target.value)}>
            <option value="contratado">Contratado</option>
            <option value="freelance">Freelance</option>
          </Select>
          <Input label="Fecha de nacimiento" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)} placeholder="dd/mm/aaaa" />
          <Input label="Dirección" value={form.address} onChange={(e) => update('address', e.target.value)} />
          <Input label="Ciudad" value={form.city} onChange={(e) => update('city', e.target.value)} />
          <Input label="País" value={form.country} onChange={(e) => update('country', e.target.value)} />
          <Input label="Fecha de inicio" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} placeholder="dd/mm/aaaa" />
          <Input label="Fecha de fin" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} placeholder="dd/mm/aaaa" />
          <Input label="Días de vacaciones / año" value={form.vacationDaysPerYear} onChange={(e) => update('vacationDaysPerYear', e.target.value)} placeholder="0 = sin límite" />
          <Input label="Fin del periodo de prueba" value={form.probationEndDate} onChange={(e) => update('probationEndDate', e.target.value)} placeholder="dd/mm/aaaa" />
          <Input label="% SS empresa (opcional)" value={form.ssPercent} onChange={(e) => update('ssPercent', e.target.value)} placeholder="Vacío = usa el % global de Configuración." />
          <label className="flex items-center gap-2 text-sm text-slate-700 md:col-span-2">
            <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Persona activa
          </label>
          <Textarea label="Notas" value={form.notes} onChange={(e) => update('notes', e.target.value)} className="md:col-span-2" />
        </div>
      ) : (
        <p className="text-slate-400">En construcción</p>
      )}
      {isDirty && (
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#44444C] px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Guardar
        </button>
      )}
    </div>
  );
}
