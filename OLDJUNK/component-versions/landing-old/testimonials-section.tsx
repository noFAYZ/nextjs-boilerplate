'use client';

import { ScrollReveal } from './scroll-reveal';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'MoneyMappr gives us complete visibility across all our crypto and traditional assets. Essential for our treasury management.',
      author: 'Sarah Chen',
      role: 'CFO, TechCorp',
    },
    {
      quote: 'The multi-chain tracking and real-time analytics have completely transformed how we manage our portfolio.',
      author: 'Michael Torres',
      role: 'Investment Manager',
    },
    {
      quote: 'Finally, a professional solution that handles both DeFi and traditional banking. The reporting features save us hours.',
      author: 'Emily Rodriguez',
      role: 'Financial Controller',
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-semibold mb-2">Trusted by Financial Professionals</h2>
            <p className="text-sm text-muted-foreground">
              See what teams are saying about MoneyMappr
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.author} delay={index * 100}>
              <div className="group rounded-lg border bg-card p-6 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="pt-4 border-t">
                  <div className="font-medium text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
