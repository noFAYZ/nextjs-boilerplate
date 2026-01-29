"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Plus,
  Folder,
  Building2,
  ArrowRight,
} from "lucide-react";
import { useAccountGroupsStore } from "@/lib/stores";
import type {
  AccountGroup,
  CreateAccountGroupRequest,
} from "@/lib/types/account-groups";
import { ProiconsFolderAdd, StreamlineFlexWallet } from "../icons/icons";
import { Card } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";

const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  icon: z.string().max(50, "Icon must be 50 characters or less").optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional()
    .or(z.literal("")),
  parentId: z.string().optional(),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (group: AccountGroup) => void;
  parentGroups?: AccountGroup[];
  defaultParentId?: string;
}

const PRESET_COLORS = [
  { color: "#3B82F6", name: "Blue" },
  { color: "#10B981", name: "Green" },
  { color: "#F59E0B", name: "Amber" },
  { color: "#EF4444", name: "Red" },
  { color: "#8B5CF6", name: "Purple" },
  { color: "#F97316", name: "Orange" },
  { color: "#06B6D4", name: "Cyan" },
  { color: "#EC4899", name: "Pink" },
];

const PRESET_ICONS = [
  { icon: "💼", name: "Business" },
  { icon: "🏦", name: "Banking" },
  { icon: "💰", name: "Money" },
  { icon: "💳", name: "Cards" },
  { icon: "📊", name: "Analytics" },
  { icon: "🚀", name: "Growth" },
  { icon: "💎", name: "Premium" },
  { icon: "🎯", name: "Goals" },
  { icon: "📈", name: "Trending" },
  { icon: "🔒", name: "Secure" },
  { icon: "⚡", name: "Fast" },
  { icon: "🌟", name: "Featured" },
];

