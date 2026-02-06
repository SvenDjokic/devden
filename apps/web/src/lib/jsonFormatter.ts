export interface JsonError {
  message: string;
  line?: number;
  column?: number;
  position?: number;
}

export interface FormatResult {
  success: boolean;
  formatted?: string;
  error?: JsonError;
}

export interface RepairResult {
  success: boolean;
  repaired?: string;
  changes?: string[];
  error?: string;
}

/**
 * Format JSON with proper indentation
 */
export function formatJson(input: string, indent: number | string = 2): FormatResult {
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);
    return { success: true, formatted };
  } catch (err) {
    const error = parseJsonError(err, input);
    return { success: false, error };
  }
}

/**
 * Minify JSON by removing whitespace
 */
export function minifyJson(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed);
    return { success: true, formatted };
  } catch (err) {
    const error = parseJsonError(err, input);
    return { success: false, error };
  }
}

/**
 * Check if the input might be repairable
 */
export function canRepair(input: string): boolean {
  if (!input.trim()) return false;

  // Check for common fixable issues
  const hasTrailingComma = /,\s*[}\]]/.test(input);
  const hasSingleQuotes = /'[^']*'\s*:/.test(input) || /:\s*'[^']*'/.test(input);
  const hasUnquotedKeys = /{\s*[a-zA-Z_][a-zA-Z0-9_]*\s*:/.test(input);
  const hasComments = /\/\/|\/\*/.test(input);

  return hasTrailingComma || hasSingleQuotes || hasUnquotedKeys || hasComments;
}

/**
 * Attempt to repair common JSON issues
 */
export function repairJson(input: string): RepairResult {
  const changes: string[] = [];
  let repaired = input;

  try {
    // First, try parsing as-is
    JSON.parse(repaired);
    return { success: true, repaired, changes: [] };
  } catch {
    // Continue with repairs
  }

  // Remove JavaScript comments
  const commentPattern = /\/\/.*$|\/\*[\s\S]*?\*\//gm;
  if (commentPattern.test(repaired)) {
    repaired = repaired.replace(commentPattern, '');
    changes.push('Removed comments');
  }

  // Replace single quotes with double quotes (for keys and values)
  const singleQuotePattern = /'([^'\\]*(\\.[^'\\]*)*)'/g;
  if (singleQuotePattern.test(repaired)) {
    repaired = repaired.replace(singleQuotePattern, '"$1"');
    changes.push('Converted single quotes to double quotes');
  }

  // Add quotes to unquoted keys
  const unquotedKeyPattern = /([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
  const beforeUnquoted = repaired;
  repaired = repaired.replace(unquotedKeyPattern, '$1"$2":');
  if (repaired !== beforeUnquoted) {
    changes.push('Added quotes to unquoted keys');
  }

  // Remove trailing commas before ] or }
  const trailingCommaPattern = /,(\s*[}\]])/g;
  const beforeTrailing = repaired;
  repaired = repaired.replace(trailingCommaPattern, '$1');
  if (repaired !== beforeTrailing) {
    changes.push('Removed trailing commas');
  }

  // Try to parse the repaired JSON
  try {
    JSON.parse(repaired);
    // Format it nicely
    const parsed = JSON.parse(repaired);
    repaired = JSON.stringify(parsed, null, 2);
    return { success: true, repaired, changes };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to repair JSON',
      changes,
    };
  }
}

/**
 * Parse JSON error to get line and column information
 */
function parseJsonError(err: unknown, input: string): JsonError {
  if (!(err instanceof SyntaxError)) {
    return { message: 'Unknown error' };
  }

  const message = err.message;

  // Try to extract position from error message
  // Format varies by browser: "at position X" or "at line X column Y"
  const positionMatch = message.match(/at position (\d+)/);
  const lineColMatch = message.match(/at line (\d+) column (\d+)/);

  if (lineColMatch) {
    return {
      message,
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
    };
  }

  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const { line, column } = getLineAndColumn(input, position);
    return { message, line, column, position };
  }

  return { message };
}

/**
 * Convert character position to line and column
 */
function getLineAndColumn(input: string, position: number): { line: number; column: number } {
  const lines = input.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}
