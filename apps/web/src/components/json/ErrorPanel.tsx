'use client';

import { JsonError } from '@/lib/jsonFormatter';

interface ErrorPanelProps {
  error: JsonError | null;
  canRepair?: boolean;
  onRepair?: () => void;
  repairChanges?: string[];
  canUndo?: boolean;
  onUndo?: () => void;
}

export function ErrorPanel({
  error,
  canRepair,
  onRepair,
  repairChanges,
  canUndo,
  onUndo
}: ErrorPanelProps) {
  // Show success state if we just repaired
  if (!error && repairChanges && repairChanges.length > 0) {
    return (
      <div className="bg-secondary-500/10 border border-secondary-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-secondary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-secondary-500">JSON Fixed!</h3>
              {canUndo && onUndo && (
                <button
                  onClick={onUndo}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Undo
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-foreground/80">
              {repairChanges.join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!error) {
    return null;
  }

  return (
    <div className="bg-error/10 border border-error/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-error">Invalid JSON</h3>
              <p className="mt-1 text-sm text-foreground/80">{error.message}</p>
              {(error.line || error.column) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {error.line && <span>Line {error.line}</span>}
                  {error.line && error.column && <span>, </span>}
                  {error.column && <span>Column {error.column}</span>}
                </p>
              )}
            </div>
            {canRepair && onRepair && (
              <button
                onClick={onRepair}
                className="flex-shrink-0 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Fix & Format
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
