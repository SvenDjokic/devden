"use client";

import { PricingResult, formatCurrency, formatNumber } from "@/lib/calculatePricing";
import { pricingData } from "@/data/pricing";

interface PricingTableProps {
  result: PricingResult | null;
}

export function PricingTable({ result }: PricingTableProps) {
  if (!result || result.costs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
        <span>
          <strong className="text-foreground">{formatNumber(result.totalTokensPerRequest)}</strong> tokens/request
        </span>
        <span>
          <strong className="text-foreground">{formatNumber(result.requestsPerMonth)}</strong> requests/month
        </span>
      </div>

      {/* Pricing table */}
      <div className="-mx-2 sm:mx-0">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 sm:py-3 px-2 font-medium text-muted-foreground">Model</th>
              <th className="hidden sm:table-cell text-right py-2 sm:py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Per Request</th>
              <th className="text-right py-2 sm:py-3 px-2 font-medium text-muted-foreground">Monthly</th>
              <th className="text-right py-2 sm:py-3 px-2 font-medium text-muted-foreground">
                <span className="text-emerald-500 whitespace-nowrap">w/ TOON</span>
              </th>
              <th className="text-right py-2 sm:py-3 px-2 font-medium text-muted-foreground">
                <span className="text-emerald-500">Savings</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {result.costs.map((cost, index) => (
              <tr
                key={cost.model.id}
                className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                  index === 0 ? "bg-emerald-500/5" : ""
                }`}
              >
                <td className="py-2 sm:py-3 px-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                    <span className="font-medium text-foreground text-xs sm:text-sm leading-tight">{cost.model.name}</span>
                    {index === 0 && (
                      <span className="inline-block w-fit px-1 py-0.5 text-[10px] sm:text-xs bg-emerald-500/10 text-emerald-500 rounded">
                        Cheapest
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{cost.model.provider}</div>
                </td>
                <td className="hidden sm:table-cell text-right py-2 sm:py-3 px-2 font-mono text-foreground whitespace-nowrap">
                  {formatCurrency(cost.costPerRequest)}
                </td>
                <td className="text-right py-2 sm:py-3 px-2 font-mono text-foreground font-medium whitespace-nowrap">
                  {formatCurrency(cost.monthlyCost)}
                </td>
                <td className="text-right py-2 sm:py-3 px-2 font-mono text-emerald-500 whitespace-nowrap">
                  {formatCurrency(cost.toonMonthlyCost)}
                </td>
                <td className="text-right py-2 sm:py-3 px-2">
                  <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-0.5 sm:gap-2">
                    <span className="font-mono text-emerald-500 text-[11px] sm:text-sm whitespace-nowrap">
                      -{formatCurrency(cost.savingsMonthly)}
                    </span>
                    <span className="px-1 py-0.5 text-[10px] sm:text-xs bg-emerald-500/10 text-emerald-500 rounded whitespace-nowrap">
                      {cost.savingsPercent.toFixed(0)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer notes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pt-2 text-[10px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Prices updated: {pricingData.lastUpdated}</span>
          <span className="text-border">|</span>
          <a
            href="https://toon.devden.dev"
            className="text-emerald-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try TOON Converter
          </a>
        </div>
        <div>
          TOON assumes 35% input token reduction
        </div>
      </div>
    </div>
  );
}
