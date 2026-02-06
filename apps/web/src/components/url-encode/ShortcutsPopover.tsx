'use client';

import { useState, useEffect, useRef } from 'react';
import { ShortcutConfig, getModifierKey } from '@/lib/useKeyboardShortcuts';

interface ShortcutsPopoverProps {
  shortcuts: ShortcutConfig[];
}

export function ShortcutsPopover({ shortcuts }: ShortcutsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modKey, setModKey] = useState('Ctrl');
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get platform-specific modifier key on mount
  useEffect(() => {
    setModKey(getModifierKey());
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  function formatShortcut(shortcut: ShortcutConfig): string {
    const parts = [modKey];
    if (shortcut.shift) parts.push('Shift');
    parts.push(shortcut.key.toUpperCase());
    return parts.join('+');
  }

  return (
    <div className="relative hidden sm:block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <line x1="6" y1="10" x2="6" y2="10" strokeLinecap="round" />
          <line x1="10" y1="10" x2="10" y2="10" strokeLinecap="round" />
          <line x1="14" y1="10" x2="14" y2="10" strokeLinecap="round" />
          <line x1="18" y1="10" x2="18" y2="10" strokeLinecap="round" />
          <line x1="8" y1="14" x2="16" y2="14" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50"
        >
          <div className="p-3 border-b border-border">
            <h3 className="font-medium text-sm text-foreground">Keyboard Shortcuts</h3>
          </div>
          <div className="p-2">
            {shortcuts
              .filter((s) => s.enabled !== false)
              .map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-2 py-2 rounded hover:bg-muted transition-colors"
                >
                  <span className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border text-foreground">
                    {formatShortcut(shortcut)}
                  </kbd>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
