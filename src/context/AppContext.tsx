import { createContext, useContext, useReducer, useEffect, useMemo, type ReactNode } from 'react';
import type { AppState, AppAction, ColumnId } from '../types';
import { appReducer } from '../reducers/appReducer';
import { loadState, saveState } from '../lib/storage';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getProjectTasks: (projectId: string, columnId: ColumnId) => AppState['tasks'];
  getProjectMembers: (projectId: string) => AppState['members'];
  getActiveProject: () => AppState['projects'][0] | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<AppContextValue>(() => ({
    state,
    dispatch,
    getProjectTasks: (projectId, columnId) =>
      state.tasks
        .filter(t => t.projectId === projectId && t.columnId === columnId)
        .sort((a, b) => a.order - b.order),
    getProjectMembers: (projectId) => {
      const project = state.projects.find(p => p.id === projectId);
      if (!project) return [];
      return state.members.filter(m => project.memberIds.includes(m.id));
    },
    getActiveProject: () => state.projects.find(p => p.id === state.activeProjectId) ?? null,
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
