'use client';

import { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { getModifierKey } from '@/lib/useKeyboardShortcuts';

interface CopyButtonProps {
  text: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export interface CopyButtonRef {
  triggerCopy: () => void;
}

export const CopyButton = forwardRef<CopyButtonRef, CopyButtonProps>(function CopyButton({ text, disabled, size = 'md' }, ref) {
  const [copied, setCopied] = useState(false);
  const [modKey, setModKey] = useState('Ctrl');

  useEffect(() => {
    setModKey(getModifierKey());
  }, []);

  const handleCopy = useCallback(async () => {
    if (!text || disabled) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [text, disabled]);

  // Expose triggerCopy method via ref
  useImperativeHandle(ref, () => ({
    triggerCopy: handleCopy,
  }), [handleCopy]);

  const sizeClasses = size === 'sm'
    ? 'px-2 py-1 text-xs gap-1'
    : 'px-4 py-2 text-sm gap-2';

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <button
      onClick={handleCopy}
      disabled={disabled || !text}
      title={`Copy (${modKey}+Shift+C)`}
      className={`
        inline-flex items-center rounded-lg font-medium
        transition-all duration-200
        ${sizeClasses}
        ${
          copied
            ? 'bg-secondary-500 text-white'
            : disabled || !text
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md'
        }
      `}
    >
      {copied ? (
        <>
          <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {size === 'sm' ? '✓' : 'Copied!'}
        </>
      ) : (
        <>
          <svg className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
});
