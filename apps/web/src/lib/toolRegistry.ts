// Tool Registry - DevDen Navigation
// Each tool in the DevDen suite

export type ToolCategory = 'formatters' | 'encoders' | 'converters' | 'generators';
export type ToolTier = 'free' | 'pro';

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  category: ToolCategory;
  tier: ToolTier;
  available: boolean;
}

export const TOOLS: Tool[] = [
  // Formatters
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON',
    href: '/json',
    icon: '{ }',
    category: 'formatters',
    tier: 'free',
    available: true,
  },
  // Encoders
  {
    id: 'base64',
    name: 'Base64',
    description: 'Encode and decode Base64',
    href: '/base64',
    icon: '64',
    category: 'encoders',
    tier: 'free',
    available: true,
  },
  {
    id: 'url-encode',
    name: 'URL Encode',
    description: 'Encode and decode URLs',
    href: '/url-encode',
    icon: '%',
    category: 'encoders',
    tier: 'free',
    available: true,
  },
  // Converters
  {
    id: 'toon',
    name: 'TOON Converter',
    description: 'JSON/YAML to TOON for LLMs',
    href: '/toon',
    icon: '◇',
    category: 'converters',
    tier: 'free',
    available: true,
  },
  {
    id: 'timestamp',
    name: 'Timestamp',
    description: 'Unix timestamp converter',
    href: '/timestamp',
    icon: '⏱',
    category: 'converters',
    tier: 'free',
    available: true,
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    description: 'Test regular expressions',
    href: '/regex',
    icon: '.*',
    category: 'formatters',
    tier: 'free',
    available: true,
  },
  // Generators
  {
    id: 'hash',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA hashes',
    href: '/hash',
    icon: '#',
    category: 'generators',
    tier: 'free',
    available: true,
  },
  {
    id: 'llm-pricing',
    name: 'LLM Pricing',
    description: 'Calculate LLM API costs',
    href: '/llm-pricing',
    icon: '$',
    category: 'generators',
    tier: 'free',
    available: true,
  },
];

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  formatters: 'Formatters',
  encoders: 'Encoders',
  converters: 'Converters',
  generators: 'Generators',
};

export const CATEGORY_ORDER: ToolCategory[] = [
  'formatters',
  'encoders',
  'converters',
  'generators',
];

export function getToolsByCategory(): Map<ToolCategory, Tool[]> {
  const map = new Map<ToolCategory, Tool[]>();

  for (const category of CATEGORY_ORDER) {
    const tools = TOOLS.filter((t) => t.category === category);
    if (tools.length > 0) {
      map.set(category, tools);
    }
  }

  return map;
}

export function isToolAvailable(toolId: string): boolean {
  const tool = TOOLS.find((t) => t.id === toolId);
  return tool?.available ?? false;
}

export function getTool(toolId: string): Tool | undefined {
  return TOOLS.find((t) => t.id === toolId);
}
