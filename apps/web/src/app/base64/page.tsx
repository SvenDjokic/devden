'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from '@/components/base64/Header';
import { TextInput } from '@/components/base64/TextInput';
import { TextOutput } from '@/components/base64/TextOutput';
import { CopyButton, CopyButtonRef, CollapsibleSection, CodeExamples, FeatureList } from '@devden/ui';
import { ModeToggle, Mode } from '@/components/base64/ModeToggle';
import { ShortcutsPopover } from '@/components/base64/ShortcutsPopover';
import { encodeBase64, decodeBase64, detectBase64 } from '@/lib/base64';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useKeyboardShortcuts, ShortcutConfig } from '@/lib/useKeyboardShortcuts';
import { Base64Schema } from '@/components/base64/Base64Schema';

const LOCAL_STORAGE_KEY = 'devden-base64-input';
const MODE_STORAGE_KEY = 'devden-base64-mode';

export default function Base64Page() {
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
    return detectBase64(input);
  }, [input]);

  // Determine actual mode to use
  const activeMode = mode === 'auto' ? detectedMode : mode;

  // Calculate output
  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: null };
    }

    const result = activeMode === 'encode'
      ? encodeBase64(input)
      : decodeBase64(input);

    return {
      output: result.output,
      error: result.success ? null : result.error,
    };
  }, [input, activeMode]);

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
      <Base64Schema />
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
                  ? 'Paste Base64 to decode...\n\nExample:\nSGVsbG8gV29ybGQh'
                  : 'Enter text to encode...\n\nExample:\nHello World!'
                }
                label="Input"
              />
            </div>
            <div className="min-h-[300px] lg:min-h-[400px]">
              <TextOutput
                value={output}
                label="Output"
                placeholder={activeMode === 'encode'
                  ? 'Base64 encoded output will appear here'
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

          {/* Status bar */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {input.trim() && (
                error ? (
                  <span className="text-error">Invalid input</span>
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
                Base64 Encoder & Decoder Online
              </h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Convert text to Base64 or decode Base64 back to text instantly with this free online tool.
                Features smart auto-detection that identifies whether your input is Base64 encoded or plain text.
                All processing happens in your browser — your data never leaves your device.
              </p>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-0">
              <CollapsibleSection title="What is Base64?">
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.
                  It&apos;s commonly used to encode data that needs to be stored or transferred in environments
                  that only support text, such as embedding images in HTML/CSS, encoding email attachments,
                  storing complex data in JSON, and passing binary data through URLs. The name &quot;Base64&quot; comes
                  from the 64 characters used in the encoding: A-Z, a-z, 0-9, +, and /.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Common Use Cases">
                <ul className="text-sm text-muted-foreground/80 space-y-2">
                  <li><strong>Data URIs</strong> — Embed images, fonts, or files directly in HTML/CSS without separate HTTP requests.</li>
                  <li><strong>API Authentication</strong> — HTTP Basic Auth encodes credentials as Base64 in the Authorization header.</li>
                  <li><strong>Email Attachments</strong> — MIME encoding uses Base64 to embed binary files in email messages.</li>
                  <li><strong>JWT Tokens</strong> — JSON Web Tokens use Base64URL encoding for the header and payload sections.</li>
                  <li><strong>Storing Binary in JSON/XML</strong> — Safely include binary data in text-only data formats.</li>
                  <li><strong>URL-Safe Data Transfer</strong> — Pass binary data through URLs and query strings without encoding issues.</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Code Examples">
                <p className="text-sm text-muted-foreground/80 mb-4">
                  Working with Base64 in your code? Here&apos;s how to encode and decode in popular languages:
                </p>
                <CodeExamples
                  storageKey="devden-base64-code-lang"
                  examples={[
                    {
                      language: 'javascript',
                      label: 'JavaScript',
                      code: `// Encode string to Base64
const encoded = btoa('Hello World');
// Result: "SGVsbG8gV29ybGQ="

// Decode Base64 to string
const decoded = atob('SGVsbG8gV29ybGQ=');
// Result: "Hello World"

// Handle Unicode (Node.js / modern browsers)
const encodeUnicode = (str) =>
  btoa(encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode(parseInt(p1, 16))
  ));

// Node.js Buffer API
const encoded = Buffer.from('Hello').toString('base64');
const decoded = Buffer.from(encoded, 'base64').toString();`,
                    },
                    {
                      language: 'python',
                      label: 'Python',
                      code: `import base64

# Encode string to Base64
text = "Hello World"
encoded = base64.b64encode(text.encode()).decode()
# Result: "SGVsbG8gV29ybGQ="

# Decode Base64 to string
decoded = base64.b64decode(encoded).decode()
# Result: "Hello World"

# URL-safe Base64 (replaces + and / with - and _)
url_safe = base64.urlsafe_b64encode(text.encode()).decode()
decoded = base64.urlsafe_b64decode(url_safe).decode()

# Encode binary file
with open('image.png', 'rb') as f:
    encoded = base64.b64encode(f.read()).decode()`,
                    },
                    {
                      language: 'go',
                      label: 'Go',
                      code: `import (
    "encoding/base64"
)

// Encode string to Base64
text := "Hello World"
encoded := base64.StdEncoding.EncodeToString([]byte(text))
// Result: "SGVsbG8gV29ybGQ="

// Decode Base64 to string
decoded, err := base64.StdEncoding.DecodeString(encoded)
if err != nil {
    // Handle error
}
// Result: []byte("Hello World")

// URL-safe Base64
urlEncoded := base64.URLEncoding.EncodeToString([]byte(text))
urlDecoded, _ := base64.URLEncoding.DecodeString(urlEncoded)`,
                    },
                    {
                      language: 'java',
                      label: 'Java',
                      code: `import java.util.Base64;
import java.nio.charset.StandardCharsets;

// Encode string to Base64
String text = "Hello World";
String encoded = Base64.getEncoder()
    .encodeToString(text.getBytes(StandardCharsets.UTF_8));
// Result: "SGVsbG8gV29ybGQ="

// Decode Base64 to string
byte[] decodedBytes = Base64.getDecoder().decode(encoded);
String decoded = new String(decodedBytes, StandardCharsets.UTF_8);
// Result: "Hello World"

// URL-safe Base64
String urlEncoded = Base64.getUrlEncoder()
    .encodeToString(text.getBytes());
byte[] urlDecoded = Base64.getUrlDecoder().decode(urlEncoded);`,
                    },
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Why Use This Tool">
                <FeatureList
                  features={[
                    'Instant encode/decode as you type',
                    'Smart auto-detection of input type',
                    'Keyboard shortcuts (E, D, A)',
                    'Handles Unicode text correctly',
                    '100% client-side processing',
                    'No ads, no signup required',
                    'Copy output with one click',
                    'Remembers your last input',
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Frequently Asked Questions">
                <div className="space-y-4">
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How do I encode text to Base64?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Enter your text in the input panel. If auto-detect mode is enabled, the tool will
                      recognize it as plain text and encode it automatically. You can also manually select
                      &quot;Encode&quot; mode using the toggle or press &apos;E&apos; on your keyboard.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How do I decode Base64 to text?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Paste your Base64 string in the input panel. Auto-detect mode will recognize valid
                      Base64 and decode it automatically. You can also manually select &quot;Decode&quot; mode
                      using the toggle or press &apos;D&apos; on your keyboard.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What is Base64 used for?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Base64 is used to encode binary data for text-only contexts: embedding images in HTML/CSS
                      (data URIs), encoding email attachments (MIME), storing binary in JSON, encoding
                      authentication credentials (HTTP Basic Auth), and passing data through URLs safely.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Is Base64 encryption?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      No. Base64 is encoding, not encryption. It transforms data into a different format but
                      provides no security — anyone can decode Base64. Never use Base64 to &quot;hide&quot; sensitive
                      data. For security, use proper encryption algorithms like AES.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What&apos;s the difference between Base64 and Base64URL?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Standard Base64 uses + and / characters, which have special meaning in URLs. Base64URL
                      replaces these with - and _ to be URL-safe without additional encoding. JWTs and many
                      web APIs use Base64URL. This tool uses standard Base64 encoding.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Why does Base64 increase file size?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Base64 encoding increases size by approximately 33% because it represents 3 bytes of
                      binary data as 4 ASCII characters. This overhead is the trade-off for text-safe
                      representation. For large files, consider using direct binary transfer instead.
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
                <a href="/llm-pricing" className="hover:text-primary-400 transition-colors">LLM Pricing Calculator</a>
                {' · '}
                <a href="/toon" className="hover:text-primary-400 transition-colors">TOON Converter</a>
                {' · '}
                <a href="/json" className="hover:text-primary-400 transition-colors">JSON Formatter</a>
                {' · '}
                <a href="/url-encode" className="hover:text-primary-400 transition-colors">URL Encoder/Decoder</a>
                {' · '}
                <a href="/timestamp" className="hover:text-primary-400 transition-colors">Unix Timestamp Converter</a>
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
              Instant conversion · Auto-detect mode · Keyboard shortcuts · 100% private
            </p>
            <p className="text-xs text-muted-foreground/40">
              Encode text to Base64 or decode Base64 to text online. Fast, free, and built for developers.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
