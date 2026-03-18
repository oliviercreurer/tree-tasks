import { useState } from 'react';
import type { Task } from './types';
import { useWeek } from './hooks/useWeek';
import { Treemap } from './components/Treemap';
import { TaskModal } from './components/TaskModal';
import { TaskSidebar } from './components/TaskSidebar';
import { HistoryPanel } from './components/HistoryPanel';
import { formatWeekLabel } from './lib/weekUtils';

type ModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; task: Task };

export function App() {
  const { week, addTask, updateTask, deleteTask, toggleComplete } = useWeek();
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });
  const [historyOpen, setHistoryOpen] = useState(false);

  const openAdd = () => setModal({ mode: 'add' });
  const openEdit = (task: Task) => setModal({ mode: 'edit', task });
  const closeModal = () => setModal({ mode: 'closed' });

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* Sidebar */}
      <TaskSidebar
        tasks={week.tasks}
        weekLabel={formatWeekLabel(week.key)}
        onAddTask={openAdd}
        onTaskClick={openEdit}
        onToggleComplete={toggleComplete}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      {/* Treemap */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Treemap tasks={week.tasks} onTaskClick={openEdit} />
      </main>

      {/* Task modal */}
      {modal.mode !== 'closed' && (
        <TaskModal
          task={modal.mode === 'edit' ? modal.task : null}
          onSave={addTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onClose={closeModal}
        />
      )}

      {/* History panel */}
      {historyOpen && <HistoryPanel onClose={() => setHistoryOpen(false)} />}
    </div>
  );
}
