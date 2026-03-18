import type { Task, TaskPriority } from '../types';

const PRIORITY_DOT: Record<TaskPriority, string> = {
  High: '#D85A30',
  Medium: '#EF9F27',
  Low: '#378ADD',
  Backlog: '#9A9590',
};

interface Props {
  tasks: Task[];
  weekLabel: string;
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onToggleComplete: (id: string) => void;
  onOpenHistory: () => void;
}

export function TaskSidebar({
  tasks,
  weekLabel,
  onAddTask,
  onTaskClick,
  onToggleComplete,
  onOpenHistory,
}: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const rolledOver = tasks.filter((t) => t.rolledOver && !t.completed).length;

  const active = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <aside
      style={{
        width: 268,
        flexShrink: 0,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Week header */}
      <div
        style={{
          padding: '24px 20px 18px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-faint)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          Week of
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 22,
            color: 'var(--text)',
            lineHeight: 1.2,
          }}
        >
          {weekLabel}
        </h1>

        {/* Progress */}
        {total > 0 && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-faint)',
                marginBottom: 6,
              }}
            >
              <span>{done} of {total} done</span>
              <span>{Math.round((done / total) * 100)}%</span>
            </div>
            <div
              style={{
                height: 3,
                background: 'var(--border)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(done / total) * 100}%`,
                  background: 'var(--accent)',
                  borderRadius: 2,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )}

        {rolledOver > 0 && (
          <p
            style={{
              marginTop: 10,
              fontSize: 11,
              fontFamily: 'var(--font-body)',
              color: 'var(--text-faint)',
            }}
          >
            ↩ {rolledOver} carried from last week
          </p>
        )}
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {active.length === 0 && completed.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--text-faint)',
              fontFamily: 'var(--font-body)',
              marginTop: 32,
              padding: '0 20px',
              lineHeight: 1.6,
            }}
          >
            No tasks yet. Add one to build your week.
          </p>
        )}

        {/* Active tasks */}
        {active.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onToggle={() => onToggleComplete(task.id)}
          />
        ))}

        {/* Completed section */}
        {completed.length > 0 && (
          <>
            <div
              style={{
                padding: '10px 20px 6px',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-faint)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Completed
            </div>
            {completed.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                onToggle={() => onToggleComplete(task.id)}
              />
            ))}
          </>
        )}
      </div>

      {/* Footer actions */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <button
          onClick={onAddTask}
          style={{
            width: '100%',
            padding: '9px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            background: 'var(--text)',
            color: 'var(--bg)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'opacity 0.12s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <span style={{ fontSize: 16, lineHeight: 1, marginTop: -1 }}>+</span>
          Add task
        </button>
        <button
          onClick={onOpenHistory}
          style={{
            width: '100%',
            padding: '7px 16px',
            borderRadius: 8,
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            color: 'var(--text-muted)',
            background: 'transparent',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'border-color 0.12s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          View history
        </button>
      </div>
    </aside>
  );
}

function TaskRow({
  task,
  onClick,
  onToggle,
}: {
  task: Task;
  onClick: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '7px 20px',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(26,23,20,0.04)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `1.5px solid ${task.completed ? 'var(--accent)' : 'var(--border-strong)'}`,
          background: task.completed ? 'var(--accent)' : 'transparent',
          flexShrink: 0,
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.12s',
        }}
      >
        {task.completed && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }} onClick={onClick}>
        <div
          style={{
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            color: task.completed ? 'var(--text-faint)' : 'var(--text)',
            textDecoration: task.completed ? 'line-through' : 'none',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {task.name}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 2,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: PRIORITY_DOT[task.priority],
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-faint)',
              letterSpacing: '0.04em',
            }}
          >
            {task.size}
            {task.dueDate && ` · ${task.dueDate}`}
            {task.rolledOver && ' · ↩'}
          </span>
        </div>
      </div>
    </div>
  );
}
