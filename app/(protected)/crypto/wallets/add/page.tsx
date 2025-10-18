'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Wallet,
  AlertCircle,
  Loader2,
  CheckCircle,
  X
} from 'lucide-react';
import Link from 'next/link';
import { cryptoApi } from '@/lib/services/crypto-api';
import type { CreateWalletRequest, NetworkType, WalletType } from '@/lib/types/crypto';

const NETWORK_OPTIONS: { value: NetworkType; label: string; description: string }[] = [
  { value: 'ETHEREUM', label: 'Ethereum', description: 'ETH and ERC-20 tokens' },
  { value: 'POLYGON', label: 'Polygon', description: 'MATIC and Polygon tokens' },
  { value: 'BSC', label: 'Binance Smart Chain', description: 'BNB and BEP-20 tokens' },
  { value: 'ARBITRUM', label: 'Arbitrum', description: 'Layer 2 Ethereum scaling' },
  { value: 'OPTIMISM', label: 'Optimism', description: 'Layer 2 Ethereum scaling' },
  { value: 'AVALANCHE', label: 'Avalanche', description: 'AVAX and Avalanche tokens' },
  { value: 'SOLANA', label: 'Solana', description: 'SOL and SPL tokens' },
  { value: 'BITCOIN', label: 'Bitcoin', description: 'BTC only' },
];

const WALLET_TYPE_OPTIONS: { value: WalletType; label: string; description: string }[] = [
  { value: 'HOT_WALLET', label: 'Hot Wallet', description: 'Software wallets like MetaMask, Trust Wallet' },
  { value: 'COLD_WALLET', label: 'Cold Wallet', description: 'Hardware wallets like Ledger, Trezor' },
  { value: 'EXCHANGE', label: 'Exchange', description: 'Centralized exchange wallets' },
  { value: 'MULTI_SIG', label: 'Multi-Signature', description: 'Multi-signature wallets' },
  { value: 'SMART_CONTRACT', label: 'Smart Contract', description: 'Contract-based wallets' },
];

interface FormData extends CreateWalletRequest {
  tags: string[];
}

export default function AddWalletPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    type: 'HOT_WALLET' as WalletType,
    network: 'ETHEREUM' as NetworkType,
    label: '',
    notes: '',
    tags: [],
  });

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        handleAddTag(tagInput);
      }
    }
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Wallet name is required';
    }
    
    if (!formData.address.trim()) {
      return 'Wallet address is required';
    }

    // Basic address validation based on network
    const address = formData.address.trim();
    
    switch (formData.network) {
      case 'ETHEREUM':
      case 'POLYGON':
      case 'BSC':
      case 'ARBITRUM':
      case 'OPTIMISM':
      case 'AVALANCHE':
        if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
          return 'Invalid Ethereum-compatible address format';
        }
        break;
      case 'SOLANA':
        if (!address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
          return 'Invalid Solana address format';
        }
        break;
      case 'BITCOIN':
        if (!address.match(/^(1|3|bc1)[a-zA-Z0-9]{25,87}$/)) {
          return 'Invalid Bitcoin address format';
        }
        break;
      default:
        return 'Please select a valid network';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare the request data
      const walletData: CreateWalletRequest = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        type: formData.type,
        network: formData.network,
        label: formData.label.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      const response = await cryptoApi.createWallet(walletData);

      if (!response.success) {
        throw new Error(response.error.message);
      }

      // Success! Redirect to the wallets page
      router.push('/crypto/wallets');
    } catch (err) {
      console.error('Failed to create wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedNetwork = NETWORK_OPTIONS.find(n => n.value === formData.network);
  const selectedWalletType = WALLET_TYPE_OPTIONS.find(t => t.value === formData.type);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/crypto/wallets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallets
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Wallet</h1>
          <p className="text-muted-foreground mt-1">
            Connect a new cryptocurrency wallet to track your portfolio
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Wallet Name *</Label>
                <Input
                  id="name"
                  placeholder="My MetaMask Wallet"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  placeholder="Personal, Trading, etc."
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address *</Label>
              <Input
                id="address"
                placeholder="0x... (Ethereum) or other address format"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Network and Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Network & Type Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Network *</Label>
                <Select
                  value={formData.network}
                  onValueChange={(value) => handleInputChange('network', value as NetworkType)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NETWORK_OPTIONS.map((network) => (
                      <SelectItem key={network.value} value={network.value}>
                        <div className="flex flex-col">
                          <span>{network.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {network.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedNetwork && (
                  <p className="text-sm text-muted-foreground">
                    {selectedNetwork.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Wallet Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value as WalletType)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WALLET_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex flex-col">
                          <span>{type.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {type.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedWalletType && (
                  <p className="text-sm text-muted-foreground">
                    {selectedWalletType.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-2">
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter or comma to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyPress}
                  disabled={isLoading}
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={isLoading}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this wallet..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Wallet
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}