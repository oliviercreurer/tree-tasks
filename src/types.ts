export type TaskSize = 'S' | 'S-M' | 'M' | 'M-L' | 'L';
export type TaskPriority = 'High' | 'Medium' | 'Low' | 'Backlog';

export interface Task {
  id: string;
  name: string;
  size: TaskSize;
  priority: TaskPriority;
  description?: string;
  dueDate?: string; // ISO date YYYY-MM-DD
  completed: boolean;
  rolledOver?: boolean; // true if carried from a previous week
  createdAt: string;
  weekKey: string; // Monday ISO date
}

export interface WeekData {
  key: string;        // Monday ISO date e.g. "2025-03-17"
  tasks: Task[];
  createdAt: string;
}
