import * as React from 'react';

interface FooterProps {
  /** Feature highlights (first line) */
  features: string;
  /** Tool description (second line) */
  description: string;
  className?: string;
}

export function Footer({ features, description, className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-border py-4 mt-auto ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
        <p className="text-xs text-muted-foreground/40">{features}</p>
        <p className="text-xs text-muted-foreground/40">{description}</p>
      </div>
    </footer>
  );
}

export type { FooterProps };
