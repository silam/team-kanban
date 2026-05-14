import { nanoid } from 'nanoid';
import type { AppState, AppAction } from '../types';
import { AVATAR_PALETTE } from '../constants';

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

const closeModal = (ui: AppState['ui']): AppState['ui'] => ({
  ...ui,
  openModal: null,
  editingTaskId: null,
  editingProjectId: null,
  pendingDeleteTaskId: null,
  pendingDeleteProjectId: null,
  defaultColumnId: null,
});

export function appReducer(state: AppState, action: AppAction): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'CREATE_PROJECT': {
      const project = { ...action.payload, id: nanoid(), createdAt: now, updatedAt: now };
      return {
        ...state,
        projects: [...state.projects, project],
        activeProjectId: project.id,
        ui: closeModal(state.ui),
      };
    }

    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload, updatedAt: now } : p
        ),
        ui: closeModal(state.ui),
      };
    }

    case 'DELETE_PROJECT': {
      const { projectId } = action.payload;
      const remaining = state.projects.filter(p => p.id !== projectId);
      return {
        ...state,
        projects: remaining,
        tasks: state.tasks.filter(t => t.projectId !== projectId),
        activeProjectId:
          state.activeProjectId === projectId ? (remaining[0]?.id ?? null) : state.activeProjectId,
        ui: closeModal(state.ui),
      };
    }

    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.payload.projectId };

    case 'ADD_MEMBER': {
      const { name, projectId } = action.payload;
      const existing = state.members.find(m => m.name.toLowerCase() === name.trim().toLowerCase());
      if (existing) {
        const project = state.projects.find(p => p.id === projectId);
        if (!project || project.memberIds.includes(existing.id)) return state;
        return {
          ...state,
          projects: state.projects.map(p =>
            p.id === projectId ? { ...p, memberIds: [...p.memberIds, existing.id], updatedAt: now } : p
          ),
        };
      }
      const member = { id: nanoid(), name: name.trim(), initials: getInitials(name), color: avatarColor(name) };
      return {
        ...state,
        members: [...state.members, member],
        projects: state.projects.map(p =>
          p.id === projectId ? { ...p, memberIds: [...p.memberIds, member.id], updatedAt: now } : p
        ),
      };
    }

    case 'REMOVE_MEMBER': {
      const { memberId, projectId } = action.payload;
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, memberIds: p.memberIds.filter(id => id !== memberId), updatedAt: now }
            : p
        ),
        tasks: state.tasks.map(t =>
          t.projectId === projectId && t.assigneeId === memberId
            ? { ...t, assigneeId: null, updatedAt: now }
            : t
        ),
      };
    }

    case 'CREATE_TASK': {
      const colTasks = state.tasks.filter(
        t => t.projectId === action.payload.projectId && t.columnId === action.payload.columnId
      );
      const maxOrder = colTasks.length > 0 ? Math.max(...colTasks.map(t => t.order)) + 1000 : 0;
      const task = { ...action.payload, id: nanoid(), order: maxOrder, createdAt: now, updatedAt: now };
      return { ...state, tasks: [...state.tasks, task], ui: closeModal(state.ui) };
    }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload, updatedAt: now } : t
        ),
        ui: closeModal(state.ui),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload.taskId),
        ui: closeModal(state.ui),
      };

    case 'MOVE_TASK': {
      const { taskId, toColumnId, orderedIds } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(t => {
          const idx = orderedIds.indexOf(t.id);
          if (t.id === taskId) return { ...t, columnId: toColumnId, order: idx >= 0 ? idx * 1000 : t.order, updatedAt: now };
          if (idx >= 0) return { ...t, order: idx * 1000 };
          return t;
        }),
      };
    }

    case 'OPEN_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          openModal: action.payload.modal,
          editingTaskId: action.payload.taskId ?? null,
          editingProjectId: action.payload.projectId ?? null,
          defaultColumnId: action.payload.columnId ?? null,
        },
      };

    case 'CLOSE_MODAL':
      return { ...state, ui: closeModal(state.ui) };

    case 'OPEN_CONFIRM_DELETE_TASK':
      return {
        ...state,
        ui: { ...state.ui, openModal: 'confirm-delete-task', pendingDeleteTaskId: action.payload.taskId },
      };

    case 'OPEN_CONFIRM_DELETE_PROJECT':
      return {
        ...state,
        ui: { ...state.ui, openModal: 'confirm-delete-project', pendingDeleteProjectId: action.payload.projectId },
      };

    default:
      return state;
  }
}
