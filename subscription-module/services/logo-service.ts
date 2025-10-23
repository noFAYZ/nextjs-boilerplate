/**
 * Logo Service
 *
 * PURPOSE: Provides company logos from logo.dev API
 * - Extracts domain from website URLs
 * - Generates logo.dev URLs for company logos
 * - Supports various sizes and formats
 */

// ============================================================================
// TYPES
// ============================================================================

export interface LogoOptions {
  size?: number; // Logo size in pixels (default: 128)
  format?: 'png' | 'svg' | 'webp' | 'jpg'; // Image format (default: png)
  theme?: 'light' | 'dark'; // Theme variant
  retina?: boolean; // High-resolution display support
  token?: string; // Optional API token for authenticated requests
}

// ============================================================================
// LOGO SERVICE
// ============================================================================

class LogoService {
  private readonly LOGO_DEV_BASE_URL = 'https://img.logo.dev';
  private readonly LOGO_DEV_API_TOKEN = 'pk_Mcso4cLAR82OsJU5f3K12g';
  private readonly DEFAULT_SIZE = 300;
  private readonly DEFAULT_FORMAT = 'jpg';
  private readonly DEFAULT_RETINA = true;
  /**
   * Extract domain from a URL
   * @param url - Full URL (e.g., "https://netflix.com" or "www.spotify.com")
   * @returns Domain name (e.g., "netflix.com", "spotify.com")
   */
  private extractDomain(url: string): string | null {
    try {
      // Remove protocol if present
      let domain = url.toLowerCase().trim();

      // Add protocol if missing for URL parsing
      if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = `https://${domain}`;
      }

      const urlObj = new URL(domain);
      let hostname = urlObj.hostname;

      // Remove 'www.' prefix if present
      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }

      return hostname;
    } catch (error) {
      console.error('Failed to extract domain from URL:', url, error);
      return null;
    }
  }

  /**
   * Generate a logo.dev URL for a given domain
   * @param domain - Domain name (e.g., "netflix.com")
   * @param options - Logo customization options
   * @returns Full logo.dev URL
   */
  private generateLogoUrl(domain: string, options?: LogoOptions): string {
    const params = new URLSearchParams();

    // Always include the API token for authenticated requests
    params.append('token', options?.token || this.LOGO_DEV_API_TOKEN);

    if (options?.size) {
      params.append('size', String(options.size));
    }

    if (options?.format) {
      params.append('format', options.format);
    }

    if (options?.theme) {
      params.append('theme', options.theme);
    }

    if (options?.retina !== undefined) {
      params.append('retina', String(options.retina));
    }

    const queryString = params.toString();
    const url = `${this.LOGO_DEV_BASE_URL}/${domain}`;

    return `${url}?${queryString}`;
  }

  /**
   * Get logo URL from a website URL
   * @param websiteUrl - Full website URL or domain
   * @param options - Logo customization options
   * @returns Logo.dev URL or null if invalid
   */
  getLogoUrl(websiteUrl: string, options?: LogoOptions): string | null {
    if (!websiteUrl) {
      return null;
    }

    const domain = this.extractDomain(websiteUrl);
    if (!domain) {
      return null;
    }

    return this.generateLogoUrl(domain, options);
  }

  /**
   * Get logo URL with default settings optimized for UI
   * @param websiteUrl - Full website URL or domain
   * @returns Logo.dev URL or null if invalid
   */
  getDefaultLogoUrl(websiteUrl: string): string | null {
    return this.getLogoUrl(websiteUrl, {
      size: this.DEFAULT_SIZE,
      format: this.DEFAULT_FORMAT,
      retina:true
    });
  }

  /**
   * Get high-resolution logo URL for retina displays
   * @param websiteUrl - Full website URL or domain
   * @param size - Logo size in pixels (default: 256)
   * @returns Logo.dev URL or null if invalid
   */
  getRetinaLogoUrl(websiteUrl: string, size: number = 256): string | null {
    return this.getLogoUrl(websiteUrl, {
      size,
      format: this.DEFAULT_FORMAT,
      retina: true,
    });
  }

  /**
   * Get SVG logo URL (scalable, best for icons)
   * @param websiteUrl - Full website URL or domain
   * @returns Logo.dev URL or null if invalid
   */
  getSvgLogoUrl(websiteUrl: string): string | null {
    return this.getLogoUrl(websiteUrl, {
      format: 'svg',
    });
  }

  /**
   * Batch get logo URLs for multiple websites
   * @param websiteUrls - Array of website URLs
   * @param options - Logo customization options
   * @returns Map of website URL to logo URL
   */
  batchGetLogoUrls(
    websiteUrls: string[],
    options?: LogoOptions
  ): Map<string, string | null> {
    const logoMap = new Map<string, string | null>();

    for (const websiteUrl of websiteUrls) {
      const logoUrl = this.getLogoUrl(websiteUrl, options);
      logoMap.set(websiteUrl, logoUrl);
    }

    return logoMap;
  }

  /**
   * Enrich subscription data with logo URL
   * @param subscription - Subscription object with websiteUrl
   * @param options - Logo customization options
   * @returns Subscription with logoUrl added if websiteUrl exists
   */
  enrichSubscriptionWithLogo<T extends { websiteUrl?: string; logoUrl?: string }>(
    subscription: T,
    options?: LogoOptions
  ): T {
    if (!subscription.websiteUrl) {
      return subscription;
    }

    const logoUrl = this.getLogoUrl(subscription.websiteUrl, options);

    return {
      ...subscription,
      logoUrl: logoUrl || subscription.logoUrl,
    };
  }

  /**
   * Batch enrich subscriptions with logo URLs
   * @param subscriptions - Array of subscription objects
   * @param options - Logo customization options
   * @returns Subscriptions with logoUrl added
   */
  batchEnrichSubscriptions<T extends { websiteUrl?: string; logoUrl?: string }>(
    subscriptions: T[],
    options?: LogoOptions
  ): T[] {
    return subscriptions.map((subscription) =>
      this.enrichSubscriptionWithLogo(subscription, options)
    );
  }

  /**
   * Validate if a logo URL is accessible (client-side check)
   * @param logoUrl - Logo URL to validate
   * @returns Promise<boolean> - True if logo loads successfully
   */
  async validateLogoUrl(logoUrl: string): Promise<boolean> {
    try {
      const response = await fetch(logoUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Logo validation failed:', logoUrl, error);
      return false;
    }
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const logoService = new LogoService();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Quick helper to get logo URL from website URL
 * @param websiteUrl - Website URL or domain
 * @returns Logo.dev URL or null
 */
export function getLogoUrl(websiteUrl: string): string | null {
  return logoService.getDefaultLogoUrl(websiteUrl);
}

/**
 * Quick helper to enrich subscription with logo
 * @param subscription - Subscription with websiteUrl
 * @returns Subscription with logoUrl
 */
export function enrichWithLogo<T extends { websiteUrl?: string; logoUrl?: string }>(
  subscription: T
): T {
  return logoService.enrichSubscriptionWithLogo(subscription);
}
