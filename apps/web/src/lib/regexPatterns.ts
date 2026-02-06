// Common regex patterns library for quick selection

export interface RegexPattern {
  name: string;
  pattern: string;
  description: string;
  testExample?: string;
}

export interface PatternCategory {
  name: string;
  icon: string;
  patterns: RegexPattern[];
}

export const PATTERN_CATEGORIES: PatternCategory[] = [
  {
    name: 'Validation',
    icon: '✓',
    patterns: [
      {
        name: 'Email Address',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        description: 'Validates email format',
        testExample: 'user@example.com',
      },
      {
        name: 'URL',
        pattern: '^https?:\\/\\/[^\\s]+$',
        description: 'HTTP/HTTPS URLs',
        testExample: 'https://example.com/path',
      },
      {
        name: 'IPv4 Address',
        pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        description: 'Valid IPv4 address (0-255 per octet)',
        testExample: '192.168.1.1',
      },
      {
        name: 'IPv6 Address',
        pattern: '^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$',
        description: 'Full IPv6 address format',
        testExample: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      },
      {
        name: 'UUID',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        description: 'UUID/GUID format',
        testExample: '550e8400-e29b-41d4-a716-446655440000',
      },
      {
        name: 'Hex Color',
        pattern: '^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$',
        description: '3 or 6 digit hex color code',
        testExample: '#ff5733',
      },
      {
        name: 'Strong Password',
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
        description: 'Min 8 chars, upper, lower, digit, special',
        testExample: 'MyP@ssw0rd',
      },
    ],
  },
  {
    name: 'Phone Numbers',
    icon: '📞',
    patterns: [
      {
        name: 'US Phone',
        pattern: '^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$',
        description: 'US phone number formats',
        testExample: '(555) 123-4567',
      },
      {
        name: 'International Phone',
        pattern: '^\\+?[1-9]\\d{1,14}$',
        description: 'E.164 international format',
        testExample: '+14155551234',
      },
      {
        name: 'UK Phone',
        pattern: '^(?:0|\\+44)\\s?(?:\\d\\s?){9,10}$',
        description: 'UK phone number',
        testExample: '+44 20 7946 0958',
      },
    ],
  },
  {
    name: 'Dates & Times',
    icon: '📅',
    patterns: [
      {
        name: 'ISO Date (YYYY-MM-DD)',
        pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$',
        description: 'ISO 8601 date format',
        testExample: '2024-12-25',
      },
      {
        name: 'US Date (MM/DD/YYYY)',
        pattern: '^(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])\\/\\d{4}$',
        description: 'US date format',
        testExample: '12/25/2024',
      },
      {
        name: 'EU Date (DD/MM/YYYY)',
        pattern: '^(?:0[1-9]|[12]\\d|3[01])\\/(?:0[1-9]|1[0-2])\\/\\d{4}$',
        description: 'European date format',
        testExample: '25/12/2024',
      },
      {
        name: 'Time (24h)',
        pattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?$',
        description: '24-hour time (HH:MM or HH:MM:SS)',
        testExample: '23:59:59',
      },
      {
        name: 'Time (12h)',
        pattern: '^(?:0?[1-9]|1[0-2]):[0-5]\\d\\s?(?:AM|PM|am|pm)$',
        description: '12-hour time with AM/PM',
        testExample: '11:30 PM',
      },
      {
        name: 'ISO DateTime',
        pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:?\\d{2})?$',
        description: 'ISO 8601 datetime with timezone',
        testExample: '2024-12-25T10:30:00Z',
      },
    ],
  },
  {
    name: 'Numbers',
    icon: '#',
    patterns: [
      {
        name: 'Integer',
        pattern: '^-?\\d+$',
        description: 'Positive or negative whole number',
        testExample: '-42',
      },
      {
        name: 'Decimal',
        pattern: '^-?\\d+\\.\\d+$',
        description: 'Number with decimal point',
        testExample: '3.14159',
      },
      {
        name: 'Currency (USD)',
        pattern: '^\\$?\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?$',
        description: 'US dollar format',
        testExample: '$1,234.56',
      },
      {
        name: 'Percentage',
        pattern: '^-?\\d+(?:\\.\\d+)?%$',
        description: 'Percentage value',
        testExample: '75.5%',
      },
      {
        name: 'Scientific Notation',
        pattern: '^-?\\d+(?:\\.\\d+)?[eE][+-]?\\d+$',
        description: 'Number in scientific notation',
        testExample: '6.022e23',
      },
    ],
  },
  {
    name: 'Web & Code',
    icon: '</>',
    patterns: [
      {
        name: 'HTML Tag',
        pattern: '<([a-z][a-z0-9]*)\\b[^>]*>([\\s\\S]*?)<\\/\\1>',
        description: 'Matches HTML opening and closing tags',
        testExample: '<div class="test">content</div>',
      },
      {
        name: 'HTML Attribute',
        pattern: '([a-z-]+)=["\']([^"\']*)["\']',
        description: 'HTML attribute name and value',
        testExample: 'class="example"',
      },
      {
        name: 'CSS Selector (Class)',
        pattern: '\\.([a-zA-Z_-][a-zA-Z0-9_-]*)',
        description: 'CSS class selector',
        testExample: '.my-class',
      },
      {
        name: 'JSON Key',
        pattern: '"([^"]+)"\\s*:',
        description: 'JSON object key',
        testExample: '"name": "value"',
      },
      {
        name: 'Markdown Link',
        pattern: '\\[([^\\]]+)\\]\\(([^)]+)\\)',
        description: 'Markdown link syntax',
        testExample: '[link text](https://example.com)',
      },
      {
        name: 'Import Statement (JS)',
        pattern: "import\\s+(?:{[^}]+}|\\w+)\\s+from\\s+['\"]([^'\"]+)['\"]",
        description: 'JavaScript import statements',
        testExample: "import { useState } from 'react'",
      },
      {
        name: 'URL Query Parameter',
        pattern: '[?&]([^=&]+)=([^&]*)',
        description: 'Extract query string parameters',
        testExample: '?name=John&age=30',
      },
    ],
  },
  {
    name: 'Text Processing',
    icon: '📝',
    patterns: [
      {
        name: 'Whitespace',
        pattern: '\\s+',
        description: 'One or more whitespace characters',
        testExample: 'hello   world',
      },
      {
        name: 'Words Only',
        pattern: '\\b\\w+\\b',
        description: 'Individual words',
        testExample: 'Hello World 123',
      },
      {
        name: 'Sentence',
        pattern: '[A-Z][^.!?]*[.!?]',
        description: 'Sentences ending with punctuation',
        testExample: 'Hello there! How are you?',
      },
      {
        name: 'Duplicate Words',
        pattern: '\\b(\\w+)\\s+\\1\\b',
        description: 'Find repeated consecutive words',
        testExample: 'the the quick brown fox',
      },
      {
        name: 'Quoted String',
        pattern: '(["\'])(?:(?!\\1)[^\\\\]|\\\\.)*\\1',
        description: 'Single or double quoted strings',
        testExample: '"Hello" and \'World\'',
      },
      {
        name: 'Hashtag',
        pattern: '#[a-zA-Z][a-zA-Z0-9_]*',
        description: 'Social media hashtags',
        testExample: '#JavaScript #coding2024',
      },
      {
        name: 'Mention (@user)',
        pattern: '@[a-zA-Z][a-zA-Z0-9_]*',
        description: 'Social media mentions',
        testExample: '@username @john_doe',
      },
    ],
  },
  {
    name: 'File & Paths',
    icon: '📁',
    patterns: [
      {
        name: 'File Extension',
        pattern: '\\.([a-zA-Z0-9]+)$',
        description: 'Extract file extension',
        testExample: 'document.pdf',
      },
      {
        name: 'Unix File Path',
        pattern: '^\\/(?:[a-zA-Z0-9_.-]+\\/)*[a-zA-Z0-9_.-]+$',
        description: 'Unix/Linux file path',
        testExample: '/home/user/documents/file.txt',
      },
      {
        name: 'Windows File Path',
        pattern: '^[a-zA-Z]:\\\\(?:[^\\\\/:*?"<>|\\r\\n]+\\\\)*[^\\\\/:*?"<>|\\r\\n]*$',
        description: 'Windows file path',
        testExample: 'C:\\Users\\Documents\\file.txt',
      },
      {
        name: 'Image File',
        pattern: '\\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$',
        description: 'Common image file extensions',
        testExample: 'photo.jpg',
      },
    ],
  },
  {
    name: 'IDs & Codes',
    icon: '🔑',
    patterns: [
      {
        name: 'Credit Card',
        pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$',
        description: 'Visa, Mastercard, Amex formats',
        testExample: '4111111111111111',
      },
      {
        name: 'SSN (US)',
        pattern: '^\\d{3}-\\d{2}-\\d{4}$',
        description: 'US Social Security Number',
        testExample: '123-45-6789',
      },
      {
        name: 'Postal Code (US)',
        pattern: '^\\d{5}(?:-\\d{4})?$',
        description: 'US ZIP code (5 or 9 digit)',
        testExample: '12345-6789',
      },
      {
        name: 'Postal Code (UK)',
        pattern: '^[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}$',
        description: 'UK postcode',
        testExample: 'SW1A 1AA',
      },
      {
        name: 'MAC Address',
        pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
        description: 'Network MAC address',
        testExample: '00:1A:2B:3C:4D:5E',
      },
      {
        name: 'Slug (URL-friendly)',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        description: 'URL slug format',
        testExample: 'my-blog-post-title',
      },
    ],
  },
];

// Flatten all patterns for search
export const ALL_PATTERNS: RegexPattern[] = PATTERN_CATEGORIES.flatMap(
  (category) => category.patterns
);

// Get total pattern count
export const PATTERN_COUNT = ALL_PATTERNS.length;
