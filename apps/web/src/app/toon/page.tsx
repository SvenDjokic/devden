'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/toon/Header';
import { TextInput } from '@/components/toon/TextInput';
import { TextOutput } from '@/components/toon/TextOutput';
import { ShortcutsPopover } from '@/components/toon/ShortcutsPopover';
import { CollapsibleSection, CodeExamples } from '@devden/ui';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useKeyboardShortcuts, ShortcutConfig } from '@/lib/useKeyboardShortcuts';
import {
  InputFormat,
  ConversionDirection,
  ConversionResult,
  convertToToon,
  convertToJson,
  detectInputFormat,
  LLM_MODELS,
  LlmModel,
  calculateCostSavings,
  TOON_EXAMPLES,
  PRICES_LAST_UPDATED,
  estimateTokens,
} from '@/lib/toon';
import { encode } from '@toon-format/toon';

// Pre-calculate savings for examples (at module level for performance)
const exampleSavings = TOON_EXAMPLES.map((example) => {
  try {
    const jsonTokens = estimateTokens(example.json);
    const data = JSON.parse(example.json);
    const toon = encode(data);
    const toonTokens = estimateTokens(toon);
    const savedPercentage = jsonTokens > 0 ? Math.round(((jsonTokens - toonTokens) / jsonTokens) * 100) : 0;
    return { id: example.id, savedPercentage };
  } catch {
    return { id: example.id, savedPercentage: 0 };
  }
});

const LOCAL_STORAGE_KEY = 'devden-toon-input';
const LOCAL_STORAGE_MODEL_KEY = 'devden-toon-model';

const DEFAULT_INPUT = `{
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ],
  "meta": {
    "total": 2,
    "page": 1
  }
}`;

