import { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { Task, TaskPriority } from '../types';

const SIZE_MAP: Record<string, number> = {
  S: 1,
  'S-M': 1.5,
  M: 2,
  'M-L': 2.5,
  L: 3,
};

interface PriorityColor {
  fill: string;
  stroke: string;
  text: string;
}

const COLORS: Record<TaskPriority, PriorityColor> = {
  High:   { fill: '#F0997B', stroke: '#D85A30', text: '#4A1B0C' },
  Medium: { fill: '#FAC775', stroke: '#EF9F27', text: '#412402' },
  Low:    { fill: '#85B7EB', stroke: '#378ADD', text: '#042C53' },
};

interface Leaf {
  task: Task;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onToggleComplete?: (id: string) => void;
}

export function Treemap({ tasks, onTaskClick, onToggleComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 800, height: 500 });
  const [tooltip, setTooltip] = useState<{ task: Task; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ width, height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const leaves = useMemo<Leaf[]>(() => {
    if (!tasks.length) return [];

    const root = d3
      .hierarchy<{ children?: Task[] }>({ children: tasks })
      .sum((d) => {
        const t = d as unknown as Task;
        return SIZE_MAP[t.size] ?? 1;
      })
      .sort((a, b) => {
        const ta = a.data as unknown as Task;
        const tb = b.data as unknown as Task;
        // 1. Nearest due date first (undated tasks last)
        const dateA = ta.dueDate ? new Date(ta.dueDate).getTime() : Infinity;
        const dateB = tb.dueDate ? new Date(tb.dueDate).getTime() : Infinity;
        if (dateA !== dateB) return dateA - dateB;
        // 2. Higher priority first
        const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        const pa = PRIORITY_ORDER[ta.priority] ?? 99;
        const pb = PRIORITY_ORDER[tb.priority] ?? 99;
        if (pa !== pb) return pa - pb;
        // 3. Larger size as final tiebreaker
        return (b.value ?? 0) - (a.value ?? 0);
      });

    d3.treemap<{ children?: Task[] }>()
      .size([dims.width, dims.height])
      .paddingInner(4)
      .paddingOuter(0)(root);

    // Mirror x-axis so nearest-due tasks land in the top-right
    return root.leaves().map((node) => ({
      task: node.data as unknown as Task,
      x0: dims.width - node.x1,
      y0: node.y0,
      x1: dims.width - node.x0,
      y1: node.y1,
    }));
  }, [tasks, dims]);

  const LEGEND: { priority: TaskPriority; label: string }[] = [
    { priority: 'High', label: 'High' },
    { priority: 'Medium', label: 'Medium' },
    { priority: 'Low', label: 'Low' },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Empty state */}
      {tasks.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--text-faint)',
          }}
        >
          <span style={{ fontSize: 48, opacity: 0.3 }}>◻</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 15 }}>
            Add a task to get started
          </span>
        </div>
      )}

      {/* Treemap SVG */}
      <svg width={dims.width} height={dims.height} style={{ display: 'block' }}>
        {leaves.map(({ task, x0, y0, x1, y1 }) => {
          const w = x1 - x0;
          const h = y1 - y0;
          const c = COLORS[task.priority] ?? COLORS.Low;
          const pad = 9;
          const clipId = `clip-${task.id}`;

          // Layout tiers
          const isTiny  = w < 28 || h < 28;
          const isSmall = !isTiny && h < 50;

          return (
            <g
              key={task.id}
              transform={`translate(${x0},${y0})`}
              className="treemap-cell"
              onClick={(e) => {
                if ((e.metaKey || e.ctrlKey) && onToggleComplete) {
                  e.stopPropagation();
                  onToggleComplete(task.id);
                } else {
                  onTaskClick(task);
                }
              }}
              onMouseMove={(e) => setTooltip({ task, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}
              style={{
                cursor: 'pointer',
                filter: task.completed ? 'grayscale(1)' : 'none',
                opacity: task.completed ? 0.28 : 1,
                transition: 'opacity 0.2s, filter 0.2s',
              }}
            >
              {/* Clip path — prevents any text from spilling outside the cell */}
              <defs>
                <clipPath id={clipId}>
                  <rect width={w} height={h} rx={4} />
                </clipPath>
              </defs>

              {/* Background */}
              <rect
                width={w}
                height={h}
                rx={4}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth={1}
              />

              {/* Completed diagonal lines */}
              {task.completed && (
                <line
                  x1={0}
                  y1={0}
                  x2={w}
                  y2={h}
                  stroke={c.stroke}
                  strokeWidth={1}
                  opacity={0.4}
                />
              )}

              {/* Rolled-over dot indicator */}
              {task.rolledOver && !isTiny && (
                <circle
                  cx={w - 8}
                  cy={8}
                  r={3}
                  fill={c.stroke}
                  opacity={0.6}
                />
              )}

              {/* Clipped text content — always top-left anchored */}
              <g clipPath={`url(#${clipId})`}>

                {/* Wrapping task name */}
                {!isTiny && (
                  <foreignObject x={pad} y={pad} width={w - pad * 2} height={h - pad * 2 - 16}>
                    <div
                      style={{
                        fontSize: 10,
                        lineHeight: 1.4,
                        color: c.text,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: task.completed ? 400 : 500,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: Math.max(1, Math.floor((h - pad * 2 - 20) / 14)),
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {task.name}
                    </div>
                  </foreignObject>
                )}

                {/* Size label */}
                {!isTiny && !isSmall && (
                <text
                  x={pad}
                  y={h - pad}
                  fontSize={9}
                  fill={c.text}
                  fontFamily="var(--font-mono)"
                  opacity={0.55}
                  letterSpacing={0.5}
                >
                  {task.size}
                </text>
                )}

              </g>{/* end clip group */}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 14,
            top: tooltip.y - 8,
            background: 'var(--text)',
            color: 'var(--bg)',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            pointerEvents: 'none',
            zIndex: 100,
            maxWidth: 220,
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontWeight: 500 }}>{tooltip.task.name}</div>
          <div style={{ opacity: 0.65, fontSize: 11, marginTop: 2 }}>
            {tooltip.task.priority} · {tooltip.task.size}
            {tooltip.task.dueDate && ` · due ${tooltip.task.dueDate}`}
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 14,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        {LEGEND.map(({ priority, label }) => (
          <span
            key={priority}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              fontFamily: 'var(--font-body)',
              color: 'var(--text-muted)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: COLORS[priority].fill,
                border: `1px solid ${COLORS[priority].stroke}`,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            {label}
          </span>
        ))}
        <span
          style={{
            fontSize: 11,
            color: 'var(--text-faint)',
            fontFamily: 'var(--font-body)',
            marginLeft: 4,
            borderLeft: '1px solid var(--border)',
            paddingLeft: 12,
          }}
        >
          size = area
        </span>
      </div>
    </div>
  );
}
