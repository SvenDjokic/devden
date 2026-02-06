'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from '@/components/url-encode/Header';
import { TextInput } from '@/components/url-encode/TextInput';
import { TextOutput } from '@/components/url-encode/TextOutput';
import { CopyButton, CopyButtonRef } from '@/components/url-encode/CopyButton';
import { ModeToggle, Mode } from '@/components/url-encode/ModeToggle';
import { ShortcutsPopover } from '@/components/url-encode/ShortcutsPopover';
import { encodeURL, decodeURL, detectURLEncoding, parseURLComponents, parseQueryString } from '@/lib/urlEncode';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useKeyboardShortcuts, ShortcutConfig } from '@/lib/useKeyboardShortcuts';
import { URLEncodeSchema } from '@/components/url-encode/URLEncodeSchema';
import { CollapsibleSection, CodeExamples, FeatureList } from '@/components/url-encode/seo';

const LOCAL_STORAGE_KEY = 'devden-url-encode-input';
const MODE_STORAGE_KEY = 'devden-url-encode-mode';

export default function Home() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('auto');
  const [isHydrated, setIsHydrated] = useState(false);
  const copyButtonRef = useRef<CopyButtonRef>(null);

  // Persist input to local storage
  const { value: savedInput, setValue: saveInput, error: storageError } = useLocalStorage<string>(
    LOCAL_STORAGE_KEY,
    ''
  );

  // Persist mode preference to local storage
  const { value: savedMode, setValue: saveMode } = useLocalStorage<Mode>(
    MODE_STORAGE_KEY,
    'auto'
  );

  // Load saved mode preference
  useEffect(() => {
    if (savedMode && !isHydrated) {
      setMode(savedMode);
    }
  }, [savedMode, isHydrated]);

  // Save mode preference when it changes
  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    saveMode(newMode);
  }, [saveMode]);

  // Load saved input on hydration
  useEffect(() => {
    if (savedInput && !isHydrated) {
      setInput(savedInput);
    }
    setIsHydrated(true);
  }, [savedInput, isHydrated]);

  // Save input to local storage when it changes (after hydration)
  useEffect(() => {
    if (isHydrated && input !== savedInput) {
      saveInput(input);
    }
  }, [input, isHydrated, savedInput, saveInput]);

  // Auto-detect mode based on input
  const detectedMode = useMemo(() => {
    return detectURLEncoding(input);
  }, [input]);

  // Determine actual mode to use
  const activeMode = mode === 'auto' ? detectedMode : mode;

  // Calculate output
  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: null };
    }

    const result = activeMode === 'encode'
      ? encodeURL(input)
      : decodeURL(input);

    return {
      output: result.output,
      error: result.success ? null : result.error,
    };
  }, [input, activeMode]);

  // Parse URL components
  const urlComponents = useMemo(() => {
    if (!input.trim()) return null;
    // Try to parse the decoded version for better results
    const textToParse = activeMode === 'decode' && output ? output : input;
    return parseURLComponents(textToParse);
  }, [input, output, activeMode]);

  // Parse query string
  const queryParams = useMemo(() => {
    if (!input.trim()) return [];
    const textToParse = activeMode === 'decode' && output ? output : input;
    return parseQueryString(textToParse);
  }, [input, output, activeMode]);

  const handleClear = () => {
    setInput('');
  };

  // Keyboard shortcuts configuration
  const shortcuts: ShortcutConfig[] = useMemo(
    () => [
      {
        key: 'c',
        shift: true,
        handler: () => copyButtonRef.current?.triggerCopy(),
        description: 'Copy output',
      },
      {
        key: 'e',
        shift: false,
        handler: () => handleModeChange('encode'),
        description: 'Encode mode',
      },
      {
        key: 'd',
        shift: false,
        handler: () => handleModeChange('decode'),
        description: 'Decode mode',
      },
      {
        key: 'a',
        shift: false,
        handler: () => handleModeChange('auto'),
        description: 'Auto-detect mode',
      },
    ],
    [handleModeChange]
  );

  useKeyboardShortcuts({ shortcuts, enabled: isHydrated });

  return (
    <>
      <URLEncodeSchema />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

      <main className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <ModeToggle
                mode={mode}
                detectedMode={detectedMode}
                onChange={handleModeChange}
              />
              {input.trim() && (
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
                <CopyButton ref={copyButtonRef} text={output} disabled={!output || !!error} />
              </div>
              <ShortcutsPopover shortcuts={shortcuts} />
            </div>
          </div>

          {/* Error panel */}
          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Editor panels - side by side */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            <div className="min-h-[300px] lg:min-h-[400px]">
              <TextInput
                value={input}
                onChange={setInput}
                placeholder={activeMode === 'decode'
                  ? 'Paste URL-encoded text to decode...\n\nExample:\nHello%20World%21'
                  : 'Enter text to encode for URLs...\n\nExample:\nHello World!'
                }
                label="Input"
              />
            </div>
            <div className="min-h-[300px] lg:min-h-[400px]">
              <TextOutput
                value={output}
                label="Output"
                placeholder={activeMode === 'encode'
                  ? 'URL-encoded output will appear here'
                  : 'Decoded text will appear here'
                }
                headerAction={
                  <div className="lg:hidden">
                    <CopyButton text={output} disabled={!output || !!error} />
                  </div>
                }
              />
            </div>
          </div>

          {/* URL Components Breakdown - Our USP! */}
          {urlComponents?.isValidURL && (
            <div className="mt-4 p-4 bg-card border border-border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">URL Components</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {urlComponents.protocol && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/60">Protocol</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded">
                        {urlComponents.protocol}
                      </code>
                      <CopyButton text={urlComponents.protocol} iconOnly label="Copy protocol" />
                    </div>
                  </div>
                )}
                {urlComponents.host && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/60">Host</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-foreground bg-muted px-2 py-1 rounded truncate max-w-[150px]" title={urlComponents.host}>
                        {urlComponents.host}
                      </code>
                      <CopyButton text={urlComponents.host} iconOnly label="Copy host" />
                    </div>
                  </div>
                )}
                {urlComponents.port && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/60">Port</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-foreground bg-muted px-2 py-1 rounded">
                        {urlComponents.port}
                      </code>
                      <CopyButton text={urlComponents.port} iconOnly label="Copy port" />
                    </div>
                  </div>
                )}
                {urlComponents.pathname && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/60">Path</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-foreground bg-muted px-2 py-1 rounded truncate max-w-[150px]" title={urlComponents.pathname}>
                        {urlComponents.pathname}
                      </code>
                      <CopyButton text={urlComponents.pathname} iconOnly label="Copy path" />
                    </div>
                  </div>
                )}
                {urlComponents.search && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/60">Query</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-secondary-500 bg-secondary-500/10 px-2 py-1 rounded truncate max-w-[150px]" title={urlComponents.search}>
                        {urlComponents.search}
                      </code>
                      <CopyButton text={urlComponents.search} iconOnly label="Copy query" />
                    </div>
                  </div>
                )}
                {urlComponents.hash && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground/60">Fragment</span>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-foreground bg-muted px-2 py-1 rounded">
                        {urlComponents.hash}
                      </code>
                      <CopyButton text={urlComponents.hash} iconOnly label="Copy fragment" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Query String Parser - Another USP! */}
          {queryParams.length > 0 && (
            <div className="mt-4 p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Query Parameters ({queryParams.length})</h3>
                <CopyButton
                  text={queryParams.map(p => `${p.key}=${p.value}`).join('&')}
                  size="sm"
                  label="Copy All"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground/60">Key</th>
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground/60">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queryParams.map((param, index) => (
                      <tr key={index} className="border-b border-border/30 last:border-0">
                        <td className="py-2 pr-4">
                          <code className="text-xs text-primary-400">{param.key}</code>
                        </td>
                        <td className="py-2">
                          <code className="text-xs text-foreground break-all">{param.value || <span className="text-muted-foreground/40">(empty)</span>}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Status bar */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {input.trim() && (
                error ? (
                  <span className="text-error">Invalid encoding</span>
                ) : (
                  <span className="text-secondary-500">
                    {activeMode === 'encode' ? 'Encoded' : 'Decoded'} successfully
                  </span>
                )
              )}
              {storageError && (
                <span className="text-amber-500">{storageError}</span>
              )}
            </div>
            <div>
              {output && (
                <span>{output.length} characters</span>
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
                URL Encoder & Decoder Online
              </h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Encode text for safe use in URLs or decode percent-encoded strings instantly with this free online tool.
                Features smart auto-detection, URL component breakdown, and query string parsing.
                All processing happens in your browser — your data never leaves your device.
              </p>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-0">
              <CollapsibleSection title="What is URL Encoding?">
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  URL encoding (also called percent-encoding) converts characters into a format safe for URLs.
                  Special characters like spaces, ampersands, and non-ASCII characters are replaced with a percent sign
                  followed by two hexadecimal digits (e.g., space becomes %20). This ensures URLs work correctly
                  across all browsers and servers, as URLs can only contain a limited set of ASCII characters.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Common Use Cases">
                <ul className="text-sm text-muted-foreground/80 space-y-2">
                  <li><strong>Query Parameters</strong> — Encode user input before adding to URL query strings (e.g., search terms, form data).</li>
                  <li><strong>API Requests</strong> — Encode special characters in API endpoints and parameters to prevent errors.</li>
                  <li><strong>Debugging</strong> — Decode URLs from logs, analytics, or error messages to see the original values.</li>
                  <li><strong>Deep Links</strong> — Encode URLs that need to be passed as parameters to other URLs.</li>
                  <li><strong>OAuth & Auth Flows</strong> — Encode redirect URLs and callback parameters.</li>
                  <li><strong>Form Submissions</strong> — Understand how form data is encoded in application/x-www-form-urlencoded format.</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Code Examples">
                <p className="text-sm text-muted-foreground/80 mb-4">
                  Working with URL encoding in your code? Here&apos;s how to encode and decode in popular languages:
                </p>
                <CodeExamples
                  storageKey="devden-url-encode-code-lang"
                  examples={[
                    {
                      language: 'javascript',
                      label: 'JavaScript',
                      code: `// Encode a string for use in URLs
const encoded = encodeURIComponent('Hello World!');
// Result: "Hello%20World%21"

// Decode a URL-encoded string
const decoded = decodeURIComponent('Hello%20World%21');
// Result: "Hello World!"

// Encode a full URL (preserves structure)
const url = encodeURI('https://example.com/path?q=hello world');
// Result: "https://example.com/path?q=hello%20world"

// Parse URL components
const url = new URL('https://example.com/path?foo=bar&baz=qux');
console.log(url.searchParams.get('foo')); // "bar"`,
                    },
                    {
                      language: 'python',
                      label: 'Python',
                      code: `from urllib.parse import quote, unquote, urlencode, parse_qs

# Encode a string
encoded = quote('Hello World!')
# Result: "Hello%20World%21"

# Decode a string
decoded = unquote('Hello%20World%21')
# Result: "Hello World!"

# Encode query parameters
params = urlencode({'name': 'John Doe', 'city': 'New York'})
# Result: "name=John+Doe&city=New+York"

# Parse query string
parsed = parse_qs('name=John&tags=a&tags=b')
# Result: {'name': ['John'], 'tags': ['a', 'b']}`,
                    },
                    {
                      language: 'go',
                      label: 'Go',
                      code: `import (
    "net/url"
)

// Encode a string
encoded := url.QueryEscape("Hello World!")
// Result: "Hello+World%21"

// Decode a string
decoded, err := url.QueryUnescape("Hello%20World%21")
// Result: "Hello World!"

// Parse a full URL
u, _ := url.Parse("https://example.com/path?foo=bar")
fmt.Println(u.Query().Get("foo")) // "bar"

// Build URL with query params
params := url.Values{}
params.Add("name", "John")
params.Add("city", "New York")
queryString := params.Encode()`,
                    },
                    {
                      language: 'php',
                      label: 'PHP',
                      code: `<?php
// Encode a string
$encoded = urlencode('Hello World!');
// Result: "Hello+World%21"

// rawurlencode for RFC 3986 compliance
$encoded = rawurlencode('Hello World!');
// Result: "Hello%20World%21"

// Decode a string
$decoded = urldecode('Hello%20World%21');
// Result: "Hello World!"

// Parse query string
parse_str('name=John&city=New+York', $params);
// $params = ['name' => 'John', 'city' => 'New York']

// Build query string
$query = http_build_query(['name' => 'John', 'city' => 'NY']);`,
                    },
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Why Use This Tool">
                <FeatureList
                  features={[
                    'Instant encode/decode as you type',
                    'Smart auto-detection of input type',
                    'URL component breakdown (protocol, host, path, query, fragment)',
                    'Query string parser (key=value pairs)',
                    'Keyboard shortcuts (E, D, A)',
                    '100% client-side processing',
                    'No ads, no signup required',
                    'Copy output with one click',
                    'Remembers your last input',
                    'Mobile responsive design',
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Frequently Asked Questions">
                <div className="space-y-4">
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How do I URL encode text?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Enter your text in the input panel. If auto-detect mode is enabled, the tool will
                      recognize it as plain text and encode it automatically. You can also manually select
                      &quot;Encode&quot; mode using the toggle or press &apos;E&apos; on your keyboard.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What&apos;s the difference between encodeURI and encodeURIComponent?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      encodeURIComponent encodes all special characters, making it safe for query parameter values.
                      encodeURI preserves URL structure characters (like :, /, ?) so you can encode a full URL
                      without breaking it. This tool uses encodeURIComponent behavior, which is more common
                      for encoding individual values.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Why do spaces become %20 or +?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Both represent spaces in URLs, but they come from different standards. %20 follows
                      RFC 3986 (URI standard), while + follows the application/x-www-form-urlencoded format
                      used by HTML forms. Most servers accept both, but %20 is the safer choice for
                      general URL encoding.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Which characters need to be encoded?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Reserved characters that have special meaning in URLs must be encoded when used as data:
                      ! # $ &amp; &apos; ( ) * + , / : ; = ? @ [ ]. Unsafe characters like spaces, &lt; &gt; { } | \
                      and non-ASCII characters also need encoding. Only unreserved characters (A-Z, a-z, 0-9, - _ . ~)
                      are safe without encoding.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Is my data private?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Yes. All encoding and decoding happens entirely in your browser using JavaScript.
                      No data is ever sent to any server. Your last input and mode preference are saved
                      in your browser&apos;s localStorage for convenience.
                    </p>
                  </details>
                </div>
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
                <a href="https://regex.devden.dev" className="hover:text-primary-400 transition-colors">Regex Tester</a>
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
              Instant conversion · Auto-detect mode · URL component breakdown · Query string parser · 100% private
            </p>
            <p className="text-xs text-muted-foreground/40">
              Encode text for URLs or decode percent-encoded strings online. Fast, free, and built for developers.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
