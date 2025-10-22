"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WalletItem {
  id: string;
  [key: string]: unknown;
}

interface AvatarGroupProps {
  wallets?: WalletItem[];
}

export default function AvatarGroup({ wallets }: AvatarGroupProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

if(!wallets || wallets.length === 0) {
    return <div>No wallets available</div>;
  }
  return (

      <div className="flex -space-x-2 *:ring-2 *:ring-background">
        {!wallets || wallets.length === 0 && wallets?.map((wallet, index) => (
          
              <Avatar
                className={`transition-transform ${
                  activeIndex === index ? "z-10 scale-110" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <AvatarImage src={'https://github.com/shadcn.png'}  />
                <AvatarFallback>
                 0x
                </AvatarFallback>
              </Avatar>
            
        ))}
      </div>
  
  );
}
