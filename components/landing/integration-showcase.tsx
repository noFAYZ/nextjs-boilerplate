'use client';

import { ScrollReveal } from './scroll-reveal';

export function IntegrationShowcase() {
  const integrations = [
    {
      category: 'Blockchain Networks',
      count: '25+',
      items: ['Ethereum', 'Bitcoin', 'Solana', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Avalanche'],
    },
    {
      category: 'Banks & Credit Cards',
      count: '500+',
      items: ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One', 'HSBC'],
    },
    {
      category: 'Crypto Exchanges',
      count: '10+',
      items: ['Coinbase', 'Binance', 'Kraken', 'Gemini', 'Crypto.com'],
    },
  ];

  return (
    <section id="integrations" className="py-16 bg-background scroll-mt-20">
      <div className=" mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-semibold mb-2">Supported Integrations</h2>
            <p className="text-sm text-muted-foreground">
              Connect all your financial accounts in one place
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <ScrollReveal key={integration.category} delay={index * 100}>
              <div className="rounded-lg border bg-card p-6 h-full">
                <div className="flex items-baseline gap-2 mb-4">
                  <h3 className="text-sm font-semibold">{integration.category}</h3>
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    {integration.count}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {integration.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                  <span className="text-xs px-2 py-1 text-muted-foreground">+more</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
