import { Card } from '@/components/ui';
import type { Reminder } from '@/types';
import { Bell } from 'lucide-react';

export interface RemindersProps {
  reminders: Reminder[];
}

export function Reminders({ reminders }: RemindersProps) {
  const hasReminders = reminders.length > 0;

  return (
    <section>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        Mis recordatorios
      </h2>
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-3 text-slate-300">
          <Bell className="h-8 w-8" />
        </div>
        {hasReminders ? (
          <ul className="w-full text-left">
            {reminders.map((reminder) => (
              <li key={reminder.id} className="border-b border-slate-100 py-2 last:border-0">
                {reminder.title}
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="font-medium text-slate-700">Aún no tienes recordatorios.</p>
            <p className="text-sm text-slate-500">
              Pronto podrás crear aquí tus tareas y recordatorios personales.
            </p>
          </>
        )}
      </Card>
    </section>
  );
}
