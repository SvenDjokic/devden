import { md5 } from 'js-md5';

export type Algorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export const ALGORITHMS: Algorithm[] = ['md5', 'sha1', 'sha256', 'sha512'];

export const ALGORITHM_LABELS: Record<Algorithm, string> = {
  md5: 'MD5',
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha512: 'SHA-512',
};

/**
 * Convert an ArrayBuffer to a hexadecimal string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Map our algorithm names to Web Crypto API algorithm names
 */
const WEB_CRYPTO_ALGORITHMS: Record<Exclude<Algorithm, 'md5'>, string> = {
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha512: 'SHA-512',
};

/**
 * Hash text using the specified algorithm
 * Uses js-md5 for MD5 (deprecated in Web Crypto), Web Crypto API for SHA variants
 */
export async function hashText(text: string, algorithm: Algorithm): Promise<string> {
  // MD5 requires js-md5 library (not available in Web Crypto API)
  if (algorithm === 'md5') {
    return md5(text);
  }

  // Use Web Crypto API for SHA algorithms
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(
    WEB_CRYPTO_ALGORITHMS[algorithm],
    data
  );

  return bufferToHex(hashBuffer);
}

/**
 * Hash a file using the specified algorithm
 * Reads file as ArrayBuffer and hashes client-side
 */
export async function hashFile(file: File, algorithm: Algorithm): Promise<string> {
  const buffer = await file.arrayBuffer();

  // MD5 requires js-md5 library
  if (algorithm === 'md5') {
    return md5(buffer);
  }

  // Use Web Crypto API for SHA algorithms
  const hashBuffer = await crypto.subtle.digest(
    WEB_CRYPTO_ALGORITHMS[algorithm],
    buffer
  );

  return bufferToHex(hashBuffer);
}

/**
 * Hash text with all algorithms at once
 * Returns a record of algorithm -> hash value
 */
export async function hashTextAll(text: string): Promise<Record<Algorithm, string>> {
  const results = await Promise.all(
    ALGORITHMS.map(async (algo) => ({
      algo,
      hash: await hashText(text, algo),
    }))
  );

  return results.reduce(
    (acc, { algo, hash }) => {
      acc[algo] = hash;
      return acc;
    },
    {} as Record<Algorithm, string>
  );
}

/**
 * Hash a file with all algorithms at once
 * Returns a record of algorithm -> hash value
 */
export async function hashFileAll(file: File): Promise<Record<Algorithm, string>> {
  // Read file once and reuse the buffer
  const buffer = await file.arrayBuffer();

  const results = await Promise.all(
    ALGORITHMS.map(async (algo) => {
      let hash: string;
      if (algo === 'md5') {
        hash = md5(buffer);
      } else {
        const hashBuffer = await crypto.subtle.digest(
          WEB_CRYPTO_ALGORITHMS[algo],
          buffer
        );
        hash = bufferToHex(hashBuffer);
      }
      return { algo, hash };
    })
  );

  return results.reduce(
    (acc, { algo, hash }) => {
      acc[algo] = hash;
      return acc;
    },
    {} as Record<Algorithm, string>
  );
}

/**
 * Empty hash values for initial state
 */
export const EMPTY_HASHES: Record<Algorithm, string> = {
  md5: '',
  sha1: '',
  sha256: '',
  sha512: '',
};
