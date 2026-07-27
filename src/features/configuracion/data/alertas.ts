export type AlertSeverity = 'info' | 'aviso' | 'critica';

export interface EventAlertRule {
  id: string;
  title: string;
  description: string;
  active: boolean;
  windowDaysBefore: number;
  severity: AlertSeverity;
  alsoEmail: boolean;
}

const ALERT_RULES: EventAlertRule[] = [
  { id: 'alerta-presupuesto', title: 'Presupuesto sin definir', description: 'El evento no tiene ninguna partida de coste ni ingreso.', active: true, windowDaysBefore: 21, severity: 'info', alsoEmail: false },
  { id: 'alerta-lineup', title: 'Line-up sin cerrar', description: 'Quedan artistas sin confirmar (o no hay ninguno confirmado).', active: true, windowDaysBefore: 14, severity: 'aviso', alsoEmail: false },
  { id: 'alerta-contrato', title: 'Contrato sin subir', description: 'No hay ningún documento de tipo Contrato en el evento.', active: true, windowDaysBefore: 10, severity: 'critica', alsoEmail: true },
  { id: 'alerta-proveedores', title: 'Proveedores sin confirmar', description: 'Hay proveedores en estado pendiente.', active: true, windowDaysBefore: 7, severity: 'aviso', alsoEmail: false },
  { id: 'alerta-tareas', title: 'Tareas de producción pendientes', description: 'Quedan tareas de producción sin completar.', active: true, windowDaysBefore: 3, severity: 'aviso', alsoEmail: false },
];

export function alertRules(): EventAlertRule[] {
  return ALERT_RULES.map((r) => ({ ...r }));
}
