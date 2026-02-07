'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { AccountGroup } from '@/lib/types/account-groups';

interface GroupSettingsProps {
  group: AccountGroup;
  onUpdate?: (group: AccountGroup) => void;
  onDelete?: () => void;
}

/**
 * GroupSettings Component
 *
 * NOTE: Group management features are not currently supported by the backend.
 * The following operations require backend endpoints that don't exist:
 * - Get group settings (GET /groups/{id}/settings)
 * - Update group settings (PUT /groups/{id}/settings)
 * - Export group settings (GET /groups/{id}/export)
 * - Import group settings (POST /groups/{id}/import)
 * - Archive group (POST /groups/{id}/archive)
 * - Delete group (DELETE /groups/{id})
 *
 * This component has been disabled until these endpoints are implemented.
 */
export function GroupSettings({ group }: GroupSettingsProps) {
  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20">
      <CardHeader>
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-amber-900 dark:text-amber-100">
              Feature Unavailable
            </CardTitle>
            <CardDescription className="text-amber-800/80 dark:text-amber-200/80 mt-1">
              Group settings management is not currently supported by the backend API.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-700 dark:text-amber-300/90">
          The following group management features require backend API endpoints that haven't been implemented:
        </p>
        <ul className="mt-3 ml-4 text-sm text-amber-700 dark:text-amber-300/90 space-y-1 list-disc">
          <li>Group settings management</li>
          <li>Settings import/export</li>
          <li>Group archiving</li>
          <li>Group deletion</li>
        </ul>
        <p className="text-xs text-amber-600/80 dark:text-amber-400/60 mt-4">
          To use these features, the following backend endpoints need to be implemented:
        </p>
        <ul className="mt-2 ml-4 text-xs text-amber-600/80 dark:text-amber-400/60 space-y-1 list-disc font-mono">
          <li>GET /api/v1/groups/{'{id}'}/settings</li>
          <li>PUT /api/v1/groups/{'{id}'}/settings</li>
          <li>GET /api/v1/groups/{'{id}'}/export</li>
          <li>POST /api/v1/groups/{'{id}'}/import</li>
          <li>POST /api/v1/groups/{'{id}'}/archive</li>
          <li>DELETE /api/v1/groups/{'{id}'}</li>
        </ul>
      </CardContent>
    </Card>
  );
}
