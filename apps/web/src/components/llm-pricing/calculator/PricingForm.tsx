"use client";

import { useState, useEffect } from "react";
import { PricingInput } from "@/lib/calculatePricing";

interface PricingFormProps {
  onCalculate: (input: PricingInput) => void;
  initialValues?: Partial<PricingInput>;
}

export function PricingForm({ onCalculate, initialValues }: PricingFormProps) {
  const [inputTokens, setInputTokens] = useState(initialValues?.inputTokensPerRequest ?? 1000);
  const [outputTokens, setOutputTokens] = useState(initialValues?.outputTokensPerRequest ?? 500);
  const [requestsPerDay, setRequestsPerDay] = useState(initialValues?.requestsPerDay ?? 100);

  // Auto-calculate on change
  useEffect(() => {
    onCalculate({
      inputTokensPerRequest: inputTokens,
      outputTokensPerRequest: outputTokens,
      requestsPerDay: requestsPerDay,
    });
  }, [inputTokens, outputTokens, requestsPerDay, onCalculate]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Input Tokens */}
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="inputTokens" className="block text-xs sm:text-sm font-medium text-foreground">
            Input tokens per request
          </label>
          <input
            id="inputTokens"
            type="number"
            min={0}
            value={inputTokens}
            onChange={(e) => setInputTokens(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full h-9 sm:h-10 px-3 font-mono text-sm bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Tokens in your prompt/context
          </p>
        </div>

        {/* Output Tokens */}
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="outputTokens" className="block text-xs sm:text-sm font-medium text-foreground">
            Output tokens per request
          </label>
          <input
            id="outputTokens"
            type="number"
            min={0}
            value={outputTokens}
            onChange={(e) => setOutputTokens(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full h-9 sm:h-10 px-3 font-mono text-sm bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Tokens in model response
          </p>
        </div>

        {/* Requests Per Day */}
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="requestsPerDay" className="block text-xs sm:text-sm font-medium text-foreground">
            Requests per day
          </label>
          <input
            id="requestsPerDay"
            type="number"
            min={0}
            value={requestsPerDay}
            onChange={(e) => setRequestsPerDay(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full h-9 sm:h-10 px-3 font-mono text-sm bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            API calls per day
          </p>
        </div>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="text-xs sm:text-sm text-muted-foreground mr-1 sm:mr-2">Presets:</span>
        <button
          onClick={() => {
            setInputTokens(500);
            setOutputTokens(200);
            setRequestsPerDay(100);
          }}
          className="px-2 sm:px-3 py-1 text-[11px] sm:text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
        >
          Light usage
        </button>
        <button
          onClick={() => {
            setInputTokens(2000);
            setOutputTokens(1000);
            setRequestsPerDay(500);
          }}
          className="px-2 sm:px-3 py-1 text-[11px] sm:text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
        >
          Medium usage
        </button>
        <button
          onClick={() => {
            setInputTokens(8000);
            setOutputTokens(2000);
            setRequestsPerDay(1000);
          }}
          className="px-2 sm:px-3 py-1 text-[11px] sm:text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
        >
          Heavy usage
        </button>
        <button
          onClick={() => {
            setInputTokens(50000);
            setOutputTokens(4000);
            setRequestsPerDay(500);
          }}
          className="px-2 sm:px-3 py-1 text-[11px] sm:text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
        >
          RAG app
        </button>
      </div>
    </div>
  );
}
