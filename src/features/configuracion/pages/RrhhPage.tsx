import { useState } from 'react';
import { Card, Input } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { DepartmentRow, COLOR_DOT } from '../components/DepartmentRow';
import {
  hrSettings,
  departments,
  DEPARTMENT_COLORS,
  type Department,
  type DepartmentColor,
  type HrSettings,
} from '../data/rrhh';

function noticeListToString(arr: number[]): string {
  return arr.join(', ');
}

export function RrhhPage() {
  const initialSettings = hrSettings();
  const [settings, setSettings] = useState<HrSettings>(initialSettings);
  const [contractNoticeDays, setContractNoticeDays] = useState(() => noticeListToString(initialSettings.contractEndNoticeDays));
  const [probationNoticeDays, setProbationNoticeDays] = useState(() => noticeListToString(initialSettings.probationEndNoticeDays));
  const [salaryReviewNoticeDays, setSalaryReviewNoticeDays] = useState(() => noticeListToString(initialSettings.salaryReviewNoticeDays));
  const [depts, setDepts] = useState<Department[]>(() => departments());
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<DepartmentColor>('blue');

  const addDepartment = () => {
    const name = newName.trim();
    if (!name) return;
    setDepts((list) => [
      ...list,
      { id: `dept-local-${Date.now()}`, name, color: newColor, active: true },
    ]);
    setNewName('');
  };

  const removeDepartment = (id: string) => {
    setDepts((list) => list.filter((department) => department.id !== id));
  };

  const toggleDepartment = (id: string) => {
    setDepts((list) =>
      list.map((department) =>
        department.id === id ? { ...department, active: !department.active } : department
      )
    );
  };

  return (
    <div className="space-y-4">
      <ConfigPageHeader title="RRHH" subtitle="Parámetros de cálculo de coste y antelación de los avisos." />

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Asalariados</h3>
        <p className="mt-1 text-sm text-slate-500">
          Coste empresa = <strong className="font-semibold text-slate-700">bruto + Seguridad Social a cargo de la empresa</strong>.
          El IRPF y la SS del trabajador salen del bruto: no suman coste. Si alguien tiene un contrato con
          bonificaciones, ponle su % propio en su ficha.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm text-slate-600">% SS a cargo de la empresa</label>
            <Input
              type="number"
              value={settings.ssEmployerPercent}
              onChange={(event) => setSettings((current) => ({ ...current, ssEmployerPercent: Number(event.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">En España suele rondar el 30-32%.</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Días laborables / mes</label>
            <Input
              type="number"
              value={settings.workingDaysPerMonth}
              onChange={(event) => setSettings((current) => ({ ...current, workingDaysPerMonth: Number(event.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Para convertir tarifas por día.</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Horas / mes</label>
            <Input
              type="number"
              value={settings.hoursPerMonth}
              onChange={(event) => setSettings((current) => ({ ...current, hoursPerMonth: Number(event.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Para convertir tarifas por hora.</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Autónomos</h3>
        <p className="mt-1 text-sm text-slate-500">
          Un autónomo <strong className="font-semibold text-slate-700">no genera Seguridad Social a cargo de la empresa</strong>:
          factura. Su <strong className="font-semibold text-slate-700">coste real es la base</strong>. El IVA que
          repercute es deducible (lo recuperas: es neutro) y el IRPF{' '}
          <strong className="font-semibold text-slate-700">no se suma, se retiene</strong> de la base y lo ingresas tú
          en Hacienda en su nombre. Estos porcentajes son los de partida; cada autónomo puede llevar el suyo en sus
          condiciones.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-slate-600">IVA por defecto (%)</label>
            <Input
              type="number"
              value={settings.freelanceVatPercent}
              onChange={(event) => setSettings((current) => ({ ...current, freelanceVatPercent: Number(event.target.value) }))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600">IRPF retenido por defecto (%)</label>
            <Input
              type="number"
              value={settings.freelanceIrpfPercent}
              onChange={(event) => setSettings((current) => ({ ...current, freelanceIrpfPercent: Number(event.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">15% general; 7% los primeros años de alta.</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Avisos</h3>
        <p className="mt-1 text-sm text-slate-500">
          Días de antelación de cada aviso. Quién los recibe se elige en Configuración → Notificaciones («Alertas de RRHH»).
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm text-slate-600">Fin de contrato</label>
            <Input
              value={contractNoticeDays}
              onChange={(event) => setContractNoticeDays(event.target.value)}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Días antes de fecha_fin. Ej: 60, 30, 15</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Fin de periodo de prueba</label>
            <Input
              value={probationNoticeDays}
              onChange={(event) => setProbationNoticeDays(event.target.value)}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Días antes de que venza. Ej: 15, 7</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Revisión salarial</label>
            <Input
              value={salaryReviewNoticeDays}
              onChange={(event) => setSalaryReviewNoticeDays(event.target.value)}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Días antes de la fecha de revisión. Ej: 30</p>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={settings.notifyBirthdays}
            onChange={(event) => setSettings((current) => ({ ...current, notifyBirthdays: event.target.checked }))}
            aria-label="Avisar al equipo de los cumpleaños"
          />
          Avisar al equipo de los cumpleaños
        </label>
      </Card>

      <button
        type="button"
        className="rounded-lg bg-[#44444C] px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Guardar configuración
      </button>

      <Card className="p-0">
        <div className="border-b border-slate-100 px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Departamentos</h3>
          <p className="mt-1 text-sm text-slate-500">
            El coste de cada persona se reparte entre departamentos en su ficha (Condiciones económicas), y la suma se
            ve en <strong className="font-semibold text-slate-700">Team → Analítica</strong>.
          </p>
        </div>
        <div className="px-5">
          {depts.map((department) => (
            <DepartmentRow
              key={department.id}
              department={department}
              onToggleActive={() => toggleDepartment(department.id)}
              onRemove={() => removeDepartment(department.id)}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-4 border-t border-slate-100 px-5 py-4">
          <div className="flex-1">
            <label className="block text-sm text-slate-600">Nuevo departamento</label>
            <Input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Booking, Marketing, Producción…"
              className="mt-1"
            />
          </div>
          <div>
            <p className="mb-1 text-sm text-slate-600">Color</p>
            <div className="flex items-center gap-1.5">
              {DEPARTMENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  aria-pressed={newColor === color}
                  onClick={() => setNewColor(color)}
                  className={`h-5 w-5 rounded-full ${COLOR_DOT[color]} ${
                    newColor === color ? 'ring-2 ring-slate-400 ring-offset-1' : ''
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={addDepartment}
            className="rounded-lg bg-[#44444C] px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Añadir
          </button>
        </div>
      </Card>
    </div>
  );
}
