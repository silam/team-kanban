import { Plus } from 'lucide-react';
import type { ColumnId } from '../../types';
import { COLUMN_LABELS } from '../../constants';
import { useAppState } from '../../context/AppContext';

interface ColumnHeaderProps {
  columnId: ColumnId;
  count: number;
}

export function ColumnHeader({ columnId, count }: ColumnHeaderProps) {
  const { state, dispatch } = useAppState();

  const handleAddTask = () => {
    if (!state.activeProjectId) return;
    dispatch({ type: 'OPEN_MODAL', payload: { modal: 'create-task', columnId } });
  };

  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {COLUMN_LABELS[columnId]}
        </span>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <button
        onClick={handleAddTask}
        className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Add task to ${COLUMN_LABELS[columnId]}`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
