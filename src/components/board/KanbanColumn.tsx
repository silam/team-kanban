import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { ColumnId, Task, Member } from '../../types';
import { COLUMN_ACCENT } from '../../constants';
import { ColumnHeader } from './ColumnHeader';
import { TaskCard } from './TaskCard';
import { useAppState } from '../../context/AppContext';

interface KanbanColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  members: Member[];
}

export function KanbanColumn({ columnId, tasks, members }: KanbanColumnProps) {
  const { dispatch, state } = useAppState();
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  const handleAddTask = () => {
    if (!state.activeProjectId) return;
    dispatch({ type: 'OPEN_MODAL', payload: { modal: 'create-task', columnId } });
  };

  return (
    <div className={`flex flex-col w-72 flex-shrink-0 rounded-xl border-t-2 ${COLUMN_ACCENT[columnId]} bg-gray-100/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 transition-colors ${isOver ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-800' : ''}`}>
      <div className="p-3 pb-0">
        <ColumnHeader columnId={columnId} count={tasks.length} />
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-2.5 p-3 min-h-[120px] overflow-y-auto scrollbar-thin"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={members.find(m => m.id === task.assigneeId)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className={`flex items-center justify-center h-20 rounded-lg border-2 border-dashed transition-colors ${isOver ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/5' : 'border-gray-200 dark:border-gray-700'}`}>
            <p className="text-xs text-gray-400 dark:text-gray-500">Drop here</p>
          </div>
        )}
      </div>

      <div className="p-2 pt-0">
        <button
          onClick={handleAddTask}
          className="flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add task
        </button>
      </div>
    </div>
  );
}
