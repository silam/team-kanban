import type { ColumnId } from '../types';
import { COLUMN_IDS } from '../constants';

export function isColumnId(id: string): id is ColumnId {
  return COLUMN_IDS.includes(id as ColumnId);
}

export function findColumnOfTask(
  taskId: string,
  items: Record<ColumnId, string[]>,
): ColumnId | null {
  for (const col of COLUMN_IDS) {
    if (items[col].includes(taskId)) return col;
  }
  return null;
}
