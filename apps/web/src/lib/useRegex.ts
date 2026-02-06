'use client';

import { useMemo } from 'react';

export interface RegexFlags {
  global: boolean;      // g - match all occurrences
  ignoreCase: boolean;  // i - case insensitive
  multiline: boolean;   // m - ^ and $ match line boundaries
  dotAll: boolean;      // s - . matches newlines
  unicode: boolean;     // u - unicode support
  sticky: boolean;      // y - sticky matching
}

export const DEFAULT_FLAGS: RegexFlags = {
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  unicode: false,
  sticky: false,
};

export interface RegexMatch {
  fullMatch: string;
  index: number;
  groups: {
    index: number;
    value: string;
    name?: string;
  }[];
}

export interface RegexResult {
  isValid: boolean;
  error: string | null;
  matches: RegexMatch[];
  matchCount: number;
}

export function flagsToString(flags: RegexFlags): string {
  let str = '';
  if (flags.global) str += 'g';
  if (flags.ignoreCase) str += 'i';
  if (flags.multiline) str += 'm';
  if (flags.dotAll) str += 's';
  if (flags.unicode) str += 'u';
  if (flags.sticky) str += 'y';
  return str;
}

export function useRegex(
  pattern: string,
  testString: string,
  flags: RegexFlags
): RegexResult {
  return useMemo(() => {
    if (!pattern) {
      return {
        isValid: true,
        error: null,
        matches: [],
        matchCount: 0,
      };
    }

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flagsToString(flags));
    } catch (e) {
      return {
        isValid: false,
        error: e instanceof Error ? e.message : 'Invalid regular expression',
        matches: [],
        matchCount: 0,
      };
    }

    if (!testString) {
      return {
        isValid: true,
        error: null,
        matches: [],
        matchCount: 0,
      };
    }

    const matches: RegexMatch[] = [];

    if (flags.global) {
      let match;
      // Reset lastIndex to ensure we start from the beginning
      regex.lastIndex = 0;

      // Prevent infinite loops with patterns that match empty strings
      let lastIndex = -1;
      const maxIterations = 10000; // Safety limit
      let iterations = 0;

      while ((match = regex.exec(testString)) !== null && iterations < maxIterations) {
        iterations++;

        // Prevent infinite loop on zero-width matches
        if (regex.lastIndex === lastIndex) {
          regex.lastIndex++;
          if (regex.lastIndex > testString.length) break;
          continue;
        }
        lastIndex = regex.lastIndex;

        const groups: RegexMatch['groups'] = [];

        // Extract capture groups
        for (let i = 1; i < match.length; i++) {
          if (match[i] !== undefined) {
            groups.push({
              index: i,
              value: match[i],
            });
          }
        }

        // Add named groups if present
        if (match.groups) {
          Object.entries(match.groups).forEach(([name, value]) => {
            // Find the existing group and add name, or create new entry
            const existingGroup = groups.find(g => g.value === value && !g.name);
            if (existingGroup) {
              existingGroup.name = name;
            }
          });
        }

        matches.push({
          fullMatch: match[0],
          index: match.index,
          groups,
        });

        // If not global flag, break after first match
        if (!flags.global) break;
      }
    } else {
      // Non-global match - just get first match
      const match = regex.exec(testString);
      if (match) {
        const groups: RegexMatch['groups'] = [];

        for (let i = 1; i < match.length; i++) {
          if (match[i] !== undefined) {
            groups.push({
              index: i,
              value: match[i],
            });
          }
        }

        if (match.groups) {
          Object.entries(match.groups).forEach(([name, value]) => {
            const existingGroup = groups.find(g => g.value === value && !g.name);
            if (existingGroup) {
              existingGroup.name = name;
            }
          });
        }

        matches.push({
          fullMatch: match[0],
          index: match.index,
          groups,
        });
      }
    }

    return {
      isValid: true,
      error: null,
      matches,
      matchCount: matches.length,
    };
  }, [pattern, testString, flags]);
}

// Helper to get highlighted segments of the test string
export interface HighlightSegment {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
}

export function getHighlightedSegments(
  testString: string,
  matches: RegexMatch[]
): HighlightSegment[] {
  if (!testString || matches.length === 0) {
    return testString ? [{ text: testString, isMatch: false }] : [];
  }

  const segments: HighlightSegment[] = [];
  let lastEnd = 0;

  // Sort matches by index to ensure proper order
  const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

  sortedMatches.forEach((match, idx) => {
    // Add non-matching text before this match
    if (match.index > lastEnd) {
      segments.push({
        text: testString.slice(lastEnd, match.index),
        isMatch: false,
      });
    }

    // Add the match
    segments.push({
      text: match.fullMatch,
      isMatch: true,
      matchIndex: idx,
    });

    lastEnd = match.index + match.fullMatch.length;
  });

  // Add any remaining text after the last match
  if (lastEnd < testString.length) {
    segments.push({
      text: testString.slice(lastEnd),
      isMatch: false,
    });
  }

  return segments;
}
