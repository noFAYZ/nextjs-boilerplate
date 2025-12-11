'use client';

import { useState } from 'react';
import posthog from 'posthog-js';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/hooks/use-toast';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const INTEGRATION_CATEGORIES = [
  { value: 'banking', label: 'Banking & Finance', description: 'Banks, credit unions, payment processors' },
  { value: 'accounting', label: 'Accounting', description: 'QuickBooks, Xero, FreshBooks' },
  { value: 'crypto', label: 'Cryptocurrency', description: 'Exchanges, wallets, DeFi platforms' },
  { value: 'payment', label: 'Payment Processing', description: 'Stripe, PayPal, Square' },
  { value: 'ecommerce', label: 'E-commerce', description: 'Shopify, WooCommerce, Amazon' },
  { value: 'investment', label: 'Investment', description: 'Brokers, trading platforms' },
  { value: 'other', label: 'Other', description: 'Something else' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', description: 'Nice to have' },
  { value: 'medium', label: 'Medium', description: 'Would be very useful' },
  { value: 'high', label: 'High', description: 'Critical for my workflow' },
];

interface RequestIntegrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestIntegrationDialog({
  open,
  onOpenChange,
}: RequestIntegrationDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    integrationName: '',
    category: '',
    priority: 'medium',
    description: '',
    useCase: '',
    website: '',
  });

  const resetForm = () => {
    setFormData({
      integrationName: '',
      category: '',
      priority: 'medium',
      description: '',
      useCase: '',
      website: '',
    });
    setIsSuccess(false);
  };

  const handleClose = () => {
    if (!isSuccess && (formData.integrationName || formData.category || formData.description)) {
      posthog.capture('integration-request-form-closed', {
        integration_name_filled: !!formData.integrationName,
        category_filled: !!formData.category,
        description_filled: !!formData.description,
      });
    }
    onOpenChange(false);
    // Reset form after dialog close animation
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.integrationName || !formData.category || !formData.description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    posthog.capture('integration-request-submitted', {
      integration_name: formData.integrationName,
      category: formData.category,
      priority: formData.priority,
      has_website: !!formData.website,
      has_use_case: !!formData.useCase,
    });

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/integrations/request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(formData),
      // });

      setIsSuccess(true);
      toast({
        title: 'Request Submitted',
        description: "We'll review your integration request and get back to you soon!",
      });

      // Close dialog after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit request. Please try again.';
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground">
              Thank you for your integration request. We&apos;ll review it and get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-5 h-5 text-primary" />
                Request Integration
              </DialogTitle>
              <DialogDescription>
                Tell us which service you&apos;d like to connect. We prioritize integrations based on user requests.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Integration Name */}
              <div className="space-y-2">
                <Label htmlFor="integrationName">
                  Integration Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="integrationName"
                  placeholder="e.g., Wells Fargo, Coinbase, Wave Accounting"
                  value={formData.integrationName}
                  onChange={(e) =>
                    setFormData({ ...formData, integrationName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTEGRATION_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{cat.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {cat.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                level.value === 'high'
                                  ? 'destructive'
                                  : level.value === 'medium'
                                  ? 'default'
                                  : 'muted'
                              }
                              size="sm"
                            >
                              {level.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {level.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Why do you need this integration? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you'd like to do with this integration..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              {/* Use Case */}
              <div className="space-y-2">
                <Label htmlFor="useCase">Use Case (Optional)</Label>
                <Textarea
                  id="useCase"
                  placeholder="How would you use this integration in your workflow?"
                  rows={2}
                  value={formData.useCase}
                  onChange={(e) =>
                    setFormData({ ...formData, useCase: e.target.value })
                  }
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
