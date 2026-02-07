'use client';

type ConversionMode = 'toDate' | 'toTimestamp';

interface ModeToggleProps {
  mode: ConversionMode;
  onChange: (mode: ConversionMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-1 bg-card border border-border rounded-md p-0.5">
        <button
          onClick={() => onChange('toDate')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            mode === 'toDate'
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Timestamp &rarr; Date
        </button>
        <button
          onClick={() => onChange('toTimestamp')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            mode === 'toTimestamp'
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Date &rarr; Timestamp
        </button>
      </div>
    </div>
  );
}
