export interface UsageBannerProps {
  boldText?: string;
  text: string;
  linkLabel?: string;
}

export function UsageBanner({ boldText, text, linkLabel }: UsageBannerProps) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {boldText && <strong className="font-semibold">{boldText} </strong>}
      {text}
      {linkLabel && (
        <a href="#" onClick={(e) => e.preventDefault()} className="ml-1 underline">
          {linkLabel}
        </a>
      )}
    </div>
  );
}
