'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { PATTERN_CATEGORIES, RegexPattern, ALL_PATTERNS } from '@/lib/regexPatterns';

interface PatternSelectorProps {
  onSelect: (pattern: string, testExample?: string) => void;
}

export function PatternSelector({ onSelect }: PatternSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter patterns based on search
  const filteredPatterns = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return ALL_PATTERNS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handlePatternSelect = (pattern: RegexPattern) => {
    onSelect(pattern.pattern, pattern.testExample);
    setIsOpen(false);
    setSearchQuery('');
    setExpandedCategory(null);
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors"
        aria-label="Select a regex pattern"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span>Patterns</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 max-h-[70vh] bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {/* Search input */}
          <div className="p-2 border-b border-border/50">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patterns..."
              className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Pattern list */}
          <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
            {filteredPatterns ? (
              // Search results
              filteredPatterns.length > 0 ? (
                <div className="p-2">
                  <div className="text-xs text-muted-foreground/60 px-2 py-1 mb-1">
                    {filteredPatterns.length} pattern{filteredPatterns.length !== 1 ? 's' : ''} found
                  </div>
                  {filteredPatterns.map((pattern) => (
                    <PatternItem
                      key={pattern.name}
                      pattern={pattern}
                      onSelect={handlePatternSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No patterns found
                </div>
              )
            ) : (
              // Categories view
              <div className="p-2">
                {PATTERN_CATEGORIES.map((category) => (
                  <div key={category.name} className="mb-1">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="text-xs text-muted-foreground/50">
                          ({category.patterns.length})
                        </span>
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${
                          expandedCategory === category.name ? 'rotate-180' : ''
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {expandedCategory === category.name && (
                      <div className="pl-2 mt-1 space-y-0.5">
                        {category.patterns.map((pattern) => (
                          <PatternItem
                            key={pattern.name}
                            pattern={pattern}
                            onSelect={handlePatternSelect}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-border/50 bg-muted/30">
            <p className="text-xs text-muted-foreground/60 text-center">
              {ALL_PATTERNS.length} patterns available
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual pattern item component
function PatternItem({
  pattern,
  onSelect,
}: {
  pattern: RegexPattern;
  onSelect: (pattern: RegexPattern) => void;
}) {
  return (
    <button
      onClick={() => onSelect(pattern)}
      className="w-full text-left px-2 py-2 rounded-md hover:bg-primary-500/10 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-sm text-foreground group-hover:text-primary-400 transition-colors truncate">
            {pattern.name}
          </div>
          <div className="text-xs text-muted-foreground/60 truncate mt-0.5">
            {pattern.description}
          </div>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-50 transition-opacity"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
      <code className="block text-xs text-primary-400/70 font-mono mt-1 truncate bg-muted/50 px-1.5 py-0.5 rounded">
        {pattern.pattern.length > 45 ? pattern.pattern.slice(0, 45) + '...' : pattern.pattern}
      </code>
    </button>
  );
}
