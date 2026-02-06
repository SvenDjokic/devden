'use client';

import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Use h3 by default, can be changed for semantic hierarchy */
  headingLevel?: 'h2' | 'h3' | 'h4';
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  headingLevel = 'h3',
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const HeadingTag = headingLevel;

  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={isOpen}
      >
        <HeadingTag className="text-sm font-medium text-muted-foreground group-hover:text-primary-400 transition-colors">
          {title}
        </HeadingTag>
        <svg
          className={`w-4 h-4 text-muted-foreground/60 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* CSS Grid trick: 0fr collapses, 1fr expands to fit content automatically */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
