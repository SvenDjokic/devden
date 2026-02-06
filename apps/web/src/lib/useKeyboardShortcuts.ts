'use client';

import { useEffect, useCallback } from 'react';

export interface ShortcutConfig {
  key: string;
  shift?: boolean;
  handler: () => void;
  description: string;
  enabled?: boolean;
}

interface UseKeyboardShortcutsProps {
  shortcuts: ShortcutConfig[];
  enabled?: boolean;
}

export function getModifierKey(): string {
  if (typeof navigator === 'undefined') return 'Ctrl';
  return navigator.platform?.toLowerCase().includes('mac') ? '⌘' : 'Ctrl';
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsProps): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Still allow shortcuts with Cmd/Ctrl modifier
        if (!event.metaKey && !event.ctrlKey) {
          return;
        }
      }

      const isMac = navigator.platform?.toLowerCase().includes('mac');
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;

      if (!modifierPressed) return;

      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (keyMatches && shiftMatches) {
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
