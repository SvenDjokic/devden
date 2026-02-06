'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from '@/components/regex/Header';
import { CopyButton, CopyButtonRef } from '@/components/regex/CopyButton';
import { FlagsToggle } from '@/components/regex/FlagsToggle';
import { ShortcutsPopover } from '@/components/regex/ShortcutsPopover';
import { PatternSelector } from '@/components/regex/PatternSelector';
import { useRegex, getHighlightedSegments, RegexFlags, DEFAULT_FLAGS } from '@/lib/useRegex';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useKeyboardShortcuts, ShortcutConfig } from '@/lib/useKeyboardShortcuts';
import { RegexSchema } from '@/components/regex/RegexSchema';
import { CollapsibleSection, FeatureList } from '@/components/regex/seo';

const PATTERN_STORAGE_KEY = 'devden-regex-pattern';
const TEST_STRING_STORAGE_KEY = 'devden-regex-test-string';
const FLAGS_STORAGE_KEY = 'devden-regex-flags';

export default function Home() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<RegexFlags>(DEFAULT_FLAGS);
  const [isHydrated, setIsHydrated] = useState(false);
  const copyButtonRef = useRef<CopyButtonRef>(null);
  const patternInputRef = useRef<HTMLInputElement>(null);

  // Persist pattern to local storage
  const { value: savedPattern, setValue: savePattern } = useLocalStorage<string>(
    PATTERN_STORAGE_KEY,
    ''
  );

  // Persist test string to local storage
  const { value: savedTestString, setValue: saveTestString } = useLocalStorage<string>(
    TEST_STRING_STORAGE_KEY,
    ''
  );

  // Persist flags to local storage
  const { value: savedFlags, setValue: saveFlags } = useLocalStorage<RegexFlags>(
    FLAGS_STORAGE_KEY,
    DEFAULT_FLAGS
  );

  // Load saved values on hydration
  useEffect(() => {
    if (!isHydrated) {
      if (savedPattern) setPattern(savedPattern);
      if (savedTestString) setTestString(savedTestString);
      if (savedFlags) setFlags(savedFlags);
      setIsHydrated(true);
    }
  }, [savedPattern, savedTestString, savedFlags, isHydrated]);

  // Save values when they change (after hydration)
  useEffect(() => {
    if (isHydrated && pattern !== savedPattern) {
      savePattern(pattern);
    }
  }, [pattern, isHydrated, savedPattern, savePattern]);

  useEffect(() => {
    if (isHydrated && testString !== savedTestString) {
      saveTestString(testString);
    }
  }, [testString, isHydrated, savedTestString, saveTestString]);

  useEffect(() => {
    if (isHydrated && JSON.stringify(flags) !== JSON.stringify(savedFlags)) {
      saveFlags(flags);
    }
  }, [flags, isHydrated, savedFlags, saveFlags]);

  // Get regex results
  const result = useRegex(pattern, testString, flags);

  // Get highlighted segments for the test string
  const highlightedSegments = useMemo(() => {
    return getHighlightedSegments(testString, result.matches);
  }, [testString, result.matches]);

  // Generate matches output for copying
  const matchesOutput = useMemo(() => {
    if (result.matches.length === 0) return '';
    return result.matches.map((m, i) => `Match ${i + 1}: "${m.fullMatch}" at index ${m.index}`).join('\n');
  }, [result.matches]);

  const handleClear = useCallback(() => {
    setPattern('');
    setTestString('');
    patternInputRef.current?.focus();
  }, []);

  const handlePatternSelect = useCallback((selectedPattern: string, testExample?: string) => {
    setPattern(selectedPattern);
    if (testExample && !testString) {
      setTestString(testExample);
    }
    patternInputRef.current?.focus();
  }, [testString]);

  // Keyboard shortcuts
  const shortcuts: ShortcutConfig[] = useMemo(
    () => [
      {
        key: 'c',
        shift: true,
        handler: () => copyButtonRef.current?.triggerCopy(),
        description: 'Copy matches',
      },
      {
        key: 'g',
        shift: false,
        handler: () => setFlags(f => ({ ...f, global: !f.global })),
        description: 'Toggle global flag',
      },
      {
        key: 'i',
        shift: false,
        handler: () => setFlags(f => ({ ...f, ignoreCase: !f.ignoreCase })),
        description: 'Toggle case insensitive',
      },
      {
        key: 'k',
        shift: false,
        handler: () => patternInputRef.current?.focus(),
        description: 'Focus pattern input',
      },
    ],
    []
  );

  useKeyboardShortcuts({ shortcuts, enabled: isHydrated });

  return (
    <>
      <RegexSchema />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
            {/* Pattern Input */}
            <div className="mb-4">
              <label htmlFor="regex-pattern" className="text-sm font-medium text-muted-foreground mb-2 block">
                Regular Expression
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground/60 text-lg" aria-hidden="true">/</span>
                <input
                  id="regex-pattern"
                  ref={patternInputRef}
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="code flex-1 px-3 py-2.5 bg-card border border-border rounded-lg transition-all duration-200 hover:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-muted-foreground"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
                <span className="text-muted-foreground/60 text-lg" aria-hidden="true">/</span>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <PatternSelector onSelect={handlePatternSelect} />
                <FlagsToggle flags={flags} onChange={setFlags} />
                {(pattern || testString) && (
                  <button
                    onClick={handleClear}
                    aria-label="Clear pattern and test string"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden lg:block">
                  <CopyButton ref={copyButtonRef} text={matchesOutput} disabled={!matchesOutput} label="Copy Matches" />
                </div>
                <ShortcutsPopover shortcuts={shortcuts} />
              </div>
            </div>

            {/* Error panel */}
            {result.error && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error font-mono">{result.error}</p>
              </div>
            )}

            {/* Editor panels - side by side */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
              {/* Test String Input */}
              <div className="min-h-[300px] lg:min-h-[400px] flex flex-col">
                <label htmlFor="test-string" className="text-sm font-medium text-muted-foreground mb-2">
                  Test String
                </label>
                <textarea
                  id="test-string"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Enter text to test against the pattern..."
                  className="code flex-1 w-full p-4 bg-card border border-border rounded-lg resize-none transition-all duration-200 hover:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-muted-foreground"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </div>

              {/* Highlighted Matches Output */}
              <div className="min-h-[300px] lg:min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Matches
                    {result.matchCount > 0 && (
                      <span className="ml-2 text-secondary-500">({result.matchCount} found)</span>
                    )}
                  </label>
                  <div className="lg:hidden">
                    <CopyButton text={matchesOutput} disabled={!matchesOutput} label="Copy" size="sm" />
                  </div>
                </div>
                <div className="flex-1 w-full bg-card border border-border rounded-lg overflow-auto">
                  {testString ? (
                    <div className="code p-4 text-sm leading-relaxed whitespace-pre-wrap break-all">
                      {highlightedSegments.map((segment, idx) => (
                        <span
                          key={idx}
                          className={
                            segment.isMatch
                              ? 'bg-primary-500/30 text-primary-300 rounded px-0.5'
                              : ''
                          }
                        >
                          {segment.text}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 h-full flex items-center justify-center p-4">
                      <span className="text-muted-foreground">
                        Matches will be highlighted here
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Capture Groups */}
            {result.matches.some(m => m.groups.length > 0) && (
              <div className="mt-4 p-4 bg-card border border-border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Capture Groups
                </h3>
                <div className="space-y-3">
                  {result.matches.map((match, matchIdx) => (
                    match.groups.length > 0 && (
                      <div key={matchIdx} className="space-y-2">
                        <div className="text-xs text-muted-foreground/60">
                          Match {matchIdx + 1}: &quot;{match.fullMatch}&quot;
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {match.groups.map((group, groupIdx) => (
                            <div
                              key={groupIdx}
                              className="flex items-center gap-2 bg-muted/50 rounded px-2 py-1.5"
                            >
                              <span className="text-xs text-muted-foreground/60">
                                {group.name ? (
                                  <code className="text-primary-400">{group.name}</code>
                                ) : (
                                  `Group ${group.index}`
                                )}
                              </span>
                              <code className="text-xs text-foreground truncate flex-1">
                                {group.value}
                              </code>
                              <CopyButton text={group.value} iconOnly label={`Copy group ${group.index}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Match Details */}
            {result.matches.length > 0 && (
              <div className="mt-4 p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Match Details ({result.matchCount})
                  </h3>
                  <CopyButton text={matchesOutput} size="sm" label="Copy All" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground/60">#</th>
                        <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground/60">Match</th>
                        <th className="text-left py-2 text-xs font-medium text-muted-foreground/60">Index</th>
                        <th className="text-left py-2 text-xs font-medium text-muted-foreground/60">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.matches.slice(0, 100).map((match, idx) => (
                        <tr key={idx} className="border-b border-border/30 last:border-0">
                          <td className="py-2 pr-4 text-muted-foreground/60">{idx + 1}</td>
                          <td className="py-2 pr-4">
                            <code className="text-xs text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded">
                              {match.fullMatch.length > 50
                                ? match.fullMatch.slice(0, 50) + '...'
                                : match.fullMatch}
                            </code>
                          </td>
                          <td className="py-2 text-muted-foreground">{match.index}</td>
                          <td className="py-2 text-muted-foreground">{match.fullMatch.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.matches.length > 100 && (
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      Showing first 100 of {result.matches.length} matches
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Status bar */}
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                {pattern && testString && (
                  result.error ? (
                    <span className="text-error">Invalid pattern</span>
                  ) : result.matchCount > 0 ? (
                    <span className="text-secondary-500">
                      {result.matchCount} match{result.matchCount !== 1 ? 'es' : ''} found
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No matches</span>
                  )
                )}
              </div>
              <div>
                {testString && (
                  <span>{testString.length} characters</span>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* SEO Content Section */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-t border-border/50">
          <div className="max-w-3xl opacity-80">
            {/* Always visible intro */}
            <div className="mb-6">
              <h2 className="text-base font-semibold text-muted-foreground mb-3">
                Regex Tester Online
              </h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Test and debug regular expressions in real-time with this free online regex tester.
                Features instant match highlighting, capture group display, and support for all JavaScript regex flags.
                All processing happens in your browser — your data never leaves your device.
              </p>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-0">
              <CollapsibleSection title="What is Regex?">
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  Regular expressions (regex) are patterns used to match character combinations in strings.
                  They&apos;re incredibly powerful for searching, validating, and manipulating text.
                  Regex is supported in virtually every programming language and is essential for tasks like
                  form validation, log parsing, data extraction, and search-and-replace operations.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="How to Use This Regex Tester">
                <ol className="text-sm text-muted-foreground/80 space-y-2 list-decimal list-inside">
                  <li><strong>Enter your pattern</strong> — Type your regular expression in the pattern field (without the surrounding slashes)</li>
                  <li><strong>Add test text</strong> — Paste or type the text you want to test against</li>
                  <li><strong>View matches</strong> — Matches are highlighted in real-time as you type</li>
                  <li><strong>Check capture groups</strong> — If your pattern has groups, they&apos;ll appear below with index numbers</li>
                  <li><strong>Adjust flags</strong> — Toggle global (g), case-insensitive (i), multiline (m), and other flags as needed</li>
                  <li><strong>Use the pattern library</strong> — Click &quot;Patterns&quot; to browse 40+ common regex patterns for quick insertion</li>
                </ol>
              </CollapsibleSection>

              <CollapsibleSection title="Regex Flags Explained">
                <ul className="text-sm text-muted-foreground/80 space-y-2">
                  <li><code className="text-primary-400">g</code> <strong>Global</strong> — Match all occurrences, not just the first</li>
                  <li><code className="text-primary-400">i</code> <strong>Case Insensitive</strong> — Match regardless of letter case</li>
                  <li><code className="text-primary-400">m</code> <strong>Multiline</strong> — ^ and $ match start/end of each line, not just the string</li>
                  <li><code className="text-primary-400">s</code> <strong>Dot All</strong> — Make . match newline characters too</li>
                  <li><code className="text-primary-400">u</code> <strong>Unicode</strong> — Enable full Unicode support</li>
                  <li><code className="text-primary-400">y</code> <strong>Sticky</strong> — Match only from the lastIndex position</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Common Regex Patterns">
                <ul className="text-sm text-muted-foreground/80 space-y-2">
                  <li><code className="text-primary-400">^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{'}2,{'}'}$</code> — Email address</li>
                  <li><code className="text-primary-400">^https?:\/\/[^\s]+$</code> — URL</li>
                  <li><code className="text-primary-400">^\d{'{'}4{'}'}-\d{'{'}2{'}'}-\d{'{'}2{'}'}$</code> — Date (YYYY-MM-DD)</li>
                  <li><code className="text-primary-400">^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{'{'}8,{'}'}$</code> — Strong password</li>
                  <li><code className="text-primary-400">^\d{'{'}1,3{'}'}\.\d{'{'}1,3{'}'}\.\d{'{'}1,3{'}'}\.\d{'{'}1,3{'}'}$</code> — IPv4 address</li>
                  <li><code className="text-primary-400">\b\d{'{'}3{'}'}-\d{'{'}3{'}'}-\d{'{'}4{'}'}\b</code> — US phone number</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Regex Tips & Best Practices">
                <ul className="text-sm text-muted-foreground/80 space-y-2">
                  <li><strong>Start simple</strong> — Build your pattern incrementally, testing after each addition</li>
                  <li><strong>Use anchors</strong> — <code className="text-primary-400">^</code> and <code className="text-primary-400">$</code> ensure full string matching for validation</li>
                  <li><strong>Escape special characters</strong> — Characters like <code className="text-primary-400">. * + ? [ ] ( ) {'{'} {'}'} | \ ^</code> need backslash escaping</li>
                  <li><strong>Be specific</strong> — <code className="text-primary-400">\d</code> is better than <code className="text-primary-400">.</code> when matching digits</li>
                  <li><strong>Use non-capturing groups</strong> — <code className="text-primary-400">(?:...)</code> groups without creating a capture</li>
                  <li><strong>Name your captures</strong> — <code className="text-primary-400">(?&lt;name&gt;...)</code> makes patterns more readable</li>
                  <li><strong>Avoid catastrophic backtracking</strong> — Nested quantifiers like <code className="text-primary-400">(a+)+</code> can cause exponential time complexity</li>
                  <li><strong>Test edge cases</strong> — Empty strings, special characters, and very long inputs</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Why Use This Tool">
                <FeatureList
                  features={[
                    'Real-time regex matching as you type',
                    'Visual match highlighting in test string',
                    'Capture group display with copy buttons',
                    'Named capture group support',
                    'All JavaScript regex flags (g, i, m, s, u, y)',
                    'Match count and position details',
                    'Keyboard shortcuts for power users',
                    '100% client-side processing',
                    'No ads, no signup required',
                    'Mobile responsive design',
                  ]}
                />
              </CollapsibleSection>
            </div>

            {/* Related Tools */}
            <div className="pt-6 mt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground/60">
                More DevDen tools:{' '}
                <a href="https://toon.devden.dev" className="hover:text-primary-400 transition-colors">TOON Converter <span className="text-primary-400">NEW</span></a>
                {' · '}
                <a href="https://json.devden.dev" className="hover:text-primary-400 transition-colors">JSON Formatter</a>
                {' · '}
                <a href="https://base64.devden.dev" className="hover:text-primary-400 transition-colors">Base64 Encoder/Decoder</a>
                {' · '}
                <a href="https://timestamp.devden.dev" className="hover:text-primary-400 transition-colors">Unix Timestamp Converter</a>
                {' · '}
                <a href="https://url-encode.devden.dev" className="hover:text-primary-400 transition-colors">URL Encoder/Decoder</a>
                {' · '}
                <a href="https://hash.devden.dev" className="hover:text-primary-400 transition-colors">Hash Generator</a>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
            <p className="text-xs text-muted-foreground/40">
              Real-time matching · Capture groups · All JS flags · 100% private
            </p>
            <p className="text-xs text-muted-foreground/40">
              Test and debug regular expressions online. Fast, free, and built for developers.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
