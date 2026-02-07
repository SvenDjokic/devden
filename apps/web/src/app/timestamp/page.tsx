'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from '@/components/timestamp/Header';
import { CopyButton, CopyButtonRef } from '@/components/timestamp/CopyButton';
import { ShortcutsPopover } from '@/components/timestamp/ShortcutsPopover';
import { ModeToggle } from '@/components/timestamp/ModeToggle';
import { TimestampOutput } from '@/components/timestamp/TimestampOutput';
import { LiveClock } from '@/components/timestamp/LiveClock';
import { TimezoneSelector } from '@/components/timestamp/TimezoneSelector';
import { timestampToDate, dateToTimestamp, getCurrentTimestamp, getTimestampPresets } from '@/lib/timestamp';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useKeyboardShortcuts, ShortcutConfig } from '@/lib/useKeyboardShortcuts';
import { TimestampSchema } from '@/components/timestamp/TimestampSchema';
import { CollapsibleSection, CodeExamples, FeatureList } from '@/components/timestamp/seo';

type ConversionMode = 'toDate' | 'toTimestamp';

const INPUT_STORAGE_KEY = 'devden-timestamp-input';
const MODE_STORAGE_KEY = 'devden-timestamp-mode';
const TZ_STORAGE_KEY = 'devden-timestamp-tz';

