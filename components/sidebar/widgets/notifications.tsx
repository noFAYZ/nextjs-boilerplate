import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StashBell } from "@/components/icons"

export default function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="
            relative overflow-visible 
            hover:text-foreground hover:bg-muted
            transition-all
          "
        >
          <StashBell className="h-5 w-5" />
          {/* Notification dot */}
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        className="
          w-80 p-0 
          border bg-background shadow-xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-1.5">
          <p className="text-xs font-semibold">Notifications</p>
          <Button
            variant="ghost"
            size="xs"
            className="text-xs text-muted-foreground"
          >
            Mark all as read
          </Button>
        </div>

        <Separator />

        {/* Notifications list */}
        <ScrollArea className="h-[260px]">
          <div className="flex flex-col gap-2 p-3">
            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <StashBell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs text-muted-foreground">
                You’re all caught up ✨
              </p>
            </div>

            {/*
            // Example notification item
            <div className="rounded-xl border p-3 hover:bg-muted transition">
              <p className="text-sm font-medium">
                New transaction detected
              </p>
              <p className="text-xs text-muted-foreground">
                2 minutes ago
              </p>
            </div>
            */}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
