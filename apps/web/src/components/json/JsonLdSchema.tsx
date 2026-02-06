export function JsonLdSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DevDen JSON Formatter",
    url: "https://json.devden.dev",
    description:
      "Format, validate, and beautify JSON instantly. No ads, no signup, no clutter.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in all modern browsers.",
    softwareVersion: "1.1",
    author: {
      "@type": "Organization",
      name: "DevDen",
      url: "https://devden.dev",
      sameAs: ["https://json.devden.dev", "https://base64.devden.dev", "https://timestamp.devden.dev"],
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "JSON formatting",
      "JSON validation",
      "Syntax highlighting",
      "Copy to clipboard",
      "Real-time formatting",
      "Error detection with line numbers",
      "Tree view",
      "Auto-fix common JSON errors",
      "Keyboard shortcuts",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I format JSON online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Paste your JSON into the input panel on the left. The tool automatically formats and validates it in real-time, showing the beautified output on the right with proper indentation and syntax highlighting. You can adjust the indent size (2 spaces, 4 spaces, or tabs) using the toolbar options.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between formatting and validation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Formatting (or beautifying) adds proper indentation and line breaks to make JSON readable, while validation checks if the JSON syntax is correct. This tool does both simultaneously — if your JSON has syntax errors, you'll see a detailed error message with the line number and position.",
        },
      },
      {
        "@type": "Question",
        name: "Can I fix broken JSON automatically?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. When the tool detects fixable errors (like trailing commas, missing quotes, or single quotes instead of double quotes), a 'Fix & Format' button appears. Click it to automatically repair common JSON issues. You can always undo the fix if needed.",
        },
      },
      {
        "@type": "Question",
        name: "What causes JSON parse errors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common causes include: trailing commas after the last item, single quotes instead of double quotes, unquoted property names, missing commas between items, comments (JSON doesn't support comments), and special characters that need escaping.",
        },
      },
      {
        "@type": "Question",
        name: "JSON vs XML — when should I use JSON?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JSON is preferred for web APIs, JavaScript applications, and when you need lightweight data interchange. It's more compact and easier to parse than XML. Use XML when you need document markup, namespaces, schemas (XSD), or when working with legacy systems that require it.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data private?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All formatting and validation happens entirely in your browser using JavaScript. No JSON data is ever sent to any server. Your input is saved in your browser's localStorage for convenience, but you can clear it anytime.",
        },
      },
    ],
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
    </>
  );
}
