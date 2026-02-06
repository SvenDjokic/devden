'use client';

import { RegexFlags } from '@/lib/useRegex';

interface FlagsToggleProps {
  flags: RegexFlags;
  onChange: (flags: RegexFlags) => void;
}

interface FlagOption {
  key: keyof RegexFlags;
  label: string;
  shortLabel: string;
  description: string;
}

const FLAG_OPTIONS: FlagOption[] = [
  { key: 'global', label: 'Global', shortLabel: 'g', description: 'Match all occurrences' },
  { key: 'ignoreCase', label: 'Case Insensitive', shortLabel: 'i', description: 'Ignore case' },
  { key: 'multiline', label: 'Multiline', shortLabel: 'm', description: '^ and $ match line boundaries' },
  { key: 'dotAll', label: 'Dot All', shortLabel: 's', description: '. matches newlines' },
  { key: 'unicode', label: 'Unicode', shortLabel: 'u', description: 'Unicode support' },
  { key: 'sticky', label: 'Sticky', shortLabel: 'y', description: 'Sticky matching' },
];

export function FlagsToggle({ flags, onChange }: FlagsToggleProps) {
  const handleToggle = (key: keyof RegexFlags) => {
    onChange({
      ...flags,
      [key]: !flags[key],
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FLAG_OPTIONS.map((option) => (
        <button
          key={option.key}
          onClick={() => handleToggle(option.key)}
          title={`${option.label}: ${option.description}`}
          aria-pressed={flags[option.key]}
          aria-label={`${option.label} flag: ${option.description}`}
          className={`
            px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200
            flex items-center gap-1.5
            ${
              flags[option.key]
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-muted/50 text-muted-foreground border border-border hover:border-border/80 hover:bg-muted'
            }
          `}
        >
          <code className="font-mono">{option.shortLabel}</code>
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
