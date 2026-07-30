import { Badge } from '@/components/ui';
import type { CreativePiece } from '../data/seed';
import { aprobacion, pintaAprobacion, tonoDeadline } from '../data/tablero';
import { DeadlineBadge } from './DeadlineBadge';

export interface PieceCardProps {
  piece: CreativePiece;
}

/**
 * Tarjeta del kanban, calcada de `docs/references/tablero-piezas-2026-07-30/kanban-detalle.json`
 * (volcado de las 10 tarjetas del live, 30-jul).
 *
 * Sin badge de prioridad y sin borde rojo en las atrasadas: el rojo vive solo en el badge de
 * deadline. El `alt` del avatar lleva el nombre largo y el texto de al lado el corto.
 */
export function PieceCard({ piece }: PieceCardProps) {
  const sinAsignar = piece.assignee === 'Sin asignar';

  return (
    <button
      type="button"
      draggable
      className="block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left hover:border-brand-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2">
        {/* Sin persona el live no pinta píldora: es un span pelado en slate-300. */}
        {sinAsignar ? (
          <span className="shrink-0 text-[11px] text-slate-300">Sin asignar</span>
        ) : (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-0.5 pr-2">
            {piece.avatarUrl ? (
              <img
                src={piece.avatarUrl}
                alt={piece.assigneeFullName ?? piece.assignee}
                className="shrink-0 rounded-full object-cover"
                style={{ width: 20, height: 20 }}
              />
            ) : (
              <span
                aria-hidden
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-200 text-[9px] font-medium text-slate-600"
              >
                {piece.assignee.charAt(0)}
              </span>
            )}
            <span className="text-[11px] font-medium text-slate-600">{piece.assignee}</span>
          </span>
        )}
        {/*
          El icono va DENTRO de esta fila, empujado con ml-auto — no antes del título. Y es dato
          por pieza: el live se lo pone a «Video Pomo 26/07» y NO a «Flyer Claptone 02/08», que es
          Vídeo igual. Derivarlo del tipo es demostrablemente falso.
        */}
        {piece.icon && (
          <span className="ml-auto shrink-0 text-xs" title={piece.iconTitle ?? piece.type}>
            {piece.icon}
          </span>
        )}
      </div>

      <div className="mt-1 truncate text-sm font-medium text-slate-800">{piece.title}</div>
      <div className="mt-0.5 truncate text-xs text-slate-400">
        {piece.client} · {piece.type} · {piece.version}
      </div>

      {/* Hasta 3 cosas caben aquí, de ahí el flex-wrap. Sin deadline la fila queda vacía. */}
      <div className="mt-1.5 flex flex-wrap items-center gap-1">
        {piece.deadline !== '—' && (
          <DeadlineBadge deadline={piece.deadline} tono={tonoDeadline(piece)} />
        )}
        {piece.checklist && (
          <span className="text-[10px] text-slate-500">
            ☑ {piece.checklist.done}/{piece.checklist.total}
          </span>
        )}
        {/*
          El live usa su utilidad `.badge` (px-2.5 py-0.5 rounded-full 12px/500) con `text-[10px]`
          encima. Nuestro <Badge> md es esa misma utilidad, así que basta con bajar el tamaño.
        */}
        {pintaAprobacion(piece) && (
          <Badge variant="amber" className="text-[10px]">
            {aprobacion(piece)}
          </Badge>
        )}
      </div>
    </button>
  );
}