export function CreateGroupDialog({
  open,
  onOpenChange,
  onSuccess,
  parentGroups = [],
  defaultParentId,
}: CreateGroupDialogProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    PRESET_COLORS[0].color
  );
  const [selectedIcon, setSelectedIcon] = useState<string>(
    PRESET_ICONS[0].icon
  );
  const [error, setError] = useState<string | null>(null);

  const createGroup = useAccountGroupsStore((state) => state.createGroup);
  const isLoading = useAccountGroupsStore((state) => state.operationLoading);

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: PRESET_ICONS[0].icon,
      color: PRESET_COLORS[0].color,
      parentId: defaultParentId || "no-parent",
    },
  });

  const onSubmit = async (data: CreateGroupForm) => {
    if (isLoading) return;

    setError(null);

    try {
      const payload: CreateAccountGroupRequest = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        icon: selectedIcon,
        color: selectedColor,
        parentId:
          data.parentId && data.parentId !== "no-parent"
            ? data.parentId
            : undefined,
      };

      const createdGroup = await createGroup(payload);

      if (createdGroup) {
        onSuccess(createdGroup);
        onOpenChange(false);
        handleReset();
      } else {
        setError("Failed to create group. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error creating group:", error);
    }
  };

  const handleReset = () => {
    form.reset();
    setSelectedColor(PRESET_COLORS[0].color);
    setSelectedIcon(PRESET_ICONS[0].icon);
    setError(null);
    // isLoading is handled by the store now
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setTimeout(handleReset, 150); // Small delay to prevent visual glitch
    }
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      handleReset();
    }
  }, [open]);

  // Update form values when preset selections change
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    form.setValue("color", color);
  };

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    form.setValue("icon", icon);
  };

  if (!open) return null; // Prevent rendering when dialog is closed

  return (
    <Dialog open={open} onOpenChange={handleClose} >
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 shadow-none bg-card ">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden">
          <div className="relative px-6 pt-6 pb-4">
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/20">
                    <ProiconsFolderAdd className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Create Group
                </span>
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mb-4">
            <Alert
              variant="destructive"
              className="border-destructive/30 bg-destructive/5"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="pr-8">{error}</AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-destructive/20"
                onClick={() => setError(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Alert>
          </div>
        )}

        {/* Form Content */}
        <div className="px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Main Fields */}
              <div className="space-y-5">
                {/* Group Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-foreground">
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter group name"
                          className="border-border shadow-sm text-xs backdrop-blur-sm transition-all"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-foreground">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What's this group for? (optional)"
                          rows={2}
                          className="resize-none border-border shadow-sm  backdrop-blur-sm transition-all"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Parent Group */}
                {parentGroups && parentGroups.length > 0 && (
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-foreground">
                          Parent Group
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 border-border shadow-sm backdrop-blur-sm">
                              <SelectValue placeholder="Select parent (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no-parent">
                              <div className="flex items-center gap-2">
                                <Folder className="h-4 w-4 text-muted-foreground" />
                                <span>No parent</span>
                              </div>
                            </SelectItem>
                            {parentGroups?.map((group) => (
                              <SelectItem key={group?.id} value={group?.id}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-4 w-4 rounded flex items-center justify-center text-xs"
                                    style={{
                                      backgroundColor: group.color
                                        ? `${group.color}20`
                                        : "rgb(243 244 246)",
                                      color: group.color || "rgb(107 114 128)",
                                    }}
                                  >
                                    {group.icon || "📁"}
                                  </div>
                                  {group?.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Appearance Selection */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-foreground">
                  Customize Appearance
                </div>
<div className="flex justify-between">
                {/* Icon Selection */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Icon
                  </div>
                  <Select
                    onValueChange={handleIconSelect}
                    value={selectedIcon}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 border-border shadow-sm backdrop-blur-sm">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{selectedIcon}</span>
                          <span className="text-sm">
                            {PRESET_ICONS.find(item => item.icon === selectedIcon)?.name || 'Select icon'}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_ICONS.map((item) => (
                        <SelectItem key={item.icon} value={item.icon}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Color
                  </div>
                  <Select
                    onValueChange={handleColorSelect}
                    value={selectedColor}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 border-border shadow-sm backdrop-blur-sm">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: selectedColor }}
                          />
                          <span className="text-sm">
                            {PRESET_COLORS.find(item => item.color === selectedColor)?.name || 'Select color'}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_COLORS.map((item) => (
                        <SelectItem key={item.color} value={item.color}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
</div>
                {/* Live Preview */}
                <div className="pt-3 border-t border-border/30">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Preview
                  </div>

                  <Card className="cursor-pointer hover:shadow-md dark:bg-sidebar bg-white p-2 px-4  group">
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        {/* Group Icon */}
                        <div
                          className="h-10 w-10 rounded-xl  flex items-center justify-center text-sm"
                          style={{
                            backgroundColor: `${selectedColor}15`,
                            borderColor: `${selectedColor}30`,
                            color: selectedColor,
                          }}
                        >
                          {selectedIcon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm truncate">
                            {" "}
                            {form.watch("name") || "Group Name"}
                          </h3>
                          <div className="text-xs text-muted-foreground truncate">
                            {form.watch("description") ||
                              "Description appears here"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 ">
                        <p className="flex text-yellow-700 bg-yellow-500/20 px-2 py-0.5 rounded-md text-sm font-medium">
                          <span className="mr-1">$</span>
                          1,840.50
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground">2</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <StreamlineFlexWallet className="h-5 w-5 text-muted-foreground" />
                          <span className="text-muted-foreground">3</span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                          {["", ""]?.map((item, index) => (
                            <Avatar key={index}>
                              {" "}
                              <AvatarImage src="https://github.com/shadcn.png" />
                            </Avatar>
                          ))}
                        </div>

                        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-3 pt-6 border-t border-border/30">
                <Button
                  type="button"
                  variant="soft"
                  size={"sm"}
                  className="text-xs"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size={"sm"}
                  disabled={isLoading || !form.watch("name")?.trim()}
                  className="text-xs"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Create Group</span>
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
