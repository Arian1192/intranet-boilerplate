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

  // Delta documentado vs live: en el live estas filas no llevan silueta gris, llevan la
  // FOTO DE PERFIL real del reportante (verificado muestreando píxeles de
  // docs/references/incidencias/live-incidencias.png: tonos de piel, no grises). No se
  // replican fotos de personas reales, así que se usa un placeholder neutro del mismo
  // tamaño y posición (18px). Las iniciales+color sí son fieles (FV #EA580C, AG #16A34A,
  // JC #2563EB, confirmados por muestreo del mismo PNG).
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
