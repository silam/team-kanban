import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import type { Task, Member } from '../../types';
import { PriorityBadge } from '../tasks/PriorityBadge';
import { AssigneeAvatar } from '../tasks/AssigneeAvatar';
import { DueDateLabel } from '../tasks/DueDateLabel';
import { useAppState } from '../../context/AppContext';

interface TaskCardProps {
  task: Task;
  assignee: Member | undefined;
  isDragOverlay?: boolean;
}

export function TaskCard({ task, assignee, isDragOverlay = false }: TaskCardProps) {
  const { dispatch } = useAppState();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'edit-task', taskId: task.id } });
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'OPEN_CONFIRM_DELETE_TASK', payload: { taskId: task.id } });
  };

  return (
    <div
      ref={setNodeRef}
      style={isDragOverlay ? undefined : style}
      {...attributes}
      {...listeners}
      onClick={handleEdit}
      className={`group relative flex flex-col gap-2 p-3 rounded-xl border bg-white dark:bg-gray-800 cursor-grab active:cursor-grabbing select-none transition-all duration-150
        ${isDragging && !isDragOverlay ? 'opacity-40 scale-[0.98] border-indigo-300 dark:border-indigo-700' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md dark:hover:shadow-black/30'}
        ${isDragOverlay ? 'shadow-2xl rotate-1 border-indigo-300 dark:border-indigo-600 cursor-grabbing' : ''}
      `}
    >
      {/* Top row: priority + assignee */}
      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        {assignee && <AssigneeAvatar member={assignee} size="sm" />}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
        {task.title}
      </p>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Bottom row: due date + delete */}
      <div className="flex items-center justify-between mt-0.5">
        {task.dueDate ? <DueDateLabel dueDate={task.dueDate} /> : <span />}
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          aria-label="Delete task"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
