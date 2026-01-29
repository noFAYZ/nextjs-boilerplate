'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How does MoneyMappr connect to my accounts?',
      answer: 'We use secure, read-only API connections for banks and exchanges. For crypto wallets, simply provide your public address. We never ask for private keys or passwords.',
    },
    {
      question: 'Which blockchains are supported?',
      answer: 'We support 25+ blockchains including Ethereum, Bitcoin, Solana, Polygon, Arbitrum, Optimism, Base, and more.',
    },
    {
      question: 'Can I track NFTs and DeFi positions?',
      answer: 'Yes. MoneyMappr automatically tracks NFTs and DeFi positions including staking, liquidity pools, and lending protocols.',
    },
    {
      question: 'How often is data synchronized?',
      answer: 'Free plan users can sync manually. Pro users get automatic real-time synchronization with background updates every 5 minutes.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. We use AES-256 encryption, are SOC 2 compliant, and all connections are read-only. Your data is encrypted in transit and at rest.',
    },
    {
      question: 'Can I export data for taxes?',
      answer: 'Pro users can export transaction history in CSV, PDF, and tax software formats with capital gains/losses calculations.',
    },
  ];

  return (
    <section id="faq" className="py-16 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
       
          
          <div className="relative max-w-lg mx-auto  mb-8 text-center">
        <div className="mx-auto  text-center ">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
          Everything you need to know about MoneyMappr
          </p>
        </div>
      </div>


        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-2">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 50}>
              <div className="rounded-lg border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
