import { User } from 'lucide-react';

export interface IncidenciaAvatarProps {
  reporterName?: string;
  reporterInitials?: string;
  reporterColor?: string;
  /** Foto de perfil (bucket `avatares`); tiene prioridad sobre iniciales+color, como en el live. */
  reporterAvatarUrl?: string;
  /** 18px en la fila de la lista, 16px en la cabecera del detalle (tokens del live). */
  size?: 18 | 16;
}

export function IncidenciaAvatar({
  reporterName,
  reporterInitials,
  reporterColor,
  reporterAvatarUrl,
  size = 18,
}: IncidenciaAvatarProps) {
  const label = reporterName ?? 'Reportante desconocido';
  const fontSize = size === 18 ? 8 : 7;

  if (reporterAvatarUrl) {
    return (
      <img
        src={reporterAvatarUrl}
        alt={label}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  if (reporterInitials && reporterColor) {
    return (
      <span
        aria-label={label}
        className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
        style={{ width: size, height: size, fontSize, backgroundColor: reporterColor }}
      >
        {reporterInitials}
      </span>
    );
  }

  // Delta documentado vs live: los reportes de Carlos Pego usan su FOTO de perfil real
  // (bucket `avatares` de Supabase). No se replican fotos de personas reales, así que sin
  // `reporterAvatarUrl` se cae a este placeholder neutro del mismo tamaño y posición.
  // Iniciales y colores sí son fieles (FV #EA580C, AG #16A34A, JC #2563EB, verificados
  // muestreando píxeles de docs/references/incidencias/live-incidencias.png).
  return (
    <span
      aria-label={label}
      className="grid shrink-0 place-items-center rounded-full bg-slate-200 text-slate-400"
      style={{ width: size, height: size }}
    >
      <User style={{ width: size === 18 ? 10 : 9, height: size === 18 ? 10 : 9 }} />
    </span>
  );
}
