// LLM Pricing Data
// Prices in USD per 1 million tokens
// Last updated: 2026-02-06
// Sources: Official provider pricing pages

export interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  contextWindow: number;
  notes?: string;
  officialPricingUrl: string;
}

export interface PricingData {
  lastUpdated: string;
  models: ModelPricing[];
}

export const pricingData: PricingData = {
  lastUpdated: "2026-02-06",
  models: [
    // OpenAI Models
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      inputPricePerMillion: 2.5,
      outputPricePerMillion: 10.0,
      contextWindow: 128000,
      officialPricingUrl: "https://openai.com/api/pricing/",
    },
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      provider: "OpenAI",
      inputPricePerMillion: 0.15,
      outputPricePerMillion: 0.6,
      contextWindow: 128000,
      notes: "Best value for simpler tasks",
      officialPricingUrl: "https://openai.com/api/pricing/",
    },
    // Anthropic Models
    {
      id: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      inputPricePerMillion: 3.0,
      outputPricePerMillion: 15.0,
      contextWindow: 200000,
      officialPricingUrl: "https://www.anthropic.com/pricing",
    },
    {
      id: "claude-sonnet-4-5",
      name: "Claude Sonnet 4.5",
      provider: "Anthropic",
      inputPricePerMillion: 3.0,
      outputPricePerMillion: 15.0,
      contextWindow: 200000,
      notes: "Latest Sonnet model",
      officialPricingUrl: "https://www.anthropic.com/pricing",
    },
    // Google Models
    {
      id: "gemini-1-5-pro",
      name: "Gemini 1.5 Pro",
      provider: "Google",
      inputPricePerMillion: 1.25,
      outputPricePerMillion: 5.0,
      contextWindow: 2000000,
      notes: "Pricing doubles for >200K context",
      officialPricingUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    },
    {
      id: "gemini-1-5-flash",
      name: "Gemini 1.5 Flash",
      provider: "Google",
      inputPricePerMillion: 0.075,
      outputPricePerMillion: 0.3,
      contextWindow: 1000000,
      notes: "Budget option with massive context",
      officialPricingUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    },
  ],
};

// TOON optimization savings estimate (conservative)
export const TOON_SAVINGS_PERCENT = 0.35; // 35% token reduction

// Helper to get model by ID
export function getModelById(id: string): ModelPricing | undefined {
  return pricingData.models.find((m) => m.id === id);
}

// Helper to get models by provider
export function getModelsByProvider(provider: string): ModelPricing[] {
  return pricingData.models.filter((m) => m.provider === provider);
}

// Get all unique providers
export function getProviders(): string[] {
  return [...new Set(pricingData.models.map((m) => m.provider))];
}
