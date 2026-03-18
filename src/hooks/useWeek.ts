import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, WeekData } from '../types';
import { storage } from '../lib/storage';
import { getMondayKey, getPreviousMondayKey } from '../lib/weekUtils';

function initCurrentWeek(): WeekData {
  const currentKey = getMondayKey();
  const existing = storage.getWeek(currentKey);
  if (existing) return existing;

  // New week — check previous week for rollover
  const prevKey = getPreviousMondayKey(currentKey);
  const prevWeek = storage.getWeek(prevKey);

  const rolledOverTasks: Task[] = [];

  if (prevWeek) {
    const incomplete = prevWeek.tasks.filter((t) => !t.completed);
    incomplete.forEach((t) => {
      rolledOverTasks.push({
        ...t,
        id: uuidv4(), // fresh ID for the new week
        weekKey: currentKey,
        rolledOver: true,
      });
    });

    // Archive the previous week: keep only completed tasks
    storage.saveWeek({
      ...prevWeek,
      tasks: prevWeek.tasks.filter((t) => t.completed),
    });
  }

  const week: WeekData = {
    key: currentKey,
    tasks: rolledOverTasks,
    createdAt: new Date().toISOString(),
  };

  storage.saveWeek(week);
  return week;
}

export function useWeek() {
  const currentKey = getMondayKey();
  const [week, setWeek] = useState<WeekData>(initCurrentWeek);

  const persist = useCallback((updated: WeekData) => {
    storage.saveWeek(updated);
    setWeek(updated);
  }, []);

  const addTask = useCallback(
    (data: Omit<Task, 'id' | 'createdAt' | 'weekKey' | 'completed' | 'rolledOver'>) => {
      const task: Task = {
        ...data,
        id: uuidv4(),
        completed: false,
        rolledOver: false,
        createdAt: new Date().toISOString(),
        weekKey: currentKey,
      };
      persist({ ...week, tasks: [...week.tasks, task] });
    },
    [week, persist, currentKey],
  );

  const updateTask = useCallback(
    (updated: Task) => {
      persist({
        ...week,
        tasks: week.tasks.map((t) => (t.id === updated.id ? updated : t)),
      });
    },
    [week, persist],
  );

  const deleteTask = useCallback(
    (id: string) => {
      persist({ ...week, tasks: week.tasks.filter((t) => t.id !== id) });
    },
    [week, persist],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      persist({
        ...week,
        tasks: week.tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        ),
      });
    },
    [week, persist],
  );

  /** Replace all tasks at once (used by dev seed utility). */
  const replaceAllTasks = useCallback(
    (tasks: Task[]) => {
      persist({ ...week, tasks });
    },
    [week, persist],
  );

  return { week, currentKey, addTask, updateTask, deleteTask, toggleComplete, replaceAllTasks };
}
