import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskSize, TaskPriority } from '../types';

const SIZES: TaskSize[] = ['S', 'S-M', 'M', 'M-L', 'L'];
const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low'];

const PRIORITY_DOT: Record<TaskPriority, string> = {
  High: '#D85A30',
  Medium: '#EF9F27',
  Low: '#378ADD',
};

interface Props {
  task?: Task | null;       // null/undefined = new task mode
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'weekKey' | 'completed' | 'rolledOver'>) => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function SegmentControl<T extends string>({
  options,
  value,
  onChange,
  renderLabel,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  renderLabel?: (v: T) => React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            border: '1px solid',
            borderColor: value === opt ? 'var(--text)' : 'var(--border)',
            background: value === opt ? 'var(--text)' : 'transparent',
            color: value === opt ? 'var(--bg)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {renderLabel ? renderLabel(opt) : opt}
        </button>
      ))}
    </div>
  );
}

export function TaskModal({ task, onSave, onUpdate, onDelete, onClose }: Props) {
  const isEdit = Boolean(task);

  const [name, setName] = useState(task?.name ?? '');
  const [size, setSize] = useState<TaskSize>(task?.size ?? 'M');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'Medium');
  const [description, setDescription] = useState(task?.description ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isValid = name.trim().length > 0;

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    if (isEdit && task) {
      onUpdate({ ...task, name: name.trim(), size, priority, description, dueDate: dueDate || undefined });
    } else {
      onSave({ name: name.trim(), size, priority, description, dueDate: dueDate || undefined });
    }
    onClose();
  }, [isValid, isEdit, task, name, size, priority, description, dueDate, onSave, onUpdate, onClose]);

  const handleDelete = useCallback(() => {
    if (!task) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete(task.id);
    onClose();
  }, [task, confirmDelete, onDelete, onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, handleSubmit]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26, 23, 20, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 24,
      }}
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          borderRadius: 12,
          width: '100%',
          maxWidth: 520,
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--text)',
            }}
          >
            {isEdit ? 'Edit task' : 'New task'}
          </span>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-faint)',
              fontSize: 20,
              lineHeight: 1,
              padding: '0 2px',
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Task name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What needs to get done?"
              style={inputStyle}
            />
          </div>

          {/* Size */}
          <div>
            <label style={labelStyle}>Size</label>
            <SegmentControl options={SIZES} value={size} onChange={setSize} />
            <p style={hintStyle}>S = small effort, L = large effort · determines cell area in the map</p>
          </div>

          {/* Priority */}
          <div>
            <label style={labelStyle}>Priority</label>
            <SegmentControl
              options={PRIORITIES}
              value={priority}
              onChange={setPriority}
              renderLabel={(p) => (
                <>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: PRIORITY_DOT[p],
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  {p}
                </>
              )}
            />
          </div>

          {/* Due date */}
          <div>
            <label style={labelStyle}>Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'light' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional context, links, blockers…"
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: 80,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            {isEdit && (
              <button
                onClick={handleDelete}
                style={{
                  fontSize: 13,
                  fontFamily: 'var(--font-body)',
                  color: confirmDelete ? '#C0392B' : 'var(--text-muted)',
                  padding: '7px 12px',
                  borderRadius: 6,
                  border: confirmDelete ? '1px solid #C0392B' : '1px solid transparent',
                  background: 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                {confirmDelete ? 'Confirm delete' : 'Delete'}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                color: 'var(--text-muted)',
                padding: '7px 16px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: 'transparent',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              style={{
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                color: isValid ? 'var(--bg)' : 'var(--text-faint)',
                background: isValid ? 'var(--text)' : 'var(--border)',
                padding: '7px 20px',
                borderRadius: 6,
                border: 'none',
                cursor: isValid ? 'pointer' : 'not-allowed',
                transition: 'all 0.12s',
              }}
            >
              {isEdit ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 14,
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--border)',
  borderRadius: 7,
  background: 'var(--sidebar-bg)',
  color: 'var(--text)',
  outline: 'none',
};

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-faint)',
  fontFamily: 'var(--font-body)',
  marginTop: 6,
};
