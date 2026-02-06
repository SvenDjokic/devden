'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseLocalStorageReturn<T> {
  value: T | null;
  setValue: (value: T) => void;
  error: string | null;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
      setError('Failed to load saved data');
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
        setError(null);
      } catch (err) {
        console.error(`Error setting localStorage key "${key}":`, err);
        setError('Failed to save data');
      }
    },
    [key]
  );

  return { value: storedValue, setValue, error };
}
