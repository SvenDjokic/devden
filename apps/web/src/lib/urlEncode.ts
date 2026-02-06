// URL Encoding/Decoding utilities

export interface EncodeResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface URLComponents {
  protocol: string | null;
  host: string | null;
  port: string | null;
  pathname: string | null;
  search: string | null;
  hash: string | null;
  isValidURL: boolean;
}

export interface QueryParam {
  key: string;
  value: string;
}

/**
 * Encode a string for use in URLs using encodeURIComponent
 */
export function encodeURL(input: string): EncodeResult {
  try {
    const encoded = encodeURIComponent(input);
    return { success: true, output: encoded };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: `Encoding failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
    };
  }
}

/**
 * Decode a URL-encoded string using decodeURIComponent
 */
export function decodeURL(input: string): EncodeResult {
  try {
    const decoded = decodeURIComponent(input);
    return { success: true, output: decoded };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: `Decoding failed: ${err instanceof Error ? err.message : 'Malformed URL encoding'}`,
    };
  }
}

/**
 * Detect if input is URL-encoded
 * Returns 'decode' if it looks encoded, 'encode' if it looks like plain text
 */
export function detectURLEncoding(input: string): 'encode' | 'decode' {
  if (!input.trim()) return 'encode';

  // Check for percent-encoded sequences (%XX)
  const encodedPattern = /%[0-9A-Fa-f]{2}/;
  const hasEncodedChars = encodedPattern.test(input);

  // Check for common encoded characters
  const commonEncodings = ['%20', '%2F', '%3A', '%3D', '%26', '%3F', '%23', '%40', '%2B', '%25'];
  const hasCommonEncodings = commonEncodings.some((enc) => input.includes(enc));

  // If it has encoded patterns, suggest decode
  if (hasEncodedChars || hasCommonEncodings) {
    // Try to decode and see if it's valid
    try {
      const decoded = decodeURIComponent(input);
      // If decoding changed the string, it was encoded
      if (decoded !== input) {
        return 'decode';
      }
    } catch {
      // Malformed encoding, but still looks encoded
      return 'decode';
    }
  }

  // Check if string contains characters that should be encoded in URLs
  const shouldEncodeChars = /[^A-Za-z0-9\-_.~]/;
  if (shouldEncodeChars.test(input)) {
    return 'encode';
  }

  return 'encode';
}

/**
 * Parse a URL string into its components
 */
export function parseURLComponents(input: string): URLComponents {
  // Default result for invalid URLs
  const invalidResult: URLComponents = {
    protocol: null,
    host: null,
    port: null,
    pathname: null,
    search: null,
    hash: null,
    isValidURL: false,
  };

  if (!input.trim()) return invalidResult;

  // Try to parse as a full URL
  try {
    // Add protocol if missing for URL parsing
    let urlString = input;
    if (!input.match(/^[a-zA-Z]+:\/\//)) {
      // Check if it looks like a URL (has domain-like structure)
      if (input.includes('.') || input.startsWith('localhost')) {
        urlString = 'https://' + input;
      } else {
        return invalidResult;
      }
    }

    const url = new URL(urlString);

    return {
      protocol: url.protocol.replace(':', ''),
      host: url.hostname,
      port: url.port || null,
      pathname: url.pathname !== '/' ? url.pathname : null,
      search: url.search || null,
      hash: url.hash || null,
      isValidURL: true,
    };
  } catch {
    return invalidResult;
  }
}

/**
 * Parse a query string into key-value pairs
 */
export function parseQueryString(input: string): QueryParam[] {
  if (!input.trim()) return [];

  // Remove leading ? if present
  let queryString = input;
  if (queryString.startsWith('?')) {
    queryString = queryString.slice(1);
  }

  // If input is a full URL, extract the query part
  if (queryString.includes('://')) {
    try {
      const url = new URL(queryString);
      queryString = url.search.slice(1); // Remove leading ?
    } catch {
      // Not a valid URL, treat as query string
    }
  }

  if (!queryString) return [];

  const params: QueryParam[] = [];
  const pairs = queryString.split('&');

  for (const pair of pairs) {
    if (!pair) continue;

    const [key, ...valueParts] = pair.split('=');
    const value = valueParts.join('='); // Handle values with = in them

    if (key) {
      try {
        params.push({
          key: decodeURIComponent(key),
          value: value ? decodeURIComponent(value) : '',
        });
      } catch {
        // If decoding fails, use raw values
        params.push({
          key,
          value: value || '',
        });
      }
    }
  }

  return params;
}

/**
 * Encode a full URL (protocol, host stay intact, but path/query/fragment get encoded)
 */
export function encodeFullURL(input: string): EncodeResult {
  try {
    const url = new URL(input);
    // URL constructor already encodes properly
    return { success: true, output: url.href };
  } catch {
    // Not a valid URL, encode the whole thing
    return encodeURL(input);
  }
}
