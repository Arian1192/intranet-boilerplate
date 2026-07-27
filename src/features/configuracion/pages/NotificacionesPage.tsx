import { useState } from 'react';
import { Card } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { NotificationCategoryCard } from '../components/NotificationCategoryCard';
import {
  categories, recipientsFor, personalTypes,
  type NotificationCategoryId, type NotificationRecipient,
} from '../data/notificaciones';

export function NotificacionesPage() {
  const cats = categories();
  const [state, setState] = useState<Record<NotificationCategoryId, NotificationRecipient[]>>(() =>
    Object.fromEntries(cats.map((c) => [c.id, recipientsFor(c.id)])) as Record<NotificationCategoryId, NotificationRecipient[]>
  );

  const toggle = (categoryId: NotificationCategoryId, userName: string) =>
    setState((s) => ({
      ...s,
      [categoryId]: s[categoryId].map((r) =>
        r.userName === userName ? { ...r, checked: !r.checked, alsoEmail: r.checked ? false : r.alsoEmail } : r
      ),
    }));

  const toggleEmail = (categoryId: NotificationCategoryId, userName: string) =>
    setState((s) => ({
      ...s,
      [categoryId]: s[categoryId].map((r) => (r.userName === userName ? { ...r, alsoEmail: !r.alsoEmail } : r)),
    }));

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Notificaciones"
        subtitle="Decide quién recibe cada aviso del grupo. Las notificaciones personales llegan siempre a la persona implicada."
      />
      {cats.map((c) => (
        <NotificationCategoryCard
          key={c.id}
          category={c}
          recipients={state[c.id]}
          onToggle={(u) => toggle(c.id, u)}
          onToggleEmail={(u) => toggleEmail(c.id, u)}
        />
      ))}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-800">Notificaciones personales (automáticas)</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          {personalTypes().map((t) => (
            <li key={t.id}>
              <span className="font-medium text-slate-700">{t.label}</span> — {t.description}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
