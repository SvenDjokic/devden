'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/hash/Header';
import { TextInput } from '@/components/hash/TextInput';
import { CopyButton, CopyButtonRef } from '@/components/hash/CopyButton';
import { ShortcutsPopover } from '@/components/hash/ShortcutsPopover';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useKeyboardShortcuts, ShortcutConfig } from '@/lib/useKeyboardShortcuts';
import { Algorithm, ALGORITHM_LABELS, ALGORITHMS, EMPTY_HASHES, hashTextAll, hashFileAll } from '@/lib/hash';
import { FileDropZone } from '@/components/hash/FileDropZone';
import { HashSchema } from '@/components/hash/seo/HashSchema';
import { CollapsibleSection } from '@/components/hash/seo/CollapsibleSection';
import { CodeExamples } from '@/components/hash/seo/CodeExamples';

const LOCAL_STORAGE_KEY = 'devden-hash-input';

export default function Home() {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<Algorithm, string>>(EMPTY_HASHES);
  const [isHashing, setIsHashing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hashSource, setHashSource] = useState<'text' | 'file' | null>(null);
  const copyButtonRefs = useRef<Record<Algorithm, CopyButtonRef | null>>({
    md5: null,
    sha1: null,
    sha256: null,
    sha512: null,
  });

  // Persist input to local storage
  const { value: savedInput, setValue: saveInput, error: storageError } = useLocalStorage<string>(
    LOCAL_STORAGE_KEY,
    ''
  );

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

  // Compute hashes when input changes
  const computeHashes = useCallback(async (text: string) => {
    if (!text.trim()) {
      setHashes(EMPTY_HASHES);
      return;
    }

    setIsHashing(true);
    try {
      const results = await hashTextAll(text);
      setHashes(results);
    } catch (error) {
      console.error('Hashing error:', error);
      setHashes(EMPTY_HASHES);
    } finally {
      setIsHashing(false);
    }
  }, []);

  // Debounce hash computation for text input
  useEffect(() => {
    if (!isHydrated || selectedFile) return; // Don't hash text if a file is selected

    const timeoutId = setTimeout(() => {
      computeHashes(input);
      if (input.trim()) {
        setHashSource('text');
      } else {
        setHashSource(null);
      }
    }, 50); // Small debounce for instant feel

    return () => clearTimeout(timeoutId);
  }, [input, isHydrated, computeHashes, selectedFile]);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setIsHashing(true);
    setHashSource('file');

    try {
      const results = await hashFileAll(file);
      setHashes(results);
    } catch (error) {
      console.error('File hashing error:', error);
      setHashes(EMPTY_HASHES);
      setHashSource(null);
    } finally {
      setIsHashing(false);
    }
  }, []);

  // Clear file selection
  const handleFileClear = useCallback(() => {
    setSelectedFile(null);
    setHashSource(null);
    // Re-hash the text input if present
    if (input.trim()) {
      computeHashes(input);
      setHashSource('text');
    } else {
      setHashes(EMPTY_HASHES);
    }
  }, [input, computeHashes]);

  const handleClear = () => {
    setInput('');
    setSelectedFile(null);
    setHashSource(null);
    setHashes(EMPTY_HASHES);
  };

  // Keyboard shortcuts configuration
  const shortcuts: ShortcutConfig[] = [
    {
      key: '1',
      shift: false,
      handler: () => copyButtonRefs.current.md5?.triggerCopy(),
      description: 'Copy MD5',
    },
    {
      key: '2',
      shift: false,
      handler: () => copyButtonRefs.current.sha1?.triggerCopy(),
      description: 'Copy SHA-1',
    },
    {
      key: '3',
      shift: false,
      handler: () => copyButtonRefs.current.sha256?.triggerCopy(),
      description: 'Copy SHA-256',
    },
    {
      key: '4',
      shift: false,
      handler: () => copyButtonRefs.current.sha512?.triggerCopy(),
      description: 'Copy SHA-512',
    },
  ];

  useKeyboardShortcuts({ shortcuts, enabled: isHydrated });

  return (
    <>
      <HashSchema />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
            {/* Action bar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  All hashes generated instantly
                </span>
                {(input.trim() || selectedFile) && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ShortcutsPopover shortcuts={shortcuts} />
              </div>
            </div>

            {/* Editor panels - side by side */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
              {/* Input panel */}
              <div className="min-h-[300px] lg:min-h-[400px] flex flex-col gap-4">
                <div className="flex-1">
                  <TextInput
                    value={input}
                    onChange={(val) => {
                      setInput(val);
                      // Clear file when typing text
                      if (val.trim() && selectedFile) {
                        setSelectedFile(null);
                      }
                    }}
                    placeholder="Enter text to hash...

Type or paste any text and all hash values will be calculated instantly."
                    label="Text Input"
                  />
                </div>
                <FileDropZone
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onClear={handleFileClear}
                  isProcessing={isHashing && hashSource === 'file'}
                  maxSizeMB={100}
                />
              </div>

              {/* Hash outputs panel */}
              <div className="min-h-[300px] lg:min-h-[400px] flex flex-col">
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Hash Outputs
                </div>
                <div className="flex-1 bg-card border border-border rounded-lg p-4 space-y-4 font-mono text-sm overflow-auto">
                  {ALGORITHMS.map((algo) => (
                    <div key={algo} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {ALGORITHM_LABELS[algo]}
                          {algo === 'md5' && (
                            <span className="ml-2 text-amber-500/70 normal-case tracking-normal">
                              (insecure)
                            </span>
                          )}
                          {algo === 'sha1' && (
                            <span className="ml-2 text-amber-500/70 normal-case tracking-normal">
                              (weak)
                            </span>
                          )}
                        </span>
                        <CopyButton
                          ref={(el) => { copyButtonRefs.current[algo] = el; }}
                          text={hashes[algo]}
                          disabled={!hashes[algo]}
                          size="sm"
                        />
                      </div>
                      <div className="bg-background/50 rounded px-3 py-2 break-all text-foreground/90 min-h-[2.5rem] flex items-center">
                        {hashes[algo] || (
                          <span className="text-muted-foreground/50 italic">
                            Enter text or drop a file
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                {isHashing && (
                  <span className="text-muted-foreground">Computing hashes...</span>
                )}
                {!isHashing && hashSource === 'text' && hashes.sha256 && (
                  <span className="text-secondary-500">Hashes generated from text</span>
                )}
                {!isHashing && hashSource === 'file' && hashes.sha256 && (
                  <span className="text-secondary-500">Hashes generated from file</span>
                )}
                {storageError && (
                  <span className="text-amber-500">{storageError}</span>
                )}
              </div>
              <div>
                {hashSource === 'text' && input && (
                  <span>{input.length} characters</span>
                )}
                {hashSource === 'file' && selectedFile && (
                  <span>{selectedFile.name}</span>
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
                Online Hash Generator - MD5, SHA-256, SHA-512
              </h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Generate cryptographic hashes instantly with this free online tool. Supports MD5, SHA-1, SHA-256, and SHA-512 algorithms.
                Compute all hash values at once from text or files. All processing happens in your browser — your data never leaves your device.
              </p>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-0">
              <CollapsibleSection title="What is Hashing?">
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  A cryptographic hash function is a mathematical algorithm that transforms any input data into a fixed-size string of characters (the hash or digest).
                  Key properties include: <strong>deterministic</strong> (same input always produces the same output), <strong>one-way</strong> (impossible to reverse),
                  <strong>collision-resistant</strong> (extremely hard to find two different inputs with the same hash), and <strong>avalanche effect</strong> (small input changes create completely different hashes).
                  Common uses include file integrity verification, password storage, digital signatures, and data deduplication.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Common Use Cases">
                <ul className="text-sm text-muted-foreground/80 space-y-2">
                  <li><strong>File Integrity Verification</strong> — Verify downloaded files match the original by comparing checksums (SHA-256 is standard).</li>
                  <li><strong>Password Storage</strong> — Store password hashes instead of plaintext (use SHA-256/512 with salt, or bcrypt/Argon2).</li>
                  <li><strong>Digital Signatures</strong> — Sign document hashes for authenticity verification in certificates and contracts.</li>
                  <li><strong>Data Deduplication</strong> — Identify duplicate files by comparing hashes without reading full content.</li>
                  <li><strong>Cache Keys</strong> — Generate unique cache identifiers from request parameters or content.</li>
                  <li><strong>Git Commits</strong> — Git uses SHA-1 to identify commits, trees, and blobs uniquely.</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="MD5 vs SHA-256: Security Considerations">
                <div className="text-sm text-muted-foreground/80 space-y-3">
                  <p>
                    <strong className="text-amber-500/90">MD5 is cryptographically broken</strong> and should never be used for security purposes.
                    Collision attacks can generate different inputs with identical MD5 hashes in seconds. However, MD5 is still acceptable for non-security uses like checksums, cache keys, or fingerprinting.
                  </p>
                  <p>
                    <strong className="text-amber-500/90">SHA-1 is deprecated</strong> for security use. While harder to attack than MD5, practical collisions have been demonstrated. Use SHA-256 or higher for any security-sensitive application.
                  </p>
                  <p>
                    <strong className="text-primary-400">SHA-256 and SHA-512</strong> are currently considered secure for all purposes.
                    SHA-256 is the most widely used, offering excellent security with good performance. SHA-512 provides larger output (512 bits vs 256 bits) and can be faster on 64-bit systems.
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Code Examples">
                <p className="text-sm text-muted-foreground/80 mb-4">
                  Generate hashes in your code using these snippets for popular languages:
                </p>
                <CodeExamples
                  storageKey="devden-hash-code-lang"
                  examples={[
                    {
                      language: 'javascript',
                      label: 'JavaScript',
                      code: `// Browser - SHA-256 with Web Crypto API
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Usage
const hash = await sha256('Hello World');
// Result: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"

// Node.js - crypto module
const crypto = require('crypto');
const hash = crypto.createHash('sha256')
  .update('Hello World')
  .digest('hex');`,
                    },
                    {
                      language: 'python',
                      label: 'Python',
                      code: `import hashlib

# SHA-256
text = "Hello World"
hash_sha256 = hashlib.sha256(text.encode()).hexdigest()
# Result: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"

# MD5 (non-security use only)
hash_md5 = hashlib.md5(text.encode()).hexdigest()
# Result: "b10a8db164e0754105b7a99be72e3fe5"

# Hash a file
def hash_file(filepath, algorithm='sha256'):
    h = hashlib.new(algorithm)
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            h.update(chunk)
    return h.hexdigest()`,
                    },
                    {
                      language: 'go',
                      label: 'Go',
                      code: `import (
    "crypto/sha256"
    "encoding/hex"
)

// SHA-256
func sha256Hash(text string) string {
    h := sha256.New()
    h.Write([]byte(text))
    return hex.EncodeToString(h.Sum(nil))
}

// Usage
hash := sha256Hash("Hello World")
// Result: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"

// Hash a file
func hashFile(filepath string) (string, error) {
    f, err := os.Open(filepath)
    if err != nil { return "", err }
    defer f.Close()
    h := sha256.New()
    if _, err := io.Copy(h, f); err != nil { return "", err }
    return hex.EncodeToString(h.Sum(nil)), nil
}`,
                    },
                    {
                      language: 'java',
                      label: 'Java',
                      code: `import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

// SHA-256
public static String sha256(String text) throws Exception {
    MessageDigest md = MessageDigest.getInstance("SHA-256");
    byte[] hash = md.digest(text.getBytes(StandardCharsets.UTF_8));
    StringBuilder sb = new StringBuilder();
    for (byte b : hash) {
        sb.append(String.format("%02x", b));
    }
    return sb.toString();
}

// Usage
String hash = sha256("Hello World");
// Result: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"

// Available algorithms: MD5, SHA-1, SHA-256, SHA-384, SHA-512`,
                    },
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Frequently Asked Questions">
                <div className="text-sm text-muted-foreground/80 space-y-4">
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Is my data safe using this tool?</p>
                    <p>Yes, all hashing happens entirely in your browser using JavaScript. Your data never leaves your device and is never sent to any server.</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Can I hash large files?</p>
                    <p>Yes, files up to 100MB are supported. Larger files may cause browser performance issues. For very large files, consider using command-line tools.</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Why do all four hashes compute at once?</p>
                    <p>For convenience. When verifying a file checksum, you might not know which algorithm was used. Computing all at once lets you quickly match against any hash format.</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Can I reverse a hash to get the original text?</p>
                    <p>No. Hash functions are one-way by design. You cannot mathematically reverse a hash. However, common passwords can be found using rainbow tables or brute force.</p>
                  </div>
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
                <a href="https://url-encode.devden.dev" className="hover:text-primary-400 transition-colors">URL Encoder/Decoder</a>
                {' · '}
                <a href="https://timestamp.devden.dev" className="hover:text-primary-400 transition-colors">Unix Timestamp Converter</a>
                {' · '}
                <a href="https://regex.devden.dev" className="hover:text-primary-400 transition-colors">Regex Tester</a>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
            <p className="text-xs text-muted-foreground/40">
              MD5 · SHA-1 · SHA-256 · SHA-512 · All hashes at once · 100% private
            </p>
            <p className="text-xs text-muted-foreground/40">
              Generate secure hashes from text online. Fast, free, and built for developers.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
