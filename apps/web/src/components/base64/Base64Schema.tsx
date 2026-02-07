export function Base64Schema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DevDen Base64 Encoder/Decoder",
    url: "https://devden.dev/base64",
    description:
      "Encode text to Base64 or decode Base64 to text instantly. Auto-detect mode, keyboard shortcuts. 100% client-side.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in all modern browsers.",
    softwareVersion: "1.0",
    author: {
      "@type": "Organization",
      name: "DevDen",
      url: "https://devden.dev",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Base64 encoding",
      "Base64 decoding",
      "Auto-detect mode",
      "Real-time conversion",
      "Copy to clipboard",
      "Keyboard shortcuts",
      "Local storage persistence",
      "Error detection",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I encode text to Base64?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter your text in the input panel. If auto-detect mode is enabled, the tool will recognize it as plain text and encode it automatically. You can also manually select 'Encode' mode using the toggle or press 'E' on your keyboard.",
        },
      },
      {
        "@type": "Question",
        name: "How do I decode Base64 to text?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Paste your Base64 string in the input panel. Auto-detect mode will recognize valid Base64 and decode it automatically. You can also manually select 'Decode' mode using the toggle or press 'D' on your keyboard.",
        },
      },
      {
        "@type": "Question",
        name: "What is Base64 used for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Base64 is used to encode binary data for text-only contexts: embedding images in HTML/CSS (data URIs), encoding email attachments (MIME), storing binary in JSON, encoding authentication credentials (HTTP Basic Auth), and passing data through URLs safely.",
        },
      },
      {
        "@type": "Question",
        name: "Is Base64 encryption?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Base64 is encoding, not encryption. It transforms data into a different format but provides no security — anyone can decode Base64. Never use Base64 to 'hide' sensitive data. For security, use proper encryption algorithms like AES.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between Base64 and Base64URL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard Base64 uses + and / characters, which have special meaning in URLs. Base64URL replaces these with - and _ to be URL-safe without additional encoding. JWTs and many web APIs use Base64URL.",
        },
      },
      {
        "@type": "Question",
        name: "Why does Base64 increase file size?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Base64 encoding increases size by approximately 33% because it represents 3 bytes of binary data as 4 ASCII characters. This overhead is the trade-off for text-safe representation.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data private?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All encoding and decoding happens entirely in your browser using JavaScript. No data is ever sent to any server.",
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
