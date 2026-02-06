import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM Pricing Calculator - Compare AI Model Costs",
  description:
    "Free LLM pricing calculator. Compare costs for GPT-4, Claude, Gemini, and more. Calculate token costs and find the most cost-effective model.",
  keywords: ["llm pricing", "ai cost calculator", "gpt4 pricing", "claude pricing", "token cost"],
  openGraph: {
    type: "website",
    url: "https://devden.dev/llm-pricing",
    title: "LLM Pricing Calculator - Compare AI Model Costs | DevDen",
    description: "Free LLM pricing calculator. Compare costs for popular AI models.",
    siteName: "DevDen",
  },
};

export default function LlmPricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
