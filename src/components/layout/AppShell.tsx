import { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BoardView } from '../board/BoardView';
import { EmptyState } from '../ui/EmptyState';

export function AppShell() {
  const { state, dispatch, getActiveProject } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeProject = getActiveProject();

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-30 w-60 flex-shrink-0 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar project={activeProject} onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-hidden">
          {activeProject ? (
            <BoardView projectId={activeProject.id} />
          ) : (
            <EmptyState
              icon={<FolderOpen className="w-7 h-7" />}
              title={state.projects.length === 0 ? 'Create your first project' : 'Select a project'}
              description={state.projects.length === 0
                ? 'Projects help you organise tasks for different goals or teams.'
                : 'Pick a project from the sidebar to view its board.'}
              action={state.projects.length === 0
                ? { label: '+ New project', onClick: () => dispatch({ type: 'OPEN_MODAL', payload: { modal: 'create-project' } }) }
                : undefined}
            />
          )}
        </div>
      </main>
    </div>
  );
}
