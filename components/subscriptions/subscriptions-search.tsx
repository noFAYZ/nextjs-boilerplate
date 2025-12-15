"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command"; // shadcn
import { SUBSCRIPTION_SERVICES } from "@/lib/constants/subscription-services-metadata";
import { CalendarIcon } from "lucide-react";
import { SubscriptionService } from "@/lib/services/subscription-service";



export default function SubscriptionSearch({ onSelect }: { onSelect?: (service: SubscriptionService) => void }) {
    const [query, setQuery] = useState("");
  
    const fuse = useMemo(
      () => new Fuse(SUBSCRIPTION_SERVICES, {
        keys: ["name", "merchantName", "tags", "category"],
        threshold: 0.3,
      }),
      []
    );
  
    const results = query
      ? fuse.search(query).map((r) => r.item)
      : SUBSCRIPTION_SERVICES.slice(0, 20);
  
    return (
      <div className="w-full">
        <Command className="rounded-lg border shadow-sm">
          <CommandInput
            placeholder="Search for your subscription..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {results.map((service, index) => (
                <CommandItem key={index} onSelect={() => onSelect?.(service)}>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.merchantName} — {service.category}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    );
  }
  