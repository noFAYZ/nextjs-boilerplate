"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ZERION_CHAINS } from "@/lib/constants/chains";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NetworkSelectorProps {

  defaultNetworkId?: string;
  onChange?: (networkId: string) => void;
}

export function NetworkSelector({

  defaultNetworkId,
  onChange,
}: NetworkSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(
    defaultNetworkId
  );

  const selectedNetwork = ZERION_CHAINS.find((n) => n.id === selected);

  return (

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            size={'sm'}
            icon= {selectedNetwork ? (
              <div className="flex items-center gap-2">
                <img
                  src={selectedNetwork.attributes.icon.url}
                  alt={selectedNetwork.attributes.name}
                  className="w-5 h-5 rounded-full"
                />
                {selectedNetwork.attributes.name}
              </div>
            ) : (
              "Select network..."
            )}
            
            className=" justify-between rounded-lg hover:shadow-sm"
          >
           
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search network..." />
            <CommandList>
              <CommandEmpty>No network found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea>
                {ZERION_CHAINS.map((network) => (
                  <CommandItem
                    key={network.id}
                    value={network.attributes.name}
                    onSelect={() => {
                      setSelected(network.id);
                      setOpen(false);
                      onChange?.(network.id);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 font-medim">
                      <img
                        src={network.attributes.icon.url}
                        alt={network.attributes.name}
                        className="w-6 h-6 rounded-full"
                      />
                      {network.attributes.name}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-5 w-5",
                        selected === network.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    
  );
}
