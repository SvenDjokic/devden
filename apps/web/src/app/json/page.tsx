'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from '@/components/json/Header';
import { JsonInput } from '@/components/json/JsonInput';
import { JsonOutput } from '@/components/json/JsonOutput';
import { ErrorPanel } from '@/components/json/ErrorPanel';
import { CopyButton, CopyButtonRef } from '@/components/json/CopyButton';
import { FileUpload, FileUploadRef } from '@/components/json/FileUpload';
import { ToolbarOptions, IndentOption } from '@/components/json/ToolbarOptions';
import { ShortcutsPopover } from '@/components/json/ShortcutsPopover';
import { formatJson, minifyJson, repairJson, canRepair, JsonError } from '@/lib/jsonFormatter';
import { useDebounce } from '@/lib/useDebounce';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useKeyboardShortcuts, ShortcutConfig } from '@/lib/useKeyboardShortcuts';
import { JsonLdSchema } from '@/components/json/JsonLdSchema';
import { CollapsibleSection, CodeExamples, FeatureList } from '@/components/json/seo';

const LOCAL_STORAGE_KEY = 'devden-json-input';
const INDENT_STORAGE_KEY = 'devden-json-indent';

export default function Home() {
  const [input, setInput] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [repairChanges, setRepairChanges] = useState<string[]>([]);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const fileUploadRef = useRef<FileUploadRef>(null);
  const copyButtonRef = useRef<CopyButtonRef>(null);

  // Persist input to local storage
  const { value: savedInput, setValue: saveInput, error: storageError } = useLocalStorage<string>(
    LOCAL_STORAGE_KEY,
    ''
  );

  // Persist indent preference to local storage
  const { value: savedIndent, setValue: saveIndent } = useLocalStorage<IndentOption>(
    INDENT_STORAGE_KEY,
    '2'
  );
  const [indent, setIndent] = useState<IndentOption>('2');

  // Load saved indent preference - intentional hydration pattern
  useEffect(() => {
    if (savedIndent && !isHydrated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndent(savedIndent);
    }
  }, [savedIndent, isHydrated]);

  // Save indent preference when it changes
  const handleIndentChange = useCallback((newIndent: IndentOption) => {
    setIndent(newIndent);
    saveIndent(newIndent);
  }, [saveIndent]);

  // Load saved input on hydration - intentional hydration pattern
  useEffect(() => {
    if (savedInput && !isHydrated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Debounce input for real-time formatting
  const debouncedInput = useDebounce(input, 300);

  // Convert indent option to actual indent value
  const indentValue = useMemo(() => {
    if (indent === 'tab') return '\t';
    return parseInt(indent, 10);
  }, [indent]);

  // Format result
  const { formatted, error } = useMemo(() => {
    if (!debouncedInput.trim()) {
      return { formatted: '', error: null as JsonError | null };
    }

    const result = formatJson(debouncedInput, indentValue);
    return {
      formatted: result.success ? (result.formatted || '') : '',
      error: result.error || null,
    };
  }, [debouncedInput, indentValue]);

  // Show loading state when input changes but hasn't been debounced yet
  useEffect(() => {
    if (input !== debouncedInput && input.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFormatting(true);
    } else {

      setIsFormatting(false);
    }
  }, [input, debouncedInput]);

  // Clear repair changes when input changes manually (not from repair)
  useEffect(() => {
    // Only clear if the current input is not in the undo stack
    // This prevents clearing when we just did a repair
    if (repairChanges.length > 0 && !undoStack.includes(input)) {
      // Check if this is a manual edit (input doesn't match what repair produced)
      const lastUndo = undoStack[undoStack.length - 1];
      if (lastUndo) {
        // User edited after repair, clear the success message
        setRepairChanges([]);
      }
    }
  }, [debouncedInput, repairChanges.length, undoStack, input]);

  const handleClear = () => {
    setInput('');
    setRepairChanges([]);
    setUndoStack([]);
  };

  // Check if current input can be repaired
  const showRepairButton = useMemo(() => {
    return error && canRepair(debouncedInput);
  }, [error, debouncedInput]);

  const handleRepair = useCallback(() => {
    const result = repairJson(input);
    if (result.success && result.repaired) {
      // Save current input to undo stack
      setUndoStack(prev => [...prev, input]);
      setInput(result.repaired);
      setRepairChanges(result.changes || []);
    }
  }, [input]);

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousInput = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      setInput(previousInput);
      setRepairChanges([]);
    }
  }, [undoStack]);

  const handleFileContent = useCallback((content: string) => {
    setInput(content);
  }, []);

  const handleMinify = useCallback(() => {
    if (!formatted) return;
    const result = minifyJson(formatted);
    if (result.success && result.formatted) {
      setInput(result.formatted);
    }
  }, [formatted]);

  const handleDownload = useCallback((minified: boolean = false) => {
    if (!formatted) return;

    let content = formatted;
    let filename = 'formatted.json';

    if (minified) {
      const result = minifyJson(formatted);
      if (result.success && result.formatted) {
        content = result.formatted;
        filename = 'minified.json';
      }
    }

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [formatted]);

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
        key: 'm',
        shift: true,
        handler: handleMinify,
        description: 'Minify JSON',
      },
      {
        key: 'o',
        shift: false,
        handler: () => fileUploadRef.current?.openFileDialog(),
        description: 'Upload file',
      },
      {
        key: 'f',
        shift: true,
        handler: handleRepair,
        description: 'Fix & Format',
        enabled: !!showRepairButton,
      },
      {
        key: 'z',
        shift: true,
        handler: handleUndo,
        description: 'Undo repair',
        enabled: undoStack.length > 0,
      },
    ],
    [handleMinify, handleRepair, handleUndo, showRepairButton, undoStack.length]
  );

  useKeyboardShortcuts({ shortcuts, enabled: isHydrated });

  return (
    <>
      <JsonLdSchema />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

      <main className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <FileUpload ref={fileUploadRef} onFileContent={handleFileContent} />
              <ToolbarOptions
                indent={indent}
                onIndentChange={handleIndentChange}
                onMinify={handleMinify}
                disabled={!formatted || !!error}
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
              {formatted && !error && (
                <button
                  onClick={() => handleDownload(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              )}
              <div className="hidden lg:block">
                <CopyButton ref={copyButtonRef} text={formatted} disabled={!formatted || !!error} />
              </div>
              <ShortcutsPopover shortcuts={shortcuts} />
            </div>
          </div>

          {/* Error panel or success panel */}
          {(error || repairChanges.length > 0) && (
            <div className="mb-4">
              <ErrorPanel
                error={error}
                canRepair={showRepairButton ?? false}
                onRepair={handleRepair}
                repairChanges={repairChanges}
                canUndo={undoStack.length > 0}
                onUndo={handleUndo}
              />
            </div>
          )}

          {/* Editor panels */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            <div className="min-h-[300px] lg:min-h-[400px]">
              <JsonInput
                value={input}
                onChange={setInput}
                placeholder='Paste your JSON here...\n\nExample:\n{\n  "name": "DevDen",\n  "type": "JSON Formatter"\n}'
              />
            </div>
            <div className="min-h-[300px] lg:min-h-[400px]">
              <JsonOutput
                value={formatted}
                isLoading={isFormatting}
                headerAction={
                  <div className="lg:hidden">
                    <CopyButton text={formatted} disabled={!formatted || !!error} />
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
                  <span className="text-error">Invalid JSON</span>
                ) : (
                  <span className="text-secondary-500">Valid JSON</span>
                )
              )}
              {storageError && (
                <span className="text-amber-500">{storageError}</span>
              )}
            </div>
            <div>
              {formatted && (
                <span>
                  {formatted.split('\n').length} lines
                </span>
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
                JSON Formatter & Validator Online
              </h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Format, beautify, and validate JSON instantly with this free online tool.
                Paste messy JSON from APIs, config files, or databases and get clean, readable
                output with proper indentation and syntax highlighting. All processing happens
                in your browser — your data never leaves your device.
              </p>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-0">
              <CollapsibleSection title="What is JSON?">
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  JSON (JavaScript Object Notation) is a lightweight data interchange format that&apos;s
                  easy for humans to read and write, and easy for machines to parse and generate.
                  It&apos;s the standard format for API responses, configuration files, and data storage
                  in modern web development. JSON supports strings, numbers, booleans, arrays, objects,
                  and null values, making it versatile for representing structured data.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Common Use Cases">
                <ul className="text-sm text-muted-foreground/80 space-y-2">
                  <li><strong>API Development & Debugging</strong> — Format API responses to inspect data structure, debug payloads, and verify endpoint outputs.</li>
                  <li><strong>Configuration Files</strong> — Validate and beautify config files for tools like ESLint, Prettier, package.json, or tsconfig.json.</li>
                  <li><strong>Database Operations</strong> — Format JSON data from MongoDB, PostgreSQL JSONB columns, or NoSQL document stores.</li>
                  <li><strong>Log Analysis</strong> — Parse and format structured JSON logs from applications, AWS CloudWatch, or logging platforms.</li>
                  <li><strong>Data Migration</strong> — Validate JSON before importing into databases or transforming between systems.</li>
                  <li><strong>Documentation</strong> — Create readable JSON examples for API docs, tutorials, or technical specifications.</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Code Examples">
                <p className="text-sm text-muted-foreground/80 mb-4">
                  Working with JSON in your code? Here&apos;s how to parse and format JSON in popular languages:
                </p>
                <CodeExamples
                  storageKey="devden-json-code-lang"
                  examples={[
                    {
                      language: 'javascript',
                      label: 'JavaScript',
                      code: `// Parse JSON string to object
const data = JSON.parse(jsonString);

// Format object to pretty JSON string
const pretty = JSON.stringify(data, null, 2);

// Minify (remove whitespace)
const minified = JSON.stringify(data);

// Handle parse errors
try {
  const parsed = JSON.parse(input);
} catch (e) {
  console.error('Invalid JSON:', e.message);
}`,
                    },
                    {
                      language: 'python',
                      label: 'Python',
                      code: `import json

# Parse JSON string to dict
data = json.loads(json_string)

# Format dict to pretty JSON string
pretty = json.dumps(data, indent=2)

# Minify (compact output)
minified = json.dumps(data, separators=(',', ':'))

# Read/write JSON files
with open('data.json', 'r') as f:
    data = json.load(f)

with open('output.json', 'w') as f:
    json.dump(data, f, indent=2)`,
                    },
                    {
                      language: 'go',
                      label: 'Go',
                      code: `import (
    "encoding/json"
    "bytes"
)

// Parse JSON to struct or map
var data map[string]interface{}
err := json.Unmarshal([]byte(jsonString), &data)

// Format to pretty JSON
pretty, err := json.MarshalIndent(data, "", "  ")

// Minify (compact)
minified, err := json.Marshal(data)

// Pretty print existing JSON
var buf bytes.Buffer
json.Indent(&buf, []byte(jsonString), "", "  ")`,
                    },
                    {
                      language: 'java',
                      label: 'Java',
                      code: `import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;

// Parse JSON string
JsonElement element = JsonParser.parseString(jsonString);

// Format to pretty JSON (Gson)
Gson gson = new GsonBuilder()
    .setPrettyPrinting()
    .create();
String pretty = gson.toJson(element);

// Jackson alternative
ObjectMapper mapper = new ObjectMapper();
Object json = mapper.readValue(jsonString, Object.class);
String pretty = mapper.writerWithDefaultPrettyPrinter()
    .writeValueAsString(json);`,
                    },
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Why Use This Tool">
                <FeatureList
                  features={[
                    'Real-time formatting as you type',
                    'Auto-fix common JSON errors',
                    'Syntax highlighting for readability',
                    'Tree view for complex structures',
                    'Keyboard shortcuts for power users',
                    'Multiple indent options (2, 4, tabs)',
                    'Minify JSON with one click',
                    'File upload support',
                    '100% client-side (data never sent)',
                    'No ads, no signup required',
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Frequently Asked Questions">
                <div className="space-y-4">
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How do I format JSON online?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Paste your JSON into the input panel on the left. The tool automatically formats
                      and validates it in real-time, showing the beautified output on the right with
                      proper indentation and syntax highlighting. You can adjust the indent size (2 spaces,
                      4 spaces, or tabs) using the toolbar options.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What&apos;s the difference between formatting and validation?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Formatting (or beautifying) adds proper indentation and line breaks to make JSON
                      readable, while validation checks if the JSON syntax is correct. This tool does
                      both simultaneously — if your JSON has syntax errors, you&apos;ll see a detailed
                      error message with the line number and position.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Can I fix broken JSON automatically?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Yes. When the tool detects fixable errors (like trailing commas, missing quotes,
                      or single quotes instead of double quotes), a &quot;Fix & Format&quot; button appears.
                      Click it to automatically repair common JSON issues. You can always undo the
                      fix if needed.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What causes JSON parse errors?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Common causes include: trailing commas after the last item, single quotes instead of
                      double quotes, unquoted property names, missing commas between items, comments (JSON
                      doesn&apos;t support comments), and special characters that need escaping. This tool
                      shows the exact line and position of errors to help you fix them quickly.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      JSON vs XML — when should I use JSON?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      JSON is preferred for web APIs, JavaScript applications, and when you need lightweight
                      data interchange. It&apos;s more compact and easier to parse than XML. Use XML when you
                      need document markup, namespaces, schemas (XSD), or when working with legacy systems
                      that require it. Most modern REST APIs use JSON.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Is my data private?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Yes. All formatting and validation happens entirely in your browser using JavaScript.
                      No JSON data is ever sent to any server. Your input is saved in your browser&apos;s
                      localStorage for convenience, but you can clear it anytime.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What indent options are available?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      You can choose between 2 spaces (default), 4 spaces, or tabs for indentation.
                      Use the dropdown in the toolbar to switch. Your preference is saved automatically
                      for future sessions. You can also minify JSON to remove all whitespace.
                    </p>
                  </details>
                </div>
              </CollapsibleSection>
            </div>

            {/* Related Tools */}
            <div className="pt-6 mt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground/60">
                More DevDen tools:{' '}
                <a href="https://llm-pricing.devden.dev" className="hover:text-primary-400 transition-colors">LLM Pricing Calculator <span className="text-primary-400">NEW</span></a>
                {' · '}
                <a href="https://toon.devden.dev" className="hover:text-primary-400 transition-colors">TOON Converter</a>
                {' · '}
                <a href="https://base64.devden.dev" className="hover:text-primary-400 transition-colors">Base64 Encoder/Decoder</a>
                {' · '}
                <a href="https://url-encode.devden.dev" className="hover:text-primary-400 transition-colors">URL Encoder/Decoder</a>
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
              Instant formatting • Auto-fix broken JSON • Keyboard shortcuts • Tree view • 100% private
            </p>
            <p className="text-xs text-muted-foreground/40">
              Format JSON online, beautify API responses, or validate config files. Fast, free, and built for developers.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
