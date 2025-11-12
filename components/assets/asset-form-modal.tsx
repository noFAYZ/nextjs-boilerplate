'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Home, Car, Package } from 'lucide-react';
import { useCreateAssetAccount, useUpdateAssetAccount } from '@/lib/queries/use-networth-data';
import { toast } from 'sonner';
import type { AssetAccount, CreateAssetAccountRequest } from '@/lib/types/networth';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: AssetAccount | null;
}

const assetTypes = [
  { value: 'REAL_ESTATE', label: 'Real Estate', icon: Home },
  { value: 'VEHICLE', label: 'Vehicle', icon: Car },
  { value: 'OTHER_ASSET', label: 'Other Asset', icon: Package },
];

export function AssetFormModal({ isOpen, onClose, asset }: AssetFormModalProps) {
  const isEdit = !!asset;
  const { mutate: createAsset, isPending: isCreating } = useCreateAssetAccount();
  const { mutate: updateAsset, isPending: isUpdating } = useUpdateAssetAccount(asset?.id || '');

  const [formData, setFormData] = useState<Partial<CreateAssetAccountRequest>>({
    name: '',
    type: 'REAL_ESTATE',
    balance: 0,
    currency: 'USD',
    assetDescription: '',
    originalValue: undefined,
    purchaseDate: '',
    appreciationRate: undefined,
    address: '',
    city: '',
    state: '',
    country: 'USA',
    postalCode: '',
    tags: [],
    hasLiability: false,
    linkedLiabilityId: undefined,
  });

  const [tagInput, setTagInput] = useState('');

  // Initialize form data when asset changes
  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        type: asset.type,
        balance: asset.balance,
        currency: asset.currency,
        assetDescription: asset.assetDescription || '',
        originalValue: asset.originalValue || undefined,
        purchaseDate: asset.purchaseDate
          ? new Date(asset.purchaseDate).toISOString().split('T')[0]
          : '',
        appreciationRate: asset.appreciationRate || undefined,
        address: asset.address || '',
        city: asset.city || '',
        state: asset.state || '',
        country: asset.country || 'USA',
        postalCode: asset.postalCode || '',
        tags: asset.tags || [],
        hasLiability: asset.hasLiability || false,
        linkedLiabilityId: asset.linkedLiabilityId || undefined,
      });
    } else {
      // Reset form for new asset
      setFormData({
        name: '',
        type: 'REAL_ESTATE',
        balance: 0,
        currency: 'USD',
        assetDescription: '',
        originalValue: undefined,
        purchaseDate: '',
        appreciationRate: undefined,
        address: '',
        city: '',
        state: '',
        country: 'USA',
        postalCode: '',
        tags: [],
        hasLiability: false,
        linkedLiabilityId: undefined,
      });
    }
  }, [asset, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.type || formData.balance === undefined) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data: CreateAssetAccountRequest = {
      name: formData.name,
      type: formData.type as any,
      balance: Number(formData.balance),
      currency: formData.currency || 'USD',
      assetDescription: formData.assetDescription || undefined,
      originalValue: formData.originalValue ? Number(formData.originalValue) : undefined,
      purchaseDate: formData.purchaseDate || undefined,
      appreciationRate: formData.appreciationRate ? Number(formData.appreciationRate) : undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
      postalCode: formData.postalCode || undefined,
      tags: formData.tags || undefined,
      hasLiability: formData.hasLiability || false,
      linkedLiabilityId: formData.linkedLiabilityId || undefined,
    };

    if (isEdit) {
      updateAsset(data, {
        onSuccess: () => {
          toast.success('Asset updated successfully');
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to update asset');
        },
      });
    } else {
      createAsset(data, {
        onSuccess: () => {
          toast.success('Asset created successfully');
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to create asset');
        },
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details of your asset.'
              : 'Add a new asset to track its value over time.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">
                  Asset Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Primary Residence, Tesla Model 3"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">
                  Asset Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="balance">
                  Current Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.assetDescription}
                  onChange={(e) => setFormData({ ...formData, assetDescription: e.target.value })}
                  placeholder="Optional description of the asset"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Purchase Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Purchase Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalValue">Original Purchase Price</Label>
                <Input
                  id="originalValue"
                  type="number"
                  step="0.01"
                  value={formData.originalValue || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, originalValue: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="appreciationRate">Annual Appreciation Rate (%)</Label>
                <Input
                  id="appreciationRate"
                  type="number"
                  step="0.1"
                  value={formData.appreciationRate || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, appreciationRate: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="e.g., 5.5"
                />
              </div>
            </div>
          </div>

          {/* Location (for Real Estate) */}
          {formData.type === 'REAL_ESTATE' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Location</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="San Francisco"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="CA"
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="94102"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag (press Enter)"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? 'Update Asset' : 'Create Asset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
