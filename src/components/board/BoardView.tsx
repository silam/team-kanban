import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import type { ColumnId, Task } from '../../types';
import { COLUMN_IDS } from '../../constants';
import { isColumnId, findColumnOfTask } from '../../lib/dndUtils';
import { useAppState } from '../../context/AppContext';
import { KanbanColumn } from './KanbanColumn';
import { TaskDragOverlay } from './TaskDragOverlay';

interface BoardViewProps {
  projectId: string;
}

export function BoardView({ projectId }: BoardViewProps) {
  const { state, dispatch, getProjectTasks, getProjectMembers } = useAppState();
  const members = getProjectMembers(projectId);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingItems, setDraggingItems] = useState<Record<ColumnId, string[]> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getColumnTaskIds = (col: ColumnId) =>
    getProjectTasks(projectId, col).map(t => t.id);

  const getColumnTaskObjects = (col: ColumnId): Task[] => {
    if (draggingItems) {
      return draggingItems[col]
        .map(id => state.tasks.find(t => t.id === id))
        .filter((t): t is Task => t !== undefined);
    }
    return getProjectTasks(projectId, col);
  };

  const activeTask = activeId ? state.tasks.find(t => t.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id);
    setDraggingItems({
      'todo': getColumnTaskIds('todo'),
      'in-progress': getColumnTaskIds('in-progress'),
      'done': getColumnTaskIds('done'),
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !draggingItems) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    const sourceCol = findColumnOfTask(activeTaskId, draggingItems);
    const targetCol = isColumnId(overId) ? overId : findColumnOfTask(overId, draggingItems);

    if (!sourceCol || !targetCol) return;

    if (sourceCol === targetCol) {
      if (isColumnId(overId)) return;
      const items = [...draggingItems[sourceCol]];
      const oldIdx = items.indexOf(activeTaskId);
      const newIdx = items.indexOf(overId);
      if (oldIdx !== newIdx && oldIdx >= 0 && newIdx >= 0) {
        setDraggingItems({ ...draggingItems, [sourceCol]: arrayMove(items, oldIdx, newIdx) });
      }
    } else {
      const sourceItems = draggingItems[sourceCol].filter(id => id !== activeTaskId);
      const targetItems = [...draggingItems[targetCol]];
      const insertAt = isColumnId(overId) ? targetItems.length : Math.max(0, targetItems.indexOf(overId));
      targetItems.splice(insertAt, 0, activeTaskId);
      setDraggingItems({ ...draggingItems, [sourceCol]: sourceItems, [targetCol]: targetItems });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (draggingItems) {
      const taskId = event.active.id as string;
      const targetCol = findColumnOfTask(taskId, draggingItems);
      if (targetCol) {
        dispatch({ type: 'MOVE_TASK', payload: { taskId, toColumnId: targetCol, orderedIds: draggingItems[targetCol] } });
      }
    }
    setActiveId(null);
    setDraggingItems(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDraggingItems(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 p-4 h-full overflow-x-auto scrollbar-thin">
        {COLUMN_IDS.map(col => (
          <KanbanColumn
            key={col}
            columnId={col}
            tasks={getColumnTaskObjects(col)}
            members={members}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <TaskDragOverlay
            task={activeTask}
            assignee={members.find(m => m.id === activeTask.assigneeId)}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
