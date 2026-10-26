export type TimeFormat = '12h' | '24h';

/** Canonical reminder storage stays HH:MM regardless of display preference. */
export function formatTime(hour: number, minute: number, format: TimeFormat): string {
  const minutes = String(minute).padStart(2, '0');
  return format === '24h'
    ? `${String(hour).padStart(2, '0')}:${minutes}`
    : `${hour % 12 || 12}:${minutes} ${hour < 12 ? 'AM' : 'PM'}`;
}

export function formatStoredTime(time: string, format: TimeFormat): string {
  const [hour, minute] = time.split(':').map(Number);
  return formatTime(hour, minute, format);
}

export function parseTime(value: string, format: TimeFormat): string | null {
  if (format === '24h') {
    const match = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());
    return match && Number(match[1]) < 24 ? `${match[1].padStart(2, '0')}:${match[2]}` : null;
  }
  const match = /^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/i.exec(value.trim());
  if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) return null;
  const hour = (Number(match[1]) % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return `${String(hour).padStart(2, '0')}:${match[2]}`;
}
