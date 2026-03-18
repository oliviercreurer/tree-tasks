import { useEffect } from 'react';

const SHORTCUTS = [
  { key: 'N', label: 'New task' },
  { key: 'H', label: 'History' },
  { key: '⌘ click', label: 'Toggle task done' },
  { key: 'Esc', label: 'Close panel / modal' },
  { key: '?', label: 'This help' },
];

const DEV_SHORTCUTS = [
  { key: 'D', label: 'Load seed data (cycles sets)' },
  { key: '⇧D', label: 'Clear all tasks' },
];

function renderGroup(items: { key: string; label: string }[]) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map(({ key, label }) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontFamily: 'var(--font-body)',
              color: 'var(--text)',
            }}
          >
            {label}
          </span>
          <kbd
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              background: 'var(--sidebar-bg)',
              border: '1px solid var(--border)',
              borderRadius: 5,
              padding: '3px 8px',
              minWidth: 28,
              textAlign: 'center',
            }}
          >
            {key}
          </kbd>
        </div>
      ))}
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export function ShortcutsHelp({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault();
        onClose();
      }
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
          background: 'rgba(26, 23, 20, 0.3)',
          zIndex: 300,
        }}
      />

      {/* Card */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '18px 22px',
          zIndex: 310,
          minWidth: 200,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-faint)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Keyboard shortcuts
        </p>

        {renderGroup(SHORTCUTS)}

        {/* Dev section */}
        <p
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-faint)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: 16,
            marginBottom: 10,
          }}
        >
          Dev
        </p>
        {renderGroup(DEV_SHORTCUTS)}
      </div>
    </>
  );
}
