import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

// Reusable FeatureTabs Component
// Props:
// tabs: Array of {
//   id: string;
//   title: string;
//   description?: string;
//   items?: string[]; // Feature bullet points
// }
export function FeatureTabs({ tabs }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue={tabs?.[0]?.id} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 bg-muted/40 p-1 rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-xs md:text-sm py-2 px-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="mt-6 border rounded-2xl p-6 bg-card shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default" className="text-sm py-1 px-3">
                {tab.title}
              </Badge>
            </div>

            {/* Description */}
            {tab.description && (
              <p className="text-muted-foreground mb-6 text-sm md:text-base leading-relaxed">
                {tab.description}
              </p>
            )}

            {/* Bullet List */}
            {tab.items && (
              <ul className="grid gap-3 text-sm md:text-base">
                {tab.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Example Usage Component (Optional for Documentation)
export function FeatureTabsExample() {
  const tabs = [
    {
      id: "overview",
      title: "Overview",
      description:
        "This system delivers high-performance analytics, robust security, and a frictionless user experience.",
      items: [
        "Modern UI with ShadCN components",
        "Zero-friction architecture for scalability",
        "Clean reusable codebase for production apps",
      ],
    },
    {
      id: "security",
      title: "Security",
      description: "Enterprise‑grade security built into every layer of the stack.",
      items: [
        "Role‑based access controls",
        "End‑to‑end encrypted data handling",
        "Hardened routing and zero‑trust boundaries",
      ],
    },
    {
      id: "performance",
      title: "Performance",
      description: "Optimized rendering pipelines and highly efficient state flow.",
      items: [
        "Automatic batching and lean DOM usage",
        "Lazy‑loading for resource efficiency",
        "Micro‑optimized UI interactions",
      ],
    },
    {
      id: "billing",
      title: "Billing",
      description: "Transparent, predictable, and scalable billing models.",
      items: [
        "Usage‑based pricing options",
        "Automated invoicing workflows",
        "Audit‑friendly reporting logs",
      ],
    },
    {
      id: "integration",
      title: "Integration",
      description: "Connect seamlessly with any external service or API.",
      items: [
        "Secure webhook middleware",
        "Multi‑provider OAuth support",
        "Unified integration layer for all services",
      ],
    },
    {
      id: "support",
      title: "Support",
      description: "Comprehensive support coverage with SLA options.",
      items: [
        "24/7 global support options",
        "Developer success engineers",
        "Priority incident response",
      ],
    },
  ];

  return (
    <div className="p-10">
      <FeatureTabs tabs={tabs} />
    </div>
  );
}
