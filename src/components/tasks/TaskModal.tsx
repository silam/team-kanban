import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { useAppState } from '../../context/AppContext';
import { COLUMN_LABELS, COLUMN_IDS, PRIORITY_META } from '../../constants';
import type { ColumnId, Priority } from '../../types';

export function TaskModal() {
  const { state, dispatch, getProjectMembers } = useAppState();
  const { openModal, editingTaskId, defaultColumnId } = state.ui;
  const isEdit = openModal === 'edit-task';
  const editingTask = isEdit ? state.tasks.find(t => t.id === editingTaskId) : undefined;
  const projectId = state.activeProjectId!;
  const members = getProjectMembers(projectId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [columnId, setColumnId] = useState<ColumnId>('todo');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setAssigneeId(editingTask.assigneeId ?? '');
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate ?? '');
      setColumnId(editingTask.columnId);
    } else {
      setTitle(''); setDescription(''); setAssigneeId('');
      setPriority('medium'); setDueDate('');
      setColumnId(defaultColumnId ?? 'todo');
    }
    setTitleError('');
  }, [editingTask, openModal, defaultColumnId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setTitleError('Title is required'); return; }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      assigneeId: assigneeId || null,
      priority,
      dueDate: dueDate || null,
      columnId,
      projectId,
    };

    if (isEdit && editingTask) {
      dispatch({ type: 'UPDATE_TASK', payload: { id: editingTask.id, ...payload } });
    } else {
      dispatch({ type: 'CREATE_TASK', payload });
    }
  };

  const handleDelete = () => {
    if (editingTask) {
      dispatch({ type: 'OPEN_CONFIRM_DELETE_TASK', payload: { taskId: editingTask.id } });
    }
  };

  const close = () => dispatch({ type: 'CLOSE_MODAL' });

  const columnOptions = COLUMN_IDS.map(id => ({ value: id, label: COLUMN_LABELS[id] }));
  const priorityOptions = (['low', 'medium', 'high', 'critical'] as Priority[]).map(p => ({
    value: p,
    label: PRIORITY_META[p].label,
  }));
  const memberOptions = members.map(m => ({ value: m.id, label: m.name }));

  return (
    <Modal title={isEdit ? 'Edit task' : 'New task'} onClose={close} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={e => { setTitle(e.target.value); setTitleError(''); }}
          placeholder="What needs to be done?"
          error={titleError}
          autoFocus
        />

        <Textarea
          label="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add more details..."
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priority"
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
            options={priorityOptions}
          />
          <Select
            label="Status"
            value={columnId}
            onChange={e => setColumnId(e.target.value as ColumnId)}
            options={columnOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Assignee"
            value={assigneeId}
            onChange={e => setAssigneeId(e.target.value)}
            options={memberOptions}
            placeholder="Unassigned"
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700 mt-1">
          {isEdit ? (
            <Button type="button" variant="danger" size="sm" onClick={handleDelete}>Delete task</Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={close}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">{isEdit ? 'Save changes' : 'Create task'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
