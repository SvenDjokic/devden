'use client';

import { useState, useRef, useCallback, DragEvent } from 'react';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isProcessing?: boolean;
  maxSizeMB?: number;
}

export function FileDropZone({
  onFileSelect,
  selectedFile,
  onClear,
  isProcessing = false,
  maxSizeMB = 100,
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (file.size > maxSizeBytes) {
        setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect, maxSizeBytes, maxSizeMB]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Or Hash a File
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Select file to hash"
      />

      {selectedFile ? (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-10 h-10 bg-secondary-500/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-secondary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                  {isProcessing && ' • Hashing...'}
                </p>
              </div>
            </div>
            <button
              onClick={onClear}
              disabled={isProcessing}
              className="shrink-0 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
            ${
              isDragOver
                ? 'border-secondary-500 bg-secondary-500/5'
                : 'border-border hover:border-muted-foreground/50 hover:bg-card/50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              className={`w-8 h-8 ${isDragOver ? 'text-secondary-500' : 'text-muted-foreground/50'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Drop file here</span> or click to browse
            </div>
            <div className="text-xs text-muted-foreground/70">
              Max {maxSizeMB}MB
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
