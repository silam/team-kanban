import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useAppState } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { ProjectModal } from './components/projects/ProjectModal';
import { TaskModal } from './components/tasks/TaskModal';
import { ConfirmDialog } from './components/ui/ConfirmDialog';

function AppContent() {
  const { state, dispatch } = useAppState();
  const { openModal, pendingDeleteTaskId, pendingDeleteProjectId } = state.ui;

  return (
    <>
      <AppShell />

      {(openModal === 'create-project' || openModal === 'edit-project') && <ProjectModal />}

      {(openModal === 'create-task' || openModal === 'edit-task') && state.activeProjectId && <TaskModal />}

      {openModal === 'confirm-delete-task' && pendingDeleteTaskId && (
        <ConfirmDialog
          title="Delete task"
          message="This task will be permanently deleted. This cannot be undone."
          onConfirm={() => dispatch({ type: 'DELETE_TASK', payload: { taskId: pendingDeleteTaskId } })}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      )}

      {openModal === 'confirm-delete-project' && pendingDeleteProjectId && (
        <ConfirmDialog
          title="Delete project"
          message="All tasks in this project will be permanently deleted. This cannot be undone."
          onConfirm={() => dispatch({ type: 'DELETE_PROJECT', payload: { projectId: pendingDeleteProjectId } })}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
