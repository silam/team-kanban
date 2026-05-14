import { Calendar } from 'lucide-react';
import { formatDueDate, isOverdue } from '../../lib/dateUtils';

export function DueDateLabel({ dueDate }: { dueDate: string }) {
  const overdue = isOverdue(dueDate);
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${overdue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
      <Calendar className="w-3 h-3" />
      {formatDueDate(dueDate)}
    </span>
  );
}
