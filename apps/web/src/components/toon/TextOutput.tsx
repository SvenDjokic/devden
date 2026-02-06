'use client';

import { CopyButton } from './CopyButton';

interface TextOutputProps {
  value: string;
  label?: string;
  error?: string;
  className?: string;
}

export function TextOutput({ value, label, error, className = '' }: TextOutputProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          {value && !error && (
            <CopyButton text={value} size="sm" />
          )}
        </div>
      )}
      <div
        className={`
          flex-1 w-full min-h-[300px] p-4 font-mono text-sm
          bg-card border rounded-lg overflow-auto
          ${error ? 'border-error/50 bg-error/5' : 'border-border'}
        `}
      >
        {error ? (
          <div className="text-error">{error}</div>
        ) : value ? (
          <pre className="whitespace-pre-wrap break-all">{value}</pre>
        ) : (
          <span className="text-muted-foreground/50 italic">
            Output will appear here...
          </span>
        )}
      </div>
    </div>
  );
}
