import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(duration);
dayjs.extend(weekOfYear);

export const uid = () => randomUUID();

export const now = () => dayjs().toISOString();

export const today = () => dayjs().format('YYYY-MM-DD');

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function hoursToSeconds(hours: number): number {
  return Math.round(hours * 3600);
}

export function secondsToHours(seconds: number): number {
  return +(seconds / 3600).toFixed(2);
}

export function weekRange(date?: string): { from: string; to: string } {
  const d = date ? dayjs(date) : dayjs();
  const from = d.startOf('week').add(1, 'day'); // Monday
  const to = d.endOf('week').add(1, 'day');
  return {
    from: from.format('YYYY-MM-DD'),
    to: to.format('YYYY-MM-DD'),
  };
}

export function monthRange(date?: string): { from: string; to: string } {
  const d = date ? dayjs(date) : dayjs();
  return {
    from: d.startOf('month').format('YYYY-MM-DD'),
    to: d.endOf('month').format('YYYY-MM-DD'),
  };
}

export function sparkChar(value: number, max: number): string {
  const chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  if (max === 0) return chars[0]!;
  const idx = Math.round((value / max) * (chars.length - 1));
  return chars[Math.min(idx, chars.length - 1)]!;
}

export { dayjs };