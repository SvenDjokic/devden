'use client';

import { useState, useEffect } from 'react';

interface CodeExample {
  language: string;
  label: string;
  code: string;
}

interface CodeExamplesProps {
  examples: CodeExample[];
  storageKey?: string;
}

export function CodeExamples({
  examples,
  storageKey = 'devden-code-lang',
}: CodeExamplesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved language preference
  useEffect(() => {
    setIsHydrated(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const index = examples.findIndex((e) => e.language === saved);
        if (index !== -1) setActiveIndex(index);
      }
    } catch {
      // localStorage not available
    }
  }, [examples, storageKey]);

  const handleTabChange = (index: number) => {
    setActiveIndex(index);
    try {
      localStorage.setItem(storageKey, examples[index].language);
    } catch {
      // localStorage not available
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(examples[activeIndex].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      {/* Language tabs */}
      <div className="flex border-b border-border/50 bg-card/50">
        {examples.map((example, index) => (
          <button
            key={example.language}
            onClick={() => handleTabChange(index)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeIndex === index
                ? 'text-primary-400 bg-card border-b-2 border-primary-400 -mb-[1px]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {example.label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <div className="relative">
        <pre className="p-4 bg-card overflow-x-auto overflow-y-auto max-h-[400px]">
          <code className="text-xs text-muted-foreground/90 font-mono whitespace-pre">
            {examples[activeIndex].code}
          </code>
        </pre>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground bg-background/80 rounded border border-border/50 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
