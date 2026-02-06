'use client';

import { useCallback, useEffect, useState } from 'react';
import { getModifierKey } from '@/lib/useKeyboardShortcuts';

export type IndentOption = '2' | '4' | 'tab';

interface ToolbarOptionsProps {
  indent: IndentOption;
  onIndentChange: (indent: IndentOption) => void;
  onMinify: () => void;
  disabled?: boolean;
}

export function ToolbarOptions({
  indent,
  onIndentChange,
  onMinify,
  disabled = false,
}: ToolbarOptionsProps) {
  const [modKey, setModKey] = useState('Ctrl');

  useEffect(() => {
    setModKey(getModifierKey());
  }, []);

  const handleIndentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onIndentChange(e.target.value as IndentOption);
    },
    [onIndentChange]
  );

  return (
    <div className="flex items-center gap-3">
      {/* Indent selector */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="indent-select"
          className="text-sm text-muted-foreground hidden sm:inline"
        >
          Indent:
        </label>
        <select
          id="indent-select"
          aria-label="Indentation style"
          value={indent}
          onChange={handleIndentChange}
          disabled={disabled}
          className="text-sm bg-card border border-border rounded px-2 py-1 text-foreground transition-colors hover:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="tab">Tabs</option>
        </select>
      </div>

      {/* Minify button */}
      <button
        onClick={onMinify}
        disabled={disabled}
        title={`Minify (${modKey}+Shift+M)`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Minify
      </button>
    </div>
  );
}
