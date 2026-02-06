# DevDen

A suite of developer tools built with Next.js, Turborepo, and pnpm.

## Tools

- `/json` - JSON Formatter & Validator
- `/regex` - Regex Tester
- `/base64` - Base64 Encoder/Decoder
- `/url-encode` - URL Encoder/Decoder
- `/toon` - TOON Converter
- `/timestamp` - Unix Timestamp Converter
- `/hash` - Hash Generator
- `/llm-pricing` - LLM Pricing Calculator

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build
```

## Structure

```
devden/
├── apps/
│   └── web/          # Main Next.js app
├── packages/
│   ├── ui/           # Shared components
│   ├── utils/        # Shared utilities
│   └── config/       # Shared configs
├── turbo.json
└── pnpm-workspace.yaml
```
