"use client";

import * as React from "react";
import { CheckCircle2, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface WalletType {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function WalletTypeDropdown({
    WALLET_TYPES,
  selectedType,
  setSelectedType,
  setValue,
  errors,
}: {
    WALLET_TYPES: readonly WalletType[],
  selectedType: string;
  setSelectedType: (val: string) => void;
  setValue: (field: string, val: string) => void;
  errors: Record<string, { message?: string }>;
}) {
  const [open, setOpen] = React.useState(false);

  const selectedWallet = WALLET_TYPES.find(
    (type) => type.value === selectedType
  );

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold">Wallet Type</h3>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between h-16 rounded-lg dark:hover:shadow-sm"
          >
            {selectedWallet ? (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    "bg-muted text-muted-foreground"
                  )}
                >
                  <selectedWallet.icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{selectedWallet.label}</span>
              </div>
            ) : (
              "Select wallet type"
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0">
          <Command>
            <CommandInput placeholder="Search wallet type..." />
            <CommandList>
              <CommandEmpty>No wallet found.</CommandEmpty>
              <CommandGroup>
                {WALLET_TYPES.map((type) => (
                  <CommandItem
                    key={type.value}
                    value={type.value}
                    onSelect={() => {
                      setSelectedType(type.value);
                      setValue("type", type.value);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md",
                        selectedType === type.value
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <type.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{type.label}</span>
                      <p className="text-[11px] text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                    {selectedType === type.value && (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {errors?.type && (
        <p className="text-sm text-red-600">{errors.type.message}</p>
      )}
    </div>
  );
}
