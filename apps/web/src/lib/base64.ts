export interface Base64Result {
  output: string;
  success: boolean;
  error?: string;
}

/**
 * Encode a string to Base64
 */
export function encodeBase64(input: string): Base64Result {
  try {
    // Handle Unicode characters properly
    const bytes = new TextEncoder().encode(input);
    const binString = Array.from(bytes)
      .map((byte) => String.fromCodePoint(byte))
      .join("");
    return {
      output: btoa(binString),
      success: true,
    };
  } catch (e) {
    return {
      output: "",
      success: false,
      error: e instanceof Error ? e.message : "Failed to encode to Base64",
    };
  }
}

/**
 * Decode a Base64 string
 */
export function decodeBase64(input: string): Base64Result {
  try {
    const binString = atob(input);
    const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0) ?? 0);
    return {
      output: new TextDecoder().decode(bytes),
      success: true,
    };
  } catch (e) {
    return {
      output: "",
      success: false,
      error: e instanceof Error ? e.message : "Invalid Base64 string",
    };
  }
}

/**
 * Detect if a string is valid Base64 and return suggested mode
 * Returns 'decode' if input appears to be Base64, 'encode' otherwise
 */
export function detectBase64(input: string): "encode" | "decode" | undefined {
  if (!input || input.length === 0) return undefined;

  // Base64 regex pattern
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

  // Check if string matches Base64 pattern and has valid length
  if (!base64Regex.test(input)) return "encode";
  if (input.length % 4 !== 0) return "encode";

  // Try to decode to verify it's valid Base64
  try {
    atob(input);
    return "decode";
  } catch {
    return "encode";
  }
}
