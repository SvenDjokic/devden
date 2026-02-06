export function PricingSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "DevDen LLM Pricing Calculator",
    "description": "Free online LLM pricing calculator. Compare API costs across GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro. Calculate monthly spend and see TOON optimization savings. 100% client-side.",
    "url": "https://llm-pricing.devden.dev",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Compare costs across OpenAI, Anthropic, and Google",
      "Calculate per-request and monthly projections",
      "Separate input and output token calculations",
      "TOON format optimization savings calculator",
      "Real-time cost updates as you type",
      "Links to official pricing pages",
      "100% client-side processing",
      "No data sent to servers"
    ],
    "creator": {
      "@type": "Organization",
      "name": "DevDen",
      "url": "https://devden.dev"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How accurate is this LLM pricing calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The calculator uses official pricing from each provider's pricing page. Actual costs may vary based on volume discounts, committed use contracts, or pricing changes. Check the 'last updated' date and verify with official sources for production budgeting."
        }
      },
      {
        "@type": "Question",
        "name": "What is TOON and how does it save money on LLM costs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TOON (Token-Optimized Object Notation) is a data format designed specifically for LLM contexts. It removes unnecessary syntax (quotes, colons, brackets) that JSON requires, reducing token count by 30-60% for structured data. Fewer tokens means lower API costs."
        }
      },
      {
        "@type": "Question",
        "name": "Why are output tokens more expensive than input tokens?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Output tokens require the model to generate new content, which is more computationally intensive than processing input. The model must run inference for each output token, while input tokens are processed in parallel. This is why output typically costs 3-5x more than input."
        }
      },
      {
        "@type": "Question",
        "name": "How do I estimate my token count for LLM APIs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A rough rule of thumb: 1 token is approximately 4 characters or ¾ of a word in English. For precise counts, use OpenAI's tiktoken library or each provider's tokenizer. Most API responses also include token usage in the metadata."
        }
      },
      {
        "@type": "Question",
        "name": "Which LLM model should I use - GPT-4o, Claude, or Gemini?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on your use case. GPT-4o is great for complex reasoning and code generation. Claude 3.5 Sonnet excels at long-form content and analysis. Gemini 1.5 Pro offers the best value for general tasks. Consider testing multiple models and using cheaper options for simpler tasks."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data private when using this calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all calculations happen entirely in your browser using JavaScript. No data is sent to any server. This tool is completely client-side. You can verify this by using the tool offline or checking the network tab in your browser's developer tools."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "DevDen",
        "item": "https://devden.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "LLM Pricing Calculator",
        "item": "https://llm-pricing.devden.dev"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
