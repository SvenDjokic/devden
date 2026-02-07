import { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS, CATEGORY_LABELS, CATEGORY_ORDER, getToolsByCategory } from '@/lib/toolRegistry';

export const metadata: Metadata = {
  title: 'DevDen - Free Developer Tools',
  description:
    'Free online developer tools that just work. JSON formatter, Base64 encoder, Regex tester, URL encoder, Hash generator, and more. 100% client-side — your data never leaves your browser.',
  keywords: [
    'developer tools',
    'dev tools',
    'json formatter',
    'base64 encoder',
    'regex tester',
    'url encoder',
    'hash generator',
    'online tools',
    'free tools',
  ],
  openGraph: {
    title: 'DevDen - Free Developer Tools',
    description:
      'Free online developer tools that just work. JSON formatter, Base64 encoder, Regex tester, and more. 100% client-side.',
    url: 'https://devden.dev',
    siteName: 'DevDen',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevDen - Free Developer Tools',
    description:
      'Free online developer tools that just work. 100% client-side — your data never leaves your browser.',
  },
  alternates: {
    canonical: 'https://devden.dev',
  },
};

function ToolCard({
  name,
  description,
  href,
  icon,
  available,
}: {
  name: string;
  description: string;
  href: string;
  icon: string;
  available: boolean;
}) {
  if (!available) {
    return (
      <div className="group relative rounded-lg border border-border/50 bg-card/30 p-4 opacity-50 cursor-not-allowed">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
            <span className="text-muted-foreground font-mono text-sm">{icon}</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-sm text-muted-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground/60 mt-0.5">{description}</p>
            <span className="inline-block mt-2 text-[10px] text-muted-foreground/40 uppercase tracking-wide">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative rounded-lg border border-border/50 bg-card/30 p-4 transition-all hover:border-primary-500/50 hover:bg-card/50"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-primary-500/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-colors">
          <span className="text-primary-400 font-mono text-sm">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary-400 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function JsonLdSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevDen',
    url: 'https://devden.dev',
    description:
      'Free online developer tools that just work. JSON formatter, Base64 encoder, Regex tester, and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://devden.dev/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function Home() {
  const toolsByCategory = getToolsByCategory();
  const availableTools = TOOLS.filter((t) => t.available);

  return (
    <>
      <JsonLdSchema />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Hero */}
        <header className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{'{ }'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">DevDen</h1>
            </div>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-4">
              Developer tools that just work.
            </p>

            {/* Trust signal */}
            <p className="text-sm text-muted-foreground/60">
              No signup. No tracking. 100% client-side.
            </p>
          </div>
        </header>

        {/* Tool Grid */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            {/* Simple grid - all tools together */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TOOLS.map((tool) => (
                <ToolCard
                  key={tool.id}
                  name={tool.name}
                  description={tool.description}
                  href={tool.href}
                  icon={tool.icon}
                  available={tool.available}
                />
              ))}
            </div>

            {/* Tool count */}
            <p className="text-center text-xs text-muted-foreground/40 mt-8">
              {availableTools.length} free tools available
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs text-muted-foreground/40">
              Built for developers. Your data never leaves your browser.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
