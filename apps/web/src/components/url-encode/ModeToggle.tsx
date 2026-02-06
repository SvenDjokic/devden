'use client';

export type Mode = 'auto' | 'encode' | 'decode';

interface ModeToggleProps {
  mode: Mode;
  detectedMode?: 'encode' | 'decode';
  onChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, detectedMode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Mode:</span>
      <div className="flex items-center gap-1 bg-card border border-border rounded-md p-0.5">
        <button
          onClick={() => onChange('auto')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            mode === 'auto'
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Auto
          {mode === 'auto' && detectedMode && (
            <span className="ml-1 text-muted-foreground">
              ({detectedMode === 'decode' ? 'Decode' : 'Encode'})
            </span>
          )}
        </button>
        <button
          onClick={() => onChange('encode')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            mode === 'encode'
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => onChange('decode')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            mode === 'decode'
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Decode
        </button>
      </div>
    </div>
  );
}
