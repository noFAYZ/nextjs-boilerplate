'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg border bg-card p-12 text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Ready to get started?
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Start tracking your complete financial picture in minutes. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/signup">
                <Button size="default">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button variant="outline" size="default">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Free plan available • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
