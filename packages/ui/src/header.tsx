'use client';

import * as React from 'react';

interface HeaderProps {
  /** Tool name displayed after "DevDen" */
  toolName: string;
  /** Icon content (text or React node) */
  icon: React.ReactNode;
  /** SR-only title for accessibility */
  srTitle: string;
  /** Function to open mobile menu */
  onOpenMobileMenu: () => void;
  /** Optional right side content */
  rightContent?: React.ReactNode;
  className?: string;
}

export function Header({
  toolName,
  icon,
  srTitle,
  onOpenMobileMenu,
  rightContent,
  className = '',
}: HeaderProps) {
  return (
    <header
      className={`border-b border-border bg-card/50 backdrop-blur-sm lg:hidden ${className}`}
    >
      <div className="px-4 sm:px-6">
        <h1 className="sr-only">{srTitle}</h1>
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {/* Hamburger menu button for mobile sidebar */}
            <button
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{icon}</span>
              </div>
              <span className="font-semibold text-sm text-foreground">
                DevDen <span className="text-muted-foreground font-normal">{toolName}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {rightContent || (
              <span className="text-xs text-muted-foreground hidden sm:inline">
                100% client-side
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export type { HeaderProps };
