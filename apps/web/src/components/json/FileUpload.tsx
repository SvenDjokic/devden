'use client';

import { useCallback, useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { getModifierKey } from '@/lib/useKeyboardShortcuts';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

export interface FileUploadRef {
  openFileDialog: () => void;
}

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(function FileUpload({ onFileContent }, ref) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modKey, setModKey] = useState('Ctrl');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setModKey(getModifierKey());
  }, []);

  // Expose openFileDialog method via ref
  useImperativeHandle(ref, () => ({
    openFileDialog: () => {
      fileInputRef.current?.click();
    },
  }));

  const validateAndReadFile = useCallback(
    (file: File) => {
      setError(null);

      // Check file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(
          `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 5MB.`
        );
        return;
      }

      // Check file type (allow .json or text files)
      const isValidType =
        file.type === 'application/json' ||
        file.type === 'text/plain' ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.txt');

      if (!isValidType) {
        setError('Please upload a .json or text file.');
        return;
      }

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          onFileContent(content);
          setError(null);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file.');
      };
      reader.readAsText(file);
    },
    [onFileContent]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        validateAndReadFile(files[0]);
      }
    },
    [validateAndReadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        validateAndReadFile(files[0]);
      }
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [validateAndReadFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="relative">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        title={`Upload file (${modKey}+O)`}
        className={`
          flex items-center justify-center gap-2 px-3 py-1.5 rounded-md cursor-pointer
          text-sm text-muted-foreground transition-all duration-200
          border border-dashed
          ${
            isDragging
              ? 'border-primary-500 bg-primary-500/10 text-primary-500'
              : 'border-border hover:border-primary-500/50 hover:text-foreground'
          }
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span>{isDragging ? 'Drop file' : 'Upload'}</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="absolute top-full left-0 mt-1 text-xs text-error whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
});
