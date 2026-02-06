export function URLEncodeSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'URL Encoder/Decoder',
    description: 'Free online URL encoder and decoder. Encode text for URLs or decode percent-encoded strings instantly. Features auto-detect, URL component breakdown, and query string parser.',
    url: 'https://url-encode.devden.dev',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'URL encoding (percent encoding)',
      'URL decoding',
      'Auto-detect input type',
      'URL component breakdown',
      'Query string parser',
      'Keyboard shortcuts',
      '100% client-side processing',
    ],
    creator: {
      '@type': 'Organization',
      name: 'DevDen',
      url: 'https://devden.dev',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
