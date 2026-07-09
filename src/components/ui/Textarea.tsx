import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    const control = (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
    if (!label) return control;
    return (
      <div className="w-full">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
        {control}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
