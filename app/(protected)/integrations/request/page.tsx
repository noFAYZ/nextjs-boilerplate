'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/lib/hooks/useToast";
import {
  ArrowLeft,
  Building2,
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

export default function RequestIntegrationPage() {
  const router = useRouter();
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

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/accounts/integrations');
      }, 2000);
    } catch (error: unknown) {
      toast({
        title: 'Submission Failed',
        description: error?.message || 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="border-2 border-green-500/20 bg-green-500/5">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your integration request. We&apos;ll review it and get back to you soon.
            </p>
            <Button onClick={() => router.push('/accounts/integrations')}>
              Back to Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Request Integration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us which service you&apos;d like to connect
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">We&apos;re Always Expanding</h3>
              <p className="text-sm text-muted-foreground">
                Don&apos;t see the integration you need? Let us know! We prioritize integrations based on user requests.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Integration Details</CardTitle>
            <CardDescription>
              Provide information about the integration you&apos;d like to request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Why do you need this integration? <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what you'd like to do with this integration..."
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Help us understand your needs better
              </p>
            </div>

            {/* Use Case */}
            <div className="space-y-2">
              <Label htmlFor="useCase">Use Case (Optional)</Label>
              <Textarea
                id="useCase"
                placeholder="How would you use this integration in your workflow?"
                rows={3}
                value={formData.useCase}
                onChange={(e) =>
                  setFormData({ ...formData, useCase: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
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
    </div>
  );
}