export default function Home() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [inputFormat, setInputFormat] = useState<InputFormat>('json');
  const [direction, setDirection] = useState<ConversionDirection>('toToon');
  const [selectedModel, setSelectedModel] = useState<LlmModel>(LLM_MODELS[0]);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Persist input to local storage
  const { value: savedInput, setValue: saveInput } = useLocalStorage<string>(
    LOCAL_STORAGE_KEY,
    DEFAULT_INPUT
  );
  const { value: savedModelId, setValue: saveModelId } = useLocalStorage<string>(
    LOCAL_STORAGE_MODEL_KEY,
    LLM_MODELS[0].id
  );

  // Load saved input on hydration
  useEffect(() => {
    if (savedInput && !isHydrated) {
      setInput(savedInput);
    }
    if (savedModelId && !isHydrated) {
      const model = LLM_MODELS.find(m => m.id === savedModelId);
      if (model) setSelectedModel(model);
    }
    setIsHydrated(true);
  }, [savedInput, savedModelId, isHydrated]);

  // Save input to local storage when it changes
  useEffect(() => {
    if (isHydrated && input !== savedInput) {
      saveInput(input);
    }
  }, [input, isHydrated, savedInput, saveInput]);

  // Auto-detect input format
  useEffect(() => {
    if (isHydrated && input.trim()) {
      const detected = detectInputFormat(input);
      setInputFormat(detected);
      // Auto-set direction based on detected format
      if (detected === 'toon') {
        setDirection('toJson');
      } else {
        setDirection('toToon');
      }
    }
  }, [input, isHydrated]);

  // Convert function
  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(undefined);
      setResult(null);
      return;
    }

    let conversionResult: ConversionResult;

    if (direction === 'toToon') {
      conversionResult = convertToToon(input, inputFormat);
    } else {
      conversionResult = convertToJson(input);
    }

    if (conversionResult.success) {
      setOutput(conversionResult.output);
      setError(undefined);
      setResult(conversionResult);
    } else {
      setOutput('');
      setError(conversionResult.error);
      setResult(null);
    }
  }, [input, direction, inputFormat]);

  // Auto-convert on input change (debounced)
  useEffect(() => {
    if (!isHydrated) return;

    const timeoutId = setTimeout(() => {
      handleConvert();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [input, direction, inputFormat, isHydrated, handleConvert]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(undefined);
    setResult(null);
  };

  const handleSwap = () => {
    if (output && !error) {
      setInput(output);
      setDirection(direction === 'toToon' ? 'toJson' : 'toToon');
    }
  };

  const handleLoadExample = (json: string) => {
    setInput(json);
    setDirection('toToon');
  };

  const handleModelChange = (modelId: string) => {
    const model = LLM_MODELS.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      saveModelId(modelId);
    }
  };

  // Keyboard shortcuts (Cmd/Ctrl is handled automatically by the hook)
  const shortcuts: ShortcutConfig[] = [
    {
      key: 'Enter',
      handler: handleConvert,
      description: 'Convert',
    },
    {
      key: 's',
      handler: handleSwap,
      description: 'Swap input/output',
    },
  ];

  useKeyboardShortcuts({ shortcuts, enabled: isHydrated });

  // Calculate cost savings
  const costSavings = result && result.savedTokens > 0
    ? calculateCostSavings(result.savedTokens, selectedModel)
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {/* Direction toggle */}
              <div className="flex items-center bg-card border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setDirection('toToon')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    direction === 'toToon'
                      ? 'bg-primary-600 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  To TOON
                </button>
                <button
                  onClick={() => setDirection('toJson')}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    direction === 'toJson'
                      ? 'bg-primary-600 text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  To JSON
                </button>
              </div>

              {/* Input format indicator */}
              <span className="text-xs text-muted-foreground">
                Detected: <span className="text-foreground font-medium uppercase">{inputFormat}</span>
              </span>

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
              {output && !error && (
                <button
                  onClick={handleSwap}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <span>⇄</span> Swap
                </button>
              )}
              <ShortcutsPopover shortcuts={shortcuts} />
            </div>
          </div>

          {/* Editor panels */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            {/* Input panel */}
            <div className="min-h-[300px] lg:min-h-[400px]">
              <TextInput
                value={input}
                onChange={setInput}
                placeholder={`Paste your ${direction === 'toToon' ? 'JSON or YAML' : 'TOON'} here...`}
                label={direction === 'toToon' ? 'Input (JSON / YAML)' : 'Input (TOON)'}
              />
            </div>

            {/* Output panel */}
            <div className="min-h-[300px] lg:min-h-[400px]">
              <TextOutput
                value={output}
                error={error}
                label={direction === 'toToon' ? 'Output (TOON)' : 'Output (JSON)'}
              />
            </div>
          </div>

          {/* Token comparison & cost savings */}
          {result && result.success && (
            <div className="mt-4 p-4 bg-card border border-border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* Left section: Token flow + Savings - all on one line */}
                <div className="flex items-center gap-2 text-sm">
                  {/* Token flow */}
                  <span className="font-mono text-muted-foreground">{result.inputTokens.toLocaleString()}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono text-muted-foreground">{result.outputTokens.toLocaleString()}</span>
                  <span className="text-muted-foreground hidden sm:inline">tokens</span>

                  {/* Savings - inline with separator */}
                  {result.savedTokens > 0 && (
                    <>
                      <span className="text-border mx-1">|</span>
                      <span className="font-semibold text-secondary-400">
                        {result.savedTokens.toLocaleString()} tokens saved
                      </span>
                      <span className="text-secondary-500 font-medium">
                        -{result.savedPercentage.toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>

                {/* Right section: Cost calculator */}
                {result.savedTokens > 0 && costSavings && (
                  <div className="flex items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    {/* Cost display */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg sm:text-xl font-bold text-foreground">
                        ${(costSavings.totalSaved * 1000).toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">/ 1K requests</span>
                    </div>

                    {/* Model selector - lighter background with arrow */}
                    <div className="relative">
                      <select
                        value={selectedModel.id}
                        onChange={(e) => handleModelChange(e.target.value)}
                        className="appearance-none bg-card border border-border rounded px-2 py-1.5 pr-7 text-xs cursor-pointer hover:border-muted-foreground/50 transition-colors"
                        title={`Prices updated ${PRICES_LAST_UPDATED}`}
                      >
                        {LLM_MODELS.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="mt-4">
            <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Load Example
            </div>
            <div className="flex flex-wrap gap-2">
              {TOON_EXAMPLES.map((example) => {
                const savings = exampleSavings.find(s => s.id === example.id);
                return (
                  <button
                    key={example.id}
                    onClick={() => handleLoadExample(example.json)}
                    className="px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:border-primary-500 hover:text-primary-400 transition-colors flex items-center gap-2"
                  >
                    <span>{example.name}</span>
                    {savings && savings.savedPercentage > 0 && (
                      <span className="text-[10px] text-secondary-500 font-medium">
                        -{savings.savedPercentage}%
                      </span>
                    )}
                  </button>
                );
              })}
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
              JSON to TOON Converter — Reduce LLM Token Costs
            </h2>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Convert JSON and YAML to TOON (Token-Oriented Object Notation) instantly with this free online tool.
              TOON is a compact data format designed specifically for LLM applications, reducing token usage by 30-60%
              compared to JSON. All processing happens in your browser — your data never leaves your device.
            </p>
          </div>

          {/* Collapsible sections */}
          <div className="space-y-0">
            <CollapsibleSection title="What is TOON?">
              <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3">
                TOON (Token-Oriented Object Notation) is a data format released in November 2025, designed to minimize
                token usage when sending structured data to Large Language Models (LLMs). Unlike JSON, which uses
                quotes, colons, and braces extensively, TOON uses a more compact syntax that LLM tokenizers process
                more efficiently.
              </p>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                The format was created specifically to address the cost and context-window limitations of LLM APIs,
                where every token counts. By switching from JSON to TOON for your structured prompts, you can
                significantly reduce API costs and fit more data within context limits.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="Why Use TOON for LLMs?">
              <ul className="text-sm text-muted-foreground/80 space-y-2">
                <li><strong>30-60% Token Reduction</strong> — TOON&apos;s compact syntax uses fewer tokens than equivalent JSON, directly reducing your LLM API costs.</li>
                <li><strong>More Context Space</strong> — Fit more data within your model&apos;s context window by using a more efficient format for structured data.</li>
                <li><strong>LLM-Native Design</strong> — TOON was designed with tokenizer behavior in mind, optimizing for how models actually process text.</li>
                <li><strong>Easy Conversion</strong> — Convert existing JSON data to TOON without changing your data structure or application logic.</li>
                <li><strong>Bidirectional</strong> — Convert back to JSON when needed for parsing or debugging.</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="TOON vs JSON Comparison">
              <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3">
                Here&apos;s how the same data looks in JSON versus TOON:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">JSON (verbose)</p>
                  <pre className="text-xs bg-card p-3 rounded border border-border overflow-x-auto">
{`{
  "name": "Alice",
  "role": "admin",
  "active": true
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">TOON (compact)</p>
                  <pre className="text-xs bg-card p-3 rounded border border-border overflow-x-auto">
{`name: Alice
role: admin
active: true`}
                  </pre>
                </div>
              </div>
              <p className="text-sm text-muted-foreground/80 leading-relaxed mt-3">
                Notice how TOON eliminates quotes around keys and string values (when unambiguous), removes curly braces,
                and uses newlines instead of commas. These small changes compound significantly with larger data structures.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="TOON Syntax Guide">
              <div className="text-sm text-muted-foreground/80 space-y-3">
                <p><strong>Objects:</strong> Key-value pairs separated by newlines, no braces needed for root objects.</p>
                <pre className="text-xs bg-card p-2 rounded border border-border">name: Alice{'\n'}age: 30</pre>

                <p><strong>Arrays:</strong> Use square brackets with items separated by newlines or commas.</p>
                <pre className="text-xs bg-card p-2 rounded border border-border">items[3]: apple, banana, cherry</pre>

                <p><strong>Nested Objects:</strong> Inline with curly braces or indented blocks.</p>
                <pre className="text-xs bg-card p-2 rounded border border-border">user{'{'}name: Alice, role: admin{'}'}</pre>

                <p><strong>Arrays of Objects:</strong> Use indexed notation with field templates.</p>
                <pre className="text-xs bg-card p-2 rounded border border-border">users[2]{'{'}id,name{'}'}: 1, Alice, 2, Bob</pre>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Code Examples">
              <p className="text-sm text-muted-foreground/80 mb-4">
                Working with TOON in your code? Here&apos;s how to convert JSON to TOON in popular languages:
              </p>
              <CodeExamples
                storageKey="devden-toon-code-lang"
                examples={[
                  {
                    language: 'javascript',
                    label: 'JavaScript',
                    code: `import { encode, decode } from '@toon-format/toon';

// Convert JSON object to TOON string
const data = { name: 'Alice', role: 'admin' };
const toon = encode(data);
// Result: "name: Alice\\nrole: admin"

// Convert TOON string back to JSON object
const parsed = decode(toon);
// Result: { name: 'Alice', role: 'admin' }

// Use with LLM APIs
const prompt = \`Here is the user data:\\n\${toon}\\n\\nAnalyze this user.\`;`,
                  },
                  {
                    language: 'python',
                    label: 'Python',
                    code: `# Note: Python TOON library (toon-format) coming soon
# For now, use the JavaScript SDK via subprocess or API

import subprocess
import json

def json_to_toon(data):
    """Convert JSON to TOON using Node.js"""
    result = subprocess.run(
        ['node', '-e', f'''
        const {{ encode }} = require("@toon-format/toon");
        console.log(encode({json.dumps(data)}));
        '''],
        capture_output=True, text=True
    )
    return result.stdout.strip()

# Or use this web tool's API (coming soon)`,
                  },
                  {
                    language: 'typescript',
                    label: 'TypeScript',
                    code: `import { encode, decode } from '@toon-format/toon';

interface User {
  name: string;
  role: string;
  active: boolean;
}

const user: User = {
  name: 'Alice',
  role: 'admin',
  active: true
};

// Type-safe encoding
const toon: string = encode(user);

// Type-safe decoding (use with caution)
const parsed = decode(toon) as User;`,
                  },
                ]}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Frequently Asked Questions">
              <div className="space-y-4">
                <details className="group">
                  <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                    How much can I save by using TOON?
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                    Typical savings range from 30-60% depending on your data structure. Data with many quoted strings,
                    nested objects, and arrays see the biggest improvements. Use the cost calculator above to see
                    exact savings for your specific data with different LLM providers.
                  </p>
                </details>
                <details className="group">
                  <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                    Can LLMs understand TOON format?
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                    Yes! Modern LLMs like GPT-4, Claude, and Gemini can parse and understand TOON format without any
                    special instructions. The format is human-readable and the models treat it like any structured text.
                    For best results, briefly mention that the data is in TOON format in your prompt.
                  </p>
                </details>
                <details className="group">
                  <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                    Is my data private?
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                    Yes. All conversion happens entirely in your browser using JavaScript. No data is ever sent to any
                    server. Your input is saved in your browser&apos;s localStorage for convenience, but you can clear it anytime.
                  </p>
                </details>
                <details className="group">
                  <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                    When should I NOT use TOON?
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                    TOON is optimized for sending data TO LLMs. If you need the LLM to output structured data that you&apos;ll
                    parse programmatically, JSON is still better because it has more robust parsing libraries. Also, if
                    your data is already small or you&apos;re not hitting context limits, the complexity of adding TOON
                    conversion may not be worth it.
                  </p>
                </details>
                <details className="group">
                  <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                    How accurate is the token count?
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                    The token counts shown are estimates based on typical LLM tokenizer behavior. Actual token counts
                    vary slightly between models (GPT uses tiktoken, Claude uses its own tokenizer). The estimates are
                    accurate enough for cost comparison purposes — expect ±5% variance from actual API token counts.
                  </p>
                </details>
                <details className="group">
                  <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                    Does TOON support all JSON features?
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                    Yes. TOON supports all JSON data types: strings, numbers, booleans, null, arrays, and nested objects.
                    The conversion is lossless — you can convert JSON to TOON and back without losing any data.
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
              <a href="https://json.devden.dev" className="hover:text-primary-400 transition-colors">JSON Formatter</a>
              {' · '}
              <a href="https://base64.devden.dev" className="hover:text-primary-400 transition-colors">Base64 Encoder</a>
              {' · '}
              <a href="https://url-encode.devden.dev" className="hover:text-primary-400 transition-colors">URL Encoder</a>
              {' · '}
              <a href="https://timestamp.devden.dev" className="hover:text-primary-400 transition-colors">Unix Timestamp</a>
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
            JSON to TOON · YAML to TOON · Token-Oriented Object Notation · 100% private
          </p>
          <p className="text-xs text-muted-foreground/40">
            Reduce LLM token costs by 30-60%. Fast, free, and built for developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
