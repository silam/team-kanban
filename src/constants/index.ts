import type { ColumnId, Priority, ProjectColor } from '../types';

export const SCHEMA_VERSION = 1;

export const COLUMN_IDS: ColumnId[] = ['todo', 'in-progress', 'done'];

export const COLUMN_LABELS: Record<ColumnId, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export const COLUMN_ACCENT: Record<ColumnId, string> = {
  'todo': 'border-t-slate-400 dark:border-t-slate-500',
  'in-progress': 'border-t-indigo-500',
  'done': 'border-t-emerald-500',
};

export const PRIORITY_META: Record<Priority, { label: string; classes: string }> = {
  low:      { label: 'Low',      classes: 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300' },
  medium:   { label: 'Medium',   classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
  high:     { label: 'High',     classes: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300' },
  critical: { label: 'Critical', classes: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' },
};

export const PROJECT_COLORS: ProjectColor[] = [
  'violet', 'sky', 'emerald', 'amber', 'rose', 'indigo', 'teal', 'pink',
];

export const PROJECT_COLOR_CLASSES: Record<ProjectColor, { dot: string; text: string; bg: string; ring: string }> = {
  violet: { dot: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10', ring: 'ring-violet-500/30' },
  sky:    { dot: 'bg-sky-500',    text: 'text-sky-600 dark:text-sky-400',       bg: 'bg-sky-500/10',    ring: 'ring-sky-500/30' },
  emerald:{ dot: 'bg-emerald-500',text: 'text-emerald-600 dark:text-emerald-400',bg: 'bg-emerald-500/10',ring: 'ring-emerald-500/30' },
  amber:  { dot: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-500/10',  ring: 'ring-amber-500/30' },
  rose:   { dot: 'bg-rose-500',   text: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-500/10',   ring: 'ring-rose-500/30' },
  indigo: { dot: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', ring: 'ring-indigo-500/30' },
  teal:   { dot: 'bg-teal-500',   text: 'text-teal-600 dark:text-teal-400',     bg: 'bg-teal-500/10',   ring: 'ring-teal-500/30' },
  pink:   { dot: 'bg-pink-500',   text: 'text-pink-600 dark:text-pink-400',     bg: 'bg-pink-500/10',   ring: 'ring-pink-500/30' },
};

export const AVATAR_PALETTE = [
  '#7C3AED', '#2563EB', '#059669', '#D97706',
  '#DC2626', '#0891B2', '#BE185D', '#EA580C',
];
