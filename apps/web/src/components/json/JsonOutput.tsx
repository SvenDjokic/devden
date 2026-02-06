'use client';

import { useState, useMemo, useCallback, ReactNode } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { JsonTreeView } from './JsonTreeView';

type ViewMode = 'code' | 'tree';

interface JsonOutputProps {
  value: string;
  isLoading?: boolean;
  headerAction?: ReactNode;
}

export function JsonOutput({ value, isLoading, headerAction }: JsonOutputProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('code');

  const parsedData = useMemo(() => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }, [value]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-muted-foreground">
            Output
          </label>
          {headerAction}
        </div>
        <div className="flex-1 w-full p-4 bg-card border border-border rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Formatting...</span>
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-muted-foreground">
            Output
          </label>
          {headerAction}
        </div>
        <div className="flex-1 w-full p-4 bg-card border border-border rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">
            Formatted JSON will appear here
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-muted-foreground">
          Output
        </label>
        <div className="flex items-center gap-2">
          {headerAction}
          <div className="flex items-center gap-1 bg-card border border-border rounded-md p-0.5">
          <button
            onClick={() => handleViewModeChange('code')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              viewMode === 'code'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => handleViewModeChange('tree')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              viewMode === 'tree'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tree
          </button>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full bg-card border border-border rounded-lg overflow-auto">
        {viewMode === 'code' ? (
          <Highlight theme={themes.nightOwl} code={value} language="json">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} p-4 text-sm leading-relaxed`}
                style={{ ...style, background: 'transparent', margin: 0 }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="inline-block w-8 text-right mr-4 text-muted-foreground select-none opacity-50">
                      {i + 1}
                    </span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        ) : (
          <div className="p-4">
            {parsedData !== null ? (
              <JsonTreeView data={parsedData} />
            ) : (
              <span className="text-muted-foreground">
                Unable to parse JSON for tree view
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
