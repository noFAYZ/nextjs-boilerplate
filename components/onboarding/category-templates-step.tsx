'use client';

import { useCategoryTemplates } from '@/lib/queries/use-category-groups-data';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  groupCount: number;
  categoryCount: number;
}

interface CategoryTemplatesStepProps {
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
}

export function CategoryTemplatesStep({
  selectedTemplate,
  onSelectTemplate,
}: CategoryTemplatesStepProps) {
  const { data: templatesResponse, isLoading, error } = useCategoryTemplates();
  const templates = templatesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="w-full mx-auto max-w-3xl flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading available templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto max-w-3xl ">
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900 dark:text-red-200">Failed to load templates</h3>
            <p className="text-sm text-red-800 dark:text-red-300 mt-1">
              {error instanceof Error ? error.message : 'An error occurred while loading category templates'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center lg:text-left">
          Choose a template to get started with pre-configured budget categories, or customize later
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No templates available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((template: CategoryTemplate) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className="w-full text-left"
            >
              <Card
                className={cn(
                  'p-3 cursor-pointer ',
                  selectedTemplate === template.id
                    ? ''
                    : 'hover:bg-card/50'
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <h3 className="font-semibold text-foreground">{template.name}</h3>
                       {/*  <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p> */}
                      </div>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>

             
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      <div className="pt-2">
        <p className="text-xs text-muted-foreground text-center">
          All templates include essential categories. You can customize, add, or remove categories anytime after setup.
        </p>
      </div>
    </div>
  );
}
