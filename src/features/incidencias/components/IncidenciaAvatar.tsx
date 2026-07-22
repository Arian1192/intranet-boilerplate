import { User } from 'lucide-react';

export interface IncidenciaAvatarProps {
  reporterName?: string;
  reporterInitials?: string;
  reporterColor?: string;
}

export function IncidenciaAvatar({ reporterName, reporterInitials, reporterColor }: IncidenciaAvatarProps) {
  const label = reporterName ?? 'Reportante desconocido';

  if (reporterInitials && reporterColor) {
    return (
      <span
        aria-label={label}
        className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
        style={{ width: 18, height: 18, fontSize: 8, backgroundColor: reporterColor }}
      >
        {reporterInitials}
      </span>
    );
  }

  return (
    <span
      aria-label={label}
      className="grid shrink-0 place-items-center rounded-full bg-slate-200 text-slate-400"
      style={{ width: 18, height: 18 }}
    >
      <User style={{ width: 10, height: 10 }} />
    </span>
  );
}
