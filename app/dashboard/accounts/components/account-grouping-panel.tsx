"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AccountGroup {
  id: string;
  name: string;
  description?: string;
  accountCount: number;
  totalBalance: number;
}

interface AccountGroupingPanelProps {
  groups: AccountGroup[];
  isLoading?: boolean;
  onCreateGroup: (name: string, description?: string) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
  onEditGroup?: (groupId: string, name: string, description?: string) => Promise<void>;
  className?: string;
}

export function AccountGroupingPanel({
  groups,
  isLoading = false,
  onCreateGroup,
  onDeleteGroup,
  onEditGroup,
  className,
}: AccountGroupingPanelProps) {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setIsCreating(true);
    try {
      await onCreateGroup(newGroupName, newGroupDescription);
      setNewGroupName("");
      setNewGroupDescription("");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    setDeletingGroupId(groupId);
    try {
      await onDeleteGroup(groupId);
    } finally {
      setDeletingGroupId(null);
    }
  };

  const handleEditGroup = async (groupId: string) => {
    if (!editName.trim() || !onEditGroup) return;
    try {
      await onEditGroup(groupId, editName, editDescription);
      setEditingGroupId(null);
    } finally {
      // Reset
    }
  };

  const startEditing = (group: AccountGroup) => {
    setEditingGroupId(group.id);
    setEditName(group.name);
    setEditDescription(group.description || "");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Create Group Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Create New Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            disabled={isCreating}
            className="text-sm"
          />
          <Input
            placeholder="Description (optional)"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
            disabled={isCreating}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={handleCreateGroup}
            disabled={!newGroupName.trim() || isCreating}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </CardContent>
      </Card>

      {/* Groups List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-2">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="pt-6">
                {editingGroupId === group.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Group name"
                      className="text-sm"
                    />
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingGroupId(null)}
                        className="flex-1"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditGroup(group.id)}
                        disabled={!editName.trim()}
                        className="flex-1"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{group.name}</h4>
                      {group.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {group.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{group.accountCount} account{group.accountCount !== 1 ? "s" : ""}</span>
                        <span>
                          {group.totalBalance.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {onEditGroup && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(group)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteGroup(group.id)}
                        disabled={deletingGroupId === group.id}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No groups yet. Create one to organize your accounts.
        </p>
      )}
    </div>
  );
}
