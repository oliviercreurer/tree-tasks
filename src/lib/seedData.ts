/**
 * seedData.ts — Fixed task sets for development & testing.
 *
 * Four sets: small (4), medium (8), large (14), XL (100).
 * Each covers a mix of sizes, priorities, and completion states.
 */

import type { TaskSize, TaskPriority } from '../types';

interface SeedTask {
  name: string;
  size: TaskSize;
  priority: TaskPriority;
  completed: boolean;
  description?: string;
  dueDate?: string;
  rolledOver?: boolean;
}

// ── Small set (4 tasks) ─────────────────────────────────────────
const small: SeedTask[] = [
  {
    name: 'Fix login redirect bug',
    size: 'S',
    priority: 'High',
    completed: false,
    description: 'Users get stuck on /callback after OAuth flow',
  },
  {
    name: 'Write Q2 goals doc',
    size: 'M',
    priority: 'Medium',
    completed: false,
    dueDate: '2026-03-20',
  },
  {
    name: 'Update dependencies',
    size: 'S-M',
    priority: 'Low',
    completed: true,
  },
  {
    name: 'Review Alicia\'s PR',
    size: 'S',
    priority: 'Medium',
    completed: false,
    rolledOver: true,
  },
];

// ── Medium set (8 tasks) ────────────────────────────────────────
const medium: SeedTask[] = [
  {
    name: 'Design settings page',
    size: 'L',
    priority: 'High',
    completed: false,
    description: 'New layout with tabs for profile, billing, team',
    dueDate: '2026-03-19',
  },
  {
    name: 'Fix timezone bug in scheduler',
    size: 'M',
    priority: 'High',
    completed: false,
  },
  {
    name: 'Add CSV export',
    size: 'M-L',
    priority: 'Medium',
    completed: false,
    description: 'Support for task list and history export',
  },
  {
    name: 'Write API docs for /tasks endpoint',
    size: 'M',
    priority: 'Medium',
    completed: false,
    dueDate: '2026-03-21',
  },
  {
    name: 'Refactor color tokens',
    size: 'S-M',
    priority: 'Low',
    completed: false,
    description: 'Move hardcoded hex values to CSS custom properties',
  },
  {
    name: 'Set up error tracking',
    size: 'S',
    priority: 'Medium',
    completed: true,
  },
  {
    name: 'Respond to customer feedback thread',
    size: 'S',
    priority: 'Low',
    completed: true,
    rolledOver: true,
  },
  {
    name: 'Backlog: explore WebSocket support',
    size: 'M-L',
    priority: 'Backlog',
    completed: false,
  },
];

// ── Large set (14 tasks) ────────────────────────────────────────
const large: SeedTask[] = [
  {
    name: 'Ship onboarding flow v2',
    size: 'L',
    priority: 'High',
    completed: false,
    description: 'Multi-step wizard with progress bar',
    dueDate: '2026-03-18',
  },
  {
    name: 'Fix mobile layout overflow',
    size: 'M',
    priority: 'High',
    completed: false,
  },
  {
    name: 'Performance audit — bundle size',
    size: 'M-L',
    priority: 'High',
    completed: false,
    description: 'Target: <200KB initial JS',
  },
  {
    name: 'Migrate auth to new provider',
    size: 'L',
    priority: 'Medium',
    completed: false,
    dueDate: '2026-03-22',
    rolledOver: true,
  },
  {
    name: 'Add dark mode toggle',
    size: 'M',
    priority: 'Medium',
    completed: false,
  },
  {
    name: 'Create team invitation flow',
    size: 'M-L',
    priority: 'Medium',
    completed: false,
    description: 'Email invite + link sharing',
  },
  {
    name: 'Write integration tests for billing',
    size: 'M',
    priority: 'Medium',
    completed: true,
  },
  {
    name: 'Update README with deploy instructions',
    size: 'S',
    priority: 'Low',
    completed: true,
  },
  {
    name: 'Fix flaky CI test — dashboard spec',
    size: 'S-M',
    priority: 'Low',
    completed: false,
  },
  {
    name: 'Accessibility pass on modals',
    size: 'S-M',
    priority: 'Low',
    completed: false,
    description: 'Focus trapping, ARIA labels, screen reader testing',
  },
  {
    name: 'Add loading skeletons',
    size: 'S',
    priority: 'Low',
    completed: true,
  },
  {
    name: 'Backlog: i18n setup',
    size: 'L',
    priority: 'Backlog',
    completed: false,
  },
  {
    name: 'Backlog: drag-and-drop task reordering',
    size: 'M-L',
    priority: 'Backlog',
    completed: false,
  },
  {
    name: 'Backlog: keyboard nav for treemap cells',
    size: 'M',
    priority: 'Backlog',
    completed: false,
  },
];

