export function HashSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "DevDen Hash Generator",
    "description": "Free online hash generator. Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly from text or files. All algorithms at once, keyboard shortcuts. 100% client-side.",
    "url": "https://hash.devden.dev",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "MD5 hash generation",
      "SHA-1 hash generation",
      "SHA-256 hash generation",
      "SHA-512 hash generation",
      "File hashing with drag and drop",
      "All algorithms computed at once",
      "Keyboard shortcuts for quick copying",
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
        "name": "What is a hash function?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A hash function is a mathematical algorithm that converts input data of any size into a fixed-size output (the hash). The same input always produces the same output, but even tiny changes to the input create completely different hashes. Hashes are one-way functions - you cannot reverse them to get the original input."
        }
      },
      {
        "@type": "Question",
        "name": "Is MD5 secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MD5 is NOT cryptographically secure and should never be used for security purposes like password storage or digital signatures. It's vulnerable to collision attacks. However, MD5 is still commonly used for non-security purposes like checksums, cache keys, and file deduplication where collision resistance isn't critical."
        }
      },
      {
        "@type": "Question",
        "name": "Which hash algorithm should I use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For security purposes (passwords, signatures), use SHA-256 or SHA-512. For checksums and file integrity verification where security isn't critical, any algorithm works. SHA-256 is the most commonly used general-purpose hash today, offering a good balance of security and performance."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data safe using this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all hashing happens entirely in your browser using JavaScript. Your data never leaves your device and is never sent to any server. You can verify this by using the tool offline or checking the network tab in your browser's developer tools."
        }
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
    </>
  );
}
