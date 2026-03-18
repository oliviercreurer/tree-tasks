import { useState, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task } from './types';
import { useWeek } from './hooks/useWeek';
import { useHotkeys } from './hooks/useHotkeys';
import { Treemap } from './components/Treemap';
import { TaskModal } from './components/TaskModal';
import { TaskSidebar } from './components/TaskSidebar';
import { HistoryPanel } from './components/HistoryPanel';
import { ShortcutsHelp } from './components/ShortcutsHelp';
import { formatWeekLabel, getMondayKey } from './lib/weekUtils';
import { SEED_SETS } from './lib/seedData';

type ModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; task: Task };

export function App() {
  const { week, addTask, updateTask, deleteTask, toggleComplete, replaceAllTasks } = useWeek();
  const seedIndexRef = useRef(0);
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const openAdd = () => setModal({ mode: 'add' });
  const openEdit = (task: Task) => setModal({ mode: 'edit', task });
  const closeModal = () => setModal({ mode: 'closed' });

  // Global keyboard shortcuts (only fire when nothing else is open)
  const nothingOpen = modal.mode === 'closed' && !historyOpen && !shortcutsOpen;

  const hotkeys = useMemo(() => ({
    n: () => {
      if (nothingOpen) openAdd();
    },
    h: () => {
      if (modal.mode === 'closed' && !shortcutsOpen) setHistoryOpen((o) => !o);
    },
    '?': () => {
      if (modal.mode === 'closed' && !historyOpen) setShortcutsOpen((o) => !o);
    },
    Escape: () => {
      if (shortcutsOpen) setShortcutsOpen(false);
      else if (historyOpen) setHistoryOpen(false);
      else if (modal.mode !== 'closed') closeModal();
    },
    // Dev: cycle seed data sets (d) / clear all tasks (D = shift+d)
    d: () => {
      if (!nothingOpen) return;
      const set = SEED_SETS[seedIndexRef.current % SEED_SETS.length];
      const weekKey = getMondayKey();
      const tasks: Task[] = set.tasks.map((s) => ({
        id: uuidv4(),
        name: s.name,
        size: s.size,
        priority: s.priority,
        completed: s.completed,
        description: s.description,
        dueDate: s.dueDate,
        rolledOver: s.rolledOver ?? false,
        createdAt: new Date().toISOString(),
        weekKey,
      }));
      replaceAllTasks(tasks);
      seedIndexRef.current += 1;
      console.log(`[dev] Loaded seed set: ${set.label}`);
    },
    D: () => {
      if (!nothingOpen) return;
      replaceAllTasks([]);
      seedIndexRef.current = 0;
      console.log('[dev] Cleared all tasks');
    },
  }), [nothingOpen, modal.mode, historyOpen, shortcutsOpen, replaceAllTasks]);

  useHotkeys(hotkeys);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* Treemap */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Treemap tasks={week.tasks} onTaskClick={openEdit} onToggleComplete={toggleComplete} />
      </main>

      {/* Sidebar */}
      <TaskSidebar
        tasks={week.tasks}
        weekLabel={formatWeekLabel(week.key)}
        onAddTask={openAdd}
        onTaskClick={openEdit}
        onToggleComplete={toggleComplete}
        onOpenHistory={() => setHistoryOpen(true)}
      />

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

      {/* Shortcuts help */}
      {shortcutsOpen && <ShortcutsHelp onClose={() => setShortcutsOpen(false)} />}
    </div>
  );
}
