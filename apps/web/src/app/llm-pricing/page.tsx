"use client";

import { useState, useCallback } from "react";
import { PageLayout, ResultSection } from "@/components/llm-pricing/layout";
import { PricingForm, PricingTable } from "@/components/llm-pricing/calculator";
import { calculatePricing, PricingInput, PricingResult } from "@/lib/calculatePricing";
import { pricingData } from "@/data/pricing";
import { CollapsibleSection, FeatureList } from "@/components/llm-pricing/seo";

export default function Home() {
  const [result, setResult] = useState<PricingResult | null>(null);

  const handleCalculate = useCallback((input: PricingInput) => {
    const pricingResult = calculatePricing(input, pricingData.models);
    setResult(pricingResult);
  }, []);

  return (
    <PageLayout toolName="LLM Pricing Calculator">
      <div className="space-y-4 sm:space-y-8">
        {/* Tool Description */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 font-sans">LLM Pricing Calculator</h1>
          <p className="text-sm sm:text-base text-muted-foreground font-sans">
            Compare API costs across GPT-4o, Claude, and Gemini. See how much you could save with{" "}
            <a
              href="https://toon.devden.dev"
              className="text-emerald-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TOON optimization
            </a>
            .
          </p>
        </div>

        {/* Input Form */}
        <div className="p-4 sm:p-6 bg-card border border-border rounded-lg">
          <PricingForm onCalculate={handleCalculate} />
        </div>

        {/* Results */}
        {result && (
          <ResultSection showAdSlot={false}>
            <PricingTable result={result} />
          </ResultSection>
        )}

        {/* CTA Section */}
        <div className="p-4 sm:p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-medium text-foreground">
                Want to reduce your LLM costs?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                TOON format can reduce input tokens by 30-60% for structured data.
              </p>
            </div>
            <a
              href="https://toon.devden.dev"
              className="inline-flex items-center justify-center h-9 sm:h-10 px-4 sm:px-6 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try TOON Converter
            </a>
          </div>
        </div>

        {/* SEO Content Section */}
        <section className="pt-8 sm:pt-12 border-t border-border/50">
          <div className="max-w-3xl opacity-80">
            {/* Always visible intro */}
            <div className="mb-6">
              <h2 className="text-base font-semibold text-muted-foreground mb-3">
                LLM Pricing Calculator - Compare AI API Costs
              </h2>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                Calculate and compare API costs across major LLM providers including OpenAI GPT-4o,
                Anthropic Claude 3.5 Sonnet, and Google Gemini 1.5 Pro. Estimate your monthly spend
                based on token usage and see potential savings with TOON format optimization.
                All calculations happen in your browser — no data is sent to any server.
              </p>
            </div>

            {/* Collapsible sections */}
            <div className="space-y-0">
              <CollapsibleSection title="What is LLM Pricing?">
                <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3">
                  LLM (Large Language Model) pricing refers to the cost structure used by AI providers
                  to charge for API access to models like GPT-4, Claude, and Gemini. Unlike traditional
                  SaaS subscriptions, LLM APIs typically charge based on <strong>token usage</strong> —
                  the number of text chunks processed in each request.
                </p>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  Most providers charge separately for <strong>input tokens</strong> (your prompts and context)
                  and <strong>output tokens</strong> (the model&apos;s responses), with output tokens often
                  costing 3-5x more than input tokens. Understanding this pricing model is crucial for
                  budgeting and optimizing your AI application costs.
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="How LLM Token Pricing Works">
                <div className="text-sm text-muted-foreground/80 space-y-3">
                  <p>
                    Tokens are the fundamental unit of LLM pricing. A token is roughly 4 characters or
                    about ¾ of a word in English. For example, &quot;ChatGPT is great&quot; is 4 tokens.
                  </p>
                  <ul className="space-y-2 pl-4">
                    <li><strong>Input tokens</strong> — Everything you send to the model: system prompts,
                    user messages, conversation history, and any context or data.</li>
                    <li><strong>Output tokens</strong> — The model&apos;s response. These typically cost
                    3-5x more than input tokens.</li>
                    <li><strong>Context window</strong> — The maximum tokens per request (e.g., 128K for
                    GPT-4o). Larger contexts enable more complex tasks but increase costs.</li>
                  </ul>
                  <p>
                    Pricing is usually quoted per million tokens. For example, GPT-4o costs $2.50 per
                    million input tokens and $10.00 per million output tokens.
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="How to Reduce LLM Costs">
                <div className="text-sm text-muted-foreground/80 space-y-3">
                  <p>There are several strategies to minimize your LLM API spending:</p>
                  <ul className="space-y-2 pl-4">
                    <li><strong>Optimize prompts</strong> — Remove unnecessary instructions, use
                    concise language, and avoid redundant context.</li>
                    <li><strong>Use efficient data formats</strong> — TOON format can reduce structured
                    data size by 30-60% compared to JSON, directly cutting token counts.</li>
                    <li><strong>Choose the right model</strong> — Use smaller, cheaper models for simple
                    tasks. Not every request needs GPT-4o.</li>
                    <li><strong>Cache responses</strong> — Store and reuse responses for identical or
                    similar queries.</li>
                    <li><strong>Limit output tokens</strong> — Set max_tokens to prevent unexpectedly
                    long responses.</li>
                    <li><strong>Batch requests</strong> — Some providers offer discounts for batch processing.</li>
                  </ul>
                  <p className="mt-3">
                    <a
                      href="https://toon.devden.dev"
                      className="text-emerald-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Try the TOON Converter
                    </a>
                    {" "}to see how much you could save by optimizing your data format.
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Provider Comparison: OpenAI vs Anthropic vs Google">
                <div className="text-sm text-muted-foreground/80 space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="py-2 pr-4 font-medium">Provider</th>
                          <th className="py-2 pr-4 font-medium">Top Model</th>
                          <th className="py-2 pr-4 font-medium">Input (per 1M)</th>
                          <th className="py-2 font-medium">Output (per 1M)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/20">
                          <td className="py-2 pr-4">OpenAI</td>
                          <td className="py-2 pr-4">GPT-4o</td>
                          <td className="py-2 pr-4">$2.50</td>
                          <td className="py-2">$10.00</td>
                        </tr>
                        <tr className="border-b border-border/20">
                          <td className="py-2 pr-4">Anthropic</td>
                          <td className="py-2 pr-4">Claude 3.5 Sonnet</td>
                          <td className="py-2 pr-4">$3.00</td>
                          <td className="py-2">$15.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4">Google</td>
                          <td className="py-2 pr-4">Gemini 1.5 Pro</td>
                          <td className="py-2 pr-4">$1.25</td>
                          <td className="py-2">$5.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    *Prices as of February 2026. Check official pricing pages for current rates.
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Why Use This Calculator">
                <FeatureList
                  features={[
                    "Compare costs across major providers instantly",
                    "Calculate per-request and monthly projections",
                    "See TOON optimization savings potential",
                    "Separate input/output token calculations",
                    "100% client-side (no data sent to servers)",
                    "No signup or account required",
                    "Updated pricing from official sources",
                    "Links to official pricing pages",
                  ]}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Frequently Asked Questions">
                <div className="space-y-4">
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How accurate is this calculator?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      The calculator uses official pricing from each provider&apos;s pricing page.
                      Actual costs may vary based on volume discounts, committed use contracts,
                      or pricing changes. Check the &quot;last updated&quot; date and verify with
                      official sources for production budgeting.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      What is TOON and how does it save money?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      TOON (Token-Optimized Object Notation) is a data format designed specifically
                      for LLM contexts. It removes unnecessary syntax (quotes, colons, brackets)
                      that JSON requires, reducing token count by 30-60% for structured data.
                      Fewer tokens means lower API costs.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Why are output tokens more expensive?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Output tokens require the model to generate new content, which is more
                      computationally intensive than processing input. The model must run
                      inference for each output token, while input tokens are processed in
                      parallel. This is why output typically costs 3-5x more than input.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      How do I estimate my token count?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      A rough rule of thumb: 1 token ≈ 4 characters or ¾ of a word in English.
                      For precise counts, use OpenAI&apos;s tiktoken library or each provider&apos;s
                      tokenizer. Most API responses also include token usage in the metadata.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Which model should I use?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      It depends on your use case. GPT-4o is great for complex reasoning and
                      code generation. Claude 3.5 Sonnet excels at long-form content and analysis.
                      Gemini 1.5 Pro offers the best value for general tasks. Consider testing
                      multiple models and using cheaper options for simpler tasks.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary-400 transition-colors">
                      Is my data private?
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed pl-4">
                      Yes. All calculations happen entirely in your browser using JavaScript.
                      No data is sent to any server. This tool is completely client-side.
                    </p>
                  </details>
                </div>
              </CollapsibleSection>
            </div>

            {/* Related Tools */}
            <div className="pt-6 mt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground/60">
                More DevDen tools:{" "}
                <a href="https://toon.devden.dev" className="hover:text-primary-400 transition-colors">TOON Converter</a>
                {" · "}
                <a href="https://json.devden.dev" className="hover:text-primary-400 transition-colors">JSON Formatter</a>
                {" · "}
                <a href="https://base64.devden.dev" className="hover:text-primary-400 transition-colors">Base64 Encoder</a>
                {" · "}
                <a href="https://hash.devden.dev" className="hover:text-primary-400 transition-colors">Hash Generator</a>
                {" · "}
                <a href="https://regex.devden.dev" className="hover:text-primary-400 transition-colors">Regex Tester</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
