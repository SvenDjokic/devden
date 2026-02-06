'use client';

import { ReactNode } from 'react';

interface TextOutputProps {
  value: string;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  headerAction?: ReactNode;
}

export function TextOutput({
  value,
  isLoading,
  label = 'Output',
  placeholder = 'Result will appear here',
  headerAction,
}: TextOutputProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-muted-foreground">
            {label}
          </label>
          {headerAction}
        </div>
        <div className="flex-1 w-full p-4 bg-card border border-border rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Converting...</span>
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-muted-foreground">
            {label}
          </label>
          {headerAction}
        </div>
        <div className="flex-1 w-full p-4 bg-card border border-border rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">{placeholder}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        {headerAction}
      </div>
      <div className="flex-1 w-full bg-card border border-border rounded-lg overflow-auto">
        <pre className="code p-4 text-sm leading-relaxed whitespace-pre-wrap break-all">
          {value}
        </pre>
      </div>
    </div>
  );
}
