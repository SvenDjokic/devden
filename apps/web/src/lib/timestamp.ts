/**
 * Unix Timestamp conversion utilities
 * All conversions use native browser APIs (Date, Intl)
 */

export interface ConvertedDate {
  /** Full formatted date string */
  formatted: string;
  /** ISO 8601 format */
  iso: string;
  /** RFC 2822 format */
  rfc2822: string;
  /** Day of the week */
  dayOfWeek: string;
  /** Relative time (e.g. "3 hours ago") */
  relative: string;
  /** Timestamp in seconds */
  seconds: number;
  /** Timestamp in milliseconds */
  milliseconds: number;
  /** UTC offset string (e.g. "UTC+05:30") */
  utcOffset: string;
  /** Whether the input was detected as milliseconds */
  inputWasMs: boolean;
}

export interface TimestampResult {
  success: boolean;
  output: ConvertedDate | null;
  error?: string;
}

/**
 * Detect whether a numeric input is seconds or milliseconds.
 * Heuristic: values > 9999999999 are treated as milliseconds.
 */
export function detectTimestampUnit(value: number): 'seconds' | 'milliseconds' {
  const abs = Math.abs(value);
  if (abs > 9999999999) {
    return 'milliseconds';
  }
  return 'seconds';
}

/**
 * Convert a Unix timestamp to a human-readable date
 */
export function timestampToDate(
  input: string,
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): TimestampResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { success: true, output: null };
  }

  const num = Number(trimmed);

  if (isNaN(num) || !isFinite(num)) {
    return {
      success: false,
      output: null,
      error: 'Invalid timestamp. Enter a numeric Unix timestamp.',
    };
  }

  const unit = detectTimestampUnit(num);
  const ms = unit === 'milliseconds' ? num : num * 1000;

  const date = new Date(ms);

  if (isNaN(date.getTime())) {
    return {
      success: false,
      output: null,
      error: 'Timestamp out of range.',
    };
  }

  return {
    success: true,
    output: formatDate(date, timezone, unit === 'milliseconds'),
  };
}

/**
 * Convert a date + time to a Unix timestamp
 */
export function dateToTimestamp(
  dateStr: string,
  timeStr: string = '00:00:00',
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): TimestampResult {
  if (!dateStr.trim()) {
    return { success: true, output: null };
  }

  try {
    const combined = `${dateStr}T${timeStr}`;
    const date = new Date(combined);

    if (isNaN(date.getTime())) {
      return {
        success: false,
        output: null,
        error: 'Invalid date. Use YYYY-MM-DD format.',
      };
    }

    // Adjust for the target timezone
    const targetOffset = getTimezoneOffsetMs(date, timezone);
    const localOffset = date.getTimezoneOffset() * 60 * 1000;
    const adjustedDate = new Date(date.getTime() + localOffset + targetOffset);

    return {
      success: true,
      output: formatDate(adjustedDate, timezone, false),
    };
  } catch {
    return {
      success: false,
      output: null,
      error: 'Failed to parse date.',
    };
  }
}

/**
 * Format a Date object into a ConvertedDate
 */
function formatDate(
  date: Date,
  timezone: string,
  inputWasMs: boolean
): ConvertedDate {
  const seconds = Math.floor(date.getTime() / 1000);
  const milliseconds = date.getTime();

  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short',
  }).format(date);

  const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: timezone,
  }).format(date);

  const iso = date.toISOString();
  const rfc2822 = date.toUTCString();
  const utcOffset = getUtcOffsetString(date, timezone);
  const relative = getRelativeTime(date);

  return {
    formatted,
    iso,
    rfc2822,
    dayOfWeek,
    relative,
    seconds,
    milliseconds,
    utcOffset,
    inputWasMs,
  };
}

/**
 * Get UTC offset string for a timezone (e.g. "UTC+05:30")
 */
function getUtcOffsetString(date: Date, timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');

    if (tzPart) {
      const match = tzPart.value.match(/GMT([+-]\d{2}:\d{2})/);
      if (match) return `UTC${match[1]}`;
      if (tzPart.value === 'GMT') return 'UTC+00:00';
    }
  } catch {
    // fallback
  }
  return 'UTC';
}

/**
 * Get timezone offset in milliseconds for a given date and timezone
 */
function getTimezoneOffsetMs(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

  const tzDate = new Date(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') === 24 ? 0 : get('hour'),
    get('minute'),
    get('second')
  );

  return -(tzDate.getTime() - date.getTime());
}

/**
 * Get relative time string (e.g. "3 hours ago", "in 2 days")
 */
export function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = date.getTime() - now;
  const absDiff = Math.abs(diff);
  const isPast = diff < 0;

  const secs = Math.floor(absDiff / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let value: string;

  if (secs < 5) {
    return 'just now';
  } else if (secs < 60) {
    value = `${secs} second${secs !== 1 ? 's' : ''}`;
  } else if (mins < 60) {
    value = `${mins} minute${mins !== 1 ? 's' : ''}`;
  } else if (hrs < 24) {
    value = `${hrs} hour${hrs !== 1 ? 's' : ''}`;
  } else if (days < 30) {
    value = `${days} day${days !== 1 ? 's' : ''}`;
  } else if (months < 12) {
    value = `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    value = `${years} year${years !== 1 ? 's' : ''}`;
  }

  return isPast ? `${value} ago` : `in ${value}`;
}

/**
 * Get current Unix timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export interface TimestampPreset {
  label: string;
  timestamp: number;
}

/**
 * Get common timestamp presets relative to now
 */
export function getTimestampPresets(): TimestampPreset[] {
  const now = new Date();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return [
    { label: 'Start of today', timestamp: Math.floor(startOfDay.getTime() / 1000) },
    { label: 'Start of week', timestamp: Math.floor(startOfWeek.getTime() / 1000) },
    { label: 'Start of month', timestamp: Math.floor(startOfMonth.getTime() / 1000) },
    { label: 'Start of year', timestamp: Math.floor(startOfYear.getTime() / 1000) },
  ];
}