// ── XL set (100 tasks) — stress test ────────────────────────────
const xl: SeedTask[] = [
  // ── High priority (15) ──
  { name: 'Fix login redirect bug', size: 'S', priority: 'High', completed: true },
  { name: 'Add email notification system', size: 'S-M', priority: 'High', completed: true },
  { name: 'Build webhook delivery pipeline', size: 'M', priority: 'High', completed: true },
  { name: 'Refactor activity feed queries', size: 'M-L', priority: 'High', completed: false },
  { name: 'Update API rate limiting', size: 'L', priority: 'High', completed: false },
  { name: 'Write PDF export service', size: 'S', priority: 'High', completed: false },
  { name: 'Design Redis caching layer', size: 'S-M', priority: 'High', completed: false },
  { name: 'Test accessibility across modals', size: 'M', priority: 'High', completed: false, rolledOver: true },
  { name: 'Ship billing page redesign', size: 'M-L', priority: 'High', completed: false },
  { name: 'Review analytics data pipeline', size: 'L', priority: 'High', completed: false },
  { name: 'Migrate CSV export to streaming', size: 'S', priority: 'High', completed: true },
  { name: 'Optimize image compression', size: 'S-M', priority: 'High', completed: true },
  { name: 'Debug rich text paste handling', size: 'M', priority: 'High', completed: true },
  { name: 'Implement DB migration tooling', size: 'M-L', priority: 'High', completed: false },
  { name: 'Create keyboard shortcut system', size: 'L', priority: 'High', completed: false },
  // ── Medium priority (30) ──
  { name: 'Set up dashboard widget framework', size: 'S', priority: 'Medium', completed: false },
  { name: 'Document role permission matrix', size: 'S-M', priority: 'Medium', completed: false },
  { name: 'Remove legacy SSO provider', size: 'M', priority: 'Medium', completed: false, rolledOver: true },
  { name: 'Replace pagination with cursor-based', size: 'M-L', priority: 'Medium', completed: false },
  { name: 'Audit color picker contrast ratios', size: 'L', priority: 'Medium', completed: false },
  { name: 'Fix S3 upload timeout handling', size: 'S', priority: 'Medium', completed: true },
  { name: 'Add login rate limiting', size: 'S-M', priority: 'Medium', completed: true },
  { name: 'Build email template previewer', size: 'M', priority: 'Medium', completed: true },
  { name: 'Refactor webhook retry logic', size: 'M-L', priority: 'Medium', completed: false },
  { name: 'Update activity feed real-time sync', size: 'L', priority: 'Medium', completed: false },
  { name: 'Write API versioning strategy', size: 'S', priority: 'Medium', completed: false },
  { name: 'Design PDF template system', size: 'S-M', priority: 'Medium', completed: false },
  { name: 'Test Redis cluster failover', size: 'M', priority: 'Medium', completed: false, rolledOver: true },
  { name: 'Ship accessibility compliance report', size: 'M-L', priority: 'Medium', completed: false },
  { name: 'Review billing invoice generation', size: 'L', priority: 'Medium', completed: false },
  { name: 'Migrate analytics to new warehouse', size: 'S', priority: 'Medium', completed: true },
  { name: 'Optimize data export chunking', size: 'S-M', priority: 'Medium', completed: true },
  { name: 'Debug image upload orientation', size: 'M', priority: 'Medium', completed: true },
  { name: 'Implement rich text mentions', size: 'M-L', priority: 'Medium', completed: false },
  { name: 'Create DB seed script', size: 'L', priority: 'Medium', completed: false },
  { name: 'Set up keyboard shortcut docs', size: 'S', priority: 'Medium', completed: false },
  { name: 'Document dashboard API endpoints', size: 'S-M', priority: 'Medium', completed: false },
  { name: 'Remove deprecated permission scopes', size: 'M', priority: 'Medium', completed: false, rolledOver: true },
  { name: 'Replace SSO token refresh flow', size: 'M-L', priority: 'Medium', completed: false },
  { name: 'Audit pagination performance', size: 'L', priority: 'Medium', completed: false },
  { name: 'Fix CSV encoding for unicode', size: 'S', priority: 'Medium', completed: true },
  { name: 'Add S3 signed URL expiration', size: 'S-M', priority: 'Medium', completed: true },
  { name: 'Build login session manager', size: 'M', priority: 'Medium', completed: true },
  { name: 'Refactor email delivery queue', size: 'M-L', priority: 'Medium', completed: false },
  { name: 'Update webhook security headers', size: 'L', priority: 'Medium', completed: false },
  // ── Low priority (30) ──
  { name: 'Write activity feed unit tests', size: 'S', priority: 'Low', completed: false },
  { name: 'Design API error response format', size: 'S-M', priority: 'Low', completed: false },
  { name: 'Test PDF rendering edge cases', size: 'M', priority: 'Low', completed: false, rolledOver: true },
  { name: 'Ship Redis monitoring dashboard', size: 'M-L', priority: 'Low', completed: false },
  { name: 'Review accessibility screen reader flow', size: 'L', priority: 'Low', completed: false },
  { name: 'Migrate billing Stripe webhooks', size: 'S', priority: 'Low', completed: true },
  { name: 'Optimize analytics query caching', size: 'S-M', priority: 'Low', completed: true },
  { name: 'Debug data export date formatting', size: 'M', priority: 'Low', completed: true },
  { name: 'Implement image lazy loading', size: 'M-L', priority: 'Low', completed: false },
  { name: 'Create rich text toolbar component', size: 'L', priority: 'Low', completed: false },
  { name: 'Set up DB connection pooling', size: 'S', priority: 'Low', completed: false },
  { name: 'Document keyboard shortcut conflicts', size: 'S-M', priority: 'Low', completed: false },
  { name: 'Remove unused dashboard components', size: 'M', priority: 'Low', completed: false, rolledOver: true },
  { name: 'Replace role permission UI', size: 'M-L', priority: 'Low', completed: false },
  { name: 'Audit SSO token storage security', size: 'L', priority: 'Low', completed: false },
  { name: 'Fix session cookie SameSite flag', size: 'S', priority: 'Low', completed: true },
  { name: 'Add CSV column mapping preview', size: 'S-M', priority: 'Low', completed: true },
  { name: 'Build S3 multipart upload progress', size: 'M', priority: 'Low', completed: true },
  { name: 'Refactor login form validation', size: 'M-L', priority: 'Low', completed: false },
  { name: 'Update email unsubscribe flow', size: 'L', priority: 'Low', completed: false },
  { name: 'Write webhook payload docs', size: 'S', priority: 'Low', completed: false },
  { name: 'Design activity feed filters', size: 'S-M', priority: 'Low', completed: false },
  { name: 'Test API rate limit headers', size: 'M', priority: 'Low', completed: false, rolledOver: true },
  { name: 'Ship PDF watermark feature', size: 'M-L', priority: 'Low', completed: false },
  { name: 'Review Redis memory usage', size: 'L', priority: 'Low', completed: false },
  { name: 'Migrate accessibility test suite', size: 'S', priority: 'Low', completed: true },
  { name: 'Optimize billing report generation', size: 'S-M', priority: 'Low', completed: true },
  { name: 'Debug analytics event deduplication', size: 'M', priority: 'Low', completed: true },
  { name: 'Implement data export scheduling', size: 'M-L', priority: 'Low', completed: false },
  { name: 'Create image gallery component', size: 'L', priority: 'Low', completed: false },
  // ── Backlog (25) ──
  { name: 'Set up rich text collaborative editing', size: 'S', priority: 'Backlog', completed: false },
  { name: 'Document DB schema conventions', size: 'S-M', priority: 'Backlog', completed: false },
  { name: 'Explore keyboard-driven navigation', size: 'M', priority: 'Backlog', completed: false, rolledOver: true },
  { name: 'Prototype dashboard drag-and-drop', size: 'M-L', priority: 'Backlog', completed: false },
  { name: 'Evaluate role-based access framework', size: 'L', priority: 'Backlog', completed: false },
  { name: 'Spike: team management redesign', size: 'S', priority: 'Backlog', completed: true },
  { name: 'Research session replay tooling', size: 'S-M', priority: 'Backlog', completed: true },
  { name: 'Benchmark CSV import performance', size: 'M', priority: 'Backlog', completed: true },
  { name: 'Explore S3 to R2 migration', size: 'M-L', priority: 'Backlog', completed: false },
  { name: 'Prototype real-time login alerts', size: 'L', priority: 'Backlog', completed: false },
  { name: 'Spike: email drag builder', size: 'S', priority: 'Backlog', completed: false },
  { name: 'Research webhook observability', size: 'S-M', priority: 'Backlog', completed: false },
  { name: 'Explore activity feed ML ranking', size: 'M', priority: 'Backlog', completed: false, rolledOver: true },
  { name: 'Prototype API GraphQL layer', size: 'M-L', priority: 'Backlog', completed: false },
  { name: 'Evaluate PDF generation libraries', size: 'L', priority: 'Backlog', completed: false },
  { name: 'Spike: Redis pub/sub for live updates', size: 'S', priority: 'Backlog', completed: true },
  { name: 'Research accessibility automation', size: 'S-M', priority: 'Backlog', completed: true },
  { name: 'Benchmark billing calculation engine', size: 'M', priority: 'Backlog', completed: true },
  { name: 'Explore analytics event streaming', size: 'M-L', priority: 'Backlog', completed: false },
  { name: 'Prototype data export templates', size: 'L', priority: 'Backlog', completed: false },
  { name: 'Spike: image AI auto-tagging', size: 'S', priority: 'Backlog', completed: false },
  { name: 'Research rich text block protocol', size: 'S-M', priority: 'Backlog', completed: false },
  { name: 'Explore DB read replicas', size: 'M', priority: 'Backlog', completed: false, rolledOver: true },
  { name: 'Prototype shortcut command palette', size: 'M-L', priority: 'Backlog', completed: false },
  { name: 'Evaluate dashboard charting libraries', size: 'L', priority: 'Backlog', completed: false },
];

export const SEED_SETS = [
  { label: 'Small (4)', tasks: small },
  { label: 'Medium (8)', tasks: medium },
  { label: 'Large (14)', tasks: large },
  { label: 'XL (100)', tasks: xl },
] as const;

export type { SeedTask };
