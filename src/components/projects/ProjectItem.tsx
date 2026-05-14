import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Project } from '../../types';
import { PROJECT_COLOR_CLASSES } from '../../constants';
import { useAppState } from '../../context/AppContext';

export function ProjectItem({ project }: { project: Project }) {
  const { state, dispatch } = useAppState();
  const isActive = state.activeProjectId === project.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const colorCls = PROJECT_COLOR_CLASSES[project.color];

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <div
      className={`group relative flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      onClick={() => dispatch({ type: 'SET_ACTIVE_PROJECT', payload: { projectId: project.id } })}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorCls.dot}`} />
      <span className={`flex-1 text-sm truncate ${isActive ? 'font-medium text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
        {project.name}
      </span>
      <div className="relative" ref={menuRef}>
        <button
          className={`p-0.5 rounded transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
          aria-label="Project options"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-6 z-20 w-36 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
            <button
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={e => { e.stopPropagation(); setMenuOpen(false); dispatch({ type: 'OPEN_MODAL', payload: { modal: 'edit-project', projectId: project.id } }); }}
            >
              <Pencil className="w-3 h-3" /> Edit project
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={e => { e.stopPropagation(); setMenuOpen(false); dispatch({ type: 'OPEN_CONFIRM_DELETE_PROJECT', payload: { projectId: project.id } }); }}
            >
              <Trash2 className="w-3 h-3" /> Delete project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
