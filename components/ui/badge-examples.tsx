import React from 'react';
import { Badge } from './badge';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Zap,
  Crown,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';

export function BadgeExamples() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-4">Badge Component Showcase</h1>
        <p className="text-muted-foreground mb-8">
          A comprehensive collection of badge variants for different use cases.
        </p>
      </div>

      {/* Basic Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Status Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Status Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">
            <CheckCircle className="h-3 w-3" />
            Success
          </Badge>
          <Badge variant="warning">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
          <Badge variant="error">
            <XCircle className="h-3 w-3" />
            Error
          </Badge>
          <Badge variant="info">
            <Info className="h-3 w-3" />
            Info
          </Badge>
        </div>
      </section>

      {/* Soft Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Soft Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success-soft">
            <CheckCircle className="h-3 w-3" />
            Connected
          </Badge>
          <Badge variant="warning-soft">
            <AlertTriangle className="h-3 w-3" />
            Pending
          </Badge>
          <Badge variant="error-soft">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
          <Badge variant="info-soft">
            <Info className="h-3 w-3" />
            Processing
          </Badge>
        </div>
      </section>

      {/* Dot Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Dot Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="dot-success">Active</Badge>
          <Badge variant="dot-warning">Expired Soon</Badge>
          <Badge variant="dot-error">Disconnected</Badge>
          <Badge variant="dot-info">Syncing</Badge>
        </div>
      </section>

      {/* Gradient Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Gradient Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="gradient-primary">
            <Zap className="h-3 w-3" />
            Primary
          </Badge>
          <Badge variant="gradient-success">
            <TrendingUp className="h-3 w-3" />
            Growth
          </Badge>
          <Badge variant="gradient-warning">
            <Star className="h-3 w-3" />
            Featured
          </Badge>
        </div>
      </section>

      {/* Special Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Special Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="premium">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
          <Badge variant="pro">
            <Star className="h-3 w-3" />
            Pro
          </Badge>
          <Badge variant="new">
            <Zap className="h-3 w-3" />
            New
          </Badge>
        </div>
      </section>

      {/* Subtle Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Subtle Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="subtle">
            <Clock className="h-3 w-3" />
            Draft
          </Badge>
          <Badge variant="subtle-primary">
            Featured
          </Badge>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success" size="sm">Small</Badge>
          <Badge variant="success" size="default">Default</Badge>
          <Badge variant="success" size="lg">Large</Badge>
        </div>
      </section>

      {/* Real-world Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Real-world Examples</h2>
        <div className="space-y-4">

          {/* Banking Status Examples */}
          <div>
            <h3 className="text-sm font-medium mb-2">Banking Status</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="dot-success">Connected</Badge>
              <Badge variant="dot-info">Syncing</Badge>
              <Badge variant="dot-warning">Expired</Badge>
              <Badge variant="dot-error">Error</Badge>
              <Badge variant="subtle">Disconnected</Badge>
            </div>
          </div>

          {/* Account Types */}
          <div>
            <h3 className="text-sm font-medium mb-2">Account Types</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="gradient-primary">Checking</Badge>
              <Badge variant="gradient-success">Savings</Badge>
              <Badge variant="gradient-warning">Credit Card</Badge>
              <Badge variant="info-soft">Investment</Badge>
            </div>
          </div>

          {/* Transaction Categories */}
          <div>
            <h3 className="text-sm font-medium mb-2">Transaction Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success-soft">Income</Badge>
              <Badge variant="error-soft">Expense</Badge>
              <Badge variant="warning-soft">Transfer</Badge>
              <Badge variant="subtle">Pending</Badge>
            </div>
          </div>

          {/* User Plans */}
          <div>
            <h3 className="text-sm font-medium mb-2">User Plans</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Free</Badge>
              <Badge variant="info">Starter</Badge>
              <Badge variant="pro">
                <Star className="h-3 w-3" />
                Pro
              </Badge>
              <Badge variant="premium">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            </div>
          </div>

        </div>
      </section>

      {/* Usage Guide */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage Guide</h2>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm space-y-2">
            <p><strong>Status communication:</strong> Use soft variants for subtle status indicators</p>
            <p><strong>Action indicators:</strong> Use dot variants for active states</p>
            <p><strong>Highlighting:</strong> Use gradient variants for important features</p>
            <p><strong>Hierarchical data:</strong> Use different sizes to show importance</p>
            <p><strong>Special features:</strong> Use premium/pro variants for plan indicators</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BadgeExamples;