import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { getMondayKey, formatWeekShort, formatWeekLabel } from '../lib/weekUtils';
import type { WeekData, TaskPriority } from '../types';

const PRIORITY_DOT: Record<TaskPriority, string> = {
  High: '#D85A30',
  Medium: '#EF9F27',
  Low: '#378ADD',
  Backlog: '#9A9590',
};

interface Props {
  onClose: () => void;
}

export function HistoryPanel({ onClose }: Props) {
  const currentKey = getMondayKey();
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const keys = storage.getAllWeekKeys().filter((k) => k !== currentKey);
    const loaded = keys.map((k) => storage.getWeek(k)).filter(Boolean) as WeekData[];
    setWeeks(loaded);
    if (loaded.length > 0) setSelected(loaded[0].key);
  }, [currentKey]);

  const selectedWeek = weeks.find((w) => w.key === selected);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,23,20,0.25)',
          zIndex: 150,
        }}
      />

      {/* Panel */}
      <div
        className="history-panel"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: 540,
          background: 'var(--bg)',
          borderRight: '1px solid var(--border)',
          zIndex: 160,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '22px 24px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 20,
                color: 'var(--text)',
              }}
            >
              History
            </h2>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text-faint)',
                fontFamily: 'var(--font-body)',
                marginTop: 2,
              }}
            >
              {weeks.length} past {weeks.length === 1 ? 'week' : 'weeks'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: 20,
              color: 'var(--text-faint)',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {weeks.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
              color: 'var(--text-faint)',
            }}
          >
            <span style={{ fontSize: 36, opacity: 0.3 }}>◻</span>
            <span style={{ fontSize: 14, fontFamily: 'var(--font-body)' }}>
              No archived weeks yet
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Week list */}
            <div
              style={{
                width: 140,
                borderRight: '1px solid var(--border)',
                overflowY: 'auto',
                flexShrink: 0,
                padding: '8px 0',
              }}
            >
              {weeks.map((w) => {
                const done = w.tasks.filter((t) => t.completed).length;
                const total = w.tasks.length;
                return (
                  <button
                    key={w.key}
                    onClick={() => setSelected(w.key)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      background: selected === w.key ? 'var(--sidebar-bg)' : 'transparent',
                      borderLeft: selected === w.key ? '2px solid var(--accent)' : '2px solid transparent',
                      fontSize: 13,
                      fontFamily: 'var(--font-body)',
                      color: selected === w.key ? 'var(--text)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{formatWeekShort(w.key)}</div>
                    <div
                      style={{
                        fontSize: 10,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-faint)',
                        marginTop: 3,
                      }}
                    >
                      {done}/{total}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Week detail */}
            {selectedWeek && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 400,
                    fontSize: 18,
                    color: 'var(--text)',
                    marginBottom: 4,
                  }}
                >
                  {formatWeekLabel(selectedWeek.key)}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-faint)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 20,
                  }}
                >
                  {selectedWeek.tasks.filter((t) => t.completed).length} of{' '}
                  {selectedWeek.tasks.length} completed
                </p>

                {selectedWeek.tasks.length === 0 && (
                  <p style={{ color: 'var(--text-faint)', fontSize: 13 }}>No tasks recorded.</p>
                )}

                {selectedWeek.tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '9px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {/* Status dot */}
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        border: `1.5px solid ${task.completed ? 'var(--accent)' : 'var(--border-strong)'}`,
                        background: task.completed ? 'var(--accent)' : 'transparent',
                        flexShrink: 0,
                        marginTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {task.completed && (
                        <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                          <path d="M1 2.5L2.5 4L6 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontFamily: 'var(--font-body)',
                          color: task.completed ? 'var(--text-faint)' : 'var(--text)',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          lineHeight: 1.4,
                        }}
                      >
                        {task.name}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          marginTop: 3,
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: PRIORITY_DOT[task.priority],
                            display: 'inline-block',
                          }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-faint)',
                          }}
                        >
                          {task.priority} · {task.size}
                          {task.dueDate && ` · due ${task.dueDate}`}
                        </span>
                      </div>
                      {task.description && (
                        <p
                          style={{
                            fontSize: 12,
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-body)',
                            marginTop: 4,
                            lineHeight: 1.5,
                          }}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
