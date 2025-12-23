export function extractDomainFromUrl(url) {
    // Remove protocol and path
    const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/?#]+)/i);
    
    if (!domainMatch) return null;
    
    const fullDomain = domainMatch[1];
    const parts = fullDomain.split('.');
    
    if (parts.length < 2) return {
      fullDomain: fullDomain,
      mainDomain: fullDomain,
      extension: ''
    };
    
    return {
      fullDomain: fullDomain,
      mainDomain: parts.slice(-2).join('.'),
      extension: parts.slice(-1)[0]
    };
  }

  export const PROVIDERS_METADATA = [
    { id: "PLAID", domain: "plaid.com", name: "Plaid", logo: "/logo/banks/plaid.png" },
    { id: "TELLER", domain: "teller.io", name: "Teller", logo: "/logos/teller-logo.svg" },
    { id: "MX", domain: "mx.com", name: "MX Technologies", logo: "/logos/mx-logo.svg" },
    { id: "YODLEE", domain: "yodlee.com", name: "Yodlee", logo: "/logos/yodlee-logo.svg" },
    { id: "FINICITY", domain: "finicity.com", name: "Finicity", logo: "/logos/finicity-logo.svg" },
    { id: "TRUELAYER", domain: "truelayer.com", name: "TrueLayer", logo: "/logos/truelayer-logo.svg" },
    { id: "MANUAL", domain: "", name: "Manual Entry", logo: "/logos/manual-entry-logo.svg" }
  ] as const;
  
  export type BankingProviderId = typeof PROVIDERS_METADATA[number]['id'];
  export type BankingProviderMetadata = typeof PROVIDERS_METADATA[number];
  
  export const getBankingProviderMetadata = (
    id: string
  ): BankingProviderMetadata | null => {
    const provider = PROVIDERS_METADATA.find(
      p => p.id.toUpperCase() === id.toUpperCase()
    );
    
    return provider || null;
  };