import type { IOEvent } from '@glandjs/events';

// Timer

export type TimerBlock = {
  id: string;
  label: string;
  projectId: string | null;
  startedAt: string;  // ISO
  stoppedAt?: string;
  duration?: number;  // seconds
  note?: string;
  status: 'running' | 'paused' | 'stopped' | 'cancelled';
};

export type TimerStatus = {
  active: boolean;
  block?: TimerBlock;
  elapsed?: number; // seconds
};

// Log

export type LogEntry = {
  id: string;
  label: string;
  projectId: string | null;
  date: string;       // YYYY-MM-DD
  duration: number;   // seconds
  note?: string;
  source: 'timer' | 'manual';
  createdAt: string;
};

// Report

export type ReportRow = {
  date: string;
  label: string;
  project: string | null;
  duration: number;
  note: string | null;
};

export type Report = {
  period: 'daily' | 'weekly' | 'monthly';
  from: string;
  to: string;
  totalSeconds: number;
  rows: ReportRow[];
};

// Project

export type Project = {
  id: string;
  name: string;
  goalHours: number | null;
  priority: 'low' | 'medium' | 'high' | null;
  createdAt: string;
};

export type ProjectProgress = {
  project: Project;
  loggedSeconds: number;
  percentComplete: number | null;
};

// Goal

export type Goal = {
  id: string;
  label: string;
  period: 'weekly' | 'monthly';
  targetHours: number;
  deadline: string | null;
  createdAt: string;
};

export type GoalProgress = {
  goal: Goal;
  loggedSeconds: number;
  percentComplete: number;
};

// Checklist

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
  listName: string;
  date: string;
};

// Metrics

export type Metrics = {
  pi: number;   // Productivity Index  (0-100)
  dr: number;   // Daily Rate          (hours logged today)
  cs: number;   // Consistency Score   (0-100, 14-day streak)
};

export type TrendEntry = {
  date: string;
  hours: number;
  spark: string;  // single char for sparkline
};

// Config

export type ConfigMap = Record<string, string | number | boolean>;

// Export
export type ExportResult = {
  format: 'md' | 'json' | 'csv';
  content: string;
  filename: string;
};

export type TrkEvents = {
  // Timer lifecycle
  'timer:start':   IOEvent<{ label: string; project?: string }, TimerBlock>;
  'timer:stop':    IOEvent<void, TimerBlock | null>;
  'timer:pause':   IOEvent<void, TimerBlock | null>;
  'timer:resume':  IOEvent<void, TimerBlock | null>;
  'timer:cancel':  IOEvent<void, boolean>;
  'timer:status':  IOEvent<void, TimerStatus>;

  // Manual log
  'log:add':    IOEvent<{ label: string; hours: number; note?: string; date?: string }, LogEntry>;
  'log:list':   IOEvent<{ date?: string }, LogEntry[]>;

  // Reports
  'report:daily':   IOEvent<{ date?: string }, Report>;
  'report:weekly':  IOEvent<{ date?: string }, Report>;
  'report:monthly': IOEvent<{ date?: string }, Report>;

  // Projects
  'project:add':      IOEvent<{ name: string; goalHours?: number; priority?: string }, Project>;
  'project:list':     IOEvent<void, Project[]>;
  'project:progress': IOEvent<{ name: string }, ProjectProgress>;

  // Goals
  'goal:set:weekly':  IOEvent<{ label: string; hours: number; deadline?: string }, Goal>;
  'goal:set:monthly': IOEvent<{ label: string; hours: number; deadline?: string }, Goal>;
  'goal:list':        IOEvent<void, Goal[]>;
  'goal:progress':    IOEvent<void, GoalProgress[]>;

  // Checklists
  'checklist:daily':   IOEvent<void, ChecklistItem[]>;
  'checklist:weekly':  IOEvent<void, ChecklistItem[]>;
  'checklist:monthly': IOEvent<void, ChecklistItem[]>;
  'checklist:custom':  IOEvent<{ name: string }, ChecklistItem[]>;
  'checklist:toggle':  IOEvent<{ id: string }, ChecklistItem>;

  // Metrics & Trends
  'metrics:get': IOEvent<void, Metrics>;
  'trends:get':  IOEvent<void, TrendEntry[]>;

  // Export
  'export:run': IOEvent<{ format: 'md' | 'json' | 'csv'; from?: string; to?: string }, ExportResult>;

  // Config
  'config:set':  IOEvent<{ key: string; value: string | number }, void>;
  'config:list': IOEvent<void, ConfigMap>;

  // Internal bus signals
  'db:ready':      IOEvent<void, void>;
  'app:shutdown':  IOEvent<void, void>;
};