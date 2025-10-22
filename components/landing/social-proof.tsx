'use client';

export function SocialProof() {
  const logos = [
    'Ethereum', 'Bitcoin', 'Polygon', 'Stripe', 'Plaid', 'Coinbase'
  ];

  return (
    <section className="py-12 bg-background border-b">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs text-muted-foreground mb-6">
          Integrated with leading platforms
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 max-w-4xl mx-auto opacity-40">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-sm font-medium text-muted-foreground"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
