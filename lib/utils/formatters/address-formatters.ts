/**
 * Address Formatting Utilities
 * Centralized address and identifier formatting
 */

/**
 * Truncate a blockchain address for display
 * @param address - Full blockchain address
 * @param startChars - Number of characters to show at start (default: 8)
 * @param endChars - Number of characters to show at end (default: 6)
 */
export function truncateAddress(
  address: string,
  startChars: number = 8,
  endChars: number = 6
): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Truncate account number (show last 4 digits)
 */
export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber) return '';
  if (accountNumber.length <= 4) return accountNumber;
  return `****${accountNumber.slice(-4)}`;
}

/**
 * Format wallet address with copy icon friendly format
 */
export function formatWalletAddress(address: string): {
  full: string;
  truncated: string;
  masked: string;
} {
  return {
    full: address,
    truncated: truncateAddress(address),
    masked: maskAccountNumber(address),
  };
}

/**
 * Validate if string is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate if string is a valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Get address format type
 */
export function getAddressType(address: string): 'ethereum' | 'solana' | 'unknown' {
  if (isValidEthereumAddress(address)) return 'ethereum';
  if (isValidSolanaAddress(address)) return 'solana';
  return 'unknown';
}
