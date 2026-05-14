import { Menu, Plus, Pencil } from 'lucide-react';
import type { Project } from '../../types';
import { PROJECT_COLOR_CLASSES } from '../../constants';
import { useAppState } from '../../context/AppContext';
import { AssigneeAvatar } from '../tasks/AssigneeAvatar';

interface TopBarProps {
  project: Project | null;
  onMenuClick: () => void;
}

export function TopBar({ project, onMenuClick }: TopBarProps) {
  const { dispatch, getProjectMembers } = useAppState();
  const members = project ? getProjectMembers(project.id) : [];

  return (
    <header className="flex items-center gap-3 px-4 h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
      <button
        className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {project ? (
        <>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${PROJECT_COLOR_CLASSES[project.color].dot}`} />
            <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{project.name}</h1>
            {project.description && (
              <span className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 truncate">— {project.description}</span>
            )}
          </div>

          <div className="flex-1" />

          {/* Member avatars */}
          {members.length > 0 && (
            <div className="flex items-center -space-x-1.5">
              {members.slice(0, 5).map(m => (
                <AssigneeAvatar key={m.id} member={m} size="sm" />
              ))}
              {members.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-900">
                  +{members.length - 5}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'edit-project', projectId: project.id } })}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Edit project"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'create-task', columnId: 'todo' } })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add task
          </button>
        </>
      ) : (
        <h1 className="text-sm font-semibold text-gray-500 dark:text-gray-400">No project selected</h1>
      )}
    </header>
  );
}
