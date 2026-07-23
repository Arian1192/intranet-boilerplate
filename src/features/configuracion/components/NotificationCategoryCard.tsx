import { Card } from '@/components/ui';
import type { NotificationCategory, NotificationRecipient } from '../data/notificaciones';

export interface NotificationCategoryCardProps {
  category: NotificationCategory;
  recipients: NotificationRecipient[];
  onToggle: (userName: string) => void;
  onToggleEmail: (userName: string) => void;
}

export function NotificationCategoryCard({ category, recipients, onToggle, onToggleEmail }: NotificationCategoryCardProps) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-slate-800">{category.title}</h3>
      <p className="text-sm text-slate-400">{category.description}</p>
      <div className="mt-3 divide-y divide-slate-50">
        {recipients.map((r) => (
          <div key={r.userName} className="flex items-center justify-between py-1.5 text-sm">
            <label className="flex items-center gap-2 text-slate-700">
              <input type="checkbox" checked={r.checked} onChange={() => onToggle(r.userName)} />
              {r.userName}
            </label>
            {category.hasEmailToggle && (
              <label className={`flex items-center gap-2 ${r.checked ? 'text-slate-500' : 'text-slate-300'}`}>
                <input type="checkbox" checked={r.alsoEmail} disabled={!r.checked} onChange={() => onToggleEmail(r.userName)} />
                también por email
              </label>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
