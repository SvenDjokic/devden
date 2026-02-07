// Shared utilities

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

/**
 * Returns the modifier key symbol for the current platform
 * @returns "⌘" for Mac, "Ctrl" for Windows/Linux
 */
export function getModifierKey(): string {
  if (typeof navigator === 'undefined') return 'Ctrl';
  return navigator.platform?.toLowerCase().includes('mac') ? '⌘' : 'Ctrl';
}

/**
 * Checks if the current platform is Mac
 */
export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.platform?.toLowerCase().includes('mac') ?? false;
}
