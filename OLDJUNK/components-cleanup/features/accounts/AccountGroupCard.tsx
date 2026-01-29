import { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  FolderPlus,
  Users,
  Wallet,
  Building2,
  ArrowRight,
} from 'lucide-react';
import type { AccountGroup } from '@/lib/types/account-groups';

interface AccountGroupCardProps {
  group: AccountGroup;
  onEdit?: (group: AccountGroup) => void;
  onDelete?: (group: AccountGroup) => void;
  onCreateChild?: (parentGroup: AccountGroup) => void;
  onMoveAccounts?: (group: AccountGroup) => void;
  onClick?: (group: AccountGroup) => void;
  showActions?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

export function AccountGroupCard({
  group,
  onEdit,
  onDelete,
  onCreateChild,
  onMoveAccounts,
  onClick,
  showActions = true,
  isSelectable = false,
  isSelected = false,
  onSelectionChange,
}: AccountGroupCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if (isSelectable && onSelectionChange) {
      onSelectionChange(!isSelected);
    } else if (onClick) {
      onClick(group);
    }
  };

  const totalAccounts = (group._count?.financialAccounts || 0) + (group._count?.cryptoWallets || 0);
  const hasSubgroups = (group._count?.children || 0) > 0;

  return (
    <Card
      className={`
        group transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}
        ${isSelectable ? 'cursor-pointer hover:ring-2 hover:ring-primary/50' : ''}
        ${onClick || isSelectable ? 'cursor-pointer' : 'cursor-default'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Group Icon */}
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center text-xl"
              style={{
                backgroundColor: group.color ? `${group.color}20` : undefined,
                color: group.color || 'inherit',
              }}
            >
              {group.icon || '📁'}
            </div>

            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {group.name}
                {group.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
              </CardTitle>
              {group.description && (
                <CardDescription className="mt-1">
                  {group.description}
                </CardDescription>
              )}
            </div>
          </div>

          {/* Direct Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-1">
              {/* Edit Button */}
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-primary/10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(group);
                  }}
                  title="Edit Group"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              
              {/* Delete Button - Only show for non-default groups */}
              {onDelete && !group.isDefault && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(group);
                  }}
                  title="Delete Group"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              {/* More Actions Dropdown for additional actions */}
              {(onCreateChild || onMoveAccounts) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onCreateChild && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onCreateChild(group);
                      }}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Add Subgroup
                      </DropdownMenuItem>
                    )}
                    {onMoveAccounts && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onMoveAccounts(group);
                      }}>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Accounts
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {group._count?.financialAccounts || 0} Banks
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {group._count?.cryptoWallets || 0} Wallets
            </span>
          </div>
        </div>

        {/* Subgroups indicator */}
        {hasSubgroups && (
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
            <span>{group._count?.children} subgroup{group._count?.children !== 1 ? 's' : ''}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}

        {/* Empty state */}
        {totalAccounts === 0 && !hasSubgroups && (
          <div className="text-center py-4 text-muted-foreground">
            <span className="text-sm">No accounts in this group</span>
          </div>
        )}

        {/* Action button for non-interactive mode */}
        {onClick && !isSelectable && (
          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick(group);
              }}
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}