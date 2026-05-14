export type ColumnId = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ProjectColor = 'violet' | 'sky' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'teal' | 'pink';
export type ModalType =
  | 'create-project'
  | 'edit-project'
  | 'create-task'
  | 'edit-task'
  | 'confirm-delete-task'
  | 'confirm-delete-project';

export interface Member {
  id: string;
  name: string;
  color: string;
  initials: string;
}

export interface Task {
  id: string;
  projectId: string;
  columnId: ColumnId;
  title: string;
  description: string;
  assigneeId: string | null;
  priority: Priority;
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: ProjectColor;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UIState {
  openModal: ModalType | null;
  editingTaskId: string | null;
  editingProjectId: string | null;
  pendingDeleteTaskId: string | null;
  pendingDeleteProjectId: string | null;
  defaultColumnId: ColumnId | null;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  members: Member[];
  activeProjectId: string | null;
  ui: UIState;
}

export interface PersistedState {
  schemaVersion: number;
  projects: Project[];
  tasks: Task[];
  members: Member[];
  activeProjectId: string | null;
}

export type AppAction =
  | { type: 'CREATE_PROJECT'; payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_PROJECT'; payload: Partial<Omit<Project, 'id'>> & { id: string } }
  | { type: 'DELETE_PROJECT'; payload: { projectId: string } }
  | { type: 'SET_ACTIVE_PROJECT'; payload: { projectId: string | null } }
  | { type: 'ADD_MEMBER'; payload: { name: string; projectId: string } }
  | { type: 'REMOVE_MEMBER'; payload: { memberId: string; projectId: string } }
  | { type: 'CREATE_TASK'; payload: Omit<Task, 'id' | 'order' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: Partial<Omit<Task, 'id'>> & { id: string } }
  | { type: 'DELETE_TASK'; payload: { taskId: string } }
  | { type: 'MOVE_TASK'; payload: { taskId: string; toColumnId: ColumnId; orderedIds: string[] } }
  | { type: 'OPEN_MODAL'; payload: { modal: ModalType; taskId?: string; projectId?: string; columnId?: ColumnId } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'OPEN_CONFIRM_DELETE_TASK'; payload: { taskId: string } }
  | { type: 'OPEN_CONFIRM_DELETE_PROJECT'; payload: { projectId: string } };
