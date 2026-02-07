'use client';

import { ReactNode } from 'react';
import { ConvertedDate } from '@/lib/timestamp';

type ConversionMode = 'toDate' | 'toTimestamp';

interface TimestampOutputProps {
  data: ConvertedDate | null;
  mode: ConversionMode;
  error: string | null;
  headerAction?: ReactNode;
}

function OutputRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
      <span className={`text-sm text-foreground break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function getLabel(data: ConvertedDate | null, mode: ConversionMode, error: string | null): string {
  if (error || !data) return 'Output';
  if (mode === 'toDate') return 'Converted Date';
  return 'Unix Timestamp';
}

export function TimestampOutput({ data, mode, error, headerAction }: TimestampOutputProps) {
  const label = getLabel(data, mode, error);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        {headerAction}
      </div>

      {error ? (
        <div className="flex-1 w-full p-4 bg-card border border-border rounded-lg flex items-center justify-center">
          <span className="text-error text-sm">{error}</span>
        </div>
      ) : !data ? (
        <div className="flex-1 w-full p-4 bg-card border border-border rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground text-sm">
            {mode === 'toDate'
              ? 'Enter a Unix timestamp to convert'
              : 'Select a date to convert'}
          </span>
        </div>
      ) : mode === 'toDate' ? (
        <div className="flex-1 w-full bg-card border border-border rounded-lg overflow-auto">
          <div className="p-4 space-y-0">
            <OutputRow label="Date & Time" value={data.formatted} />
            <OutputRow label="Day" value={data.dayOfWeek} />
            <OutputRow label="Relative" value={data.relative} />
            <OutputRow label="ISO 8601" value={data.iso} mono />
            <OutputRow label="RFC 2822" value={data.rfc2822} mono />
            <OutputRow label="Seconds" value={String(data.seconds)} mono />
            <OutputRow label="Milliseconds" value={String(data.milliseconds)} mono />
            <OutputRow label="Timezone" value={data.utcOffset} mono />
            {data.inputWasMs && (
              <div className="pt-2">
                <span className="text-xs text-primary-400">Auto-detected as milliseconds</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full bg-card border border-border rounded-lg overflow-auto">
          <div className="p-4 space-y-0">
            <OutputRow label="Seconds" value={String(data.seconds)} mono />
            <OutputRow label="Milliseconds" value={String(data.milliseconds)} mono />
            <OutputRow label="Date & Time" value={data.formatted} />
            <OutputRow label="ISO 8601" value={data.iso} mono />
            <OutputRow label="RFC 2822" value={data.rfc2822} mono />
            <OutputRow label="Relative" value={data.relative} />
            <OutputRow label="Timezone" value={data.utcOffset} mono />
          </div>
        </div>
      )}
    </div>
  );
}
