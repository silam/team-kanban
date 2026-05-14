import { Plus, LayoutGrid, X, Sun, Moon } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { ProjectItem } from '../projects/ProjectItem';

export function Sidebar({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useAppState();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-gray-100 text-sm tracking-tight">TeamFlow</span>
        </div>
        <button
          className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New project button */}
      <div className="px-3 pt-3">
        <button
          onClick={() => { dispatch({ type: 'OPEN_MODAL', payload: { modal: 'create-project' } }); onClose(); }}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      {/* Project list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-2 pb-1.5 mt-1">
          Projects
        </p>
        {state.projects.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">No projects yet</p>
        ) : (
          state.projects.map(p => (
            <ProjectItem key={p.id} project={p} />
          ))
        )}
      </div>

      {/* Theme toggle */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </div>
  );
}
