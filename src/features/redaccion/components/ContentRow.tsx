import type { ContentPiece, ContentStatus } from '../data/contenidos';

const TONE_CHIP: Record<'plain' | 'slate' | 'amber', string> = {
  plain: 'bg-slate-100 text-slate-500',
  slate: 'bg-slate-100 text-slate-500',
  amber: 'bg-amber-100 text-amber-700',
};

export interface ContentRowProps {
  piece: ContentPiece;
  status?: ContentStatus;
}

export function ContentRow({ piece, status }: ContentRowProps) {
  const tone = status?.tone ?? 'slate';
  return (
    <div className="flex items-center gap-3 border-t border-slate-100 py-2 text-sm">
      <span className={`inline-flex w-32 shrink-0 justify-center rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TONE_CHIP[tone]}`}>
        {status?.label ?? ''}
      </span>
      <span className="flex-1 truncate font-medium text-slate-800">{piece.title}</span>
      <span className="w-28 shrink-0 text-right text-xs text-slate-400">{piece.type}</span>
      <span className="w-32 shrink-0 text-right text-xs text-slate-400">{piece.campaignName ?? ''}</span>
      <span className="w-24 shrink-0 text-right text-xs text-slate-400">{piece.dueLabel}</span>
      {piece.ownerInitials ? (
        <span
          data-testid="row-avatar"
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white"
          style={{ backgroundColor: piece.ownerColor ?? '#64748b' }}
        >
          {piece.ownerInitials}
        </span>
      ) : (
        <span className="w-5 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}
