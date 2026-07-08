import { Card } from '@/components/ui';
import type { LogisticsItem } from '@/types';

export interface TaskListProps {
  items: LogisticsItem[];
}

export function TaskList({ items }: TaskListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <h4 className="mb-3 font-medium text-slate-900">{item.title}</h4>
          <ul className="space-y-2">
            {item.tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.done}
                  readOnly
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className={`text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