export default function TimestampPage() {
  // Timestamp → Date inputs
  const [timestampInput, setTimestampInput] = useState('');
  // Date → Timestamp inputs
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('00:00:00');

  const [mode, setMode] = useState<ConversionMode>('toDate');
  const [timezone, setTimezone] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const copyButtonRef = useRef<CopyButtonRef>(null);

  // Persist state
  const { value: savedInput, setValue: saveInput } = useLocalStorage<string>(INPUT_STORAGE_KEY, '');
  const { value: savedMode, setValue: saveMode } = useLocalStorage<ConversionMode>(MODE_STORAGE_KEY, 'toDate');
  const { value: savedTz, setValue: saveTz } = useLocalStorage<string>(TZ_STORAGE_KEY, '');

  // Hydrate from localStorage
  useEffect(() => {
    if (!isHydrated) {
      if (savedMode) setMode(savedMode);
      if (savedInput) setTimestampInput(savedInput);
      if (savedTz) {
        setTimezone(savedTz);
      } else {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      }
      setIsHydrated(true);
    }
  }, [savedInput, savedMode, savedTz, isHydrated]);

  // Persist on change
  useEffect(() => {
    if (isHydrated) saveInput(timestampInput);
  }, [timestampInput, isHydrated, saveInput]);

  const handleModeChange = useCallback((newMode: ConversionMode) => {
    setMode(newMode);
    saveMode(newMode);
  }, [saveMode]);

  const handleTimezoneChange = useCallback((tz: string) => {
    setTimezone(tz);
    saveTz(tz);
  }, [saveTz]);

  // Compute conversion result
  const result = useMemo(() => {
    if (!isHydrated) return { output: '', error: null, data: null };

    if (mode === 'toDate') {
      const res = timestampToDate(timestampInput, timezone);
      return {
        output: res.output?.formatted ?? '',
        error: res.success ? null : (res.error ?? null),
        data: res.output,
      };
    } else {
      const res = dateToTimestamp(dateInput, timeInput, timezone);
      return {
        output: res.output ? String(res.output.seconds) : '',
        error: res.success ? null : (res.error ?? null),
        data: res.output,
      };
    }
  }, [mode, timestampInput, dateInput, timeInput, timezone, isHydrated]);

  const handleClear = useCallback(() => {
    setTimestampInput('');
    setDateInput('');
    setTimeInput('00:00:00');
  }, []);

  const handlePasteCurrentTimestamp = useCallback(() => {
    setTimestampInput(String(getCurrentTimestamp()));
  }, []);

  // Keyboard shortcuts
  const shortcuts: ShortcutConfig[] = useMemo(
    () => [
      {
        key: 'c',
        shift: true,
        handler: () => copyButtonRef.current?.triggerCopy(),
        description: 'Copy output',
      },
      {
        key: 'k',
        shift: false,
        handler: handleClear,
        description: 'Clear input',
      },
      {
        key: '1',
        shift: false,
        handler: () => handleModeChange('toDate'),
        description: 'Timestamp to Date',
      },
      {
        key: '2',
        shift: false,
        handler: () => handleModeChange('toTimestamp'),
        description: 'Date to Timestamp',
      },
    ],
    [handleClear, handleModeChange]
  );

  useKeyboardShortcuts({ shortcuts, enabled: isHydrated });

  // Copyable output text
  const copyText = useMemo(() => {
    if (!result.data) return '';
    if (mode === 'toDate') {
      return result.data.formatted;
    }
    return String(result.data.seconds);
  }, [result.data, mode]);

  return (
    <>
      <TimestampSchema />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">

            {/* Live Clock */}
            <LiveClock timezone={timezone} />

            {/* Action bar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <ModeToggle mode={mode} onChange={handleModeChange} />
                {(timestampInput.trim() || dateInput.trim()) && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden lg:block">
                  <CopyButton ref={copyButtonRef} text={copyText} disabled={!copyText || !!result.error} />
                </div>
                <ShortcutsPopover shortcuts={shortcuts} />
              </div>
            </div>

            {/* Timezone selector */}
            <div className="mb-4">
              <TimezoneSelector value={timezone} onChange={handleTimezoneChange} />
            </div>

            {/* Error panel */}
            {result.error && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error">{result.error}</p>
              </div>
            )}

            {/* Main content area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
              {/* Input panel */}
              <div className="min-h-[300px] lg:min-h-[400px] flex flex-col">
                <label className="text-sm font-medium text-muted-foreground mb-2">
                  {mode === 'toDate' ? 'Unix Timestamp' : 'Date & Time'}
                </label>

                {mode === 'toDate' ? (
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={timestampInput}
                      onChange={(e) => setTimestampInput(e.target.value)}
                      placeholder="Enter Unix timestamp...\n\nExamples:\n1700000000 (seconds)\n1700000000000 (milliseconds)"
                      className="code flex-1 w-full p-4 bg-card border border-border rounded-lg resize-none transition-all duration-200 hover:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-muted-foreground"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                      <input
                        type="date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className="w-full p-3 bg-card border border-border rounded-lg text-foreground transition-all duration-200 hover:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Time</label>
                      <input
                        type="time"
                        step="1"
                        value={timeInput}
                        onChange={(e) => setTimeInput(e.target.value)}
                        className="w-full p-3 bg-card border border-border rounded-lg text-foreground transition-all duration-200 hover:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent [color-scheme:dark]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Output panel */}
              <div className="min-h-[300px] lg:min-h-[400px] flex flex-col">
                <TimestampOutput
                  data={result.data}
                  mode={mode}
                  error={result.error}
                  headerAction={
                    <div className="lg:hidden">
                      <CopyButton text={copyText} disabled={!copyText || !!result.error} />
                    </div>
                  }
                />
              </div>
            </div>

            {/* Quick-action links - below the grid */}
            {mode === 'toDate' && (
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <button
                  onClick={handlePasteCurrentTimestamp}
                  className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Use current timestamp
                </button>
                <span className="text-xs text-muted-foreground/40">|</span>
                {getTimestampPresets().map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTimestampInput(String(preset.timestamp))}
                    className="text-xs text-muted-foreground hover:text-primary-400 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Status bar */}
            <div className="mt-4 text-xs text-muted-foreground">
              {result.data && !result.error && (
                <span className="text-secondary-500">
                  Converted successfully
                  {result.data.inputWasMs && mode === 'toDate' && (
                    <span className="text-muted-foreground ml-2">(detected as milliseconds)</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </main>

        {/* SEO Content Section - Outside main so boxes can expand */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-t border-border/50">
          <div className="max-w-3xl opacity-80">
            {/* Always visible intro */}
            <div className="mb-6">
              <h2 className="text-base font-semibold text-muted-foreground mb-3">
                Unix Timestamp Converter Online
              </h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Convert Unix timestamps (epoch time) to human-readable dates and back instantly.
                Supports both seconds and milliseconds with automatic detection, timezone-aware
                conversion, and a live clock. All processing happens in your browser.
              </p>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-0">
              <CollapsibleSection title="What is a Unix Timestamp?">
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  A Unix timestamp (also called epoch time or POSIX time) is the number of seconds
                  that have elapsed since January 1, 1970, 00:00:00 UTC. It is widely used in programming,
                  databases, APIs, and server logs as a compact, timezone-independent way to represent a
                  point in time. Timestamps in milliseconds (13 digits) are common in JavaScript, Java,
                  and many web APIs.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Common Use Cases">
                <ul className="text-sm text-muted-foreground/80 space-y-2">
                  <li><strong>API Development</strong> — Timestamps in API responses and requests for created_at, updated_at, and expiration fields.</li>
                  <li><strong>Database Operations</strong> — Storing dates as integers for efficient indexing and querying across timezones.</li>
                  <li><strong>Log Analysis</strong> — Server logs, application logs, and monitoring systems use Unix timestamps for precise timing.</li>
                  <li><strong>Caching & Expiration</strong> — TTL (time-to-live) values, JWT expiration, and cache invalidation timestamps.</li>
                  <li><strong>Scheduling & Cron Jobs</strong> — Task schedulers and cron expressions often work with Unix timestamps.</li>
                  <li><strong>Event Tracking</strong> — Analytics, user activity logs, and audit trails with timezone-independent timestamps.</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Code Examples">
                <p className="text-sm text-muted-foreground/80 mb-4">
                  Working with timestamps in your code? Here&apos;s how to get and convert them in popular languages:
                </p>
                <CodeExamples
                  storageKey="devden-timestamp-code-lang"
                  examples={[
                    {
                      language: 'javascript',
                      label: 'JavaScript',
                      code: `// Get current timestamp (milliseconds)
const now = Date.now();
// Result: 1700000000000

// Get current timestamp (seconds)
const nowSeconds = Math.floor(Date.now() / 1000);
// Result: 1700000000

// Timestamp to Date object
const date = new Date(1700000000 * 1000);

// Date to formatted string
date.toISOString();     // "2023-11-14T22:13:20.000Z"
date.toLocaleString();  // Localized format

// Timestamp from date string
const ts = new Date('2023-11-14').getTime() / 1000;`,
                    },
                    {
                      language: 'python',
                      label: 'Python',
                      code: `import time
from datetime import datetime

# Get current timestamp (seconds)
now = int(time.time())
# Result: 1700000000

# Get current timestamp (milliseconds)
now_ms = int(time.time() * 1000)

# Timestamp to datetime object
dt = datetime.fromtimestamp(1700000000)

# Datetime to formatted string
dt.isoformat()  # "2023-11-14T22:13:20"
dt.strftime("%Y-%m-%d %H:%M:%S")

# Datetime to timestamp
ts = int(datetime.now().timestamp())

# Parse date string to timestamp
dt = datetime.strptime("2023-11-14", "%Y-%m-%d")
ts = int(dt.timestamp())`,
                    },
                    {
                      language: 'go',
                      label: 'Go',
                      code: `import (
    "time"
)

// Get current timestamp (seconds)
now := time.Now().Unix()
// Result: 1700000000

// Get current timestamp (milliseconds)
nowMs := time.Now().UnixMilli()

// Timestamp to Time object
t := time.Unix(1700000000, 0)

// Time to formatted string
t.Format(time.RFC3339)  // "2023-11-14T22:13:20Z"
t.Format("2006-01-02 15:04:05")

// Parse date string to timestamp
t, _ := time.Parse("2006-01-02", "2023-11-14")
ts := t.Unix()`,
                    },
                    {
                      language: 'java',
                      label: 'Java',
                      code: `import java.time.*;

// Get current timestamp (seconds)
long now = Instant.now().getEpochSecond();
// Result: 1700000000

// Get current timestamp (milliseconds)
long nowMs = System.currentTimeMillis();

// Timestamp to Instant/LocalDateTime
Instant instant = Instant.ofEpochSecond(1700000000);
LocalDateTime dt = LocalDateTime.ofInstant(
    instant, ZoneId.systemDefault()
);

// Format to string
dt.toString();  // "2023-11-14T22:13:20"

// Parse date string to timestamp
LocalDate date = LocalDate.parse("2023-11-14");
long ts = date.atStartOfDay(ZoneOffset.UTC)
    .toInstant().getEpochSecond();`,
                    },
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Why Use This Tool">
                <FeatureList
                  features={[
                    'Bidirectional conversion (timestamp ↔ date)',
                    'Auto-detect seconds vs milliseconds',
                    'Full timezone support (all IANA zones)',
                    'Live clock with current timestamp',
                    'Multiple output formats (ISO 8601, RFC 2822)',
                    'Relative time display ("2 hours ago")',
                    'Keyboard shortcuts for power users',
                    '100% client-side processing',
                    'No ads, no signup required',
                    'Remembers your timezone preference',
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Frequently Asked Questions">
                <div className="space-y-4">
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How do I convert a Unix timestamp to a date?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Paste your Unix timestamp (in seconds or milliseconds) into the input field.
                      The tool automatically detects the format and shows the converted date with
                      day of week, relative time, and multiple output formats including ISO 8601 and RFC 2822.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What is the difference between seconds and milliseconds?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Unix timestamps in seconds are 10 digits long (e.g., 1700000000), while
                      millisecond timestamps are 13 digits (e.g., 1700000000000). Languages like
                      JavaScript use milliseconds (Date.now()), while most Unix systems and languages
                      like Python use seconds. This tool auto-detects which format you enter.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How do timezones affect timestamp conversion?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Unix timestamps are always in UTC. When converting to a human-readable date,
                      the timezone determines how the date and time are displayed. For example,
                      the same timestamp shows different clock times in New York (EST/EDT) and
                      Tokyo (JST). Use the timezone selector to see the date in any timezone.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What is the Y2K38 problem?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      The Year 2038 problem affects systems storing timestamps as 32-bit signed integers.
                      On January 19, 2038, at 03:14:07 UTC, these systems will overflow. Modern systems
                      use 64-bit integers, which won&apos;t overflow for billions of years. This tool handles
                      timestamps well beyond 2038.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How do I get the current Unix timestamp?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      The live clock at the top shows the current Unix timestamp updating in real-time.
                      You can also click &quot;Use current timestamp&quot; to paste it into the converter.
                      In code: JavaScript uses Date.now(), Python uses time.time(), and most other
                      languages have similar functions.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Is my data private?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Yes. All conversions happen entirely in your browser using JavaScript&apos;s
                      built-in Date and Intl APIs. No timestamps or dates are sent to any server.
                      Your last input and timezone preference are saved in your browser&apos;s
                      localStorage for convenience.
                    </p>
                  </details>
                </div>
              </CollapsibleSection>
            </div>

            {/* Related Tools */}
            <div className="pt-6 mt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground/60">
                More DevDen tools:{' '}
                <a href="/llm-pricing" className="hover:text-primary-400 transition-colors">LLM Pricing Calculator</a>
                {' · '}
                <a href="/toon" className="hover:text-primary-400 transition-colors">TOON Converter</a>
                {' · '}
                <a href="/json" className="hover:text-primary-400 transition-colors">JSON Formatter</a>
                {' · '}
                <a href="/base64" className="hover:text-primary-400 transition-colors">Base64 Encoder/Decoder</a>
                {' · '}
                <a href="/url-encode" className="hover:text-primary-400 transition-colors">URL Encoder/Decoder</a>
                {' · '}
                <a href="/regex" className="hover:text-primary-400 transition-colors">Regex Tester</a>
                {' · '}
                <a href="/hash" className="hover:text-primary-400 transition-colors">Hash Generator</a>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
            <p className="text-xs text-muted-foreground/40">
              Bidirectional conversion · Auto-detect seconds/milliseconds · Timezone support · 100% private
            </p>
            <p className="text-xs text-muted-foreground/40">
              Convert Unix timestamps to dates or dates to timestamps online. Fast, free, and built for developers.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
