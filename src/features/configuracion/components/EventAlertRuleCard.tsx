import { Card } from '@/components/ui';
import type { AlertSeverity, EventAlertRule } from '../data/alertas';

export interface EventAlertRuleCardProps {
  rule: EventAlertRule;
  onToggleActive: () => void;
  onWindowChange: (value: number) => void;
  onSeverityChange: (value: AlertSeverity) => void;
  onToggleEmail: () => void;
}

export function EventAlertRuleCard({
  rule,
  onToggleActive,
  onWindowChange,
  onSeverityChange,
  onToggleEmail,
}: EventAlertRuleCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-800">{rule.title}</h3>
          <p className="text-sm text-slate-400">{rule.description}</p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={rule.active}
            onChange={onToggleActive}
            aria-label="Activa"
            className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
          />
          Activa
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-4">
        <label className="block text-sm text-slate-600">
          Ventana (días antes)
          <span className="mt-1 flex items-center gap-1">
            <span className="text-slate-400">D-</span>
            <input
              type="number"
              min={0}
              value={rule.windowDaysBefore}
              onChange={(event) => onWindowChange(Number(event.target.value))}
              className="h-10 w-20 rounded-lg border border-slate-200 px-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-500"
            />
          </span>
        </label>

        <label className="block text-sm text-slate-600">
          Severidad
          <select
            value={rule.severity}
            onChange={(event) => onSeverityChange(event.target.value as AlertSeverity)}
            className="mt-1 h-10 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="info">Info</option>
            <option value="aviso">Aviso</option>
            <option value="critica">Crítica</option>
          </select>
        </label>

        <label className="flex h-10 items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={rule.alsoEmail}
            onChange={onToggleEmail}
            aria-label="Avisar también por email"
            className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
          />
          Avisar también por email
        </label>
      </div>
    </Card>
  );
}
