import { format, isPast, isToday, parseISO } from 'date-fns';

export function formatDueDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d');
  } catch {
    return dateStr;
  }
}

export function isOverdue(dateStr: string): boolean {
  try {
    const date = parseISO(dateStr);
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
}
