'use client';

import { useCallback } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function TextInput({ value, onChange, placeholder, label = 'Input' }: TextInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="flex flex-col h-full">
      <label className="text-sm font-medium text-muted-foreground mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder || 'Enter text here...'}
        className="code flex-1 w-full p-4 bg-card border border-border rounded-lg resize-none transition-all duration-200 hover:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-muted-foreground"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
}
