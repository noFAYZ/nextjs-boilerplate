import React from 'react';
import { useRouter } from 'next/navigation';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { getLogoUrl } from '@/lib/services/logo-service';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowRight, Clock, WifiHigh } from 'lucide-react';
import type { UnifiedAccount } from '@/lib/types/unified-accounts';
import {
  MdiDragVertical,
  MdiPen,
  HeroiconsWallet,
  MdiDollar,
} from '@/components/icons/icons';
import { timestampzPresets } from '@/lib/utils/time';

export interface AccountRowProps {
  account: UnifiedAccount;
  balanceVisible: boolean;
  onAccountClick: (accountId: string) => void;
  isDraggable?: boolean;
  className?: string;
  imageErrors?: Set<string>;
  onImageError?: (accountId: string) => void;
}

export function AccountRow({
  account,
  balanceVisible,
  onAccountClick,
  isDraggable = false,
  className,
  imageErrors = new Set(),
  onImageError,
}: AccountRowProps) {
  const router = useRouter();

  // Draggable setup (optional)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable(
    isDraggable ? { id: account.id } : { id: `${account.id}-disabled` }
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  const getInstitutionLogo = () => {
 
    if (account.institutionUrl) {
      return getLogoUrl(account.institutionUrl) || undefined;
    }
    return undefined;
  };

  const isCrypto = account.category === 'CRYPTO' || account.type === 'CRYPTO' || account.source === 'crypto';

  const handleClick = () => {
    onAccountClick(account.id);
  };

  const handleImageError = () => {
    onImageError?.(account.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={cn(
        'group relative flex items-center gap-2.5 p-2 transition-all hover:bg-muted/20 cursor-pointer',
        isSortableDragging && 'bg-primary/10',
        className
      )}
    >
      {/* Drag Handle Icon - Show only if draggable */}
      {isDraggable && (
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center flex-shrink-0 w-6 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <MdiDragVertical className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* Icon - Institution Logo */}
      <div className="relative h-10 w-10 flex-shrink-0 mr-2">
        <Avatar className="h-10 w-10 rounded-full border border-border">
          <AvatarImage
            src={getInstitutionLogo()}
            alt={account.institutionName || 'Institution'}
            className="rounded-full"
            onError={handleImageError}
          />
          <AvatarFallback className="bg-card rounded-full">
            {isCrypto ? (
              <HeroiconsWallet className="h-6 w-6" />
            ) : (
              <MdiDollar className="h-6 w-6" />
            )}
          </AvatarFallback>
        </Avatar>

        {/* Account Source Badge */}
        {(account.accountSource || account.providerType) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'absolute -bottom-1 -right-2 rounded-full p-[1px] flex items-center justify-center ring-2 ring-background text-white text-[10px] font-medium whitespace-nowrap overflow-hidden',
                    account.accountSource === 'MANUAL'
                      ? 'bg-orange-500/60'
                      : account.accountSource === 'LINK'
                        ? 'bg-emerald-500'
                        : account.providerType === 'PLAID'
                          ? 'bg-white'
                          : 'bg-slate-500'
                  )}
                >
                  {account.accountSource === 'MANUAL' ? (
                    <MdiPen className="w-3.5 h-3.5" />
                  ) : account.accountSource === 'LINK' ? (
                    <WifiHigh className="w-3.5 h-3.5" />
                  ) : account.providerType === 'PLAID' ? (
                    <img src="/logo/banks/plaid.png" alt="Plaid" className="w-4 h-4 object-contain" />
                  ) : (
                    <div className="text-[8px] font-bold">{(account.accountSource || account.providerType || '?').charAt(0)}</div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                <div className="space-y-1">
                  <p className="font-semibold">
                    {account.accountSource === 'MANUAL'
                      ? 'Manual Account'
                      : account.accountSource === 'LINK'
                        ? 'Linked Account'
                        : account.providerType || 'Connected'}
                  </p>
                  <p className="text-muted-foreground">
                    {account.providerType && `via ${account.providerType} • `}
                    {account.isActive ? '✓ Active' : '✗ Inactive'}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-foreground truncate transition-colors group-hover:text-primary flex items-center gap-2">
          {account.name}
        </div>
        <div className="flex items-center">
          <p className="text-[11px] text-muted-foreground truncate">
            {isCrypto ? `${account.metadata?.network || 'Crypto'} ${account.type}` : account.institutionName || account.type}
          </p>

        {/*   {(account.accountSource || account.providerType) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {account.accountSource === 'MANUAL' ? (
                    <Badge variant="subtle" className="h-5 rounded-full px-0 pr-1 ml-1">
                      <MdiPen className="w-4 h-4 bg-primary/40 rounded-full p-0.5" /> Manual
                    </Badge>
                  ) : account.accountSource === 'LINK' ? (
                    <WifiHigh className="w-3.5 h-3.5 ml-1" />
                  ) : account.providerType === 'PLAID' ? (
                    <Badge variant="subtle" className="h-5 rounded-full px-0 pr-1 ml-1">
                      <img src="/logo/banks/plaid.png" alt="Plaid" className="w-4 h-4 object-contain rounded-full" /> Plaid
                    </Badge>
                  ) : (
                    <div className="text-[8px] font-bold ml-1">{(account.accountSource || account.providerType || '?').charAt(0)}</div>
                  )}
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {account.accountSource === 'MANUAL'
                        ? 'Manual Account'
                        : account.accountSource === 'LINK'
                          ? 'Linked Account'
                          : account.providerType || 'Connected'}
                    </p>
                    <p className="text-muted-foreground">
                      {account.providerType && `via ${account.providerType} • `}
                      {account.isActive ? '✓ Active' : '✗ Inactive'}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )} */}
        </div>
      </div>

      {/* Amount & Status */}
      <div className="flex flex-col items-end flex-shrink-0 gap-1">
        <div className="text-right">
          {balanceVisible ? (
            <CurrencyDisplay amountUSD={account.balance} variant="small" className="text-muted-foreground font-semibold" />
          ) : (
            <span className="text-muted-foreground font-bold text-xs">••••••</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[9px] px-1 h-5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="hidden sm:inline">{account.updatedAt ? timestampzPresets.relative(account.updatedAt) : 'Never'}</span>
        </div>
      </div>

      {/* Hover Indicator */}
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}
