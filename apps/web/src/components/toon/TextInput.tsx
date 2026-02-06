'use client';

import { forwardRef, useCallback, useEffect, useRef } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  readOnly?: boolean;
  className?: string;
}

export const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  function TextInput({ value, onChange, placeholder, label, readOnly = false, className = '' }, ref) {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Handle tab key to insert actual tab character
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);

        // Set cursor position after the inserted spaces
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    }, [value, onChange]);

    // Auto-resize based on content
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 300)}px`;
      }
    }, [value, textareaRef]);

    return (
      <div className={`flex flex-col h-full ${className}`}>
        {label && (
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            {label}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={`
            flex-1 w-full min-h-[300px] p-4 font-mono text-sm
            bg-card border border-border rounded-lg
            placeholder:text-muted-foreground/50
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            resize-none overflow-auto
            ${readOnly ? 'cursor-default' : ''}
          `}
        />
      </div>
    );
  }
);
