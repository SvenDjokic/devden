export function TimestampSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DevDen Unix Timestamp Converter",
    url: "https://timestamp.devden.dev",
    description:
      "Convert Unix timestamps to human-readable dates or dates to Unix timestamps instantly. Timezone support, auto-detection of seconds/milliseconds, live clock. 100% client-side.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in all modern browsers.",
    softwareVersion: "1.0",
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
      "Timestamp to date conversion",
      "Date to timestamp conversion",
      "Auto-detect seconds vs milliseconds",
      "Timezone selection",
      "Live Unix timestamp clock",
      "Copy to clipboard",
      "Keyboard shortcuts",
      "Local storage persistence",
      "Relative time display",
      "Multiple output formats (ISO 8601, RFC 2822)",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I convert a Unix timestamp to a date?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Paste your Unix timestamp (in seconds or milliseconds) into the input field. The tool automatically detects the format and shows the converted date with day of week, relative time, and multiple output formats including ISO 8601 and RFC 2822.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between seconds and milliseconds?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unix timestamps in seconds are 10 digits long (e.g., 1700000000), while millisecond timestamps are 13 digits (e.g., 1700000000000). Languages like JavaScript use milliseconds (Date.now()), while most Unix systems and languages like Python use seconds.",
        },
      },
      {
        "@type": "Question",
        name: "How do timezones affect timestamp conversion?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unix timestamps are always in UTC. When converting to a human-readable date, the timezone determines how the date and time are displayed. The same timestamp shows different clock times in different timezones.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Y2K38 problem?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Year 2038 problem affects systems storing timestamps as 32-bit signed integers. On January 19, 2038, at 03:14:07 UTC, these systems will overflow. Modern systems use 64-bit integers, which won't overflow for billions of years.",
        },
      },
      {
        "@type": "Question",
        name: "How do I get the current Unix timestamp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The live clock at the top shows the current Unix timestamp updating in real-time. In code: JavaScript uses Date.now(), Python uses time.time(), and most other languages have similar functions.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data private?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All conversions happen entirely in your browser using JavaScript's built-in Date and Intl APIs. No timestamps or dates are sent to any server.",
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
