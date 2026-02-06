/**
 * Convert Unix timestamp to date object and formatted strings
 */
export function timestampToDate(
  timestamp: number,
  timezone: string = "UTC"
): {
  date: Date;
  iso: string;
  local: string;
  utc: string;
  relative: string;
} {
  // Handle both seconds and milliseconds
  const ms = timestamp > 9999999999 ? timestamp : timestamp * 1000;
  const date = new Date(ms);

  return {
    date,
    iso: date.toISOString(),
    local: date.toLocaleString("en-US", { timeZone: timezone }),
    utc: date.toUTCString(),
    relative: getRelativeTime(date),
  };
}

/**
 * Convert a date string to Unix timestamp
 */
export function dateToTimestamp(
  dateStr: string,
  format: "seconds" | "milliseconds" = "seconds"
): number {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return format === "milliseconds" ? date.getTime() : Math.floor(date.getTime() / 1000);
}

/**
 * Get current Unix timestamp
 */
export function getCurrentTimestamp(
  format: "seconds" | "milliseconds" = "seconds"
): number {
  const now = Date.now();
  return format === "milliseconds" ? now : Math.floor(now / 1000);
}

/**
 * Get common timestamp presets
 */
export function getTimestampPresets(): Array<{ label: string; value: number }> {
  const now = Date.now();
  return [
    { label: "Now", value: Math.floor(now / 1000) },
    { label: "1 hour ago", value: Math.floor((now - 3600000) / 1000) },
    { label: "24 hours ago", value: Math.floor((now - 86400000) / 1000) },
    { label: "1 week ago", value: Math.floor((now - 604800000) / 1000) },
    { label: "1 month ago", value: Math.floor((now - 2592000000) / 1000) },
    { label: "1 year ago", value: Math.floor((now - 31536000000) / 1000) },
    { label: "Unix Epoch", value: 0 },
    { label: "Y2K", value: 946684800 },
  ];
}

/**
 * Get relative time string (e.g., "5 minutes ago")
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMs < 0) {
    // Future date
    const absDiffSec = Math.abs(diffSec);
    const absDiffMin = Math.abs(diffMin);
    const absDiffHour = Math.abs(diffHour);
    const absDiffDay = Math.abs(diffDay);

    if (absDiffSec < 60) return `in ${absDiffSec} seconds`;
    if (absDiffMin < 60) return `in ${absDiffMin} minutes`;
    if (absDiffHour < 24) return `in ${absDiffHour} hours`;
    return `in ${absDiffDay} days`;
  }

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour < 24) return `${diffHour} hours ago`;
  return `${diffDay} days ago`;
}
