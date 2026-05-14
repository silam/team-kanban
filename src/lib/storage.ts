import type { AppState, PersistedState } from '../types';
import { SCHEMA_VERSION } from '../constants';

const KEY = 'kanban-app-v1';

function defaultUI(): AppState['ui'] {
  return {
    openModal: null,
    editingTaskId: null,
    editingProjectId: null,
    pendingDeleteTaskId: null,
    pendingDeleteProjectId: null,
    defaultColumnId: null,
  };
}

export function getInitialState(): AppState {
  return { projects: [], tasks: [], members: [], activeProjectId: null, ui: defaultUI() };
}

function migrate(data: PersistedState): AppState {
  // future migrations added here as schema evolves
  return {
    projects: data.projects ?? [],
    tasks: data.tasks ?? [],
    members: data.members ?? [],
    activeProjectId: data.activeProjectId ?? null,
    ui: defaultUI(),
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw) as PersistedState;
    const state = migrate(parsed);
    if (state.activeProjectId && !state.projects.find(p => p.id === state.activeProjectId)) {
      state.activeProjectId = state.projects[0]?.id ?? null;
    }
    return state;
  } catch {
    return getInitialState();
  }
}

export function saveState(state: AppState): void {
  try {
    const snap: PersistedState = {
      schemaVersion: SCHEMA_VERSION,
      projects: state.projects,
      tasks: state.tasks,
      members: state.members,
      activeProjectId: state.activeProjectId,
    };
    localStorage.setItem(KEY, JSON.stringify(snap));
  } catch {
    // QuotaExceededError — silently ignore
  }
}
