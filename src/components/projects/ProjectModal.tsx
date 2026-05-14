import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { MemberManager } from './MemberManager';
import { useAppState } from '../../context/AppContext';
import { PROJECT_COLORS, PROJECT_COLOR_CLASSES } from '../../constants';
import type { ProjectColor } from '../../types';

export function ProjectModal() {
  const { state, dispatch, getProjectMembers } = useAppState();
  const { openModal, editingProjectId } = state.ui;
  const isEdit = openModal === 'edit-project';
  const editingProject = isEdit ? state.projects.find(p => p.id === editingProjectId) : undefined;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<ProjectColor>('indigo');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setDescription(editingProject.description);
      setColor(editingProject.color);
    } else {
      setName(''); setDescription(''); setColor('indigo');
    }
    setNameError('');
  }, [editingProject, openModal]);

  const projectMembers = editingProject ? getProjectMembers(editingProject.id) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Project name is required'); return; }
    if (isEdit && editingProject) {
      dispatch({ type: 'UPDATE_PROJECT', payload: { id: editingProject.id, name: name.trim(), description: description.trim(), color } });
    } else {
      dispatch({ type: 'CREATE_PROJECT', payload: { name: name.trim(), description: description.trim(), color, memberIds: [] } });
    }
  };

  const close = () => dispatch({ type: 'CLOSE_MODAL' });

  return (
    <Modal title={isEdit ? 'Edit Project' : 'New Project'} onClose={close}>
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <Input
          label="Project name"
          value={name}
          onChange={e => { setName(e.target.value); setNameError(''); }}
          placeholder="e.g. Website Redesign"
          error={nameError}
          autoFocus
        />
        <Textarea
          label="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What is this project about?"
        />

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Color</p>
          <div className="flex flex-wrap gap-2">
            {PROJECT_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full ${PROJECT_COLOR_CLASSES[c].dot} transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        {isEdit && editingProject && (
          <MemberManager
            members={projectMembers}
            onAdd={name => dispatch({ type: 'ADD_MEMBER', payload: { name, projectId: editingProject.id } })}
            onRemove={memberId => dispatch({ type: 'REMOVE_MEMBER', payload: { memberId, projectId: editingProject.id } })}
          />
        )}

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={close}>Cancel</Button>
          <Button type="submit" variant="primary" size="sm">{isEdit ? 'Save changes' : 'Create project'}</Button>
        </div>
      </form>
    </Modal>
  );
}
