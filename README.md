# Weekmap

A weekly task manager that visualizes your workload as a treemap. Cell area = task size. Color = priority. Every Monday, incomplete tasks roll over automatically.

## Stack

- **React 18** + TypeScript + Vite
- **D3 v7** — treemap layout only; all rendering is React SVG
- **localStorage** — abstracted in `src/lib/storage.ts` for easy backend swap

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deploy

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```
`vercel.json` handles SPA routing automatically.

### Netlify
```bash
npm run build
# drag the dist/ folder to app.netlify.com/drop
```
`public/_redirects` handles SPA routing automatically.

---

## Swapping in a real backend

All storage operations go through `src/lib/storage.ts`. The interface is:

```ts
storage.getWeek(key)       // → WeekData | null
storage.saveWeek(data)     // → void
storage.getAllWeekKeys()    // → string[]
storage.deleteWeek(key)    // → void
```

Replace the `localStorage` calls with Supabase, Firebase, or any other backend here — nothing else in the codebase needs to change.

### Supabase example

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export const storage = {
  async getWeek(key: string) {
    const { data } = await supabase.from('weeks').select('*').eq('key', key).single();
    return data;
  },
  async saveWeek(week: WeekData) {
    await supabase.from('weeks').upsert(week, { onConflict: 'key' });
  },
  // ...
};
```

---

## File structure

```
src/
├── App.tsx                  # Root layout, modal state
├── types.ts                 # Task, WeekData interfaces
├── index.css                # Global styles + CSS variables
├── lib/
│   ├── storage.ts           # Persistence layer (swap here for backend)
│   └── weekUtils.ts         # Monday key logic, date formatting
├── hooks/
│   └── useWeek.ts           # All task/week state + rollover logic
└── components/
    ├── Treemap.tsx           # D3 layout → React SVG cells
    ├── TaskModal.tsx         # Add / edit task form
    ├── TaskSidebar.tsx       # Task list, progress bar, footer actions
    └── HistoryPanel.tsx      # Slide-in panel for past weeks
```

---

## Rollover behaviour

On Monday, when the app first loads:
1. Reads the previous week from storage
2. Filters incomplete tasks → copies them into the new week with `rolledOver: true`
3. Strips those tasks from the previous week's archive (keeps only completed ones)
4. Saves both weeks

Rolled-over tasks show a small dot indicator (•) in the treemap cell and a `↩` badge in the sidebar.
