// TOON Conversion Library
import { encode, decode } from '@toon-format/toon';
import yaml from 'js-yaml';

export type InputFormat = 'json' | 'yaml' | 'toon';
export type ConversionDirection = 'toToon' | 'toJson';

export interface ConversionResult {
  success: boolean;
  output: string;
  error?: string;
  inputTokens: number;
  outputTokens: number;
  savedTokens: number;
  savedPercentage: number;
}

// Approximate token counting (similar to tiktoken cl100k_base estimation)
// This is a rough approximation - real token count varies by model
export function countTokens(text: string): number {
  if (!text) return 0;

  // Simple approximation: ~4 characters per token on average for code/structured data
  // This is more accurate for JSON/TOON than the general 4 chars/token rule
  const words = text.split(/\s+/).filter(Boolean);
  const punctuation = (text.match(/[{}\[\]:,"']/g) || []).length;

  // Estimate: words + significant punctuation as separate tokens
  return Math.ceil(words.length + punctuation * 0.5);
}

// More accurate estimation based on character patterns
export function estimateTokens(text: string): number {
  if (!text) return 0;

  // GPT tokenizers typically split on:
  // - Whitespace
  // - Punctuation boundaries
  // - Common subword patterns

  // Rough heuristic that works well for JSON/TOON:
  // Count characters, divide by ~3.5 for structured data
  return Math.ceil(text.length / 3.5);
}

export function detectInputFormat(input: string): InputFormat {
  const trimmed = input.trim();

  // Check for JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON, could be TOON or YAML
    }
  }

  // Check for TOON patterns
  // TOON typically has patterns like: key[N]{fields}: or key: value without quotes
  if (/^[a-zA-Z_][a-zA-Z0-9_]*(\[\d+\])?\{[^}]+\}:/.test(trimmed) ||
      /^[a-zA-Z_][a-zA-Z0-9_]*:/.test(trimmed) && !trimmed.includes('"')) {
    return 'toon';
  }

  // Default to YAML (superset of JSON anyway)
  return 'yaml';
}

export function convertToToon(input: string, inputFormat: InputFormat): ConversionResult {
  const inputTokens = estimateTokens(input);

  try {
    let data: unknown;

    if (inputFormat === 'json') {
      data = JSON.parse(input);
    } else if (inputFormat === 'yaml') {
      data = yaml.load(input);
    } else {
      // Already TOON, just return as-is
      return {
        success: true,
        output: input,
        inputTokens,
        outputTokens: inputTokens,
        savedTokens: 0,
        savedPercentage: 0,
      };
    }

    const output = encode(data);
    const outputTokens = estimateTokens(output);
    const savedTokens = inputTokens - outputTokens;
    const savedPercentage = inputTokens > 0 ? (savedTokens / inputTokens) * 100 : 0;

    return {
      success: true,
      output,
      inputTokens,
      outputTokens,
      savedTokens,
      savedPercentage,
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      inputTokens,
      outputTokens: 0,
      savedTokens: 0,
      savedPercentage: 0,
    };
  }
}

export function convertToJson(input: string, pretty: boolean = true): ConversionResult {
  const inputTokens = estimateTokens(input);

  try {
    const data = decode(input);
    const output = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    const outputTokens = estimateTokens(output);
    const savedTokens = outputTokens - inputTokens; // Negative = TOON was smaller
    const savedPercentage = outputTokens > 0 ? (savedTokens / outputTokens) * 100 : 0;

    return {
      success: true,
      output,
      inputTokens,
      outputTokens,
      savedTokens: -savedTokens, // Flip to show "TOON saved X tokens"
      savedPercentage: -savedPercentage,
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      inputTokens,
      outputTokens: 0,
      savedTokens: 0,
      savedPercentage: 0,
    };
  }
}

// LLM pricing data (per 1M tokens)
export const PRICES_LAST_UPDATED = '2026-02-06';

export interface LlmModel {
  id: string;
  name: string;
  inputPrice: number;  // $ per 1M input tokens
  outputPrice: number; // $ per 1M output tokens
}

export const LLM_MODELS: LlmModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', inputPrice: 2.50, outputPrice: 10.00 },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', inputPrice: 0.15, outputPrice: 0.60 },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', inputPrice: 3.00, outputPrice: 15.00 },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', inputPrice: 0.80, outputPrice: 4.00 },
  { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', inputPrice: 1.25, outputPrice: 5.00 },
  { id: 'gemini-1-5-flash', name: 'Gemini 1.5 Flash', inputPrice: 0.075, outputPrice: 0.30 },
];

export function calculateCostSavings(
  savedTokens: number,
  model: LlmModel
): { inputSaved: number; outputSaved: number; totalSaved: number } {
  // Assuming the tokens are primarily for input (prompt data)
  const inputSaved = (savedTokens / 1_000_000) * model.inputPrice;
  // Also estimate output savings (responses often echo data)
  const outputSaved = (savedTokens * 0.3 / 1_000_000) * model.outputPrice; // Assume 30% reflected in output

  return {
    inputSaved,
    outputSaved,
    totalSaved: inputSaved + outputSaved,
  };
}

// Example data for the examples library
export interface ToonExample {
  id: string;
  name: string;
  description: string;
  json: string;
}

export const TOON_EXAMPLES: ToonExample[] = [
  {
    id: 'user',
    name: 'User Object',
    description: 'Simple user profile object',
    json: JSON.stringify({
      id: 12345,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "admin",
      active: true
    }, null, 2),
  },
  {
    id: 'products',
    name: 'Product List',
    description: 'Array of product objects',
    json: JSON.stringify({
      products: [
        { sku: "LAPTOP-001", name: "MacBook Pro", price: 2499.99, inStock: true },
        { sku: "MOUSE-002", name: "Magic Mouse", price: 99.00, inStock: true },
        { sku: "KEYBOARD-003", name: "Magic Keyboard", price: 149.00, inStock: false }
      ]
    }, null, 2),
  },
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Typical API response with metadata',
    json: JSON.stringify({
      status: "success",
      data: {
        users: [
          { id: 1, name: "John", email: "john@example.com" },
          { id: 2, name: "Jane", email: "jane@example.com" }
        ]
      },
      meta: {
        page: 1,
        total: 2,
        hasMore: false
      }
    }, null, 2),
  },
  {
    id: 'chat-messages',
    name: 'Chat Messages',
    description: 'LLM chat message format',
    json: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is TOON format?" },
        { role: "assistant", content: "TOON is a token-efficient data format for LLMs." }
      ]
    }, null, 2),
  },
  {
    id: 'config',
    name: 'Config File',
    description: 'Nested configuration structure',
    json: JSON.stringify({
      app: {
        name: "MyApp",
        version: "1.0.0",
        debug: false
      },
      database: {
        host: "localhost",
        port: 5432,
        name: "myapp_db"
      },
      features: {
        darkMode: true,
        notifications: true,
        analytics: false
      }
    }, null, 2),
  },
];
