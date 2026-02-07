'use client';

import { useMemo, useState, useRef, useEffect } from 'react';

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
}

/** Common timezones to show at the top */
const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
];

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTimezones = useMemo(() => {
    try {
      return Intl.supportedValuesOf('timeZone');
    } catch {
      // Fallback for older browsers
      return COMMON_TIMEZONES;
    }
  }, []);

  const filteredTimezones = useMemo(() => {
    if (!search.trim()) {
      // Show common first, then all
      const rest = allTimezones.filter((tz) => !COMMON_TIMEZONES.includes(tz));
      return [...COMMON_TIMEZONES, '---', ...rest];
    }
    const q = search.toLowerCase();
    return allTimezones.filter((tz) => tz.toLowerCase().includes(q));
  }, [search, allTimezones]);

  // Get UTC offset for display
  const getOffset = (tz: string): string => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'longOffset',
      });
      const parts = formatter.formatToParts(new Date());
      const tzPart = parts.find((p) => p.type === 'timeZoneName');
      if (tzPart) {
        const match = tzPart.value.match(/GMT([+-]\d{2}:\d{2})/);
        if (match) return match[1];
        if (tzPart.value === 'GMT') return '+00:00';
      }
    } catch {
      // ignore
    }
    return '';
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const displayValue = value || 'Select timezone...';
  const offset = value ? getOffset(value) : '';

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm hover:border-primary-500/50 transition-colors w-full sm:w-auto"
      >
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
        <span className="text-foreground">{displayValue.replace(/_/g, ' ')}</span>
        {offset && (
          <span className="text-muted-foreground text-xs">({offset})</span>
        )}
        <svg
          className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-80 max-h-72 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search timezones..."
              className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-muted-foreground"
            />
          </div>
          <div className="overflow-y-auto max-h-56">
            {filteredTimezones.map((tz, i) => {
              if (tz === '---') {
                return (
                  <div key={`sep-${i}`} className="border-t border-border my-1" />
                );
              }
              const tzOffset = getOffset(tz);
              return (
                <button
                  key={tz}
                  onClick={() => {
                    onChange(tz);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors ${
                    tz === value ? 'bg-primary-500/10 text-primary-400' : 'text-foreground'
                  }`}
                >
                  <span>{tz.replace(/_/g, ' ')}</span>
                  {tzOffset && (
                    <span className="text-xs text-muted-foreground">{tzOffset}</span>
                  )}
                </button>
              );
            })}
            {filteredTimezones.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                No timezones found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
