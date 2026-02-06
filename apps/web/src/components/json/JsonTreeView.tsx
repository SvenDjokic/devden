'use client';

import { useState, useCallback, useMemo } from 'react';

interface JsonTreeViewProps {
  data: unknown;
  defaultExpanded?: boolean;
}

interface TreeNodeProps {
  keyName: string | null;
  value: unknown;
  depth: number;
  defaultExpanded: boolean;
}

function TreeNode({ keyName, value, depth, defaultExpanded }: TreeNodeProps) {
  // Only auto-expand first 2 levels by default
  const [isExpanded, setIsExpanded] = useState(defaultExpanded && depth < 2);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const indent = depth * 16;

  // Determine value type
  const valueType = useMemo(() => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }, [value]);

  // Get entries for objects/arrays (always compute to satisfy hooks rules)
  const entries = useMemo(() => {
    if (value === null || typeof value !== 'object') {
      return [];
    }
    if (Array.isArray(value)) {
      return value.map((item, index) => ({ key: String(index), value: item }));
    }
    return Object.entries(value as Record<string, unknown>).map(
      ([key, val]) => ({ key, value: val })
    );
  }, [value]);

  // Render primitive values
  if (valueType !== 'object' && valueType !== 'array') {
    return (
      <div className="flex items-start py-0.5" style={{ paddingLeft: indent }}>
        {keyName !== null && (
          <span className="text-primary-400 mr-1">&quot;{keyName}&quot;:</span>
        )}
        <span
          className={
            valueType === 'string'
              ? 'text-secondary-400'
              : valueType === 'number'
                ? 'text-amber-400'
                : valueType === 'boolean'
                  ? 'text-purple-400'
                  : 'text-muted-foreground'
          }
        >
          {valueType === 'string' ? `"${String(value)}"` : String(value)}
        </span>
      </div>
    );
  }

  // Render object or array
  const isArray = valueType === 'array';
  const isEmpty = entries.length === 0;
  const bracketOpen = isArray ? '[' : '{';
  const bracketClose = isArray ? ']' : '}';

  if (isEmpty) {
    return (
      <div className="flex items-start py-0.5" style={{ paddingLeft: indent }}>
        {keyName !== null && (
          <span className="text-primary-400 mr-1">&quot;{keyName}&quot;:</span>
        )}
        <span className="text-muted-foreground">
          {bracketOpen}
          {bracketClose}
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Header line with expand/collapse toggle */}
      <div
        className="flex items-start py-0.5 cursor-pointer hover:bg-white/5 rounded"
        style={{ paddingLeft: indent }}
        onClick={toggleExpand}
      >
        <span className="w-4 h-4 flex items-center justify-center text-muted-foreground mr-1 select-none">
          {isExpanded ? '▼' : '▶'}
        </span>
        {keyName !== null && (
          <span className="text-primary-400 mr-1">&quot;{keyName}&quot;:</span>
        )}
        <span className="text-muted-foreground">
          {bracketOpen}
          {!isExpanded && (
            <span className="text-muted-foreground/60">
              {' '}
              {entries.length} {isArray ? 'items' : 'keys'}{' '}
            </span>
          )}
          {!isExpanded && bracketClose}
        </span>
      </div>

      {/* Children */}
      {isExpanded && (
        <>
          {entries.map(({ key, value: childValue }) => (
            <TreeNode
              key={key}
              keyName={isArray ? null : key}
              value={childValue}
              depth={depth + 1}
              defaultExpanded={defaultExpanded}
            />
          ))}
          <div
            className="py-0.5 text-muted-foreground"
            style={{ paddingLeft: indent }}
          >
            {bracketClose}
          </div>
        </>
      )}
    </div>
  );
}

export function JsonTreeView({ data, defaultExpanded = true }: JsonTreeViewProps) {
  if (data === undefined) {
    return (
      <div className="text-muted-foreground text-sm">No data to display</div>
    );
  }

  return (
    <div className="code text-sm font-mono overflow-auto">
      <TreeNode
        keyName={null}
        value={data}
        depth={0}
        defaultExpanded={defaultExpanded}
      />
    </div>
  );
}
