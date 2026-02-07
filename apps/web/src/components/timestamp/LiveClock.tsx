'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentTimestamp } from '@/lib/timestamp';

interface LiveClockProps {
  timezone: string;
}

export function LiveClock({ timezone }: LiveClockProps) {
  const [now, setNow] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNow(getCurrentTimestamp());
    const interval = setInterval(() => {
      setNow(getCurrentTimestamp());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = useCallback(async () => {
    if (now === null) return;
    try {
      await navigator.clipboard.writeText(String(now));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [now]);

  if (now === null) {
    return (
      <div className="mb-6 p-4 bg-card border border-border rounded-lg">
        <div className="h-12 animate-pulse bg-muted rounded" />
      </div>
    );
  }

  const formattedTime = timezone
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timezone,
        timeZoneName: 'short',
      }).format(new Date(now * 1000))
    : '';

  return (
    <div className="mb-6 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Current Unix Timestamp</div>
          <div className="font-mono text-2xl font-semibold text-foreground tabular-nums">
            {now}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {formattedTime && (
            <div className="text-sm text-muted-foreground tabular-nums">
              {formattedTime}
            </div>
          )}
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all duration-200 ${
              copied
                ? 'bg-secondary-500 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
