import type { Task, Member } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskDragOverlayProps {
  task: Task;
  assignee: Member | undefined;
}

export function TaskDragOverlay({ task, assignee }: TaskDragOverlayProps) {
  return <TaskCard task={task} assignee={assignee} isDragOverlay />;
}
