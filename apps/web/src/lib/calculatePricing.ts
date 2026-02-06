import { ModelPricing, TOON_SAVINGS_PERCENT } from "@/data/pricing";

export interface PricingInput {
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  requestsPerDay: number;
}

export interface ModelCost {
  model: ModelPricing;
  costPerRequest: number;
  dailyCost: number;
  monthlyCost: number;
  // With TOON optimization
  toonCostPerRequest: number;
  toonDailyCost: number;
  toonMonthlyCost: number;
  savingsPerRequest: number;
  savingsMonthly: number;
  savingsPercent: number;
}

export interface PricingResult {
  input: PricingInput;
  totalTokensPerRequest: number;
  requestsPerMonth: number;
  costs: ModelCost[];
}

/**
 * Calculate cost for a given number of tokens at a price per million
 */
function calculateTokenCost(tokens: number, pricePerMillion: number): number {
  return (tokens / 1_000_000) * pricePerMillion;
}

/**
 * Calculate pricing for all models based on user input
 */
export function calculatePricing(
  input: PricingInput,
  models: ModelPricing[]
): PricingResult {
  const { inputTokensPerRequest, outputTokensPerRequest, requestsPerDay } = input;

  const totalTokensPerRequest = inputTokensPerRequest + outputTokensPerRequest;
  const requestsPerMonth = requestsPerDay * 30;

  // Calculate with TOON optimization (reduces input tokens)
  const toonInputTokens = inputTokensPerRequest * (1 - TOON_SAVINGS_PERCENT);

  const costs: ModelCost[] = models.map((model) => {
    // Standard costs
    const inputCost = calculateTokenCost(inputTokensPerRequest, model.inputPricePerMillion);
    const outputCost = calculateTokenCost(outputTokensPerRequest, model.outputPricePerMillion);
    const costPerRequest = inputCost + outputCost;
    const dailyCost = costPerRequest * requestsPerDay;
    const monthlyCost = costPerRequest * requestsPerMonth;

    // TOON-optimized costs (only input tokens are reduced)
    const toonInputCost = calculateTokenCost(toonInputTokens, model.inputPricePerMillion);
    const toonCostPerRequest = toonInputCost + outputCost;
    const toonDailyCost = toonCostPerRequest * requestsPerDay;
    const toonMonthlyCost = toonCostPerRequest * requestsPerMonth;

    // Savings
    const savingsPerRequest = costPerRequest - toonCostPerRequest;
    const savingsMonthly = monthlyCost - toonMonthlyCost;
    const savingsPercent = monthlyCost > 0 ? (savingsMonthly / monthlyCost) * 100 : 0;

    return {
      model,
      costPerRequest,
      dailyCost,
      monthlyCost,
      toonCostPerRequest,
      toonDailyCost,
      toonMonthlyCost,
      savingsPerRequest,
      savingsMonthly,
      savingsPercent,
    };
  });

  // Sort by monthly cost (cheapest first)
  costs.sort((a, b) => a.monthlyCost - b.monthlyCost);

  return {
    input,
    totalTokensPerRequest,
    requestsPerMonth,
    costs,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  if (amount < 0.01 && amount > 0) {
    return `$${amount.toFixed(4)}`;
  }
  if (amount < 1) {
    return `$${amount.toFixed(3)}`;
  }
  if (amount < 100) {
    return `$${amount.toFixed(2)}`;
  }
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString("en-US");
}
