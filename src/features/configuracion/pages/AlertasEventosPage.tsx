import { useState } from 'react';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { EventAlertRuleCard } from '../components/EventAlertRuleCard';
import { alertRules, type AlertSeverity, type EventAlertRule } from '../data/alertas';

export function AlertasEventosPage() {
  const [rules, setRules] = useState<EventAlertRule[]>(alertRules());

  const update = (id: string, patch: Partial<EventAlertRule>) => {
    setRules((list) => list.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ConfigPageHeader
          title="Alertas de producción"
          subtitle="Reglas que vigilan hitos de cada evento y avisan dentro de su ventana (D-N respecto a la fecha)."
        />
        <button
          type="button"
          className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          Evaluar ahora
        </button>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <EventAlertRuleCard
            key={rule.id}
            rule={rule}
            onToggleActive={() => update(rule.id, { active: !rule.active })}
            onWindowChange={(value) => update(rule.id, { windowDaysBefore: value })}
            onSeverityChange={(value: AlertSeverity) => update(rule.id, { severity: value })}
            onToggleEmail={() => update(rule.id, { alsoEmail: !rule.alsoEmail })}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400">
        El aviso se envía cuando el evento entra en la ventana (D-{'{días}'}) y el hito sigue incumplido, hasta el día
        del evento. La evaluación automática corre a diario; usa «Evaluar ahora» para forzarla.
      </p>
    </div>
  );
}
