'use client';

export function RegexSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DevDen Regex Tester',
    description:
      'Free online regex tester with real-time pattern matching, capture group highlighting, and a library of common patterns. Test and debug regular expressions instantly.',
    url: 'https://regex.devden.dev',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time regex matching',
      'Capture group highlighting',
      'Named group support',
      'All JavaScript regex flags (g, i, m, s, u, y)',
      'Match count display',
      'Common patterns library',
      '100% client-side processing',
      'Dark mode support',
      'Mobile responsive',
    ],
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '1.0',
    author: {
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
